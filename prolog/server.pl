% WEB SERVER
% The web page (prolog/web/) talks to Prolog through this server.
%
% Start it from the project root folder:
%   swipl prolog/server.pl
% then open http://localhost:8000/ (Ctrl+C stops it)
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

% prolog_dir(Dir): the folder this file is in, saved when it loads.
:- dynamic prolog_dir/1.
:- prolog_load_context(directory, Dir),
   retractall(prolog_dir(_)), assertz(prolog_dir(Dir)).


start_server(Port) :-
	http_server(http_dispatch, [port(Port)]).

% Runs when the file is started with "swipl prolog/server.pl".
% Starts the server and keeps it running until Ctrl+C.
% Another port can be given at the end: swipl prolog/server.pl 8080
:- initialization(main, main).

main :-
	current_prolog_flag(argv, Args),
	(   Args = [Arg|_], atom_number(Arg, Port)
	->  true
	;   Port = 8000
	),
	start_server(Port),
	format("Server running at http://localhost:~w/~n", [Port]),
	thread_get_message(_).

% Sends the files in prolog/web/ (index.html, app.js) to the browser.
serve_public(Request) :-
	prolog_dir(PrologDir),
	atom_concat(PrologDir, '/web', WebDir),
	http_reply_from_files(WebDir, [indexes(['index.html'])], Request).


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
% Replies:  {"candidates": [{"id": ..., "category": ..., "symptoms": [...],
%                            "description": ..., "high_risk": true}],
%            "high_risk_symptoms": [...]}
% A condition fits when it has every "yes" symptom and none of the "no" ones.
handle_triage(Request) :-
	http_read_json_dict(Request, Data),
	atom_string(Page, Data.category),
	read_answers(Data.answers, Answers),
	findall(_{id: Condition, category: Category, symptoms: Symptoms,
	          description: Text, high_risk: HighRisk},
		(in_page_category(Page, Condition),
		 condition(Condition, Category, Symptoms),
		 fits_answers(Condition, Answers),
		 description(Condition, Text),
		 is_high_risk_condition(Condition, HighRisk)),
		Candidates),
	findall(Symptom, high_risk_symptom(Symptom), RiskSymptoms),
	reply_json_dict(_{candidates: Candidates, high_risk_symptoms: RiskSymptoms}).

% is_high_risk_condition(Condition, Bool): true or false for the JSON reply.
is_high_risk_condition(Condition, true) :-
	high_risk_condition(Condition),
	!.
is_high_risk_condition(_, false).

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
% Replies:  {"id": 3, "condition": "meningitis", "possible": [...],
%            "high_risk": "YES", "resources": 3}
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
	reply_json_dict(_{id: Id, condition: Condition, possible: Possible,
	                  high_risk: HighRisk, resources: Resources}).
