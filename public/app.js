const DISEASE_DESCRIPTIONS = {
  influenza: "Commonly known as the flu. It is a viral illness that causes fever, cough, and a runny nose. Resting at home and drinking plenty of water or warm fluids helps recovery.",
  measles: "A contagious viral illness that causes fever, cough, red watery eyes, and a widespread skin rash. Please consult a doctor and avoid close contact with others.",
  covid_19: "A contagious respiratory virus that commonly causes fever, cough, sore throat, and a reduced sense of smell. Rest, hydrate, and get tested if possible.",
  acute_respiratory_infection: "An infection in the airways or lungs causing fever, cough, and fast breathing. Because fast breathing can be serious, please have a doctor check your breathing.",
  pneumonia: "A serious lung infection where the air sacs fill with fluid, causing fever, cough with phlegm, chest pain, and trouble breathing. Prompt medical care is needed.",
  acute_bronchitis: "Swelling and mucus buildup in the main breathing tubes of the lungs, causing a cough with phlegm, wheezing, and a sore throat.",
  chronic_lower_respiratory_disease: "Long-term irritation of the airways (such as chronic bronchitis or asthma) causing shortness of breath, wheezing, and tightness in the chest.",
  tuberculosis: "A serious bacterial lung infection that causes a long-lasting cough, fever, and unexplained weight loss. A doctor can provide specific antibiotic treatment.",
  pertussis: "Also called whooping cough. It causes severe, repeated coughing spells that can make it hard to catch your breath or cause vomiting after coughing.",
  extrapulmonary_tuberculosis: "A tuberculosis infection located outside the lungs, often causing swollen lymph glands, fever, night sweats, and weight loss.",
  hiv: "A virus that weakens the body's immune system, which can cause ongoing fever, swollen glands, weight loss, and a skin rash. Please visit a clinic for blood testing.",
  diphtheria: "A serious bacterial throat infection that causes fever, sore throat, swollen neck glands, and a thick grey coating in the throat. Seek immediate medical care.",
  dengue: "A mosquito-borne viral illness that causes high fever, severe headache, pain behind the eyes, and body aches. Drink plenty of fluids and see a doctor promptly.",
  chikungunya: "A viral illness spread by mosquitoes that causes sudden fever, strong joint pain, and a skin rash.",
  leptospirosis: "A bacterial infection often caught from floodwater or wet soil, causing fever, headache, body aches, and pain in the calves. Antibiotic treatment from a doctor is important.",
  malaria: "A serious illness spread by mosquitoes in tropical areas, causing repeated waves of high fever, shaking chills, and headache.",
  typhoid_fever: "A bacterial infection from contaminated food or water that causes a lasting fever, headache, stomach pain, and loss of appetite.",
  meningitis: "A medical emergency involving swelling around the brain and spinal cord, causing fever, severe headache, vomiting, and a stiff neck. Go to a hospital immediately.",
  meningococcemia: "A life-threatening bloodstream infection causing fever, a stiff neck, skin rash, and dark bruising. Seek emergency hospital care right away.",
  sepsis: "A life-threatening medical emergency where the body reacts severely to an infection, causing fever, fast heartbeat, fast breathing, and confusion. Go to an emergency room immediately.",
  rheumatic_fever: "An inflammatory condition that can develop after an untreated throat infection, causing fever, painful swollen joints, and chest pain.",
  diarrhea: "Frequent loose or watery bowel movements with stomach cramps and vomiting. Sip clean water or oral rehydration salts frequently to prevent dehydration.",
  cholera: "A severe watery diarrhea illness that quickly drains the body of fluids, causing vomiting, dry skin, and sunken eyes. Immediate rehydration at a clinic is critical.",
  dysentery: "An intestinal infection that causes diarrhea with visible blood, stomach cramps, and fever. Please see a doctor for proper medication and hydration.",
  schistosomiasis: "A parasitic infection caught from freshwater exposure, causing stomach pain, diarrhea with blood, and itchy skin.",
  appendicitis: "Sudden inflammation of the appendix causing stomach pain, nausea, loss of appetite, and fever. Please visit a hospital promptly to check if surgery is needed.",
  acute_pancreatitis: "Sudden swelling of the pancreas causing strong stomach pain that spreads to the back, along with nausea and vomiting. Hospital care is recommended.",
  gastric_ulcer: "An open sore in the lining of the stomach that causes burning stomach pain, heartburn, bloating, and nausea.",
  cirrhosis: "Long-term scarring of the liver that can cause yellowing of the skin and eyes (jaundice), a swollen belly, easy bruising, and itchy skin.",
  hepatitis_a: "A liver infection spread through contaminated food or water, causing fever, loss of appetite, dark-colored urine, and yellow skin or eyes.",
  hepatitis_b: "A viral liver infection that causes nausea, dark urine, pale-colored stools, and yellowing of the skin or eyes.",
  hepatitis_c: "A viral infection of the liver causing stomach pain, nausea, dark urine, pale stools, and yellowing of the skin or eyes.",
  urinary_tract_infection: "An infection in the bladder or urinary tract causing burning or pain when urinating, frequent urination, cloudy urine, and lower belly discomfort.",
  kidney_infection: "A serious urinary infection that has reached the kidneys, causing fever, back or side pain, nausea, and painful urination. Please see a doctor for antibiotics.",
  chronic_kidney_disease: "Gradual loss of kidney function over time, which can cause swelling in the ankles, nausea, and blood in the urine.",
  glomerulonephritis: "Inflammation of the tiny filters inside the kidneys, causing puffiness in the face, swollen ankles, and blood in the urine.",
  cellulitis: "A bacterial skin infection that causes an area of red, swollen, painful skin along with a fever. A doctor can prescribe antibiotics to clear it.",
  dermatitis: "Skin irritation or eczema that causes red, dry, cracked, and itchy skin.",
  chickenpox: "A contagious viral illness that causes fever and an itchy rash of small fluid-filled blisters across the body.",
  mpox: "A viral illness that causes fever, swollen glands, and a rash with blisters.",
  hand_foot_mouth_disease: "A viral infection that causes fever, painful sores inside the mouth, and a rash or blisters on the hands and feet.",
  leprosy: "A slow-growing bacterial infection affecting the skin and nerves, causing pale skin patches, numbness, and muscle weakness. It is curable with medical treatment.",
  sore_eyes: "Also known as pink eye or conjunctivitis. It causes red, itchy, and watery eyes. Avoid rubbing your eyes and wash your hands frequently.",
  ischemic_heart_disease: "Reduced blood flow to the heart muscle causing chest pain or pressure, shortness of breath, sweating, and nausea. Seek emergency medical attention immediately.",
  stroke: "A medical emergency where blood flow to part of the brain stops, causing facial drooping, arm weakness, and trouble speaking. Call emergency services immediately.",
  hypertension: "High blood pressure. When very high, it can cause headache, dizziness, and blurry vision. Have your blood pressure checked with a cuff.",
  diabetes: "A condition where blood sugar levels are too high, often causing constant thirst, frequent urination, and blurry vision.",
  heart_failure: "A condition where the heart pumps less effectively, leading to shortness of breath, swollen ankles, and a fluttering or racing heartbeat.",
  atherosclerosis: "Narrowing of the arteries from plaque buildup, which can cause chest pain, leg pain when walking, and numbness.",
  deep_vein_thrombosis: "A blood clot in a deep vein, usually in the leg, causing leg pain, swelling, redness, and warm skin in that area. See a doctor promptly.",
  anemia: "A low level of healthy red blood cells to carry oxygen, causing pale skin, dizziness, and a fast or noticeable heartbeat.",
  cancer: "Abnormal cell growth in the body that can cause unexplained weight loss, loss of appetite, and a painless lump. Please see a doctor for an evaluation.",
  malnutrition: "A lack of enough nutrients or calories in the diet, leading to weight loss, low body weight, and weak muscles.",
  epilepsy: "A brain condition that causes repeated seizures, sudden muscle jerking, and brief loss of awareness.",
  tetanus: "A serious bacterial nerve condition from a wound, causing stiff muscles, painful spasms, stiffness in the jaw (lockjaw), and trouble swallowing. Seek emergency care.",
  rabies: "A life-threatening viral infection from an animal bite or scratch, causing fever, numbness, muscle spasms, and difficulty swallowing water. Seek emergency care immediately.",
  arthritis: "Swelling and tenderness in one or more joints, causing joint pain, swelling, and stiffness—especially first thing in the morning.",
  depression: "A mood condition that causes a persistent feeling of sadness, loss of interest in daily activities, trouble sleeping, and feelings of hopelessness.",
  schizophrenia: "A serious mental health condition that affects how a person thinks and perceives reality, causing hallucinations, strong false beliefs, and withdrawal from others.",
  alzheimers: "A brain condition that slowly affects memory, causing forgetfulness, confusion about time or place, trouble finding words, and mood changes."
};

