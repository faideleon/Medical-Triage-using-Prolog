% NURSE INTAKE (terminal)
% The symptom checker the nurse uses at the hospital entrance.
%
% How to run (from the project root folder):
%   swipl private/intake.pl
%   ?- start.
%
% Steps:
%   1. Emergency check. If the patient has an emergency sign, save them
%      right away as EMERGENCY and stop asking questions.
%   2. Patient details: name, age, sex.
%   3. Main problem area, then the nurse picks the patient's symptoms.
%   4. Prolog shows the possible conditions (initial diagnosis).
%   5. Pain score and vital signs.
%   6. Everything is saved to data/intake_records.txt for the C program.
%
% Prolog does NOT decide the ESI level. The C program reads the file
% and decides it.

:- ensure_loaded(knowledge).
:- ensure_loaded(triage).
:- ensure_loaded(records).


start :-
	nl,
	writeln('========== PATIENT INTAKE =========='),
	ask_emergency_signs(Signs),
	intake(Signs).


% intake(Signs)
% No emergency signs: do the full intake.
intake([]) :-
	nl,
	ask_name(Name),
	ask_number('Age (years)', 0, 130, Age),
	ask_sex(Sex),
	ask_category(Category),
	ask_symptoms(Category, Symptoms),
	likely_conditions(Category, Symptoms, Matches),
	show_conditions(Matches),
	best_condition(Matches, Condition),
	condition_names(Matches, Possible),
	resource_count(Condition, Resources),
	high_risk_answer(Symptoms, HighRisk),
	nl,
	ask_number('Pain score (0-10)', 0, 10, Pain),
	writeln('Vital signs (press Enter to skip if not measured):'),
	ask_vital('  Heart rate (beats/min)', 20, 250, HeartRate),
	ask_vital('  Breathing rate (breaths/min)', 4, 80, RespRate),
	ask_vital('  Oxygen level SpO2 (%)', 50, 100, SpO2),
	save_record([
		'NAME' - Name,
		'AGE' - Age,
		'SEX' - Sex,
		'EMERGENCY' - 'NO',
		'EMERGENCY_SIGNS' - [],
		'CATEGORY' - Category,
		'SYMPTOMS' - Symptoms,
		'CONDITION' - Condition,
		'POSSIBLE_CONDITIONS' - Possible,
		'HIGH_RISK' - HighRisk,
		'RESOURCES' - Resources,
		'PAIN' - Pain,
		'HEART_RATE' - HeartRate,
		'RESP_RATE' - RespRate,
		'SPO2' - SpO2
	], Id),
	show_saved(Id, HighRisk).

% At least one emergency sign: ask only the name and save right away.
intake(Signs) :-
	Signs \== [],
	nl,
	writeln('*** EMERGENCY - bring the patient to the Emergency Room NOW ***'),
	ask('Patient name (press Enter if unknown)', Text),
	unknown_if_empty(Text, Name),
	save_record([
		'NAME' - Name,
		'EMERGENCY' - 'YES',
		'EMERGENCY_SIGNS' - Signs
	], Id),
	show_saved(Id, 'YES').


% ---------- Questions ----------

ask_emergency_signs(Signs) :-
	nl,
	writeln('EMERGENCY CHECK - is any of these happening RIGHT NOW?'),
	findall(Id-Label, emergency_sign(Id, Label), Items),
	pick_from_list(Items, Signs).

ask_category(Category) :-
	nl,
	writeln('Where is the main problem?'),
	findall(Id-Label, category(Id, Label), Items),
	show_numbered(Items),
	length(Items, Max),
	ask_number('Choose a number', 1, Max, Choice),
	nth1(Choice, Items, Category-_).

ask_symptoms(Category, Symptoms) :-
	nl,
	writeln('Which symptoms does the patient have?'),
	category_symptoms(Category, Ids),
	findall(Id-Label, (member(Id, Ids), readable(Id, Label)), Items),
	pick_from_list(Items, Symptoms).

% ask_name(Name): the name is required.
ask_name(Name) :-
	ask('Patient name', Name),
	Name \== "",
	!.
ask_name(Name) :-
	writeln('Name is required.'),
	ask_name(Name).

% ask_sex(Sex): M or F.
ask_sex(Sex) :-
	ask('Sex (M/F)', Text),
	string_upper(Text, Upper),
	member(Upper, ["M", "F"]),
	!,
	atom_string(Sex, Upper).
