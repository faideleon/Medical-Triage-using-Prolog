/**
 * ============================================================================
 * 1. EDITABLE DISEASE DESCRIPTIONS DICTIONARY
 * Modify any text string below to customize the output on the results page.
 * ============================================================================
 */
const DISEASE_DESCRIPTIONS = {
  influenza: "An acute viral respiratory infection characterized by sudden onset of fever, cough, and nasal congestion. Rest and hydration are primary supportive measures.",
  measles: "A highly contagious viral illness presenting with fever, cough, conjunctivitis (red eyes), and a characteristic maculopapular rash.",
  covid_19: "A respiratory disease caused by SARS-CoV-2, commonly presenting with fever, dry cough, sore throat, and anosmia (loss of smell).",
  acute_respiratory_infection: "An upper or lower respiratory tract infection causing fever, cough, and tachypnea (fast breathing) requiring airway monitoring.",
  pneumonia: "Inflammation of the pulmonary alveoli resulting in productive cough with phlegm, fever, dyspnea, and pleuritic chest pain.",
  acute_bronchitis: "Inflammation of the bronchial tubes causing persistent cough, sputum production, wheezing, and throat irritation.",
  chronic_lower_respiratory_disease: "Long-term airway obstruction (including COPD and chronic asthma) marked by dyspnea, wheezing, and chest tightness.",
  tuberculosis: "A chronic bacterial infection by Mycobacterium tuberculosis affecting the lungs, causing prolonged cough, fever, and unexplained weight loss.",
  pertussis: "Whooping cough; a bacterial respiratory infection causing severe paroxysmal coughing fits often followed by post-tussive vomiting.",
  extrapulmonary_tuberculosis: "Tuberculosis infection occurring outside the lungs, frequently affecting lymph nodes with fever, night sweats, and weight loss.",
  hiv: "Human Immunodeficiency Virus infection; acute or chronic presentation includes persistent fever, generalized lymphadenopathy, weight loss, and rash.",
  diphtheria: "A serious bacterial infection by Corynebacterium diphtheriae producing a characteristic grey pseudomembrane in the pharynx alongside fever and swollen glands.",
  dengue: "A mosquito-borne flavivirus infection presenting with high fever, severe retro-orbital pain (behind the eyes), headache, and myalgia.",
  chikungunya: "An alphavirus transmitted by Aedes mosquitoes causing acute fever, debilitating polyarthralgia (joint pain), and skin rash.",
  leptospirosis: "A zoonotic spirochetal infection acquired from contaminated water, marked by fever, headache, myalgia, and prominent calf tenderness.",
  malaria: "A protozoan parasitic infection transmitted by Anopheles mosquitoes presenting with cyclical paroxysms of fever, rigors (chills), and headache.",
  typhoid_fever: "Enteric fever caused by Salmonella Typhi, characterized by stepwise fever, headache, abdominal pain, and anorexia.",
  meningitis: "Acute inflammation of the protective meningeal membranes covering the brain and spinal cord; classic triad includes fever, headache, and nuchal rigidity.",
  meningococcemia: "Life-threatening bloodstream infection by Neisseria meningitidis causing rapid onset fever, petechial/purpuric rash, bruising, and neck stiffness.",
  sepsis: "Systemic dysregulated host response to infection causing organ dysfunction, tachycardia, tachypnea, fever, and altered mental status (confusion).",
  rheumatic_fever: "An inflammatory autoimmune complication following streptococcal pharyngitis, affecting the heart, joints, and central nervous system.",
  diarrhea: "Acute gastroenteritis characterized by loose watery stools, emesis, and abdominal cramping; primary risk is fluid and electrolyte depletion.",
  cholera: "Severe secretory diarrhea caused by Vibrio cholerae leading to rapid dehydration, sunken eyes, loss of skin turgor, and vomiting.",
  dysentery: "Invasive infectious gastroenteritis causing bloody, mucoid diarrhea, severe abdominal cramps, and systemic fever.",
  schistosomiasis: "A parasitic trematode infection acquired through freshwater contact, causing abdominal pain, bloody diarrhea, and cercarial dermatitis (itching).",
  appendicitis: "Acute inflammation of the vermiform appendix presenting with periumbilical pain migrating to the right lower quadrant, nausea, fever, and anorexia.",
  acute_pancreatitis: "Sudden inflammation of the pancreas presenting with severe epigastric pain radiating to the back, accompanied by nausea and vomiting.",
  gastric_ulcer: "A mucosal defect in the stomach lining causing burning epigastric pain, dyspepsia (heartburn), bloating, and nausea.",
  cirrhosis: "Late-stage hepatic fibrosis resulting in portal hypertension, jaundice, ascites (swollen abdomen), coagulopathy (bruising), and pruritus.",
  hepatitis_a: "An acute, self-limiting viral liver infection transmitted via the fecal-oral route, presenting with fever, anorexia, dark urine, and jaundice.",
  hepatitis_b: "A viral liver infection transmitted via bodily fluids causing nausea, choluria (dark urine), acholic (pale) stools, and icterus.",
  hepatitis_c: "A blood-borne viral hepatitis that frequently progresses to chronic liver disease, presenting with right upper quadrant pain, dark urine, and jaundice.",
  urinary_tract_infection: "Bacterial colonization of the urinary tract causing dysuria (painful urination), frequency, suprapubic tenderness, and turbid urine.",
  kidney_infection: "Pyelonephritis; an upper urinary tract infection presenting with high fever, costovertebral angle (back/flank) pain, dysuria, and nausea.",
  chronic_kidney_disease: "Progressive loss of renal function resulting in fluid retention (pedal/ankle edema), uremic nausea, and hematuria.",
  glomerulonephritis: "Immune-mediated inflammation of the renal glomeruli presenting with hematuria, periorbital (facial) edema, and peripheral swelling.",
  cellulitis: "An acute bacterial skin and subcutaneous tissue infection characterized by localized erythema, edema, warmth, tenderness, and fever.",
  dermatitis: "Inflammatory skin condition marked by pruritus (itching), xerosis (dry skin), erythema, and epidermal fissuring.",
  chickenpox: "Primary varicella-zoster virus infection causing fever and a generalized pruritic vesicular (blistering) rash in successive crops.",
  mpox: "A viral zoonosis presenting with prodromal fever, prominent lymphadenopathy (swollen glands), and a centrifugal vesiculopustular rash.",
  hand_foot_mouth_disease: "An enteroviral syndrome characterized by low-grade fever, painful oral enanthems (mouth ulcers), and maculopapular/vesicular lesions on hands and feet.",
  leprosy: "Hansen's disease; a chronic mycobacterial infection targeting peripheral nerves and skin, causing hypopigmented anesthetic patches and motor weakness.",
  sore_eyes: "Acute conjunctivitis presenting with conjunctival injection (red eyes), ocular pruritus, and epiphora (watery discharge).",
  ischemic_heart_disease: "Myocardial oxygen supply-demand mismatch due to coronary artery narrowing, causing angina (chest pain), dyspnea, diaphoresis, and nausea.",
  stroke: "Acute focal neurological deficit from cerebral ischemia or hemorrhage; recognized by facial droop, unilateral arm weakness, and dysarthria/aphasia.",
  hypertension: "Sustained elevation of systemic arterial blood pressure; severe elevations may cause occipital headache, vertigo/dizziness, and visual disturbances.",
  diabetes: "Chronic metabolic disorder of impaired insulin secretion or action presenting with polydipsia (excessive thirst), polyuria, and blurred vision.",
  heart_failure: "Inability of the ventricles to pump sufficient blood to meet metabolic demands, resulting in dyspnea, orthopnea, ankle edema, and palpitations.",
  atherosclerosis: "Systemic arterial plaque deposition causing myocardial ischemia (chest pain), peripheral claudication (leg pain), and paresthesia.",
  deep_vein_thrombosis: "Formation of a blood clot within a deep vein (typically the lower extremity), presenting with unilateral calf pain, swelling, warmth, and erythema.",
  anemia: "Decreased red blood cell mass or hemoglobin concentration leading to reduced tissue oxygenation, pallor, dizziness, and compensatory palpitations.",
  cancer: "Malignant neoplastic proliferation often presenting systemically with unintentional weight loss (cachexia), anorexia, and a persistent painless mass.",
  malnutrition: "Deficiency of caloric or protein intake resulting in marked weight loss, low body mass index, and skeletal muscle wasting.",
  epilepsy: "A chronic neurological disorder predisposing the brain to recurrent unprovoked seizures, myoclonic jerking, and transient loss of consciousness.",
  tetanus: "Clostridium tetani neurotoxin-mediated condition causing generalized hypertonia, painful muscle spasms, trismus (lockjaw), and dysphagia.",
  rabies: "An acute, fatal viral encephalomyelitis transmitted via mammalian bites, presenting with fever, paresthesia at the bite site, spasms, and hydrophobia.",
  arthritis: "Intra-articular joint inflammation causing arthralgia, joint effusion (swelling), reduced range of motion, and prominent morning stiffness.",
  depression: "Major depressive disorder characterized by persistent dysphoria (low mood), anhedonia (loss of interest), sleep dysregulation, and feelings of hopelessness.",
  schizophrenia: "A chronic psychotic disorder involving auditory/visual hallucinations, fixed delusions, disorganized thought processes, and social withdrawal.",
  alzheimers: "Progressive neurodegenerative dementia marked by anterograde memory impairment, disorientation, aphasia, and behavioral changes."
};

