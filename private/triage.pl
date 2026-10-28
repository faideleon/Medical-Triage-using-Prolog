% SYMPTOM CHECKER RULES
% Uses the facts in knowledge.pl to find which conditions match the
% patient's symptoms (the initial diagnosis).
%
% Prolog does NOT decide the ESI level. It only writes what it found to
% the intake file, and the C triage program decides the ESI level.


% has_symptom(Condition, Symptom)
% Symptom is one of the symptoms of Condition.
has_symptom(Condition, Symptom) :-
	condition(Condition, _, Symptoms),
	member(Symptom, Symptoms).


% category_symptoms(Category, Symptoms)
% All the symptoms used by the conditions in one category, without repeats.
% These are the symptoms the nurse can choose from.
category_symptoms(Category, Symptoms) :-
	findall(Symptom,
		(condition(_, Category, List), member(Symptom, List)),
		All),
	list_to_set(All, Symptoms).


% match_count(Condition, PatientSymptoms, Count)
% How many of the condition's symptoms the patient has.
match_count(Condition, PatientSymptoms, Count) :-
	condition(Condition, _, Symptoms),
	intersection(Symptoms, PatientSymptoms, Same),
	length(Same, Count).


% likely_conditions(Category, PatientSymptoms, Top3)
% The 3 best matching conditions, as Count-Condition pairs.
% The condition with the most matching symptoms comes first.
% A condition needs at least 1 matching symptom to be listed.
likely_conditions(Category, PatientSymptoms, Top3) :-
	findall(Count-Condition,
		(condition(Condition, Category, _),
		 match_count(Condition, PatientSymptoms, Count),
		 Count > 0),
		Matches),
	sort(1, @>=, Matches, Sorted),	% biggest Count first, keeps duplicates
	first_n(3, Sorted, Top3).

% first_n(N, List, Front): the first N items of List.
first_n(0, _, []) :- !.
first_n(_, [], []) :- !.
first_n(N, [Item|Rest], [Item|Front]) :-
	N1 is N - 1,
	first_n(N1, Rest, Front).


% best_condition(Matches, Condition)
% The first match is the best one. 'none' when nothing matched.
best_condition([], none).
best_condition([_-Condition|_], Condition).


% condition_names(Matches, Names): only the names from Count-Condition pairs.
condition_names([], []).
condition_names([_-Condition|Rest], [Condition|Names]) :-
	condition_names(Rest, Names).


% high_risk(PatientSymptoms)
% True when the patient has a dangerous symptom, or has ALL the symptoms
% of a dangerous condition (the lists are in knowledge.pl).
high_risk(PatientSymptoms) :-
	member(Symptom, PatientSymptoms),
	high_risk_symptom(Symptom).
high_risk(PatientSymptoms) :-
	high_risk_condition(Condition),
	condition(Condition, _, Symptoms),
	subset(Symptoms, PatientSymptoms).


% resource_count(Condition, Count)
% How many hospital resources (labs, x-ray, ...) the condition usually needs.
% The C program uses this number for the ESI level.
resource_count(none, 0).
resource_count(Condition, Count) :-
	resources(Condition, List),
	length(List, Count).
