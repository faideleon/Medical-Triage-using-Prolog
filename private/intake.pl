% NURSE INTAKE (terminal)
% The nurse runs  ?- start.  and answers the questions for the patient.
% At the end the patient is saved to the intake file that the C triage
% program reads (see docs/INTAKE_FILE_FORMAT.md).
%
% Order of the questions, like at a real hospital entrance:
%   1. Emergency check first. If anything is ticked, save as EMERGENCY now.
%   2. Patient details.
%   3. Main problem area, then yes/no symptom questions picked by triage.pl.
%   4. Confusion, pain score and vital signs (vital signs may be skipped).

:- use_module(library(lists)).
:- use_module(library(readutil)).

start :-
	catch(intake,
		 intake_cancelled,
		(nl,
			writeln('Intake cancelled. Nothing was saved.'))).

intake :-
	get_time(Arrived),
	nl,
	writeln('=== PATIENT INTAKE ==='),
	ask_emergency_signs(Signs),
	(Signs \== [] ->
	writeln('*** EMERGENCY - only basic details, press Enter to skip ***'),
		ask_patient(loose, Name, Age, Sex),
		emergency_fields(Signs, Fields),
		Result = emergency(Signs);
	ask_patient(strict, Name, Age, Sex),
		ask_category(Category),
		ask_symptoms(Category, [], Answers),
		ask_yes_no('Is the patient confused, very sleepy, or not making sense?', Confused),
		ask_number('Pain score 0-10', 0, 10, required, Pain),
		writeln('Vital signs (press Enter to skip any not measured):'),
		ask_number('  Heart rate (/min)', 20, 250, optional, HR),
		ask_number('  Breathing rate (/min)', 4, 80, optional, RR),
		ask_number('  SpO2 (%)',               50, 100, optional, SpO2),
	    ask_number('Temperature(C)',        30,  45, optional, Temp),
	    ask_number('SystolicBP(mmHg)',     40, 300, optional, BP),
	    assess(Answers, Confused, Pain, [HR, RR, SpO2, Temp, BP], Fields, Result)
	),
	format_time(atom(ArrivedText), '%Y-%m-%d %H:%M:%S', Arrived),
		save_record(['ARRIVED' - ArrivedText, 'NAME' - Name, 'AGE' - Age, 'SEX' - Sex|Fields], Id),
			show_result(Id, Result).


% ---------- Questions ----------

ask_emergency_signs(Signs) :-
	nl,
	writeln('EMERGENCY CHECK - is any of these happening RIGHT NOW?'),
	findall(Id - Label,
		emergency_sign(Id, Label),
		Pairs),
	forall(nth1(N, Pairs, _ - Label),
		format("  ~w. ~w~n", [N, Label])),
	writeln('Type the numbers (for example 2,5), or press Enter for none.'),
	read_answer(Text),
	split_string(Text, ", ", ", ", Parts0),
	exclude(empty_text, Parts0, Parts),
	(maplist(sign_number(Pairs),
			Parts,
			Signs0) ->
	list_to_set(Signs0, Signs);
	writeln('Please type only numbers from the list.'),
		ask_emergency_signs(Signs)).

empty_text("").

sign_number(Pairs, Text, Sign) :-
	number_string(N, Text),
	nth1(N, Pairs, Sign - _).

% strict: everything required.  loose: Enter means unknown (emergencies).
ask_patient(Mode, Name, Age, Sex) :-
	nl,
	ask_name(Mode, Name),
	(Mode == strict ->
	AgeMode = required;
	AgeMode = optional),
	ask_number('Age (years)', 0, 130, AgeMode, Age),
	ask_sex(Mode, Sex).

ask_name(Mode, Name) :-
	prompt_raw('Patient name', Text),
	(Text \== "" ->
	atom_string(Name, Text);
	Mode == loose ->
	Name = 'Unknown';
	writeln('Name is required.'),
		ask_name(Mode, Name)).