ask_sex(Sex) :-
	writeln('Please type M or F.'),
	ask_sex(Sex).

% ask_number(Question, Low, High, Number): a required number.
ask_number(Question, Low, High, Number) :-
	ask(Question, Text),
	number_in_range(Text, Low, High, Number),
	!.
ask_number(Question, Low, High, Number) :-
	format("Please type a number from ~w to ~w.~n", [Low, High]),
	ask_number(Question, Low, High, Number).

% ask_vital(Question, Low, High, Value): a number, or Enter to skip.
% A skipped vital sign is saved as an empty value.
ask_vital(Question, Low, High, Value) :-
	ask(Question, Text),
	vital_value(Text, Low, High, Value),
	!.
ask_vital(Question, Low, High, Value) :-
	format("Please type a number from ~w to ~w, or press Enter to skip.~n", [Low, High]),
	ask_vital(Question, Low, High, Value).

vital_value("", _, _, '').
vital_value(Text, Low, High, Number) :-
	number_in_range(Text, Low, High, Number).

number_in_range(Text, Low, High, Number) :-
	number_string(Number, Text),
	Number >= Low,
	Number =< High.


% pick_from_list(Items, Picked)
% Items is a list of Id-Label pairs. Shows them numbered 1, 2, 3...
% The nurse types the numbers separated by commas (for example 2,5),
% or presses Enter for none. Picked is the list of chosen Ids.
pick_from_list(Items, Picked) :-
	show_numbered(Items),
	ask('Type the numbers (example: 1,4) or press Enter for none', Text),
	numbers_to_ids(Text, Items, Picked),
	!.
pick_from_list(Items, Picked) :-
	writeln('Please type only numbers from the list.'),
	pick_from_list(Items, Picked).

numbers_to_ids(Text, Items, Ids) :-
	split_string(Text, ",", " ", Parts),
	delete(Parts, "", Numbers),
	maplist(number_to_id(Items), Numbers, AllIds),
	list_to_set(AllIds, Ids).	% removes repeats, like 2,2

number_to_id(Items, Text, Id) :-
	number_string(N, Text),
	nth1(N, Items, Id-_).


% ---------- Small helpers ----------

% ask(Question, Text): show the question and read one line.
ask(Question, Text) :-
	format("~w: ", [Question]),
	read_line_to_string(user_input, Line),
	clean_line(Line, Text).

% clean_line(Line, Text): removes extra spaces.
% End of input (Ctrl+Z or Ctrl+D) is treated as an empty answer.
clean_line(end_of_file, "") :- !.
clean_line(Line, Text) :-
	normalize_space(string(Text), Line).

unknown_if_empty("", 'Unknown') :- !.
unknown_if_empty(Text, Text).

% high_risk_answer(Symptoms, Answer): 'YES' or 'NO' for the file.
high_risk_answer(Symptoms, 'YES') :-
	high_risk(Symptoms),
	!.
high_risk_answer(_, 'NO').

% readable(Id, Text): shortness_of_breath -> shortness of breath
readable(Id, Text) :-
	atomic_list_concat(Words, '_', Id),
	atomic_list_concat(Words, ' ', Text).

% show_numbered(Items): prints Id-Label pairs as a numbered list.
show_numbered(Items) :-
	forall(nth1(N, Items, _-Label),
		format("  ~w. ~w~n", [N, Label])).


% ---------- Results on screen ----------

show_conditions([]) :-
	nl,
	writeln('No condition matched. A nurse will assess the patient.').
show_conditions(Matches) :-
	Matches \== [],
	nl,
	writeln('Possible conditions (initial diagnosis):'),
	forall(member(Count-Condition, Matches),
		show_condition(Count, Condition)).

show_condition(Count, Condition) :-
	condition(Condition, _, Symptoms),
	length(Symptoms, Total),
	readable(Condition, Name),
	format("  - ~w (~w of ~w symptoms)~n", [Name, Count, Total]).

show_saved(Id, HighRisk) :-
	intake_file(File),
	nl,
	writeln('===================================='),
	format("Patient number: ~w~n", [Id]),
	format("High risk: ~w~n", [HighRisk]),
	format("Saved to ~w for the C triage program.~n", [File]),
	writeln('====================================').
