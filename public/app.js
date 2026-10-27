/**
 * ============================================================================
 * 1. STANDARDIZED CLINICAL DESCRIPTIONS (WHO & NIH MEDLINEPLUS REFERENCE)
 * Format: [Etiology/Classification] + [Clinical Presentation] + [Triage/Care]
 * ============================================================================
 */
const CLINICAL_REFERENCE_SOURCE = "WHO & NIH MedlinePlus Clinical Reference";

const DISEASE_DESCRIPTIONS = {
  // FEVER, RESPIRATORY & SYSTEMIC INFECTIONS
  influenza: "An acute viral respiratory infection caused by influenza viruses. It presents with sudden fever, dry cough, nasal congestion, headache, and myalgia. Manage mild cases with rest, oral hydration, and antipyretics; seek medical care if shortness of breath develops.",
  measles: "A highly contagious viral illness caused by the paramyxovirus family. It is characterized by high fever, cough, conjunctivitis (red watery eyes), and a generalized maculopapular rash. Isolate immediately to prevent transmission and consult a physician for supportive care.",
  covid_19: "An infectious respiratory illness caused by the SARS-CoV-2 coronavirus. Common symptoms include fever, dry cough, sore throat, fatigue, and loss of taste or smell. Isolate, maintain hydration, perform antigen/PCR testing, and seek urgent care if breathing difficulty occurs.",
  acute_respiratory_infection: "An acute infection of the upper or lower respiratory tract obstructing normal airflow. It presents with fever, persistent cough, and tachypnea (rapid breathing). Prompt clinical auscultation and evaluation are required to rule out lower airway involvement.",
  pneumonia: "An acute respiratory infection affecting the pulmonary alveoli, which fill with pus and fluid. It causes fever, productive cough with phlegm, pleuritic chest pain, and labored breathing. Prompt medical evaluation is required for targeted antimicrobial therapy.",
  acute_bronchitis: "Transient inflammation of the large conducting airways (bronchi), typically following a viral upper respiratory infection. It manifests with a persistent phlegm-producing cough, wheezing, and throat irritation. Supportive care with hydration and rest is standard unless symptoms persist.",
  chronic_lower_respiratory_disease: "Progressive airway obstruction encompassing chronic bronchitis, emphysema (COPD), and chronic asthma. It presents with exertional dyspnea (shortness of breath), wheezing, and chest tightness. Ongoing medical management with bronchodilators or inhaled corticosteroids is advised.",
  tuberculosis: "A chronic bacterial infection caused by Mycobacterium tuberculosis that primarily affects lung tissue. Classic symptoms include a cough lasting more than two weeks, fever, night sweats, and unintentional weight loss. Diagnostic sputum testing and a multi-drug antibiotic regimen are required.",
  pertussis: "A highly contagious bacterial respiratory infection caused by Bordetella pertussis (whooping cough). It causes paroxysmal coughing fits followed by a high-pitched inspiratory whoop and post-tussive vomiting. Early macrolide antibiotic therapy and medical monitoring are essential.",
  extrapulmonary_tuberculosis: "Tuberculosis infection occurring in organ systems outside the pulmonary parenchyma, such as the lymph nodes, pleura, or bones. It commonly presents with localized lymphadenopathy (swollen glands), fever, drenching night sweats, and weight loss. Specialist infectious disease evaluation is required.",
  hiv: "A retroviral infection caused by the Human Immunodeficiency Virus that progressively depletes CD4+ T lymphocytes. Acute or advancing stages present with persistent fever, generalized lymphadenopathy, weight loss, and rash. Confidential serological testing and antiretroviral therapy (ART) are essential.",
  diphtheria: "An acute, toxin-mediated bacterial infection caused by Corynebacterium diphtheriae affecting the nasopharynx. It produces fever, sore throat, cervical lymphadenopathy, and an adherent gray pseudomembrane. Immediate hospital admission for diphtheria antitoxin and antibiotics is critical.",
  dengue: "A mosquito-borne flavivirus infection transmitted by Aedes mosquitoes. It presents with sudden high-grade fever, severe retro-orbital headache, myalgia, arthralgia, and rash. Maintain strict oral hydration, avoid NSAIDs (such as ibuprofen or aspirin), and seek clinical platelet monitoring.",
  chikungunya: "An alphavirus infection transmitted by Aedes mosquitoes. It is characterized by abrupt onset of fever accompanied by severe, debilitating polyarthralgia (joint pain) and maculopapular rash. Consult a clinician for symptom management and hydration guidance.",
  leptospirosis: "A zoonotic bacterial infection caused by Leptospira species, typically acquired through skin contact with water or soil contaminated by animal urine. It causes fever, headache, myalgia, and characteristic calf tenderness. Prompt clinical evaluation for doxycycline or penicillin therapy is vital.",
  malaria: "A life-threatening protozoan parasitic disease transmitted by Anopheles mosquitoes. It presents with cyclical paroxysms of high fever, rigors (shaking chills), diaphoresis, and headache. Immediate blood smear or rapid diagnostic testing and artemisinin-based therapy are required.",
  typhoid_fever: "A systemic bacterial infection caused by Salmonella enterica serotype Typhi via contaminated food or water. It causes prolonged stepwise fever, frontal headache, abdominal pain, and anorexia. Medical evaluation and targeted antibiotic therapy are necessary to prevent complications.",
  meningitis: "A critical inflammation of the leptomeninges surrounding the brain and spinal cord, caused by bacterial or viral pathogens. It presents with the classic triad of high fever, severe headache, and nuchal rigidity (stiff neck) alongside vomiting. Seek emergency hospital care immediately.",
  meningococcemia: "A fulminant bloodstream infection caused by Neisseria meningitidis. It manifests with acute fever, neck stiffness, petechial or purpuric rash, and rapid hemodynamic instability. Immediate emergency department intervention and intravenous antibiotics are life-saving.",
  sepsis: "A life-threatening organ dysfunction caused by a dysregulated host response to infection. Warning signs include fever or hypothermia, tachycardia, tachypnea, and altered mental status. Activate emergency medical services immediately for intensive hospital resuscitation.",
  rheumatic_fever: "An autoimmune inflammatory multisystem disease occurring as a delayed sequela of untreated Group A streptococcal pharyngitis. It causes fever, migratory polyarthritis (painful swollen joints), and carditis (chest pain). Prompt clinical evaluation is needed to prevent rheumatic heart disease.",

  // GASTROINTESTINAL, HEPATIC, RENAL & DERMATOLOGICAL
  diarrhea: "Acute gastroenteritis characterized by three or more loose or liquid stools per day, often accompanied by abdominal cramping and emesis. Primary treatment centers on oral rehydration salts (ORS) and zinc supplementation; seek care if signs of dehydration appear.",
  cholera: "An acute secretory diarrheal infection caused by ingestion of Vibrio cholerae bacteria. It produces profuse watery diarrhea, vomiting, loss of skin turgor, and sunken eyes, leading to rapid hypovolemic shock. Immediate clinical rehydration with ORS or intravenous fluids is critical.",
  dysentery: "An invasive inflammatory disorder of the lower intestinal tract, commonly caused by Shigella or Entamoeba histolytica. It presents with mucoid, bloody diarrhea, tenesmus, abdominal cramps, and fever. Medical assessment is required for antimicrobial therapy and hydration.",
  schistosomiasis: "A parasitic trematode infection acquired through cutaneous contact with cercariae-infested freshwater. It causes abdominal pain, bloody diarrhea or hematuria, and pruritic skin reactions. Clinical stool/urine examination and praziquantel therapy are recommended.",
  appendicitis: "Acute inflammation and obstruction of the vermiform appendix. It typically presents with periumbilical pain migrating to the right lower quadrant, nausea, anorexia, and low-grade fever. Urgent surgical evaluation is required to prevent perforation and peritonitis.",
  acute_pancreatitis: "Sudden non-bacterial inflammation of the pancreas triggered by gallstones or alcohol use. It causes severe epigastric pain radiating to the back, persistent nausea, and vomiting. Hospital admission is required for intravenous fluid resuscitation and bowel rest.",
  gastric_ulcer: "A mucosal defect penetrating the muscularis mucosae of the stomach wall, commonly linked to H. pylori infection or NSAID use. It causes burning epigastric pain, dyspepsia, bloating, and nausea. Consult a physician for acid-suppression therapy and H. pylori eradication.",
  cirrhosis: "End-stage diffuse hepatic fibrosis with nodular regeneration resulting from chronic liver injury. Decompensated disease presents with jaundice, ascites (abdominal swelling), coagulopathy (easy bruising), and pruritus. Comprehensive hepatology care is required.",
  hepatitis_a: "An acute, self-limiting viral liver infection transmitted via the fecal-oral route through contaminated food or water. Symptoms include fever, malaise, anorexia, dark urine, and icterus (jaundice). Supportive rest, hydration, and avoidance of hepatotoxic medications are advised.",
  hepatitis_b: "A potentially chronic DNA viral infection of the liver transmitted through blood or bodily fluids. Acute flares present with nausea, dark urine, acholic (pale) stools, and jaundice. Serological testing and antiviral evaluation by a physician are recommended.",
  hepatitis_c: "A blood-borne RNA viral infection causing chronic hepatic inflammation. When symptomatic, it presents with right upper quadrant discomfort, nausea, dark urine, pale stools, and jaundice. Confirmatory RNA testing and direct-acting antiviral (DAA) therapy can cure the infection.",
  urinary_tract_infection: "Bacterial colonization and inflammation of the urinary system, predominantly affecting the bladder (cystitis). It causes dysuria (burning urination), urinary frequency, cloudy urine, and suprapubic discomfort. Outpatient clinical evaluation for targeted oral antibiotics is advised.",
  kidney_infection: "Acute pyelonephritis resulting from an ascending urinary tract infection reaching the renal parenchyma. It presents with high fever, unilateral or bilateral flank pain, nausea, and dysuria. Prompt medical care for systemic antibiotics is necessary to prevent renal scarring.",
  chronic_kidney_disease: "Progressive, irreversible structural or functional decline of the kidneys lasting more than three months. Advanced stages manifest with peripheral edema (swollen ankles), uremic nausea, and hematuria. Nephrology evaluation for blood pressure and renal function management is essential.",
  glomerulonephritis: "Immune-mediated inflammation of the renal glomeruli impairing blood filtration. It characteristically presents with periorbital puffiness, dependent ankle edema, and hematuria (tea-colored or bloody urine). Prompt medical evaluation of renal function and blood pressure is required.",
  cellulitis: "An acute spreading bacterial infection of the dermis and subcutaneous tissues, typically caused by Streptococcus or Staphylococcus species. It produces localized erythema, warmth, edema, tenderness, and fever. Prescription antibiotic therapy from a clinician is required.",
  dermatitis: "Inflammatory superficial skin reactivity encompassing atopic eczema and contact dermatitis. It presents with erythema, xerosis (dryness), scaling, fissuring, and pruritus. Manage with fragrance-free emollients, trigger avoidance, and topical anti-inflammatory care.",
  chickenpox: "A highly contagious primary infection caused by the varicella-zoster virus. It produces fever, malaise, and a generalized pruritic rash that progresses rapidly from macules to vesicles and crusts. Isolate until all lesions have crusted and use supportive antipruritic care.",
  mpox: "A zoonotic orthopoxvirus infection transmitted through close physical contact. It presents with prodromal fever, prominent lymphadenopathy, myalgia, and a centrifugal vesiculopustular rash. Isolate and contact a healthcare provider for diagnostic testing and supportive care.",
  hand_foot_mouth_disease: "A common contagious enteroviral syndrome predominantly caused by Coxsackievirus A16 or Enterovirus 71. It causes low-grade fever, painful oral enanthem (mouth ulcers), and a maculopapular or vesicular rash on the palms and soles. Maintain hydration and monitor closely.",
  leprosy: "A chronic granulomatous infection caused by Mycobacterium leprae affecting peripheral nerves and skin. It presents with hypopigmented or erythematous anesthetic skin patches, peripheral neuropathy, and muscle weakness. It is completely curable with WHO multidrug therapy (MDT).",
  sore_eyes: "Acute infectious or allergic conjunctivitis involving inflammation of the palpebral and bulbar conjunctiva. It causes conjunctival hyperemia (redness), pruritus, grittiness, and tearing. Practice strict hand hygiene, avoid sharing towels, and seek ophthalmic drops if purulent.",

  // CARDIOVASCULAR, METABOLIC, NEUROLOGICAL & PSYCHIATRIC
  ischemic_heart_disease: "Myocardial oxygen supply-demand mismatch typically caused by coronary artery atherosclerosis. Acute coronary syndrome presents with substernal chest pressure, dyspnea, diaphoresis, and nausea. Seek emergency medical services immediately.",
  stroke: "An acute focal neurological deficit resulting from cerebral infarction or hemorrhage. Warning signs include sudden facial droop, unilateral arm weakness, and dysarthria or aphasia (speech difficulty). Call emergency services immediately—time-critical reperfusion saves brain tissue.",
  hypertension: "Persistently elevated systemic arterial blood pressure (≥140/90 mmHg). Often asymptomatic, severe elevations can produce occipital headache, dizziness, and visual disturbances. Regular sphygmomanometer monitoring, dietary sodium reduction, and antihypertensive therapy are advised.",
  diabetes: "A chronic metabolic disorder characterized by persistent hyperglycemia due to impaired insulin secretion, insulin action, or both. Classic symptoms include polydipsia (excessive thirst), polyuria (frequent urination), and blurred vision. Clinical HbA1c/glucose testing and glycemic management are required.",
  heart_failure: "A clinical syndrome in which impaired ventricular filling or ejection prevents the heart from meeting systemic metabolic demands. It presents with dyspnea, orthopnea, dependent ankle edema, and palpitations. Cardiology evaluation and guideline-directed medical therapy are essential.",
  atherosclerosis: "Chronic arterial wall thickening and lumen narrowing driven by lipid-rich plaque accumulation. It manifests clinically with angina pectoris (chest pain), intermittent claudication (exertional leg pain), and paresthesia. Cardiovascular risk modification and lipid-lowering therapy are indicated.",
  deep_vein_thrombosis: "Formation of a fibrin-rich thrombus within a deep venous conduit, most commonly in the lower extremities. It causes unilateral calf or thigh pain, pitting edema, erythema, and localized warmth. Urgent Doppler ultrasound and anticoagulation are needed to prevent pulmonary embolism.",
  anemia: "A hematologic reduction in circulating hemoglobin concentration or red blood cell mass, impairing tissue oxygen delivery. It causes mucocutaneous pallor, fatigue, orthostatic dizziness, and compensatory tachycardia. Complete blood count (CBC) evaluation is recommended to identify the underlying cause.",
  cancer: "Uncontrolled clonal proliferation of abnormal cells capable of local tissue invasion and distant metastasis. Constitutional signs include unexplained weight loss, persistent anorexia, and a firm, painless mass. Prompt oncological diagnostic workup and biopsy evaluation are critical.",
  malnutrition: "Cellular imbalance between nutrient/energy intake and physiological requirements for maintenance and growth. Protein-energy undernutrition presents with significant weight loss, low body mass index, and skeletal muscle wasting. Structured nutritional rehabilitation under clinical guidance is advised.",
  epilepsy: "A chronic neurological disorder characterized by an enduring predisposition to generate unprovoked epileptic seizures. Episodes involve paroxysmal electrical discharges causing tonic-clonic muscle jerking and transient loss of consciousness. Neurological evaluation and antiepileptic medication are required.",
  tetanus: "An acute, toxin-mediated neurological disease caused by Clostridium tetani spores entering devitalized wounds. Tetanospasmin causes generalized rigidity, painful reflex spasms, trismus (lockjaw), and dysphagia. Immediate emergency hospitalization for immunoglobulin and airway support is mandatory.",
  rabies: "A virtually fatal zoonotic viral encephalomyelitis transmitted via the saliva of infected mammals through bites or scratches. Clinical onset features fever, wound paresthesia, pharyngeal spasms, and hydrophobia. Immediate post-exposure prophylaxis (vaccine and immunoglobulin) after any bite is life-saving.",
  arthritis: "Acute or chronic intra-articular inflammation involving synovial proliferation or cartilage degeneration. It presents with localized arthralgia, joint effusion (swelling), and prolonged morning stiffness. Rheumatology or primary care assessment for anti-inflammatory and physical therapy is advised.",
  depression: "A common mood disorder involving persistent neurobiological and affective dysregulation lasting at least two weeks. Core symptoms include depressed mood, anhedonia (loss of interest), insomnia or hypersomnia, and feelings of hopelessness. Evidence-based psychotherapy and pharmacotherapy are highly effective.",
  schizophrenia: "A chronic, severe neuropsychiatric syndrome affecting perception, cognition, and affect. It presents with positive symptoms such as auditory hallucinations and fixed delusions alongside social withdrawal. Comprehensive psychiatric care and antipsychotic therapy are essential.",
  alzheimers: "A progressive neurodegenerative disorder characterized by cortical atrophy, beta-amyloid plaques, and neurofibrillary tangles. It causes insidious episodic memory loss, temporal/spatial disorientation, anomia (word-finding difficulty), and behavioral changes. Neurological assessment and supportive care planning are recommended."
};

