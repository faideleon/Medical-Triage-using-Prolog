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
% Short triage note for staff, shown on the intake screen.
% description(Name, Text).
description(influenza, "Acute viral respiratory illness with fever, cough and coryza. Usually non-urgent; escalate if breathless, dehydrated, elderly, pregnant or immunocompromised.").
description(measles, "Highly contagious viral illness: fever, cough, coryza, conjunctivitis, maculopapular rash. Isolate on arrival (airborne). Watch for pneumonia and dehydration in children.").
description(covid_19, "Viral respiratory infection: fever, cough, sore throat, loss of smell. Apply respiratory isolation; check SpO2 and work of breathing.").
description(acute_respiratory_infection, "Lower respiratory infection with fever, cough and tachypnoea. Check SpO2 and respiratory rate; tachypnoea in children is a danger sign.").
description(pneumonia, "Lung infection: fever, productive cough, pleuritic chest pain, dyspnoea. High risk; check SpO2, RR and BP. Likely needs labs, chest X-ray and IV antibiotics.").
description(acute_bronchitis, "Inflammation of the large airways: productive cough, wheeze, sore throat. Usually non-urgent if SpO2 and RR are normal.").
description(chronic_lower_respiratory_disease, "COPD or asthma exacerbation: dyspnoea, wheeze, chest tightness. Assess work of breathing and SpO2; may need nebulised bronchodilators.").
description(tuberculosis, "Pulmonary TB: chronic cough, fever, weight loss. Apply airborne isolation; needs sputum tests and chest X-ray.").
description(pertussis, "Whooping cough: paroxysmal coughing fits, post-tussive vomiting. Droplet isolation; infants are at risk of apnoea.").
description(extrapulmonary_tuberculosis, "TB outside the lungs: lymphadenopathy, fever, night sweats, weight loss. Needs labs and imaging; not usually time-critical.").
description(hiv, "Possible HIV: persistent fever, lymphadenopathy, weight loss, rash. Arrange testing and counselling; assess for opportunistic infection.").
description(diphtheria, "Bacterial pharyngitis with grey pseudomembrane and bull neck. High risk of airway obstruction; isolate and escalate to a doctor now.").
description(dengue, "Mosquito-borne viral fever: headache, retro-orbital pain, myalgia. Check platelets and haematocrit; watch for warning signs (bleeding, abdominal pain, persistent vomiting).").
description(chikungunya, "Mosquito-borne viral fever with severe polyarthralgia and rash. Usually supportive care; exclude dengue.").
description(leptospirosis, "Bacterial infection after flood or soil exposure: fever, headache, myalgia, calf pain. Ask about exposure; needs labs and antibiotics, watch renal function.").
description(malaria, "Parasitic infection: cyclical fever, rigors, headache. Ask about travel; needs a blood smear or rapid test urgently.").
description(typhoid_fever, "Enteric fever: sustained fever, headache, abdominal pain, anorexia. Needs blood cultures and antibiotics.").
description(meningitis, "Meningeal infection: fever, severe headache, neck stiffness, vomiting. Time-critical; escalate to a doctor immediately for antibiotics.").
description(meningococcemia, "Meningococcal sepsis: fever, non-blanching rash or purpura, neck stiffness. Life-threatening; immediate resuscitation area and antibiotics.").
description(sepsis, "Dysregulated response to infection: fever, tachycardia, tachypnoea, altered mental state. Life-threatening; start sepsis pathway now.").
description(rheumatic_fever, "Post-streptococcal inflammation: fever, migratory polyarthritis, chest pain. Needs ECG and labs to check for carditis.").
description(diarrhea, "Acute gastroenteritis: diarrhoea, vomiting, cramps. Assess hydration; oral rehydration if mild.").
description(cholera, "Profuse watery diarrhoea with signs of dehydration (sunken eyes, dry skin). High risk of hypovolaemic shock; start rehydration now.").
description(dysentery, "Bloody diarrhoea with cramps and fever. Needs stool tests; assess hydration.").
description(schistosomiasis, "Parasitic infection after freshwater exposure: abdominal pain, bloody diarrhoea, itch. Ask about exposure; needs stool or urine tests.").
description(appendicitis, "Suspected appendicitis: abdominal pain, fever, nausea, anorexia. Keep nil by mouth; needs labs, imaging and surgical review.").
description(acute_pancreatitis, "Severe epigastric pain radiating to the back with nausea and vomiting. Needs labs (lipase), IV fluids and analgesia.").
description(gastric_ulcer, "Peptic ulcer: epigastric pain, heartburn, bloating, nausea. Escalate if there is haematemesis, melaena or a rigid abdomen.").
description(cirrhosis, "Chronic liver disease: jaundice, ascites, bruising, pruritus. Watch for GI bleeding and confusion (encephalopathy).").
description(hepatitis_a, "Acute viral hepatitis: fever, anorexia, dark urine, jaundice. Needs liver function tests; enteric precautions.").
description(hepatitis_b, "Viral hepatitis: nausea, dark urine, pale stools, jaundice. Needs serology and liver function tests.").
description(hepatitis_c, "Viral hepatitis: abdominal pain, nausea, dark urine, pale stools, jaundice. Needs serology and liver function tests.").
description(urinary_tract_infection, "Lower UTI: dysuria, frequency, suprapubic pain, cloudy urine. Urinalysis; usually non-urgent.").
description(kidney_infection, "Pyelonephritis: fever, flank pain, dysuria, nausea. Needs urine and blood tests; may need IV antibiotics. Watch for sepsis.").
description(chronic_kidney_disease, "Chronic kidney disease: oedema, nausea, haematuria. Check potassium, creatinine and BP.").
description(glomerulonephritis, "Glomerular inflammation: haematuria, facial and ankle oedema. Check BP, urinalysis and renal function.").
description(cellulitis, "Bacterial skin infection: erythema, swelling, pain, fever. Mark the margin; may need IV antibiotics.").
description(dermatitis, "Eczema or dermatitis: itchy, dry, red, cracked skin. Non-urgent.").
description(chickenpox, "Varicella: fever with itchy vesicular rash. Airborne isolation; avoid contact with pregnant or immunocompromised patients.").
description(mpox, "Mpox: fever, lymphadenopathy, vesicular rash. Isolate and notify infection control.").
description(hand_foot_mouth_disease, "Viral infection in children: fever, mouth ulcers, vesicles on hands and feet. Check oral intake and hydration.").
description(leprosy, "Leprosy: hypopigmented skin patches, numbness, weakness. Non-urgent; refer for specialist assessment.").
description(sore_eyes, "Conjunctivitis: red, itchy, watery eyes. Non-urgent; escalate if there is pain, reduced vision or photophobia.").
description(ischemic_heart_disease, "Possible acute coronary syndrome: chest pain, dyspnoea, diaphoresis, nausea. ECG within 10 minutes; escalate to a doctor now.").
description(stroke, "Possible acute stroke (FAST positive): facial droop, arm weakness, speech difficulty. Note time last known well; activate the stroke pathway now.").
description(hypertension, "Raised blood pressure with headache, dizziness, blurred vision. Recheck BP; hypertensive emergency if there are end-organ symptoms.").
description(diabetes, "Possible hyperglycaemia: polydipsia, polyuria, blurred vision. Check capillary glucose and ketones.").
description(heart_failure, "Heart failure: dyspnoea, ankle oedema, palpitations. Check SpO2, ECG and chest X-ray; may need IV diuretics.").
description(atherosclerosis, "Peripheral or coronary arterial disease: chest pain, claudication, numbness. Exclude acute coronary syndrome or limb ischaemia.").
description(deep_vein_thrombosis, "Suspected DVT: unilateral leg pain, swelling, warmth, erythema. Needs D-dimer or ultrasound; watch for signs of pulmonary embolism.").
description(anemia, "Anaemia: pallor, dizziness, palpitations. Check haemoglobin; ask about bleeding.").
description(cancer, "Possible malignancy: unexplained weight loss, anorexia, painless lump. Non-urgent unless unstable; refer for work-up.").
description(malnutrition, "Malnutrition: weight loss, low weight, muscle wasting. Check weight, glucose and electrolytes.").
description(epilepsy, "Seizure disorder: seizures, jerking, loss of awareness. Check glucose; an ongoing seizure is an emergency.").
description(tetanus, "Tetanus after a wound: muscle rigidity, spasms, trismus, dysphagia. Airway risk; escalate now and give immunoglobulin.").
description(rabies, "Possible rabies after an animal bite: fever, paraesthesia, spasms, hydrophobia. Escalate now; wound care and post-exposure prophylaxis.").
description(arthritis, "Inflammatory arthritis: joint pain, swelling, morning stiffness. Non-urgent; exclude septic joint if there is fever or a single hot joint.").
description(depression, "Depressive symptoms: low mood, anhedonia, sleep problems, hopelessness. Ask directly about self-harm and suicidal thoughts.").
description(schizophrenia, "Psychotic symptoms: hallucinations, delusions, disordered thinking. Assess risk to self and others; arrange psychiatry review.").
description(alzheimers, "Cognitive decline: memory loss, confusion, word-finding difficulty, mood change. Exclude acute delirium (infection, glucose, medication).").
