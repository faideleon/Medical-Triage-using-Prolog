% KNOWLEDGE BASE
% Only facts live here. The rules that use them are in triage.pl.
% To add a condition: add a condition/3, description/2 and resources/2 fact.
%
% NOTE: the medical content (symptoms, high-risk lists, resources) is a
% school-project starting point. It must be reviewed by a doctor or nurse
% before real hospital use.

:- encoding(utf8).

% category(Id, Label).
% The body area the patient's main complaint belongs to.
category(fever_breathing, "Fever & Breathing").
category(stomach_urinary, "Stomach, Liver & Urinary").
category(skin_eyes, "Skin & Eyes").
category(heart_brain, "Heart, Brain & Body").


% EMERGENCY SIGNS
% Asked FIRST, before anything else. If any is present the patient needs
% life-saving care right now (ESI level 1), so we stop asking questions.
% emergency_sign(Id, Question shown to staff).
emergency_sign(not_breathing, "Not breathing, or no pulse").
emergency_sign(unresponsive, "Unresponsive (does not react to voice or pain)").
emergency_sign(severe_breathing, "Severe difficulty breathing, or lips/face turning blue").
emergency_sign(active_seizure, "Seizure happening right now").
emergency_sign(severe_bleeding, "Heavy bleeding that will not stop").
emergency_sign(allergic_reaction, "Swelling of face or throat after food, drug or sting").
emergency_sign(shock, "Cold, clammy, very pale skin and fainting").
emergency_sign(major_trauma, "Major injury (crash, fall from height, stab or gunshot)").


% HIGH-RISK SIGNS
% Not "dying right now", but the patient should not wait in the queue
% (ESI level 2). The triage nurse must see them immediately.
high_risk_symptom(chest_pain).
high_risk_symptom(shortness_of_breath).
high_risk_symptom(fast_breathing).
high_risk_symptom(fast_heartbeat).
high_risk_symptom(confusion).
high_risk_symptom(neck_stiffness).
high_risk_symptom(face_drooping).
high_risk_symptom(arm_weakness).
high_risk_symptom(speech_difficulty).
high_risk_symptom(blood_in_stool).
high_risk_symptom(seizures).
high_risk_symptom(grey_throat_membrane).
high_risk_symptom(lockjaw).
high_risk_symptom(fear_of_water).

high_risk_condition(sepsis).
high_risk_condition(meningitis).
high_risk_condition(meningococcemia).
high_risk_condition(pneumonia).
high_risk_condition(diphtheria).
high_risk_condition(cholera).
high_risk_condition(appendicitis).
high_risk_condition(acute_pancreatitis).
high_risk_condition(stroke).
high_risk_condition(ischemic_heart_disease).
high_risk_condition(heart_failure).
high_risk_condition(deep_vein_thrombosis).
high_risk_condition(tetanus).
high_risk_condition(rabies).

% Pain at or above this score (0-10) counts as high risk.
severe_pain_score(7).


% CONDITIONS
% condition(Name, Category, Symptoms).

% Fever & Breathing
condition(influenza, fever_breathing, [fever, cough, runny_nose]).
condition(measles, fever_breathing, [fever, cough, runny_nose, red_eyes, rash]).
condition(covid_19, fever_breathing, [fever, cough, sore_throat, loss_of_smell]).
condition(acute_respiratory_infection, fever_breathing, [fever, cough, fast_breathing]).
condition(pneumonia, fever_breathing, [fever, cough, phlegm, shortness_of_breath, chest_pain]).
condition(acute_bronchitis, fever_breathing, [cough, phlegm, wheeze, sore_throat]).
condition(chronic_lower_respiratory_disease, fever_breathing, [shortness_of_breath, wheeze, chest_tightness]).
condition(tuberculosis, fever_breathing, [cough, chronic_cough, fever, weight_loss]).
condition(pertussis, fever_breathing, [cough, chronic_cough, coughing_fits, vomiting]).
condition(extrapulmonary_tuberculosis, fever_breathing, [fever, swollen_glands, night_sweats, weight_loss]).
condition(hiv, fever_breathing, [fever, swollen_glands, weight_loss, rash]).
condition(diphtheria, fever_breathing, [fever, sore_throat, swollen_glands, grey_throat_membrane]).
condition(dengue, fever_breathing, [fever, headache, pain_behind_eyes, muscle_pain]).
condition(chikungunya, fever_breathing, [fever, joint_pain, rash]).
condition(leptospirosis, fever_breathing, [fever, headache, muscle_pain, calf_pain]).
condition(malaria, fever_breathing, [fever, chills, headache]).
condition(typhoid_fever, fever_breathing, [fever, headache, abdominal_pain, loss_of_appetite]).
condition(meningitis, fever_breathing, [fever, headache, neck_stiffness, vomiting]).
condition(meningococcemia, fever_breathing, [fever, rash, bruising, neck_stiffness]).
condition(sepsis, fever_breathing, [fever, fast_heartbeat, fast_breathing, confusion]).
condition(rheumatic_fever, fever_breathing, [fever, joint_pain, joint_swelling, chest_pain]).

