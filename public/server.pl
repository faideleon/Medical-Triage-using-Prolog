:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_files)).
:- use_module(library(filesex)).
:- use_module(library(lists)).
:- use_module(library(error)).

:- http_handler(root(api/triage), handle_triage, [method(post)]).
:- http_handler(root(.), serve_public, [prefix]).

%FACTS

% Conditions divided into three categories: Fever, Stomach, Body

% Fever- 21
in_category(influenza, fever).
in_category(measles, fever).
in_category(covid_19, fever).
in_category(acute_respiratory_infection, fever).
in_category(pneumonia, fever).
in_category(acute_bronchitis, fever).
in_category(chronic_lower_respiratory_disease, fever).
in_category(tuberculosis, fever).
in_category(pertussis, fever).
in_category(extrapulmonary_tuberculosis, fever).
in_category(hiv, fever).
in_category(diphtheria, fever).
in_category(dengue, fever).
in_category(chikungunya, fever).
in_category(leptospirosis, fever).
in_category(malaria, fever).
in_category(typhoid_fever, fever).
in_category(meningitis, fever).
in_category(meningococcemia, fever).
in_category(sepsis, fever).
in_category(rheumatic_fever, fever).

% Stomach- 22
in_category(diarrhea, stomach).
in_category(cholera, stomach).
in_category(dysentery, stomach).
in_category(schistosomiasis, stomach).
in_category(appendicitis, stomach).
in_category(acute_pancreatitis, stomach).
in_category(gastric_ulcer, stomach).
in_category(cirrhosis, stomach).
in_category(hepatitis_a, stomach).
in_category(hepatitis_b, stomach).
in_category(hepatitis_c, stomach).
in_category(urinary_tract_infection, stomach).
in_category(kidney_infection, stomach).
in_category(chronic_kidney_disease, stomach).
in_category(glomerulonephritis, stomach).
in_category(cellulitis, stomach).
in_category(dermatitis, stomach).
in_category(chickenpox, stomach).
in_category(mpox, stomach).
in_category(hand_foot_mouth_disease, stomach).
in_category(leprosy, stomach).
in_category(sore_eyes, stomach).

% Body- 17
in_category(ischemic_heart_disease, body).
in_category(stroke, body).
in_category(hypertension, body).
in_category(diabetes, body).
in_category(heart_failure, body).
in_category(atherosclerosis, body).
in_category(deep_vein_thrombosis, body).
in_category(anemia, body).
in_category(cancer, body).
in_category(malnutrition, body).
in_category(epilepsy, body).
in_category(tetanus, body).
in_category(rabies, body).
in_category(arthritis, body).
in_category(depression, body).
in_category(schizophrenia, body).
in_category(alzheimers, body).


% Conditions with their corresponding symptoms

condition(influenza, [fever, cough, runny_nose]).
condition(measles, [fever, cough, runny_nose, red_eyes, rash]).
condition(covid_19, [fever, cough, sore_throat, loss_of_smell]).
condition(acute_respiratory_infection, [fever, cough, fast_breathing]).
condition(pneumonia, [fever, cough, phlegm, shortness_of_breath, chest_pain]).
condition(acute_bronchitis, [cough, phlegm, wheeze, sore_throat]).
condition(chronic_lower_respiratory_disease, [shortness_of_breath, wheeze, chest_tightness]).
condition(tuberculosis, [cough, chronic_cough, fever, weight_loss]).
condition(pertussis, [cough, chronic_cough, coughing_fits, vomiting]).
condition(extrapulmonary_tuberculosis, [fever, swollen_glands, night_sweats, weight_loss]).
condition(hiv, [fever, swollen_glands, weight_loss, rash]).
condition(diphtheria, [fever, sore_throat, swollen_glands, grey_throat_membrane]).
condition(dengue, [fever, headache, pain_behind_eyes, muscle_pain]).
condition(chikungunya, [fever, joint_pain, rash]).
condition(leptospirosis, [fever, headache, muscle_pain, calf_pain]).
condition(malaria, [fever, chills, headache]).
condition(typhoid_fever, [fever, headache, abdominal_pain, loss_of_appetite]).
condition(meningitis, [fever, headache, neck_stiffness, vomiting]).
condition(meningococcemia, [fever, rash, bruising, neck_stiffness]).
condition(sepsis, [fever, fast_heartbeat, fast_breathing, confusion]).
condition(rheumatic_fever, [fever, joint_pain, joint_swelling, chest_pain]).