/**
 * ============================================================================
 * 2. PROLOG KNOWLEDGE BASE DATASET (60 Conditions across 3 Categories)
 * ============================================================================
 */
const KNOWLEDGE_BASE = [
  // FEVER (21)
  { id: "influenza", category: "fever", symptoms: ["fever", "cough", "runny_nose"] },
  { id: "measles", category: "fever", symptoms: ["fever", "cough", "runny_nose", "red_eyes", "rash"] },
  { id: "covid_19", category: "fever", symptoms: ["fever", "cough", "sore_throat", "loss_of_smell"] },
  { id: "acute_respiratory_infection", category: "fever", symptoms: ["fever", "cough", "fast_breathing"] },
  { id: "pneumonia", category: "fever", symptoms: ["fever", "cough", "phlegm", "shortness_of_breath", "chest_pain"] },
  { id: "acute_bronchitis", category: "fever", symptoms: ["cough", "phlegm", "wheeze", "sore_throat"] },
  { id: "chronic_lower_respiratory_disease", category: "fever", symptoms: ["shortness_of_breath", "wheeze", "chest_tightness"] },
  { id: "tuberculosis", category: "fever", symptoms: ["cough", "chronic_cough", "fever", "weight_loss"] },
  { id: "pertussis", category: "fever", symptoms: ["cough", "chronic_cough", "coughing_fits", "vomiting"] },
  { id: "extrapulmonary_tuberculosis", category: "fever", symptoms: ["fever", "swollen_glands", "night_sweats", "weight_loss"] },
  { id: "hiv", category: "fever", symptoms: ["fever", "swollen_glands", "weight_loss", "rash"] },
  { id: "diphtheria", category: "fever", symptoms: ["fever", "sore_throat", "swollen_glands", "grey_throat_membrane"] },
  { id: "dengue", category: "fever", symptoms: ["fever", "headache", "pain_behind_eyes", "muscle_pain"] },
  { id: "chikungunya", category: "fever", symptoms: ["fever", "joint_pain", "rash"] },
  { id: "leptospirosis", category: "fever", symptoms: ["fever", "headache", "muscle_pain", "calf_pain"] },
  { id: "malaria", category: "fever", symptoms: ["fever", "chills", "headache"] },
  { id: "typhoid_fever", category: "fever", symptoms: ["fever", "headache", "abdominal_pain", "loss_of_appetite"] },
  { id: "meningitis", category: "fever", symptoms: ["fever", "headache", "neck_stiffness", "vomiting"] },
  { id: "meningococcemia", category: "fever", symptoms: ["fever", "rash", "bruising", "neck_stiffness"] },
  { id: "sepsis", category: "fever", symptoms: ["fever", "fast_heartbeat", "fast_breathing", "confusion"] },
  { id: "rheumatic_fever", category: "fever", symptoms: ["fever", "joint_pain", "joint_swelling", "chest_pain"] },

  // STOMACH (22)
  { id: "diarrhea", category: "stomach", symptoms: ["diarrhea", "vomiting", "abdominal_cramps"] },
  { id: "cholera", category: "stomach", symptoms: ["diarrhea", "vomiting", "sunken_eyes", "dry_skin"] },
  { id: "dysentery", category: "stomach", symptoms: ["diarrhea", "abdominal_cramps", "blood_in_stool", "fever"] },
  { id: "schistosomiasis", category: "stomach", symptoms: ["diarrhea", "abdominal_pain", "blood_in_stool", "itching"] },
  { id: "appendicitis", category: "stomach", symptoms: ["abdominal_pain", "fever", "nausea", "loss_of_appetite"] },
  { id: "acute_pancreatitis", category: "stomach", symptoms: ["abdominal_pain", "back_pain", "nausea", "vomiting"] },
  { id: "gastric_ulcer", category: "stomach", symptoms: ["abdominal_pain", "nausea", "heartburn", "bloating"] },
  { id: "cirrhosis", category: "stomach", symptoms: ["jaundice", "swollen_abdomen", "bruising", "itching"] },
  { id: "hepatitis_a", category: "stomach", symptoms: ["fever", "loss_of_appetite", "dark_urine", "jaundice"] },
  { id: "hepatitis_b", category: "stomach", symptoms: ["nausea", "dark_urine", "pale_stools", "jaundice"] },
  { id: "hepatitis_c", category: "stomach", symptoms: ["abdominal_pain", "nausea", "dark_urine", "pale_stools", "jaundice"] },
  { id: "urinary_tract_infection", category: "stomach", symptoms: ["painful_urination", "frequent_urination", "lower_abdominal_pain", "cloudy_urine"] },
  { id: "kidney_infection", category: "stomach", symptoms: ["fever", "back_pain", "painful_urination", "nausea"] },
  { id: "chronic_kidney_disease", category: "stomach", symptoms: ["ankle_swelling", "nausea", "blood_in_urine"] },
  { id: "glomerulonephritis", category: "stomach", symptoms: ["blood_in_urine", "facial_swelling", "ankle_swelling"] },
  { id: "cellulitis", category: "stomach", symptoms: ["red_skin", "swelling", "skin_pain", "fever"] },
  { id: "dermatitis", category: "stomach", symptoms: ["itching", "dry_skin", "red_skin", "cracked_skin"] },
  { id: "chickenpox", category: "stomach", symptoms: ["fever", "rash", "blisters", "itching"] },
  { id: "mpox", category: "stomach", symptoms: ["fever", "rash", "blisters", "swollen_glands"] },
  { id: "hand_foot_mouth_disease", category: "stomach", symptoms: ["fever", "rash", "mouth_ulcer", "hand_foot_blisters"] },
  { id: "leprosy", category: "stomach", symptoms: ["pale_skin_patches", "numbness", "muscle_weakness"] },
  { id: "sore_eyes", category: "stomach", symptoms: ["red_eyes", "itchy_eyes", "watery_eyes"] },

  // BODY (17)
  { id: "ischemic_heart_disease", category: "body", symptoms: ["chest_pain", "shortness_of_breath", "sweating", "nausea"] },
  { id: "stroke", category: "body", symptoms: ["face_drooping", "arm_weakness", "speech_difficulty"] },
  { id: "hypertension", category: "body", symptoms: ["headache", "dizziness", "blurred_vision"] },
  { id: "diabetes", category: "body", symptoms: ["thirst", "frequent_urination", "blurred_vision"] },
  { id: "heart_failure", category: "body", symptoms: ["shortness_of_breath", "ankle_swelling", "palpitations"] },
  { id: "atherosclerosis", category: "body", symptoms: ["chest_pain", "leg_pain", "numbness"] },
  { id: "deep_vein_thrombosis", category: "body", symptoms: ["leg_pain", "leg_swelling", "warm_skin", "red_skin"] },
  { id: "anemia", category: "body", symptoms: ["pale_skin", "dizziness", "palpitations"] },
  { id: "cancer", category: "body", symptoms: ["weight_loss", "loss_of_appetite", "painless_lump"] },
  { id: "malnutrition", category: "body", symptoms: ["weight_loss", "low_weight", "muscle_weakness"] },
  { id: "epilepsy", category: "body", symptoms: ["seizures", "jerking", "loss_of_awareness"] },
  { id: "tetanus", category: "body", symptoms: ["muscle_stiffness", "muscle_spasm", "lockjaw", "difficulty_swallowing"] },
  { id: "rabies", category: "body", symptoms: ["fever", "numbness", "muscle_spasm", "fear_of_water"] },
  { id: "arthritis", category: "body", symptoms: ["joint_pain", "joint_stiffness", "joint_swelling", "morning_stiffness"] },
  { id: "depression", category: "body", symptoms: ["low_mood", "loss_of_interest", "sleep_problems", "hopelessness"] },
  { id: "schizophrenia", category: "body", symptoms: ["hallucinations", "delusions", "disordered_thinking", "social_withdrawal"] },
  { id: "alzheimers", category: "body", symptoms: ["memory_loss", "confusion", "language_problems", "mood_changes"] }
];