% Stomach, Liver & Urinary
condition(diarrhea, stomach_urinary, [diarrhea, vomiting, abdominal_cramps]).
condition(cholera, stomach_urinary, [diarrhea, vomiting, sunken_eyes, dry_skin]).
condition(dysentery, stomach_urinary, [diarrhea, abdominal_cramps, blood_in_stool, fever]).
condition(schistosomiasis, stomach_urinary, [diarrhea, abdominal_pain, blood_in_stool, itching]).
condition(appendicitis, stomach_urinary, [abdominal_pain, fever, nausea, loss_of_appetite]).
condition(acute_pancreatitis, stomach_urinary, [abdominal_pain, back_pain, nausea, vomiting]).
condition(gastric_ulcer, stomach_urinary, [abdominal_pain, nausea, heartburn, bloating]).
condition(cirrhosis, stomach_urinary, [jaundice, swollen_abdomen, bruising, itching]).
condition(hepatitis_a, stomach_urinary, [fever, loss_of_appetite, dark_urine, jaundice]).
condition(hepatitis_b, stomach_urinary, [nausea, dark_urine, pale_stools, jaundice]).
condition(hepatitis_c, stomach_urinary, [abdominal_pain, nausea, dark_urine, pale_stools, jaundice]).
condition(urinary_tract_infection, stomach_urinary, [painful_urination, frequent_urination, lower_abdominal_pain, cloudy_urine]).
condition(kidney_infection, stomach_urinary, [fever, back_pain, painful_urination, nausea]).
condition(chronic_kidney_disease, stomach_urinary, [ankle_swelling, nausea, blood_in_urine]).
condition(glomerulonephritis, stomach_urinary, [blood_in_urine, facial_swelling, ankle_swelling]).

% Skin & Eyes
condition(cellulitis, skin_eyes, [red_skin, swelling, skin_pain, fever]).
condition(dermatitis, skin_eyes, [itching, dry_skin, red_skin, cracked_skin]).
condition(chickenpox, skin_eyes, [fever, rash, blisters, itching]).
condition(mpox, skin_eyes, [fever, rash, blisters, swollen_glands]).
condition(hand_foot_mouth_disease, skin_eyes, [fever, rash, mouth_ulcer, hand_foot_blisters]).
condition(leprosy, skin_eyes, [pale_skin_patches, numbness, muscle_weakness]).
condition(sore_eyes, skin_eyes, [red_eyes, itchy_eyes, watery_eyes]).

% Heart, Brain & Body
condition(ischemic_heart_disease, heart_brain, [chest_pain, shortness_of_breath, sweating, nausea]).
condition(stroke, heart_brain, [face_drooping, arm_weakness, speech_difficulty]).
condition(hypertension, heart_brain, [headache, dizziness, blurred_vision]).
condition(diabetes, heart_brain, [thirst, frequent_urination, blurred_vision]).
condition(heart_failure, heart_brain, [shortness_of_breath, ankle_swelling, palpitations]).
condition(atherosclerosis, heart_brain, [chest_pain, leg_pain, numbness]).
condition(deep_vein_thrombosis, heart_brain, [leg_pain, leg_swelling, warm_skin, red_skin]).
condition(anemia, heart_brain, [pale_skin, dizziness, palpitations]).
condition(cancer, heart_brain, [weight_loss, loss_of_appetite, painless_lump]).
condition(malnutrition, heart_brain, [weight_loss, low_weight, muscle_weakness]).
condition(epilepsy, heart_brain, [seizures, jerking, loss_of_awareness]).
condition(tetanus, heart_brain, [muscle_stiffness, muscle_spasm, lockjaw, difficulty_swallowing]).
condition(rabies, heart_brain, [fever, numbness, muscle_spasm, fear_of_water]).
condition(arthritis, heart_brain, [joint_pain, joint_stiffness, joint_swelling, morning_stiffness]).
condition(depression, heart_brain, [low_mood, loss_of_interest, sleep_problems, hopelessness]).
condition(schizophrenia, heart_brain, [hallucinations, delusions, disordered_thinking, social_withdrawal]).
condition(alzheimers, heart_brain, [memory_loss, confusion, language_problems, mood_changes]).