condition(diarrhea, [diarrhea, vomiting, abdominal_cramps]).
condition(cholera, [diarrhea, vomiting, sunken_eyes, dry_skin]).
condition(dysentery, [diarrhea, abdominal_cramps, blood_in_stool, fever]).
condition(schistosomiasis, [diarrhea, abdominal_pain, blood_in_stool, itching]).
condition(appendicitis, [abdominal_pain, fever, nausea, loss_of_appetite]).
condition(acute_pancreatitis, [abdominal_pain, back_pain, nausea, vomiting]).
condition(gastric_ulcer, [abdominal_pain, nausea, heartburn, bloating]).
condition(cirrhosis, [jaundice, swollen_abdomen, bruising, itching]).
condition(hepatitis_a, [fever, loss_of_appetite, dark_urine, jaundice]).
condition(hepatitis_b, [nausea, dark_urine, pale_stools, jaundice]).
condition(hepatitis_c, [abdominal_pain, nausea, dark_urine, pale_stools, jaundice]).
condition(urinary_tract_infection, [painful_urination, frequent_urination, lower_abdominal_pain, cloudy_urine]).
condition(kidney_infection, [fever, back_pain, painful_urination, nausea]).
condition(chronic_kidney_disease, [ankle_swelling, nausea, blood_in_urine]).
condition(glomerulonephritis, [blood_in_urine, facial_swelling, ankle_swelling]).
condition(cellulitis, [red_skin, swelling, skin_pain, fever]).
condition(dermatitis, [itching, dry_skin, red_skin, cracked_skin]).
condition(chickenpox, [fever, rash, blisters, itching]).
condition(mpox, [fever, rash, blisters, swollen_glands]).
condition(hand_foot_mouth_disease, [fever, rash, mouth_ulcer, hand_foot_blisters]).
condition(leprosy, [pale_skin_patches, numbness, muscle_weakness]).
condition(sore_eyes, [red_eyes, itchy_eyes, watery_eyes]).


condition(ischemic_heart_disease, [chest_pain, shortness_of_breath, sweating, nausea]).
condition(stroke, [face_drooping, arm_weakness, speech_difficulty]).
condition(hypertension, [headache, dizziness, blurred_vision]).
condition(diabetes, [thirst, frequent_urination, blurred_vision]).
condition(heart_failure, [shortness_of_breath, ankle_swelling, palpitations]).
condition(atherosclerosis, [chest_pain, leg_pain, numbness]).
condition(deep_vein_thrombosis, [leg_pain, leg_swelling, warm_skin, red_skin]).
condition(anemia, [pale_skin, dizziness, palpitations]).
condition(cancer, [weight_loss, loss_of_appetite, painless_lump]).
condition(malnutrition, [weight_loss, low_weight, muscle_weakness]).
condition(epilepsy, [seizures, jerking, loss_of_awareness]).
condition(tetanus, [muscle_stiffness, muscle_spasm, lockjaw, difficulty_swallowing]).
condition(rabies, [fever, numbness, muscle_spasm, fear_of_water]).
condition(arthritis, [joint_pain, joint_stiffness, joint_swelling, morning_stiffness]).
condition(depression, [low_mood, loss_of_interest, sleep_problems, hopelessness]).
condition(schizophrenia, [hallucinations, delusions, disordered_thinking, social_withdrawal]).
condition(alzheimers, [memory_loss, confusion, language_problems, mood_changes]).

% Dynamic predicate to store user answers in the form of answer(Symptom, Answer), 
% where Symptom is the symptom being asked about and Answer is the user's response (yes or no).
:- dynamic answer/2.



% RULES

% Main entry point for the diagnostic system. 
% First, it clears any previous answers. 
% Then, it prompts the user to choose a category of symptoms (Fever, Stomach, or Body) by typing the corresponding number. 
% After the user makes a valid choice, it proceeds to ask about all symptoms in that category. 
% If the user provides invalid input, it prompts them to try again.
start :-
	retractall(answer(_, _)), %clear previous answers
	write('Choose category, type the number only'), 
	nl,
	write('1. Fever'),
	nl,
	write('2. Stomach'),
	nl,
	write('3. Body'),
	nl,
	read_line_to_string(user_input, Raw), %wait for user input and place it in Raw variable
	(catch(number_string(Choice, Raw), % catch any errors that may occur when converting the input to a number	
			_,
			fail),
		choice(Choice, Category) -> 
	write('You picked: '),
		write(Category), 
		nl,
		ask_all(Category),
		nl;
	write('Invalid input. Try again.'),
		nl,
		start).