function formatName(str) {
  if (str === "covid_19") return "COVID-19";
  if (str === "hiv") return "HIV";
  if (str === "alzheimers") return "Alzheimer's Disease";
  return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * ============================================================================
 * 2. PROLOG BRIDGE & QUERY FILTER
 * ============================================================================
 */
const prologBridge = {
  isLoaded: false
};

let prologKnowledgeBase = [];

async function queryPrologCandidates(category, answers) {
  if (prologKnowledgeBase.length === 0) return [];

  return prologKnowledgeBase.filter(disease => {
    if (category !== "extended" && disease.category !== category) return false;

    for (const { symptom, answer } of answers) {
      const hasSymptom = disease.symptoms.includes(symptom);
      if (answer === "yes" && !hasSymptom) return false;
      if (answer === "no" && hasSymptom) return false;
    }

    return true;
  });
}

async function queryAllPrologConditions(category) {
  return queryPrologCandidates(category, []);
}

/**
 * ============================================================================
 * 3. ENGINE STATE & CONTINUED-QUESTIONING LOGIC
 * ============================================================================
 */
const state = {
  category: null,
  initialPool: [],
  candidates: [],
  answers: [],
  currentSymptom: null,
  matchedDisease: null,
  isContinuingAfterMatch: false,
  isFinished: false
};

async function startCategorySession(category) {
  if (!prologBridge.isLoaded) return;

  state.category = category;
  state.answers = [];
  state.matchedDisease = null;
  state.isContinuingAfterMatch = false;
  state.isFinished = false;

  state.initialPool = await queryAllPrologConditions(category);
  await recomputeEngineState();

  document.getElementById("category-step-view").style.display = "none";
  document.getElementById("question-step-view").style.display = "flex";

  const badgeLabel = category === "extended"
    ? `Extended Mode • ${state.initialPool.length} Conditions`
    : `${formatName(category)} Category`;
  document.getElementById("active-category-badge").textContent = badgeLabel;

  renderWorkspace();
}

async function recomputeEngineState() {
  const yesSet = new Set(state.answers.filter(a => a.answer === "yes").map(a => a.symptom));
  const noSet = new Set(state.answers.filter(a => a.answer === "no").map(a => a.symptom));

  state.candidates = await queryPrologCandidates(state.category, state.answers);

  if (state.candidates.length === 0) {
    state.matchedDisease = null;
    state.currentSymptom = null;
    state.isContinuingAfterMatch = false;
    state.isFinished = true;
    return;
  }

  const matchedCandidates = state.candidates.filter(disease =>
    disease.symptoms.every(sym => yesSet.has(sym))
  );

  const exactMatch = matchedCandidates.length > 0
    ? [...matchedCandidates].sort((a, b) => b.symptoms.length - a.symptoms.length)[0]
    : null;

  let nextSym = null;
  for (const candidate of state.candidates) {
    const unasked = candidate.symptoms.find(sym => !yesSet.has(sym) && !noSet.has(sym));
    if (unasked) {
      nextSym = unasked;
      break;
    }
  }

  if (nextSym) {
    state.matchedDisease = exactMatch;
    state.currentSymptom = nextSym;
    state.isContinuingAfterMatch = Boolean(exactMatch);
    state.isFinished = false;
    return;
  }

  state.matchedDisease = exactMatch;
  state.currentSymptom = null;
  state.isContinuingAfterMatch = false;
  state.isFinished = true;
}

async function recordAnswer(answerValue) {
  if (!state.currentSymptom || state.isFinished) return;

  state.answers.push({
    symptom: state.currentSymptom,
    answer: answerValue
  });

  await recomputeEngineState();
  renderWorkspace();

  if (state.isFinished) {
    openConfirmationModal();
  }
}

async function undoLastAnswer() {
  if (state.answers.length === 0) return;
  state.answers.pop();
  await recomputeEngineState();
  renderWorkspace();
}

/**
 * ============================================================================
 * 4. GOOGLE MATERIAL 3 UI RENDERING
 * ============================================================================
 */
function updatePrologStatusUI(loaded, message) {
  const pill = document.getElementById("pl-status-pill");
  pill.textContent = message;
  pill.className = `pl-status-pill ${loaded ? "loaded" : "error"}`;

  document.querySelectorAll(".category-card-btn").forEach(btn => {
    btn.disabled = !loaded;
  });
}

function updateProgressSidebar() {
  const statusText = document.getElementById("progress-status-text");
  const percentText = document.getElementById("progress-percent");
  const fillBar = document.getElementById("progress-fill");
  const inst1 = document.getElementById("inst-1");
  const inst2 = document.getElementById("inst-2");
  const inst3 = document.getElementById("inst-3");

  inst1.classList.remove("active");
  inst2.classList.remove("active");
  inst3.classList.remove("active");

  if (!state.category) {
    statusText.textContent = "Step 1 • Select Category";
    percentText.textContent = "0%";
    fillBar.style.width = "10%";
    inst1.classList.add("active");
    return;
  }

  if (state.isFinished) {
    statusText.textContent = "Step 3 • Ready to Review";
    percentText.textContent = "100%";
    fillBar.style.width = "100%";
    inst3.classList.add("active");
    return;
  }

  inst2.classList.add("active");
  const totalPool = state.initialPool.length || 1;
  const eliminated = totalPool - state.candidates.length;
  const pct = Math.min(95, Math.max(15, Math.round((eliminated / totalPool) * 85) + 10));
  statusText.textContent = "Step 2 • Symptom Check";
  percentText.textContent = `${pct}%`;
  fillBar.style.width = `${pct}%`;
}

function renderWorkspace() {
  const yesSet = new Set(state.answers.filter(a => a.answer === "yes").map(a => a.symptom));

  const questionText = document.getElementById("question-text");
  const yesNoControls = document.getElementById("yes-no-controls");
  const completeBanner = document.getElementById("question-complete-banner");
  const continuingBanner = document.getElementById("continuing-match-banner");

  if (state.isContinuingAfterMatch && state.matchedDisease && !state.isFinished) {
    const otherCandidates = state.candidates
      .filter(d => d.id !== state.matchedDisease.id)
      .map(d => formatName(d.id))
      .join(", ");
    continuingBanner.style.display = "block";
    continuingBanner.textContent = `Preliminary match: ${formatName(state.matchedDisease.id)} • Checking closely related conditions (${otherCandidates})`;
  } else {
    continuingBanner.style.display = "none";
    continuingBanner.textContent = "";
  }

  if (!state.isFinished && state.currentSymptom) {
    const readableSymptom = formatName(state.currentSymptom).toLowerCase();
    questionText.textContent = `Are you experiencing ${readableSymptom}?`;
    yesNoControls.style.display = "grid";
    completeBanner.style.display = "none";
  } else {
    yesNoControls.style.display = "none";
    completeBanner.style.display = "block";
    if (state.matchedDisease) {
      questionText.textContent = `Primary Match Identified: ${formatName(state.matchedDisease.id)}`;
    } else {
      questionText.textContent = `Symptom Check Complete`;
    }
  }

  document.getElementById("btn-undo").disabled = state.answers.length === 0;

  // CANDIDATES BOARD (MATERIAL 3 EMPTY STATES & CHIPS)
  const board = document.getElementById("candidates-board");
  const badge = document.getElementById("remaining-count-badge");

  if (!state.category) {
    badge.textContent = prologBridge.isLoaded ? "Awaiting Selection" : "Knowledge Base Offline";
    board.innerHTML = `
      <div class="m3-empty-state">
        <div class="m3-empty-title">
          ${prologBridge.isLoaded ? "Select a symptom category above" : "Knowledge base file required"}
        </div>
        <div class="m3-empty-subtitle">
          ${prologBridge.isLoaded
            ? "Candidate conditions from the clinical knowledge base will filter here in real time."
            : "Use 'Load .pl File' in the top bar to select conditions.pl and initialize the engine."}
        </div>
      </div>
    `;
  } else {
    badge.textContent = `${state.candidates.length} of ${state.initialPool.length} Active`;
    board.innerHTML = "";

    if (state.candidates.length === 0) {
      board.innerHTML = `
        <div class="m3-empty-state m3-empty-warning">
          <div class="m3-empty-title">No exact condition matches all selected responses</div>
          <div class="m3-empty-subtitle">
            Undo your last response to revise, or continue to view the closest partial clinical matches.
          </div>
        </div>
      `;
    } else {
      state.candidates.forEach(disease => {
        const matchedCount = disease.symptoms.filter(s => yesSet.has(s)).length;
        const isFullMatch = matchedCount === disease.symptoms.length;
        const node = document.createElement("div");
        node.className = `candidate-node ${
          isFullMatch ? "full-match" : matchedCount > 0 ? "highlighted" : ""
        }`;
        node.innerHTML = `
          <div class="candidate-node-title">${formatName(disease.id)}</div>
          <div class="candidate-node-meta">
            ${matchedCount}/${disease.symptoms.length} symptoms${isFullMatch ? " • ✓ Match" : ""}
          </div>
        `;
        board.appendChild(node);
      });
    }
  }

  // ANSWER LOG (MATERIAL 3 TONAL PLACEHOLDER OR CHIPS)
  document.getElementById("answers-count").textContent = state.answers.length;
  const historyList = document.getElementById("answer-history-list");

  if (state.answers.length === 0) {
    historyList.innerHTML = `
      <div class="m3-empty-state m3-empty-compact">
        <div class="m3-empty-title">No responses recorded</div>
        <div class="m3-empty-subtitle">Your YES and NO symptom chips will appear here as you progress.</div>
      </div>
    `;
  } else {
    historyList.innerHTML = "";
    state.answers.forEach(item => {
      const row = document.createElement("div");
      row.className = "answer-pill";
      row.innerHTML = `
        <span>${formatName(item.symptom)}</span>
        <span class="${item.answer === "yes" ? "answer-badge-yes" : "answer-badge-no"}">
          ${item.answer.toUpperCase()}
        </span>
      `;
      historyList.appendChild(row);
    });
  }

  document.getElementById("btn-sidebar-finish").disabled = state.answers.length === 0;
  updateProgressSidebar();
}

/**
 * ============================================================================
 * 5. CONFIRMATION MODAL & CLINICAL RESULTS VIEW
 * ============================================================================
 */
const confirmModal = document.getElementById("confirm-modal");

function openConfirmationModal() {
  const reviewBox = document.getElementById("modal-review-box");
  const yesAnswers = state.answers.filter(a => a.answer === "yes");
  const noAnswers = state.answers.filter(a => a.answer === "no");

  const renderChips = (items, badgeClass, label) => {
    if (items.length === 0) {
      return `<span class="m3-empty-subtitle">None reported</span>`;
    }
    return items.map(a => `
      <span class="answer-pill">
        <span>${formatName(a.symptom)}</span>
        <span class="${badgeClass}">${label}</span>
      </span>
    `).join("");
  };

  reviewBox.innerHTML = `
    <div class="modal-review-group">
      <div class="modal-group-label positive">Confirmed Present (${yesAnswers.length})</div>
      <div class="modal-chip-row">
        ${renderChips(yesAnswers, "answer-badge-yes", "YES")}
      </div>
    </div>
    <div class="modal-review-group">
      <div class="modal-group-label negative">Reported Absent (${noAnswers.length})</div>
      <div class="modal-chip-row">
        ${renderChips(noAnswers, "answer-badge-no", "NO")}
      </div>
    </div>
  `;

  confirmModal.classList.add("active");
}

async function renderResultsPage() {
  const primaryContainer = document.getElementById("primary-result-container");
  const fallbackContainer = document.getElementById("fallback-result-container");
  primaryContainer.innerHTML = "";
  fallbackContainer.innerHTML = "";

  const yesSet = new Set(state.answers.filter(a => a.answer === "yes").map(a => a.symptom));

  if (state.matchedDisease) {
    const d = state.matchedDisease;
    const desc = DISEASE_DESCRIPTIONS[d.id] || "Consult a qualified healthcare professional for a comprehensive clinical evaluation.";
    primaryContainer.innerHTML = `
      <div class="result-card">
        <div class="result-meta-row">
          <span class="result-category-pill">Primary Match • ${formatName(d.category)} Category</span>
          <span class="result-source-pill">${CLINICAL_REFERENCE_SOURCE}</span>
        </div>
        <h1 class="result-title">${formatName(d.id)}</h1>
        <div class="result-desc">${desc}</div>
        <div class="result-symptoms-block">
          <span class="result-symptoms-label">Matched Clinical Criteria</span>
          <div class="modal-chip-row">
            ${d.symptoms.map(s => `<span class="answer-pill"><span class="answer-badge-yes">✓</span><span>${formatName(s)}</span></span>`).join("")}
          </div>
        </div>
      </div>
    `;
  } else {
    primaryContainer.innerHTML = `
      <div class="result-card unknown-card">
        <div class="result-meta-row">
          <span class="result-category-pill danger">Inconclusive Pattern</span>
          <span class="result-source-pill">${CLINICAL_REFERENCE_SOURCE}</span>
        </div>
        <h1 class="result-title">No Single Exact Match Found</h1>
        <div class="result-desc">
          Your reported symptom combination did not satisfy all criteria for a single condition in this category. Please consult a physician for an in-person clinical assessment.
        </div>
        ${state.category !== "extended" ? `
          <button id="btn-switch-extended" class="btn-submit" style="max-width: 380px;">
            Run Extended Check Across All Categories →
          </button>
        ` : ""}
      </div>
    `;

    if (yesSet.size > 0) {
      const allConditions = await queryAllPrologConditions("extended");
      const partialMatches = allConditions
        .map(d => ({
          ...d,
          matched: d.symptoms.filter(s => yesSet.has(s))
        }))
        .filter(d => d.matched.length > 0)
        .sort((a, b) => (b.matched.length / b.symptoms.length) - (a.matched.length / a.symptoms.length))
        .slice(0, 3);

      if (partialMatches.length > 0) {
        fallbackContainer.innerHTML = `
          <div class="card partial-matches-card">
            <div class="candidates-header">
              <h3 class="section-title">Closest Partial Matches</h3>
              <span class="result-source-pill">${CLINICAL_REFERENCE_SOURCE}</span>
            </div>
            <div class="partial-match-list">
              ${partialMatches.map(item => `
                <div class="partial-match-item">
                  <div class="partial-match-header">
                    <span class="partial-match-name">${formatName(item.id)}</span>
                    <span class="answer-badge-yes">${item.matched.length}/${item.symptoms.length} matched</span>
                  </div>
                  <p class="partial-match-desc">${DISEASE_DESCRIPTIONS[item.id] || ""}</p>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
    }
  }

  document.getElementById("triage-page").classList.remove("active");
  document.getElementById("results-page").classList.add("active");

  const switchExtendedBtn = document.getElementById("btn-switch-extended");
  if (switchExtendedBtn) {
    switchExtendedBtn.addEventListener("click", () => {
      document.getElementById("results-page").classList.remove("active");
      document.getElementById("triage-page").classList.add("active");
      startCategorySession("extended");
    });
  }
}

/**
 * ============================================================================
 * 6. INITIALIZATION, PARSING & EVENT LISTENERS
 * ============================================================================
 */
function updateInitProgress(percent, text, isError = false) {
  const progressBar = document.getElementById("init-progress-bar");
  const progressText = document.getElementById("init-progress-text");
  const progressPercent = document.getElementById("init-progress-percent");

  if (progressBar) {
    progressBar.style.width = `${percent}%`;
    progressBar.style.background = isError ? "var(--danger-red)" : "var(--primary-blue)";
  }
  if (progressPercent) progressPercent.textContent = `${percent}%`;
  if (progressText) progressText.textContent = text;
}

async function parsePrologText(plText, sourceLabel) {
  const progressContainer = document.getElementById("init-progress-container");

  updateInitProgress(65, "Indexing clinical categories...");
  const categories = {};
  for (const match of plText.matchAll(/in_category\(\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*\)\s*\./g)) {
    categories[match[1].trim()] = match[2].trim();
  }
  await new Promise(r => setTimeout(r, 150));

  updateInitProgress(85, "Mapping symptom rules...");
  const conditions = {};
  for (const match of plText.matchAll(/condition\(\s*([a-zA-Z0-9_]+)\s*,\s*\[([^\]]+)\]\s*\)\s*\./g)) {
    conditions[match[1].trim()] = match[2].split(",").map(s => s.trim());
  }

  prologKnowledgeBase = Object.keys(conditions).map(id => ({
    id,
    category: categories[id],
    symptoms: conditions[id]
  }));

  if (prologKnowledgeBase.length === 0) {
    throw new Error("No valid Prolog facts found in file.");
  }

  await new Promise(r => setTimeout(r, 150));
  updateInitProgress(100, `Ready (${prologKnowledgeBase.length} conditions)`);
  prologBridge.isLoaded = true;
  updatePrologStatusUI(true, `Knowledge Base Ready • ${prologKnowledgeBase.length} Conditions`);

  setTimeout(() => {
    if (progressContainer) progressContainer.style.display = "none";
  }, 600);

  renderWorkspace();
}

async function autoDiscoverPrologFile() {
  const candidatePaths = ["../private/conditions.pl", "conditions.pl", "./conditions.pl"];

  updateInitProgress(20, "Locating conditions.pl...");
  await new Promise(r => setTimeout(r, 150));

  for (const path of candidatePaths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        updateInitProgress(45, `Loading ${path}...`);
        const plText = await response.text();
        await parsePrologText(plText, path);
        return;
      }
    } catch (_) {
      // Continue trying fallback paths
    }
  }

  updateInitProgress(100, "Manual file selection required", true);
  prologBridge.isLoaded = false;
  updatePrologStatusUI(false, "Select conditions.pl to begin");
  renderWorkspace();
}