// Utility: format snake_case identifiers into readable labels
function formatLabel(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// Build symptom index mapped to categories
const SYMPTOM_MAP = new Map();
KNOWLEDGE_BASE.forEach(cond => {
  cond.symptoms.forEach(sym => {
    if (!SYMPTOM_MAP.has(sym)) {
      SYMPTOM_MAP.set(sym, new Set());
    }
    SYMPTOM_MAP.get(sym).add(cond.category);
  });
});
const ALL_SYMPTOMS = Array.from(SYMPTOM_MAP.keys()).sort();

// Application State
const state = {
  selectedSymptoms: new Set(),
  activeCategory: "all",
  searchQuery: "",
  subgraphOnly: false,
  rankedDiseases: []
};

/**
 * ============================================================================
 * 3. SCORING & DIAGNOSTIC ENGINE
 * ============================================================================
 */
function evaluateCandidates() {
  const selected = state.selectedSymptoms;
  if (selected.size === 0) {
    state.rankedDiseases = [];
    return;
  }

  const results = [];
  KNOWLEDGE_BASE.forEach(disease => {
    const matched = disease.symptoms.filter(s => selected.has(s));
    if (matched.length > 0) {
      const missing = disease.symptoms.filter(s => !selected.has(s));
      const unionSize = new Set([...selected, ...disease.symptoms]).size;
      const coverage = matched.length / disease.symptoms.length; // Sensitivity
      const jaccard = matched.length / unionSize;                // Specificity
      const compositeScore = (coverage * 0.7 + jaccard * 0.3) * 100;

      results.push({
        ...disease,
        matched,
        missing,
        coverage,
        score: Math.round(compositeScore)
      });
    }
  });

  results.sort((a, b) => b.score - a.score || b.matched.length - a.matched.length);
  state.rankedDiseases = results;
}

/**
 * ============================================================================
 * 4. OBSIDIAN FORCE-DIRECTED GRAPH VIEW (HTML5 CANVAS)
 * ============================================================================
 */
const canvas = document.getElementById("graph-canvas");
const ctx = canvas.getContext("2d");

const nodes = [];
const edges = [];
const nodeById = new Map();

// Initialize Graph Nodes & Edges
function initGraphData() {
  const width = canvas.clientWidth || 800;
  const height = canvas.clientHeight || 500;

  KNOWLEDGE_BASE.forEach((d, idx) => {
    const angle = (idx / KNOWLEDGE_BASE.length) * Math.PI * 2;
    const node = {
      id: `d:${d.id}`,
      rawId: d.id,
      label: formatLabel(d.id),
      type: "disease",
      category: d.category,
      x: width / 2 + Math.cos(angle) * 220 + (Math.random() - 0.5) * 40,
      y: height / 2 + Math.sin(angle) * 220 + (Math.random() - 0.5) * 40,
      vx: 0,
      vy: 0,
      radius: 7
    };
    nodes.push(node);
    nodeById.set(node.id, node);
  });

  ALL_SYMPTOMS.forEach((s, idx) => {
    const angle = (idx / ALL_SYMPTOMS.length) * Math.PI * 2;
    const node = {
      id: `s:${s}`,
      rawId: s,
      label: formatLabel(s),
      type: "symptom",
      x: width / 2 + Math.cos(angle) * 110 + (Math.random() - 0.5) * 30,
      y: height / 2 + Math.sin(angle) * 110 + (Math.random() - 0.5) * 30,
      vx: 0,
      vy: 0,
      radius: 5
    };
    nodes.push(node);
    nodeById.set(node.id, node);
  });

  KNOWLEDGE_BASE.forEach(d => {
    d.symptoms.forEach(s => {
      edges.push({
        source: nodeById.get(`d:${d.id}`),
        target: nodeById.get(`s:${s}`)
      });
    });
  });
}

// Camera & Interaction State
const camera = { x: 0, y: 0, zoom: 0.95 };
let isDraggingCanvas = false;
let draggedNode = null;
let hoveredNode = null;
let dragStart = { x: 0, y: 0 };

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);