function formatName(str) {
  if (str === "covid_19") return "COVID-19";
  if (str === "hiv") return "HIV";
  if (str === "alzheimers") return "Alzheimer's Disease";
  return str.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

const prologBridge = {
  isLoaded: false
};

async function queryPrologCandidates(category, answers) {
  const response = await fetch("/api/triage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, answers })
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Prolog API request failed.");
  }
  return result.candidates;
}

async function queryAllPrologConditions(category) {
  return queryPrologCandidates(category, []);
}

/**
 * ============================================================================
 * 3. ENGINE STATE & CONTINUED-QUESTIONING SCRIPT CHECK
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

  // Preserve the exact .pl order (no sorting in JS)
  state.initialPool = await queryAllPrologConditions(category);
  await recomputeEngineState();

  document.getElementById("category-step-view").style.display = "none";
  document.getElementById("question-step-view").style.display = "block";

  const badgeLabel = category === "extended"
    ? `Mode: Extended Questioning (All ${state.initialPool.length} Conditions)`
    : `You picked: ${formatName(category)} Category`;
  document.getElementById("active-category-badge").textContent = badgeLabel;

  renderWorkspace();
}

async function recomputeEngineState() {
  const yesSet = new Set(state.answers.filter(a => a.answer === "yes").map(a => a.symptom));
  const noSet = new Set(state.answers.filter(a => a.answer === "no").map(a => a.symptom));

  // 1. Query Prolog candidate/2 for remaining viable conditions
  state.candidates = await queryPrologCandidates(state.category, state.answers);

  if (state.candidates.length === 0) {
    state.matchedDisease = null;
    state.currentSymptom = null;
    state.isContinuingAfterMatch = false;
    state.isFinished = true;
    return;
  }

  // 2. Check if one or more candidates already have all of their symptoms confirmed "yes"
  const matchedCandidates = state.candidates.filter(disease =>
    disease.symptoms.every(sym => yesSet.has(sym))
  );

  // If multiple candidates are completely matched, pick the most specific one
  const exactMatch = matchedCandidates.length > 0
    ? [...matchedCandidates].sort((a, b) => b.symptoms.length - a.symptoms.length)[0]
    : null;

  // 3. Find the next unasked symptom across remaining viable candidates in .pl order
  let nextSym = null;
  for (const candidate of state.candidates) {
    const unasked = candidate.symptoms.find(sym => !yesSet.has(sym) && !noSet.has(sym));
    if (unasked) {
      nextSym = unasked;
      break;
    }
  }

  // 4. SCRIPT CHECK:
  // Keep asking despite an existing match if any other viable candidate still has
  // unasked symptoms (e.g., continuing past influenza to test for measles).
  if (nextSym) {
    state.matchedDisease = exactMatch;
    state.currentSymptom = nextSym;
    state.isContinuingAfterMatch = Boolean(exactMatch);
    state.isFinished = false;
    return;
  }

  // All unasked symptoms across all remaining candidates have been exhausted
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
 * 4. UI RENDERING
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
    statusText.textContent = "Step 1: Pick Category";
    percentText.textContent = "0%";
    fillBar.style.width = "10%";
    inst1.classList.add("active");
    return;
  }

  if (state.isFinished) {
    statusText.textContent = "Step 3: Ready to Confirm";
    percentText.textContent = "100%";
    fillBar.style.width = "100%";
    inst3.classList.add("active");
    return;
  }

  inst2.classList.add("active");
  const totalPool = state.initialPool.length || 1;
  const eliminated = totalPool - state.candidates.length;
  const pct = Math.min(95, Math.max(15, Math.round((eliminated / totalPool) * 85) + 10));
  statusText.textContent = "Step 2: Answering Questions";
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
    continuingBanner.textContent = `Preliminary Match: ${formatName(state.matchedDisease.id)} — Continuing questions to check for similar conditions with additional symptoms (${otherCandidates}).`;
  } else {
    continuingBanner.style.display = "none";
    continuingBanner.textContent = "";
  }

  if (!state.isFinished && state.currentSymptom) {
    const readableSymptom = formatName(state.currentSymptom).toLowerCase();
    questionText.textContent = `Do you have ${readableSymptom}?`;
    yesNoControls.style.display = "grid";
    completeBanner.style.display = "none";
  } else {
    yesNoControls.style.display = "none";
    completeBanner.style.display = "block";
    if (state.matchedDisease) {
      questionText.textContent = `Match Found: ${formatName(state.matchedDisease.id)}`;
    } else {
      questionText.textContent = `No exact match found.`;
    }
  }

  document.getElementById("btn-undo").disabled = state.answers.length === 0;

  const board = document.getElementById("candidates-board");
  const badge = document.getElementById("remaining-count-badge");

  if (!state.category) {
    badge.textContent = prologBridge.isLoaded
      ? "Waiting for category..."
      : "Load your .pl file above to start";
    board.innerHTML = `<div style="font-size: 19px; color: var(--text-muted); padding: 12px;">${
      prologBridge.isLoaded
        ? "Pick a category above to start."
        : "Click 'Load / Change .pl Logic File' in the top bar to load your Prolog file."
    }</div>`;
  } else {
    badge.textContent = `${state.candidates.length} of ${state.initialPool.length} Conditions Possible`;
    board.innerHTML = "";

    if (state.candidates.length === 0) {
      board.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--danger-red-light); border: 2px solid var(--danger-red); border-radius: 12px; padding: 18px; font-weight: 700; color: var(--danger-red);">
          No conditions match this combination. You can undo your last answer or proceed to view advice.
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
            Confirmed: ${matchedCount} of ${disease.symptoms.length}
            ${isFullMatch ? " • ✓ MATCHED" : ""}
          </div>
        `;
        board.appendChild(node);
      });
    }
  }

  document.getElementById("answers-count").textContent = state.answers.length;
  const historyList = document.getElementById("answer-history-list");

  if (state.answers.length === 0) {
    historyList.innerHTML = `<div style="color: var(--text-muted); font-size: 18px;">No questions answered yet.</div>`;
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
 * 5. CONFIRMATION & RESULTS
 * ============================================================================
 */
const confirmModal = document.getElementById("confirm-modal");

function openConfirmationModal() {
  const reviewBox = document.getElementById("modal-review-box");
  const yesAnswers = state.answers.filter(a => a.answer === "yes");
  const noAnswers = state.answers.filter(a => a.answer === "no");

  let html = `<div style="margin-bottom: 14px;">
    <strong style="color: var(--success-green); font-size: 20px;">✓ Present Symptoms (Answered YES):</strong>
    <div style="margin-top: 6px; font-size: 20px; font-weight: 700;">
      ${yesAnswers.length > 0 ? yesAnswers.map(a => formatName(a.symptom)).join(", ") : "None selected"}
    </div>
  </div>`;

  html += `<div>
    <strong style="color: var(--danger-red); font-size: 18px;">✕ Absent Symptoms (Answered NO):</strong>
    <div style="margin-top: 6px; font-size: 18px; color: var(--text-muted);">
      ${noAnswers.length > 0 ? noAnswers.map(a => formatName(a.symptom)).join(", ") : "None"}
    </div>
  </div>`;

  reviewBox.innerHTML = html;
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
    const desc = DISEASE_DESCRIPTIONS[d.id] || "Please consult a healthcare professional for further evaluation.";
    primaryContainer.innerHTML = `
      <div class="result-card">
        <div style="font-size: 18px; font-weight: 700; color: var(--success-green); text-transform: uppercase;">
          Most Likely Condition (${formatName(d.category)} Category)
        </div>
        <h1 class="result-title">${formatName(d.id)}</h1>
        <div class="result-desc">${desc}</div>
        <div style="font-size: 19px; font-weight: 700; color: var(--success-green);">
          ✓ Confirmed Symptoms: ${d.symptoms.map(formatName).join(", ")}
        </div>
      </div>
    `;
  } else {
    primaryContainer.innerHTML = `
      <div class="result-card unknown-card">
        <div style="font-size: 19px; font-weight: 800; color: var(--danger-red); text-transform: uppercase;">
          Notice
        </div>
        <h1 class="result-title" style="color: var(--danger-red);">
          Condition is unknown. Please visit a doctor immediately!
        </h1>
        <p style="font-size: 21px; color: var(--text-main); margin-bottom: 18px;">
          Your answers did not match all required symptoms of a single condition.
        </p>
        ${state.category !== "extended" ? `
          <button id="btn-switch-extended" class="btn-submit" style="background: var(--primary-blue); max-width: 480px;">
            Try Extended Questioning (Check All Conditions) →
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
          <div class="card" style="margin-top: 20px;">
            <h3 style="font-size: 23px; margin-bottom: 8px;">Closest Partial Matches</h3>
            ${partialMatches.map(item => `
              <div style="border: 2px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px; background: var(--bg-page);">
                <div style="font-size: 22px; font-weight: 700;">
                  ${formatName(item.id)}
                  <span style="font-size: 17px; color: var(--success-green);">
                    (Matched ${item.matched.length} of${item.symptoms.length} symptoms)
                  </span>
                </div>
                <div style="font-size: 18px; color: var(--text-muted); margin-top: 6px;">
                  ${DISEASE_DESCRIPTIONS[item.id] || ""}
                </div>
              </div>
            `).join("")}
          </div>
        `;
      }
    }
  }

  document.getElementById("triage-page").classList.remove("active");
  document.getElementById("results-page").classList.add("active");
  window.scrollTo(0, 0);

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
 * 6. INITIALIZATION & EVENT LISTENERS
 * ============================================================================
 */
async function autoDiscoverPrologFile() {
  try {
    await queryPrologCandidates("fever", []);
    prologBridge.isLoaded = true;
    updatePrologStatusUI(true, "Connected to Prolog");
  } catch (error) {
    prologBridge.isLoaded = false;
    updatePrologStatusUI(false, `Cannot connect to Prolog: ${error.message}`);
  }
  renderWorkspace();
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
  document.getElementById("category-step-view").style.display = "block";
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
  document.getElementById("category-step-view").style.display = "block";
  renderWorkspace();
});

autoDiscoverPrologFile();