% EXPECTED RESOURCES
% What the hospital will likely need for each condition. The ESI program (C)
% counts these to tell ESI 3, 4 and 5 apart.
% Resource types (ESI handbook): labs, ecg, xray, imaging (CT/MRI/ultrasound),
% iv_fluids, iv_medication (IV, IM or nebulized), specialist_consult,
% simple_procedure, complex_procedure.
resources(influenza, []).
resources(measles, [labs]).
resources(covid_19, [labs]).
resources(acute_respiratory_infection, [xray]).
resources(pneumonia, [labs, xray, iv_medication]).
resources(acute_bronchitis, []).
resources(chronic_lower_respiratory_disease, [xray, iv_medication]).
resources(tuberculosis, [labs, xray]).
resources(pertussis, [labs]).
resources(extrapulmonary_tuberculosis, [labs, imaging]).
resources(hiv, [labs]).
resources(diphtheria, [labs, iv_medication, specialist_consult]).
resources(dengue, [labs, iv_fluids]).
resources(chikungunya, [labs]).
resources(leptospirosis, [labs, iv_medication]).
resources(malaria, [labs, iv_medication]).
resources(typhoid_fever, [labs, iv_medication]).
resources(meningitis, [labs, imaging, iv_medication]).
resources(meningococcemia, [labs, iv_fluids, iv_medication]).
resources(sepsis, [labs, xray, iv_fluids, iv_medication]).
resources(rheumatic_fever, [labs, ecg]).
resources(diarrhea, []).
resources(cholera, [labs, iv_fluids]).
resources(dysentery, [labs]).
resources(schistosomiasis, [labs]).
resources(appendicitis, [labs, imaging, specialist_consult]).
resources(acute_pancreatitis, [labs, imaging, iv_fluids, iv_medication]).
resources(gastric_ulcer, []).
resources(cirrhosis, [labs, imaging]).
resources(hepatitis_a, [labs]).
resources(hepatitis_b, [labs]).
resources(hepatitis_c, [labs]).
resources(urinary_tract_infection, [labs]).
resources(kidney_infection, [labs, iv_medication]).
resources(chronic_kidney_disease, [labs, imaging]).
resources(glomerulonephritis, [labs]).
resources(cellulitis, [iv_medication]).
resources(dermatitis, []).
resources(chickenpox, []).
resources(mpox, [labs]).
resources(hand_foot_mouth_disease, []).
resources(leprosy, [labs, specialist_consult]).
resources(sore_eyes, []).
resources(ischemic_heart_disease, [labs, ecg, xray, iv_medication]).
resources(stroke, [labs, imaging, specialist_consult]).
resources(hypertension, [labs, ecg]).
resources(diabetes, [labs]).
resources(heart_failure, [labs, ecg, xray, iv_medication]).
resources(atherosclerosis, [labs, imaging]).
resources(deep_vein_thrombosis, [labs, imaging]).
resources(anemia, [labs]).
resources(cancer, [labs, imaging, specialist_consult]).
resources(malnutrition, [labs]).
resources(epilepsy, [labs, imaging]).
resources(tetanus, [iv_medication, specialist_consult]).
resources(rabies, [iv_medication, simple_procedure]).
resources(arthritis, [xray]).
resources(depression, [specialist_consult]).
resources(schizophrenia, [specialist_consult]).
resources(alzheimers, [labs, imaging]).