% VALIDATION: ask about a symptom and record the answer. 
% If the answer is not yes or no, ask again.
ask(Symptom, Category) :-
	has_symptom(Condition, Symptom),
	candidate(Condition, Category),
	 \+ answer(Symptom, _),
	format("Do you have ~w? (yes/no): ", [Symptom]),
	read_line_to_string(user_input, Raw), 
	string_lower(Raw, Lower), 
	atom_string(Answer, Lower), 
	assertz(answer(Symptom, Answer)). 

% Ask about all symptoms in a category. 
% If the user has a symptom, ask about the next symptom. 
% If the user does not have any more symptoms, find the most likely condition based on the symptoms the user has and print it out. 
% If no condition is found, print out a message saying that the condition is unknown and to visit a doctor immediately.
ask_all(Category) :-
	(ask(Symptom, Category) -> 
	ask_all(Category); 
	(candidate(Condition, Category)) -> 
	format("Most likely condition is: ~w", [Condition]),
		nl;
	write("Condition is unknown. Please visit a doctor immediately!")).

% Determine if a condition is a candidate for the given category based on the user's answers. 
% Returns true if the condition is in the category and the user has answered yes to all of the symptoms for that condition 
% and has not answered no to any of the symptoms for that condition. 
% Otherwise, returns false.
candidate(Condition, Category) :-
	 in_category(Condition, Category), 
	 \+ (answer(Symptom, yes), 
		 \+ has_symptom(Condition, Symptom)), 
	 \+ (answer(Symptom, no), 
		has_symptom(Condition, Symptom)).

choice(1, fever).
choice(2, stomach).
choice(3, body).

% Checks if a condition has a symptom. Returns true if the symptom is in the list of symptoms for that condition otherwise returns false.
has_symptom(Condition, Symptom) :-
	condition(Condition, Symptoms),
	member(Symptom, Symptoms).



% HTTP API

% Start with ?- start_server. or ?- start_server(Port).
start_server :-
	start_server(8000).

% Start the HTTP server on the specified port. The port must be an integer.
start_server(Port) :-
	must_be(integer, Port),
	http_server(http_dispatch, [port(Port)]).

% Serve static files from the public directory. 
% The public directory is located in the parent directory of the private directory.
serve_public(Request) :-
	source_file(start_server(_), SourceFile),
	file_directory_name(SourceFile, PrivateDirectory),
	directory_file_path(PrivateDirectory, '../public', PublicPath),
	absolute_file_name(PublicPath, PublicDirectory, [file_type(directory)]),
	http_reply_from_files(PublicDirectory, [indexes(['index.html'])], Request).

% Handle the triage request.
handle_triage(Request) :-
	http_read_json_dict(Request, Payload),
	(   valid_request(Payload, Category, Answers)
	->  findall(
		    _{id: Condition, category: ActualCategory, symptoms: Symptoms},
		    ( in_category(Condition, ActualCategory),
		      (Category = extended ; Category = ActualCategory),
		      condition(Condition, Symptoms),
		      matches_answers(Condition, Answers)
		    ),
		    Candidates
		),
		reply_json_dict(_{candidates: Candidates})
	;   reply_json_dict(_{error: "Invalid category or symptom answers"}, [status(400)])
	).

% Validate the request payload. 
% The payload must be a dictionary with a category and a list of answers.
valid_request(Payload, Category, Answers) :-
	is_dict(Payload),
	get_dict(category, Payload, CategoryText),
	string(CategoryText),
	atom_string(Category, CategoryText),
	memberchk(Category, [fever, stomach, body, extended]),
	get_dict(answers, Payload, Items),
	is_list(Items),
	maplist(parse_answer(Category), Items, Answers).

% Parse an individual answer item.
parse_answer(Category, Item, answer(Symptom, Answer)) :-
	is_dict(Item),
	get_dict(symptom, Item, SymptomText),
	string(SymptomText),
	atom_string(Symptom, SymptomText),
	get_dict(answer, Item, AnswerText),
	string(AnswerText),
	atom_string(Answer, AnswerText),
	memberchk(Answer, [yes, no]),
	(   Category = extended
	->  has_symptom(_, Symptom)
	;   in_category(Condition, Category),
	    has_symptom(Condition, Symptom)
	).

% Check if a condition matches the user's answers.
matches_answers(Condition, Answers) :-
	forall(
		member(answer(Symptom, Answer), Answers),
		(Answer = yes -> has_symptom(Condition, Symptom)
		; Answer = no -> \+ has_symptom(Condition, Symptom))
	).