function screenToWorld(sx, sy) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (sx - rect.left - rect.width / 2 - camera.x) / camera.zoom + rect.width / 2,
    y: (sy - rect.top - rect.height / 2 - camera.y) / camera.zoom + rect.height / 2
  };
}

canvas.addEventListener("mousedown", e => {
  const pos = screenToWorld(e.clientX, e.clientY);
  draggedNode = nodes.find(n => !n.hidden && Math.hypot(n.x - pos.x, n.y - pos.y) < n.radius + 6);
  if (!draggedNode) {
    isDraggingCanvas = true;
    dragStart = { x: e.clientX - camera.x, y: e.clientY - camera.y };
  }
});

window.addEventListener("mousemove", e => {
  const pos = screenToWorld(e.clientX, e.clientY);
  if (draggedNode) {
    draggedNode.x = pos.x;
    draggedNode.y = pos.y;
    draggedNode.vx = 0;
    draggedNode.vy = 0;
  } else if (isDraggingCanvas) {
    camera.x = e.clientX - dragStart.x;
    camera.y = e.clientY - dragStart.y;
  } else {
    hoveredNode = nodes.find(n => !n.hidden && Math.hypot(n.x - pos.x, n.y - pos.y) < n.radius + 5) || null;
  }
});

window.addEventListener("mouseup", () => {
  if (draggedNode && draggedNode.type === "symptom") {
    // Allow clicking symptom nodes directly in the graph to toggle them
  }
  draggedNode = null;
  isDraggingCanvas = false;
});