ask_sex(Mode, Sex) :-
	prompt_line('Sex (M/F)', Text),
	string_upper(Text, Upper),
	(memberchk(Upper, ["M", "F"]) ->
	atom_string(Sex, Upper);
	Upper == "",
		Mode == loose ->
	Sex = 'U';
	writeln('Please type M or F.'),
		ask_sex(Mode, Sex)).

ask_category(Category) :-
	nl,
	writeln('Where is the main problem?'),
	findall(Id - Label,
		category(Id, Label),
		Pairs0),
	append(Pairs0, [all - "Not sure - check everything"], Pairs),
	forall(nth1(N, Pairs, _ - Label),
		format("  ~w. ~w~n", [N, Label])),
	length(Pairs, Max),
	ask_number('Choose', 1, Max, required, Choice),
	nth1(Choice, Pairs, Category - _).

% Keep asking the question triage.pl picks until there is nothing left,
% or the nurse types "done".
ask_symptoms(Category, Answers0, Answers) :-
	(next_question(Category, Answers0, Symptom) ->
	readable(Symptom, Text),
		format(atom(Question),
			"Does the patient have ~w? (y/n/?=not sure/done)",
			[Text]),
		prompt_line(Question, Reply),
		(reply_answer(Reply, Answer) ->
	append(Answers0, [Symptom - Answer], Answers1),
			warn_high_risk(Symptom, Answer),
			ask_symptoms(Category, Answers1, Answers);
	Reply == "done" ->
	Answers = Answers0;
	writeln('Please type y, n, ? or done.'),
			ask_symptoms(Category, Answers0, Answers));
	Answers = Answers0).

reply_answer("y", yes).
reply_answer("yes", yes).
reply_answer("n", no).
reply_answer("no", no).
reply_answer("?", unsure).

% Tell the nurse straight away, do not wait until the end.
warn_high_risk(Symptom, yes) :-
	high_risk_symptom(Symptom),
	!,
	readable(Symptom, Text),
	format("  !! HIGH-RISK symptom: ~w - the patient should not wait.~n", [Text]).
warn_high_risk(_, _).

ask_yes_no(Question, Answer) :-
	format(atom(Prompt),
		"~w (y/n)",
		[Question]),
	prompt_line(Prompt, Reply),
	(memberchk(Reply - Answer, ["y" - yes, "yes" - yes, "n" - no, "no" - no]) ->
	true;
	writeln('Please type y or n.'),
		ask_yes_no(Question, Answer)).

% ask_number(+Question, +Low, +High, +required/optional, -Value)
% An optional number left empty becomes '' (saved as an empty field).
ask_number(Question, Low, High, Mode, Value) :-
	prompt_line(Question, Text),
	(Text == "",
		Mode == optional ->
	Value = '';
	catch(number_string(Value0, Text),
			_,
			fail),
		Value0 >= Low,
		Value0 =< High ->
	Value = Value0;
	format("Please type a number from ~w to ~w.~n", [Low, High]),
		ask_number(Question, Low, High, Mode, Value)).

% prompt_line gives lower-case text for matching answers;
% prompt_raw keeps the case as typed (for names).
prompt_line(Question, Text) :-
	prompt_raw(Question, Raw),
	string_lower(Raw, Text).

prompt_raw(Question, Text) :-
	format("~w: ", [Question]),
	read_raw(Text).

read_answer(Text) :-
	read_raw(Raw),
	string_lower(Raw, Text).

% Reads one line with extra spaces removed.
% End of input (Ctrl+Z / Ctrl+D) cancels the intake.
read_raw(Text) :-
	read_line_to_string(user_input, Line),
	(Line == end_of_file ->
	throw(intake_cancelled);
	normalize_space(string(Text),
			Line)).

readable(Symptom, Text) :-
	atomic_list_concat(Parts, '_', Symptom),
	atomic_list_concat(Parts, ' ', Text).


% ---------- Result ----------

