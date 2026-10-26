% RULES
% How the symptom checker thinks. Facts come from knowledge.pl.
%
% Answers are always a list of Symptom-yes / Symptom-no pairs, for example
% [fever-yes, cough-no]. Symptom-unsure means "asked, but the patient does
% not know": it is never asked again and counts as neither yes nor no.
% Category is one of the category/2 ids, or `all` to check every condition.

:- use_module(library(lists)).
:- use_module(library(pairs)).


% in_scope(+Category, ?Condition)
% Condition belongs to the chosen category (`all` means every condition).
in_scope(all, Condition) :-
	condition(Condition, _, _).
in_scope(Category, Condition) :-
	Category \== all,
	condition(Condition, Category, _).

% has_symptom(?Condition, ?Symptom)
has_symptom(Condition, Symptom) :-
	condition(Condition, _, Symptoms),
	member(Symptom, Symptoms).

% still_possible(+Answers, +Condition)
% The patient has not said "no" to any symptom of this condition.
still_possible(Answers, Condition) :-
	 \+ (member(Symptom - no, Answers),
		has_symptom(Condition, Symptom)).

% yes_count(+Answers, +Condition, -Count)
% How many of the condition's symptoms the patient said "yes" to.
yes_count(Answers, Condition, Count) :-
	aggregate_all(count,
		(has_symptom(Condition, Symptom),
			member(Symptom - yes, Answers)),
		Count).


% next_question(+Category, +Answers, -Symptom)
% Picks the next symptom to ask about. We follow the condition that is
% currently matching best, and ask its first symptom not asked yet.
% When two conditions match equally well, the dangerous one goes first,
% so serious illnesses are ruled out early.
% Fails when there is nothing left to ask, or a clear winner is found.
next_question(Category, Answers, Symptom) :-
	 \+ clear_winner(Category, Answers),
	findall(Score - Condition,
		( in_scope(Category, Condition),
			still_possible(Answers, Condition),
			yes_count(Answers, Condition, Yes),
			(high_risk_condition(Condition) ->
		Risk = 0;
		Risk = 1),
			NegYes is  - Yes,
			% negative so the best comes first
			Score = NegYes - Risk),
		Scored),
	keysort(Scored, Sorted),
	% keysort keeps knowledge.pl order on ties
	member(_ - Condition, Sorted),
	condition(Condition, _, Symptoms),
	member(Symptom, Symptoms),
	 \+ member(Symptom - _, Answers),
	!.

% clear_winner(+Category, +Answers)
% One condition has all its symptoms confirmed, and no other possible
% condition has even one "yes" yet. Asking more would not change anything.
clear_winner(Category, Answers) :-
		in_scope(Category, Winner),
	full_match(Answers, Winner),
	 \+ ( in_scope(Category, Other),
		Other \== Winner,
		 \+ full_match(Answers, Other),
		still_possible(Answers, Other),
		yes_count(Answers, Other, Yes),
		Yes > 0),
	!.

full_match(Answers, Condition) :-
	condition(Condition, _, Symptoms),
	forall(member(S, Symptoms),
		member(S - yes, Answers)).

% count_possible(+Category, +Answers, -Count)
count_possible(Category, Answers, Count) :-
	aggregate_all(count,
		( in_scope(Category, C),
			still_possible(Answers, C)),
		Count).


% likely_conditions(+Category, +Answers, -Matches)
% The best 3 matches, as match(Condition, Yes, Total) terms.
% Sorted by percent of symptoms matched, then by number matched.
% A condition needs at least one "yes" to be listed.
likely_conditions(Category, Answers, Matches) :-
	findall(Key - match(Condition, Yes, Total),
		( in_scope(Category, Condition),
			yes_count(Answers, Condition, Yes),
			Yes > 0,
			condition(Condition, _, Symptoms),
			length(Symptoms, Total),
			Percent is  - (Yes/Total),
			% negative so the best comes first
			NegYes is  - Yes,
			Key = Percent - NegYes),
		Keyed),
	keysort(Keyed, Sorted),
	% ties keep knowledge.pl order
	pairs_values(Sorted, All),
	take(3, All, Matches).

take(N, List, Front) :-
	length(List, Len),
	(Len =< N ->
	Front = List;
	length(Front, N),
		append(Front, _, List)).


% high_risk_reasons(+Answers, +Matches, +Confused, +Pain, -Reasons)
% Every reason the patient should see the triage nurse immediately.
% Confused is yes/no, Pain is 0-10.
high_risk_reasons(Answers, Matches, Confused, Pain, Reasons) :-
	findall(Symptom,
		(member(Symptom - yes, Answers),
			high_risk_symptom(Symptom)),
		FromSymptoms),
	findall(Condition,
		(member(match(Condition, Yes, Total),
				Matches),
			Yes =:= Total,
			% only fully matched conditions
			high_risk_condition(Condition)),
		FromConditions),
	(Confused == yes ->
	FromMind = [confused_or_drowsy];
	FromMind = []),
	severe_pain_score(Limit),
	(Pain  >= Limit ->
	FromPain  = [severe_pain];
	FromPain  = []),
	append([FromSymptoms, FromConditions, FromMind, FromPain], All),
	list_to_set(All, Reasons).


% expected_resources(+Matches, -Resources)
% Resources needed for the best match (empty when nothing matched).
expected_resources([match(Condition, _, _)|_], Resources) :-
	resources(Condition, Resources),
	!.
expected_resources(_, []).