% DESCRIPTIONS
% Plain-language explanation shown on the result screen.
% description(Name, Text).
description(influenza, "Commonly known as the flu. It is a viral illness that causes fever, cough, and a runny nose. Resting at home and drinking plenty of water or warm fluids helps recovery.").
description(measles, "A contagious viral illness that causes fever, cough, red watery eyes, and a widespread skin rash. Please consult a doctor and avoid close contact with others.").
description(covid_19, "A contagious respiratory virus that commonly causes fever, cough, sore throat, and a reduced sense of smell. Rest, hydrate, and get tested if possible.").
description(acute_respiratory_infection, "An infection in the airways or lungs causing fever, cough, and fast breathing. Because fast breathing can be serious, please have a doctor check your breathing.").
description(pneumonia, "A serious lung infection where the air sacs fill with fluid, causing fever, cough with phlegm, chest pain, and trouble breathing. Prompt medical care is needed.").
description(acute_bronchitis, "Swelling and mucus buildup in the main breathing tubes of the lungs, causing a cough with phlegm, wheezing, and a sore throat.").
description(chronic_lower_respiratory_disease, "Long-term irritation of the airways (such as chronic bronchitis or asthma) causing shortness of breath, wheezing, and tightness in the chest.").
description(tuberculosis, "A serious bacterial lung infection that causes a long-lasting cough, fever, and unexplained weight loss. A doctor can provide specific antibiotic treatment.").
description(pertussis, "Also called whooping cough. It causes severe, repeated coughing spells that can make it hard to catch your breath or cause vomiting after coughing.").
description(extrapulmonary_tuberculosis, "A tuberculosis infection located outside the lungs, often causing swollen lymph glands, fever, night sweats, and weight loss.").
description(hiv, "A virus that weakens the body's immune system, which can cause ongoing fever, swollen glands, weight loss, and a skin rash. Please visit a clinic for blood testing.").
description(diphtheria, "A serious bacterial throat infection that causes fever, sore throat, swollen neck glands, and a thick grey coating in the throat. Seek immediate medical care.").
description(dengue, "A mosquito-borne viral illness that causes high fever, severe headache, pain behind the eyes, and body aches. Drink plenty of fluids and see a doctor promptly.").
description(chikungunya, "A viral illness spread by mosquitoes that causes sudden fever, strong joint pain, and a skin rash.").
description(leptospirosis, "A bacterial infection often caught from floodwater or wet soil, causing fever, headache, body aches, and pain in the calves. Antibiotic treatment from a doctor is important.").
description(malaria, "A serious illness spread by mosquitoes in tropical areas, causing repeated waves of high fever, shaking chills, and headache.").
description(typhoid_fever, "A bacterial infection from contaminated food or water that causes a lasting fever, headache, stomach pain, and loss of appetite.").
description(meningitis, "A medical emergency involving swelling around the brain and spinal cord, causing fever, severe headache, vomiting, and a stiff neck. Go to a hospital immediately.").
description(meningococcemia, "A life-threatening bloodstream infection causing fever, a stiff neck, skin rash, and dark bruising. Seek emergency hospital care right away.").
description(sepsis, "A life-threatening medical emergency where the body reacts severely to an infection, causing fever, fast heartbeat, fast breathing, and confusion. Go to an emergency room immediately.").
description(rheumatic_fever, "An inflammatory condition that can develop after an untreated throat infection, causing fever, painful swollen joints, and chest pain.").
description(diarrhea, "Frequent loose or watery bowel movements with stomach cramps and vomiting. Sip clean water or oral rehydration salts frequently to prevent dehydration.").
description(cholera, "A severe watery diarrhea illness that quickly drains the body of fluids, causing vomiting, dry skin, and sunken eyes. Immediate rehydration at a clinic is critical.").
description(dysentery, "An intestinal infection that causes diarrhea with visible blood, stomach cramps, and fever. Please see a doctor for proper medication and hydration.").
description(schistosomiasis, "A parasitic infection caught from freshwater exposure, causing stomach pain, diarrhea with blood, and itchy skin.").
description(appendicitis, "Sudden inflammation of the appendix causing stomach pain, nausea, loss of appetite, and fever. Please visit a hospital promptly to check if surgery is needed.").
description(acute_pancreatitis, "Sudden swelling of the pancreas causing strong stomach pain that spreads to the back, along with nausea and vomiting. Hospital care is recommended.").
description(gastric_ulcer, "An open sore in the lining of the stomach that causes burning stomach pain, heartburn, bloating, and nausea.").
description(cirrhosis, "Long-term scarring of the liver that can cause yellowing of the skin and eyes (jaundice), a swollen belly, easy bruising, and itchy skin.").
description(hepatitis_a, "A liver infection spread through contaminated food or water, causing fever, loss of appetite, dark-colored urine, and yellow skin or eyes.").
description(hepatitis_b, "A viral liver infection that causes nausea, dark urine, pale-colored stools, and yellowing of the skin or eyes.").
description(hepatitis_c, "A viral infection of the liver causing stomach pain, nausea, dark urine, pale stools, and yellowing of the skin or eyes.").
description(urinary_tract_infection, "An infection in the bladder or urinary tract causing burning or pain when urinating, frequent urination, cloudy urine, and lower belly discomfort.").
description(kidney_infection, "A serious urinary infection that has reached the kidneys, causing fever, back or side pain, nausea, and painful urination. Please see a doctor for antibiotics.").
description(chronic_kidney_disease, "Gradual loss of kidney function over time, which can cause swelling in the ankles, nausea, and blood in the urine.").
description(glomerulonephritis, "Inflammation of the tiny filters inside the kidneys, causing puffiness in the face, swollen ankles, and blood in the urine.").
description(cellulitis, "A bacterial skin infection that causes an area of red, swollen, painful skin along with a fever. A doctor can prescribe antibiotics to clear it.").
description(dermatitis, "Skin irritation or eczema that causes red, dry, cracked, and itchy skin.").
description(chickenpox, "A contagious viral illness that causes fever and an itchy rash of small fluid-filled blisters across the body.").
description(mpox, "A viral illness that causes fever, swollen glands, and a rash with blisters.").
description(hand_foot_mouth_disease, "A viral infection that causes fever, painful sores inside the mouth, and a rash or blisters on the hands and feet.").
description(leprosy, "A slow-growing bacterial infection affecting the skin and nerves, causing pale skin patches, numbness, and muscle weakness. It is curable with medical treatment.").
description(sore_eyes, "Also known as pink eye or conjunctivitis. It causes red, itchy, and watery eyes. Avoid rubbing your eyes and wash your hands frequently.").
description(ischemic_heart_disease, "Reduced blood flow to the heart muscle causing chest pain or pressure, shortness of breath, sweating, and nausea. Seek emergency medical attention immediately.").
description(stroke, "A medical emergency where blood flow to part of the brain stops, causing facial drooping, arm weakness, and trouble speaking. Call emergency services immediately.").
description(hypertension, "High blood pressure. When very high, it can cause headache, dizziness, and blurry vision. Have your blood pressure checked with a cuff.").
description(diabetes, "A condition where blood sugar levels are too high, often causing constant thirst, frequent urination, and blurry vision.").
description(heart_failure, "A condition where the heart pumps less effectively, leading to shortness of breath, swollen ankles, and a fluttering or racing heartbeat.").
description(atherosclerosis, "Narrowing of the arteries from plaque buildup, which can cause chest pain, leg pain when walking, and numbness.").
description(deep_vein_thrombosis, "A blood clot in a deep vein, usually in the leg, causing leg pain, swelling, redness, and warm skin in that area. See a doctor promptly.").
description(anemia, "A low level of healthy red blood cells to carry oxygen, causing pale skin, dizziness, and a fast or noticeable heartbeat.").
description(cancer, "Abnormal cell growth in the body that can cause unexplained weight loss, loss of appetite, and a painless lump. Please see a doctor for an evaluation.").
description(malnutrition, "A lack of enough nutrients or calories in the diet, leading to weight loss, low body weight, and weak muscles.").
description(epilepsy, "A brain condition that causes repeated seizures, sudden muscle jerking, and brief loss of awareness.").
description(tetanus, "A serious bacterial nerve condition from a wound, causing stiff muscles, painful spasms, stiffness in the jaw (lockjaw), and trouble swallowing. Seek emergency care.").
description(rabies, "A life-threatening viral infection from an animal bite or scratch, causing fever, numbness, muscle spasms, and difficulty swallowing water. Seek emergency care immediately.").
description(arthritis, "Swelling and tenderness in one or more joints, causing joint pain, swelling, and stiffness—especially first thing in the morning.").
description(depression, "A mood condition that causes a persistent feeling of sadness, loss of interest in daily activities, trouble sleeping, and feelings of hopelessness.").
description(schizophrenia, "A serious mental health condition that affects how a person thinks and perceives reality, causing hallucinations, strong false beliefs, and withdrawal from others.").
description(alzheimers, "A brain condition that slowly affects memory, causing forgetfulness, confusion about time or place, trouble finding words, and mood changes.").