emergency_fields(Signs, Fields) :-
	Fields = [
		'EMERGENCY' - 'YES',
		'EMERGENCY_SIGNS' - Signs,
		'CATEGORY' - '',
		'SYMPTOMS_YES' - [],
		'SYMPTOMS_NO' - [],
		'CONFUSED' - '',
		'PAIN' - '',
		'HEART_RATE' - '',
		'RESP_RATE' - '',
		'SPO2' - '',
		'TEMP_C' - '',
		'SYSTOLIC_BP' - '',
		'HIGH_RISK' - 'YES',
		'HIGH_RISK_REASONS' - [],
		'LIKELY_CONDITIONS' - [],
		'RESOURCES' - [],
		'RESOURCE_COUNT' - ''].

% assess(+Answers, +Confused, +Pain, +Vitals, -Fields, -Result)
% Works out likely conditions, risk and resources, and the record fields.
assess(Answers, Confused, Pain, [HR, RR, SpO2, Temp, BP], Fields, Result) :-
	likely_conditions(all, Answers, Matches),
	high_risk_reasons(Answers, Matches, Confused, Pain, Reasons),
	expected_resources(Matches, Resources),
	% No match means the resources are unknown, so leave the count empty.
	(Matches == [] ->
	ResourceCount = '';
	length(Resources, ResourceCount)),
	% The category is the one of the best match.
	(Matches = [match(Best, _, _)|_] ->
	condition(Best, Category, _);
	Category = unknown),
	(Reasons == [] ->
	HighRisk = 'NO';
	HighRisk = 'YES'),
	findall(S,
		member(S - yes, Answers),
		Yes),
	findall(S,
		member(S - no, Answers),
		No),
	findall(Text,
		(member(match(C, Y, T),
				Matches),
			format(atom(Text),
				"~w:~w/~w",
				[C, Y, T])),
		MatchTexts),
	upcase_atom(Confused, ConfusedText),
	Fields = [
		'EMERGENCY' - 'NO',
		'EMERGENCY_SIGNS' - [],
		'CATEGORY' - Category,
		'SYMPTOMS_YES' - Yes,
		'SYMPTOMS_NO' - No,
		'CONFUSED' - ConfusedText,
		'PAIN' - Pain,
		'HEART_RATE' - HR,
		'RESP_RATE' - RR,
		'SPO2' - SpO2,
		'TEMP_C' - Temp,
		'SYSTOLIC_BP' - BP,
		'HIGH_RISK' - HighRisk,
		'HIGH_RISK_REASONS' - Reasons,
		'LIKELY_CONDITIONS' - MatchTexts,
		'RESOURCES' - Resources,
		'RESOURCE_COUNT' - ResourceCount],
	Result = normal(HighRisk, Reasons, Matches).

show_result(Id, Result) :-
	nl,
	writeln('=================================================='),
	format("PATIENT NUMBER: ~w~n", [Id]),
	show_status(Result),
		intake_file(File),
	format("Saved to ~w~n", [File]),
	writeln('==================================================').

show_status(emergency(Signs)) :-
	writeln('STATUS: EMERGENCY - take the patient to the Emergency Room NOW'),
	findall(L,
		(member(S, Signs),
			emergency_sign(S, L)),
		Labels),
	atomic_list_concat(Labels, ', ', Text),
	format("Signs: ~w~n", [Text]).
show_status(normal(HighRisk, Reasons, Matches)) :-
	(HighRisk == 'YES' ->
	writeln('STATUS: HIGH RISK - the triage nurse must see this patient immediately'),
		maplist(readable, Reasons, ReasonTexts),
		atomic_list_concat(ReasonTexts, ', ', Text),
		format("Reasons: ~w~n", [Text]);
	writeln('STATUS: Please wait - the patient will be called for triage')),
	(Matches == [] ->
	writeln('No condition matched. A nurse will assess the patient.');
	writeln('Possible conditions:'),
		forall(nth1(N,
				Matches,
				match(C, Y, T)),
			(readable(C, Name),
				format("  ~w. ~w (~w of ~w symptoms)~n", [N, Name, Y, T])))).
