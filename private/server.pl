% WEB SERVER
% Serves the web page in public/ and answers its /api/triage requests.
%
% Start it from the project root:
%   swipl -q -s private/server.pl -g "start_server(8000), thread_get_message(_)" -t halt
% then open http://localhost:8000/
%
% For the nurse intake in the terminal (writes the file for the C program):
%   swipl private/server.pl
%   ?- start.

:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_files)).
:- use_module(library(lists)).
:- use_module(library(apply)).
:- use_module(library(error)).

:- ensure_loaded(knowledge).
:- ensure_loaded(triage).
:- ensure_loaded(records).
:- ensure_loaded(intake).

:- http_handler(root(api/triage), handle_triage, [method(post)]).
:- http_handler(root(.), serve_public, [prefix]).


% The web page has three category buttons. Each one covers these
% knowledge-base categories (Stomach also covers skin and eyes).
page_category(fever, fever_breathing).
page_category(stomach, stomach_urinary).
page_category(stomach, skin_eyes).
page_category(body, heart_brain).

% in_page_category(+PageCategory, ?Condition, ?Category)
% "extended" on the page means every condition.
in_page_category(extended, Condition, Category) :-
	condition(Condition, Category, _).
in_page_category(Page, Condition, Category) :-
	Page \== extended,
	page_category(Page, Category),
	condition(Condition, Category, _).


% Start with ?- start_server. or ?- start_server(Port).
start_server :-
	start_server(8000).

start_server(Port) :-
	must_be(integer, Port),
	http_server(http_dispatch,
		[port(Port)]).

% Serve static files from the public directory next to private/.
serve_public(Request) :-
	private_dir(PrivateDir),
	directory_file_path(PrivateDir, '../public', PublicPath),
	absolute_file_name(PublicPath,
		PublicDir,
		[file_type(directory)]),
	http_reply_from_files(PublicDir,
		[
			indexes(['index.html'])],
		Request).


% POST /api/triage   {category, answers: [{symptom, answer}]}
% Replies with every condition in the category that still fits the answers:
% all "yes" symptoms belong to it and no "no" symptom does.
handle_triage(Request) :-
	http_read_json_dict(Request, Payload),
	(valid_request(Payload, Page, Answers) ->
	findall(_{
				id : Condition,
				category : Category,
				symptoms : Symptoms
				},
			( in_page_category(Page, Condition, Category),
				condition(Condition, _, Symptoms),
				matches_answers(Condition, Answers)),
			Candidates),
		reply_json_dict(_{candidates : Candidates});
	reply_json_dict(_{
				error : "Invalid category or symptom answers"
				},
			[status(400)])).

% The payload must have a known category and a list of answers.
valid_request(Payload, Page, Answers) :-
	is_dict(Payload),
	get_dict(category, Payload, PageText),
	string(PageText),
	atom_string(Page, PageText),
	memberchk(Page, [fever, stomach, body, extended]),
	get_dict(answers, Payload, Items),
	is_list(Items),
	maplist(parse_answer(Page),
		Items,
		Answers).

% Each answer must be yes/no about a symptom from the chosen category.
parse_answer(Page, Item, Symptom-Answer) :-
	is_dict(Item),
	get_dict(symptom, Item, SymptomText),
	string(SymptomText),
	atom_string(Symptom, SymptomText),
	get_dict(answer, Item, AnswerText),
	string(AnswerText),
	atom_string(Answer, AnswerText),
	memberchk(Answer, [yes, no]),
	once(( in_page_category(Page, Condition, _),
			has_symptom(Condition, Symptom))).

% A condition fits when it has every "yes" symptom and none of the "no" ones.
matches_answers(Condition, Answers) :-
	forall(member(Symptom - yes, Answers),
		has_symptom(Condition, Symptom)),
	still_possible(Answers, Condition).
