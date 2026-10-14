%CATEGORIES

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




% SYMPTOMS

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

:- dynamic answer/2.

start :-
	write('Choose category'),
	nl,
	write('1. Fever'),
	nl,
	write('2. Stomach'),
	nl,
	write('3. Body'),
	nl,
	read(Choice),
	choice(Choice, Category),
	write('You picked: '),
	write(Category),
	nl.


candidate(Condition, Category) :-
	 in_category(Condition, Category),
	(answer(Symptom, yes),
		 \+ has_symptom(Condition, Symptom)),
	 \+ (answer(Symptom, no),
		has_symptom(Condition, Symptom)).
	

choice(1, fever).
choice(2, stomach).
choice(3, body).



%RULES
has_symptom(Condition, Symptom) :-
	condition(Condition, Symptoms),
	member(Symptom, Symptoms).