canvas.addEventListener("dblclick", e => {
  const pos = screenToWorld(e.clientX, e.clientY);
  const clicked = nodes.find(n => !n.hidden && Math.hypot(n.x - pos.x, n.y - pos.y) < n.radius + 6);
  if (clicked && clicked.type === "symptom") {
    toggleSymptom(clicked.rawId);
  }
});

canvas.addEventListener("wheel", e => {
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.1 : 0.9;
  camera.zoom = Math.min(2.5, Math.max(0.35, camera.zoom * factor));
}, { passive: false });

// Physics & Render Loop
function tickGraph() {
  const rect = canvas.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  const scoreMap = new Map(state.rankedDiseases.map(d => [d.id, d.score]));

  // Determine visibility
  nodes.forEach(n => {
    if (!state.subgraphOnly || state.selectedSymptoms.size === 0) {
      n.hidden = false;
    } else if (n.type === "symptom") {
      n.hidden = !state.selectedSymptoms.has(n.rawId);
    } else {
      n.hidden = !scoreMap.has(n.rawId);
    }
  });

  const visibleNodes = nodes.filter(n => !n.hidden);

  // Node Repulsion
  for (let i = 0; i < visibleNodes.length; i++) {
    for (let j = i + 1; j < visibleNodes.length; j++) {
      const a = visibleNodes[i];
      const b = visibleNodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distSq = dx * dx + dy * dy + 1;
      if (distSq < 18000) {
        const force = 260 / distSq;
        a.vx -= dx * force;
        a.vy -= dy * force;
        b.vx += dx * force;
        b.vy += dy * force;
      }
    }
  }

  // Spring Attraction along Edges
  edges.forEach(e => {
    if (e.source.hidden || e.target.hidden) return;
    const isActive = state.selectedSymptoms.has(e.target.rawId);
    const dx = e.target.x - e.source.x;
    const dy = e.target.y - e.source.y;
    const dist = Math.hypot(dx, dy) || 1;
    const targetDist = isActive ? 65 : 130;
    const strength = isActive ? 0.025 : 0.004;
    const f = (dist - targetDist) * strength;
    const fx = (dx / dist) * f;
    const fy = (dy / dist) * f;

    e.source.vx += fx;
    e.source.vy += fy;
    e.target.vx -= fx;
    e.target.vy -= fy;
  });

  // Center Gravity & Velocity Update
  visibleNodes.forEach(n => {
    const isMatchedDisease = n.type === "disease" && scoreMap.has(n.rawId);
    const isSelectedSym = n.type === "symptom" && state.selectedSymptoms.has(n.rawId);
    const gravity = (isMatchedDisease || isSelectedSym) ? 0.012 : 0.004;

    n.vx += (cx - n.x) * gravity;
    n.vy += (cy - n.y) * gravity;
    n.vx *= 0.82;
    n.vy *= 0.82;

    if (n !== draggedNode) {
      n.x += n.vx;
      n.y += n.vy;
    }
  });

  // Render Pass
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.save();
  ctx.translate(cx + camera.x, cy + camera.y);
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-cx, -cy);

  // Draw Edges
  edges.forEach(e => {
    if (e.source.hidden || e.target.hidden) return;
    const isSelectedSym = state.selectedSymptoms.has(e.target.rawId);
    const dScore = scoreMap.get(e.source.rawId) || 0;

    ctx.beginPath();
    ctx.moveTo(e.source.x, e.source.y);
    ctx.lineTo(e.target.x, e.target.y);
    if (isSelectedSym && dScore > 0) {
      ctx.strokeStyle = `rgba(188, 140, 255, ${0.25 + (dScore / 100) * 0.65})`;
      ctx.lineWidth = 1.8;
    } else {
      ctx.strokeStyle = "rgba(48, 54, 61, 0.35)";
      ctx.lineWidth = 0.7;
    }
    ctx.stroke();
  });

  // Draw Nodes
  visibleNodes.forEach(n => {
    const isSelectedSym = n.type === "symptom" && state.selectedSymptoms.has(n.rawId);
    const dScore = n.type === "disease" ? (scoreMap.get(n.rawId) || 0) : 0;

    ctx.beginPath();
    let r = n.radius;
    if (isSelectedSym) r = 8;
    else if (dScore > 0) r = 6 + (dScore / 100) * 7;

    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);

    if (isSelectedSym) {
      ctx.fillStyle = "#3fb950";
      ctx.shadowColor = "#3fb950";
      ctx.shadowBlur = 12;
    } else if (dScore > 0) {
      ctx.fillStyle = dScore >= 60 ? "#bc8cff" : "#58a6ff";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
    } else {
      ctx.fillStyle = n.type === "disease" ? "#30363d" : "#21262d";
      ctx.shadowBlur = 0;
    }
    ctx.fill();
    ctx.shadowBlur = 0;

    // Labels for active nodes or hovered node
    if (isSelectedSym || dScore >= 35 || n === hoveredNode) {
      ctx.font = (isSelectedSym || dScore >= 50) ? "600 11px sans-serif" : "10px sans-serif";
      ctx.fillStyle = isSelectedSym ? "#7ee787" : (dScore > 0 ? "#e6edf3" : "#8b949e");
      const labelText = dScore > 0 ? `${n.label} (${dScore}%)` : n.label;
      ctx.fillText(labelText, n.x + r + 5, n.y + 3);
    }
  });

  ctx.restore();
  requestAnimationFrame(tickGraph);
}

