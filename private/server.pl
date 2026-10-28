% WEB SERVER
% The web page (public/) talks to Prolog through this server.
%
% Start it from the project root folder:
%   swipl -q -s private/server.pl -g "start_server(8000), thread_get_message(_)" -t halt
% then open http://localhost:8000/
%
% The web page uses two APIs:
%   POST /api/triage  - sends the answers so far, gets the conditions that still fit
%   POST /api/save    - sends the finished patient, Prolog saves it to
%                       data/intake_records.txt for the C triage program

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_files)).

:- ensure_loaded(knowledge).
:- ensure_loaded(triage).
:- ensure_loaded(records).

:- http_handler(root(api/triage), handle_triage, [method(post)]).
:- http_handler(root(api/save), handle_save, [method(post)]).
:- http_handler(root(.), serve_public, [prefix]).

% private_dir(Dir): the folder this file is in, saved when it loads.
:- dynamic private_dir/1.
:- prolog_load_context(directory, Dir),
   retractall(private_dir(_)), assertz(private_dir(Dir)).


start_server(Port) :-
	http_server(http_dispatch, [port(Port)]).

% Sends the files in public/ (index.html, app.js) to the browser.
serve_public(Request) :-
	private_dir(PrivateDir),
	atom_concat(PrivateDir, '/../public', PublicDir),
	http_reply_from_files(PublicDir, [indexes(['index.html'])], Request).


% ---------- The categories on the web page ----------

% The web page has three category buttons. Each one covers these
% knowledge-base categories (Stomach also covers skin and eyes).
page_category(fever, fever_breathing).
page_category(stomach, stomach_urinary).
page_category(stomach, skin_eyes).
page_category(body, heart_brain).

% in_page_category(PageCategory, Condition)
% "extended" on the web page means every condition.
in_page_category(extended, Condition) :-
	condition(Condition, _, _).
in_page_category(Page, Condition) :-
	page_category(Page, Category),
	condition(Condition, Category, _).


% ---------- POST /api/triage ----------
% Gets:     {"category": "fever", "answers": [{"symptom": "cough", "answer": "yes"}]}
% Replies:  {"candidates": [{"id": ..., "category": ..., "symptoms": [...]}]}
% A condition fits when it has every "yes" symptom and none of the "no" ones.
handle_triage(Request) :-
	http_read_json_dict(Request, Data),
	atom_string(Page, Data.category),
	read_answers(Data.answers, Answers),
	findall(_{id: Condition, category: Category, symptoms: Symptoms},
		(in_page_category(Page, Condition),
		 condition(Condition, Category, Symptoms),
		 fits_answers(Condition, Answers)),
		Candidates),
	reply_json_dict(_{candidates: Candidates}).

% read_answers(Items, Answers)
% Turns the JSON answers into a list like [cough-yes, fever-no].
read_answers([], []).
read_answers([Item|Items], [Symptom-Answer|Answers]) :-
	atom_string(Symptom, Item.symptom),
	atom_string(Answer, Item.answer),
	read_answers(Items, Answers).

% fits_answers(Condition, Answers)
% The condition has every "yes" symptom and none of the "no" symptoms.
fits_answers(Condition, Answers) :-
	forall(member(Symptom-yes, Answers), has_symptom(Condition, Symptom)),
	forall(member(Symptom-no, Answers), \+ has_symptom(Condition, Symptom)).


% ---------- POST /api/save ----------
% Gets:     {"name": "Juan", "age": 45, "answers": [{"symptom": "cough", "answer": "yes"}]}
% Replies:  {"id": 3}
% Finds the likely conditions and saves the patient for the C program.
handle_save(Request) :-
	http_read_json_dict(Request, Data),
	read_answers(Data.answers, Answers),
	findall(Symptom, member(Symptom-yes, Answers), Symptoms),
	likely_conditions(Symptoms, Matches),
	best_condition(Matches, Condition),
	condition_names(Matches, Possible),
	condition_category(Condition, Category),
	high_risk_answer(Symptoms, HighRisk),
	resource_count(Condition, Resources),
	save_record([
		'NAME' - Data.name,
		'AGE' - Data.age,
		'CATEGORY' - Category,
		'SYMPTOMS' - Symptoms,
		'CONDITION' - Condition,
		'POSSIBLE_CONDITIONS' - Possible,
		'HIGH_RISK' - HighRisk,
		'RESOURCES' - Resources
	], Id),
	reply_json_dict(_{id: Id}).