const fileInput = document.getElementById("pl-file-input");
if (fileInput) {
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const progressContainer = document.getElementById("init-progress-container");
      if (progressContainer) progressContainer.style.display = "block";
      updateInitProgress(35, `Reading ${file.name}...`);
      const text = await file.text();
      await parsePrologText(text, file.name);
    } catch (error) {
      updateInitProgress(100, "Invalid file format", true);
      updatePrologStatusUI(false, `Parse Error: ${error.message}`);
    }
  });
}

document.querySelectorAll(".category-card-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    startCategorySession(btn.dataset.cat);
  });
});

document.getElementById("btn-answer-yes").addEventListener("click", () => recordAnswer("yes"));
document.getElementById("btn-answer-no").addEventListener("click", () => recordAnswer("no"));
document.getElementById("btn-undo").addEventListener("click", undoLastAnswer);

document.getElementById("btn-change-category").addEventListener("click", () => {
  state.category = null;
  state.answers = [];
  state.candidates = [];
  state.isContinuingAfterMatch = false;
  state.isFinished = false;
  document.getElementById("question-step-view").style.display = "none";
  document.getElementById("category-step-view").style.display = "flex";
  renderWorkspace();
});

document.getElementById("btn-open-confirm-main").addEventListener("click", openConfirmationModal);
document.getElementById("btn-sidebar-finish").addEventListener("click", openConfirmationModal);

document.getElementById("btn-modal-back").addEventListener("click", () => {
  confirmModal.classList.remove("active");
});

document.getElementById("btn-modal-confirm").addEventListener("click", () => {
  confirmModal.classList.remove("active");
  renderResultsPage();
});

document.getElementById("btn-results-back").addEventListener("click", () => {
  document.getElementById("results-page").classList.remove("active");
  document.getElementById("triage-page").classList.add("active");
});

document.getElementById("btn-results-restart").addEventListener("click", () => {
  state.category = null;
  state.answers = [];
  state.candidates = [];
  state.isContinuingAfterMatch = false;
  state.isFinished = false;
  document.getElementById("results-page").classList.remove("active");
  document.getElementById("triage-page").classList.add("active");
  document.getElementById("question-step-view").style.display = "none";
  document.getElementById("category-step-view").style.display = "flex";
  renderWorkspace();
});

autoDiscoverPrologFile();