/**
 * ============================================================================
 * 5. UI RENDERING & EVENT HANDLERS
 * ============================================================================
 */
function renderSymptomsGrid() {
  const grid = document.getElementById("symptoms-grid");
  grid.innerHTML = "";

  const filtered = ALL_SYMPTOMS.filter(sym => {
    const matchesCat = state.activeCategory === "all" || SYMPTOM_MAP.get(sym).has(state.activeCategory);
    const matchesSearch = formatLabel(sym).toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  filtered.forEach(sym => {
    const chip = document.createElement("div");
    const isSel = state.selectedSymptoms.has(sym);
    chip.className = `symptom-chip ${isSel ? "selected" : ""}`;
    chip.innerHTML = `<span>${isSel ? "✓" : "+"}</span> <span>${formatLabel(sym)}</span>`;
    chip.addEventListener("click", () => toggleSymptom(sym));
    grid.appendChild(chip);
  });
}

function updateSidebar() {
  const count = state.selectedSymptoms.size;
  document.getElementById("selected-count").textContent = count;

  // Progress bar & steps
  const pct = count === 0 ? 0 : Math.min(90, 30 + count * 15);
  document.getElementById("progress-pct").textContent = `${pct}%`;
  document.getElementById("progress-fill").style.width = `${pct}%`;

  document.getElementById("step-1").classList.toggle("done", state.activeCategory !== "all" || state.searchQuery !== "" || count > 0);
  document.getElementById("step-2").classList.toggle("done", count > 0);

  // Selected Symptoms Tray
  const tray = document.getElementById("selected-tray");
  if (count === 0) {
    tray.innerHTML = `<span style="color:var(--text-muted);font-size:12px;">No symptoms selected yet.</span>`;
  } else {
    tray.innerHTML = "";
    state.selectedSymptoms.forEach(sym => {
      const tag = document.createElement("span");
      tag.className = "symptom-chip selected";
      tag.style.padding = "4px 9px";
      tag.style.fontSize = "11.5px";
      tag.innerHTML = `${formatLabel(sym)} ✕`;
      tag.addEventListener("click", () => toggleSymptom(sym));
      tray.appendChild(tag);
    });
  }

  // Live Candidate Ranking
  const candList = document.getElementById("candidate-list");
  document.getElementById("candidate-count").textContent = `${state.rankedDiseases.length} active`;

  if (state.rankedDiseases.length === 0) {
    candList.innerHTML = `<div style="color:var(--text-muted);font-size:12px;">Select symptoms to rank diseases in real time.</div>`;
  } else {
    candList.innerHTML = "";
    state.rankedDiseases.slice(0, 6).forEach(d => {
      const item = document.createElement("div");
      item.className = "candidate-item";
      item.innerHTML = `
        <div class="candidate-header">
          <span>${formatLabel(d.id)}</span>
          <span style="color:var(--accent-purple)">${d.score}% (${d.matched.length}/${d.symptoms.length})</span>
        </div>
        <div class="candidate-bar-bg">
          <div class="candidate-bar-fill" style="width:${d.score}%"></div>
        </div>
      `;
      candList.appendChild(item);
    });
  }

  document.getElementById("btn-submit-triage").disabled = count === 0;
}

function toggleSymptom(sym) {
  if (state.selectedSymptoms.has(sym)) {
    state.selectedSymptoms.delete(sym);
  } else {
    state.selectedSymptoms.add(sym);
  }
  evaluateCandidates();
  renderSymptomsGrid();
  updateSidebar();
}

// Category Tabs
document.querySelectorAll(".cat-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.activeCategory = btn.dataset.cat;
    renderSymptomsGrid();
    updateSidebar();
  });
});

// Search Filter
document.getElementById("symptom-search").addEventListener("input", e => {
  state.searchQuery = e.target.value;
  renderSymptomsGrid();
});

// Clear All
document.getElementById("btn-clear-all").addEventListener("click", () => {
  state.selectedSymptoms.clear();
  evaluateCandidates();
  renderSymptomsGrid();
  updateSidebar();
});

// Graph Controls
document.getElementById("btn-toggle-subgraph").addEventListener("click", e => {
  state.subgraphOnly = !state.subgraphOnly;
  e.target.classList.toggle("active", state.subgraphOnly);
  e.target.textContent = `Active Subgraph Only: ${state.subgraphOnly ? "ON" : "OFF"}`;
});

document.getElementById("btn-reset-camera").addEventListener("click", () => {
  camera.x = 0;
  camera.y = 0;
  camera.zoom = 0.95;
});

// Confirmation Modal Flow
const confirmModal = document.getElementById("confirm-modal");

document.getElementById("btn-submit-triage").addEventListener("click", () => {
  const modalList = document.getElementById("modal-symptom-list");
  modalList.innerHTML = "";
  state.selectedSymptoms.forEach(sym => {
    const chip = document.createElement("span");
    chip.className = "symptom-chip selected";
    chip.textContent = formatLabel(sym);
    modalList.appendChild(chip);
  });

  // Check if top candidate has unchosen symptoms to prompt user verification
  const top = state.rankedDiseases[0];
  const suggestedBox = document.getElementById("modal-suggested-box");
  if (top && top.missing.length > 0) {
    suggestedBox.innerHTML = `<strong>Verification Tip:</strong> The top candidate (<em>${formatLabel(top.id)}</em>) also commonly involves: <strong>${top.missing.map(formatLabel).join(", ")}</strong>. If any of these are present, click "Wait, Add More Symptoms".`;
  } else {
    suggestedBox.innerHTML = "";
  }

  confirmModal.classList.add("active");
});

document.getElementById("btn-modal-back").addEventListener("click", () => {
  confirmModal.classList.remove("active");
});

document.getElementById("btn-modal-confirm").addEventListener("click", () => {
  confirmModal.classList.remove("active");
  renderDiagnosticResultsPage();
  document.getElementById("triage-view").classList.remove("active");
  document.getElementById("results-view").classList.add("active");
});

// Results Page Rendering
function renderDiagnosticResultsPage() {
  const top = state.rankedDiseases[0];
  const primaryBox = document.getElementById("primary-result-box");
  const desc = DISEASE_DESCRIPTIONS[top.id] || "No custom description provided. Edit DISEASE_DESCRIPTIONS in app.js.";

  primaryBox.innerHTML = `
    <span class="badge">Primary Match • ${top.category} Category • ${top.score}% Confidence</span>
    <h1 class="diagnosis-title">${formatLabel(top.id)}</h1>
    <div class="diagnosis-desc">${desc}</div>
    <div style="font-size:13px;color:var(--text-muted);display:flex;gap:20px;flex-wrap:wrap;">
      <div><strong style="color:var(--accent-green);">Matched Symptoms (${top.matched.length}/${top.symptoms.length}):</strong> ${top.matched.map(formatLabel).join(", ")}</div>
      <div><strong style="color:var(--accent-amber);">Unreported Symptoms:</strong> ${top.missing.length ? top.missing.map(formatLabel).join(", ") : "None (100% Match)"}</div>
    </div>
  `;

  const tbody = document.getElementById("diff-table-body");
  tbody.innerHTML = "";
  state.rankedDiseases.slice(1, 8).forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${formatLabel(d.id)}</strong></td>
      <td style="text-transform:capitalize;">${d.category}</td>
      <td style="color:#7ee787;">${d.matched.map(formatLabel).join(", ")}</td>
      <td style="color:var(--text-muted);">${d.missing.map(formatLabel).join(", ") || "—"}</td>
      <td><strong style="color:var(--accent-purple);">${d.score}%</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("btn-back-to-triage").addEventListener("click", () => {
  document.getElementById("results-view").classList.remove("active");
  document.getElementById("triage-view").classList.add("active");
  resizeCanvas();
});

document.getElementById("btn-new-triage").addEventListener("click", () => {
  state.selectedSymptoms.clear();
  evaluateCandidates();
  renderSymptomsGrid();
  updateSidebar();
  document.getElementById("results-view").classList.remove("active");
  document.getElementById("triage-view").classList.add("active");
  resizeCanvas();
});

// Boot Application
resizeCanvas();
initGraphData();
renderSymptomsGrid();
updateSidebar();
requestAnimationFrame(tickGraph);