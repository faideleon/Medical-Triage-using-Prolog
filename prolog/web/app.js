/**
 * ============================================================================
 * 1. NAMES & LABELS
 * ============================================================================
 */
const BODY_SYSTEMS = {
  fever_breathing: "Fever & breathing",
  stomach_urinary: "Abdomen & urinary",
  skin_eyes: "Skin & eyes",
  heart_brain: "Cardiac, neuro & general",
  unknown: "Unknown"
};

const COMPLAINTS = {
  fever: "Fever & breathing",
  stomach: "Abdomen, urinary, skin",
  body: "Cardiac, neuro, general",
  extended: "Full review"
};

// Clinical wording for symptoms where the Prolog id reads poorly.
const SYMPTOM_LABELS = {
  runny_nose: "Runny nose",
  phlegm: "Productive cough (phlegm)",
  chronic_cough: "Cough longer than 2 weeks",
  coughing_fits: "Coughing fits",
  fast_breathing: "Fast breathing",
  fast_heartbeat: "Fast heartbeat",
  swollen_glands: "Swollen lymph glands",
  grey_throat_membrane: "Grey membrane in the throat",
  pain_behind_eyes: "Pain behind the eyes",
  neck_stiffness: "Neck stiffness",
  bruising: "Bruising or purple spots",
  sunken_eyes: "Sunken eyes",
  blood_in_stool: "Blood in stool",
  blood_in_urine: "Blood in urine",
  jaundice: "Jaundice (yellow skin or eyes)",
  swollen_abdomen: "Swollen abdomen",
  pale_stools: "Pale stools",
  painful_urination: "Pain on urination",
  frequent_urination: "Frequent urination",
  lower_abdominal_pain: "Lower abdominal pain",
  face_drooping: "Facial droop",
  arm_weakness: "Arm weakness",
  speech_difficulty: "Speech difficulty",
  palpitations: "Palpitations",
  painless_lump: "Painless lump",
  low_weight: "Low body weight",
  loss_of_awareness: "Loss of awareness",
  lockjaw: "Lockjaw (cannot open mouth)",
  fear_of_water: "Fear of water (hydrophobia)",
  low_mood: "Low mood",
  loss_of_interest: "Loss of interest",
  thirst: "Excessive thirst",
  hand_foot_blisters: "Blisters on hands or feet",
  pale_skin_patches: "Pale skin patches"
};

function formatName(str) {
  if (str === "covid_19") return "COVID-19";
  if (str === "hiv") return "HIV";
  if (str === "alzheimers") return "Alzheimer's disease";
  if (str === "none") return "No match";
  const text = str.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function symptomName(id) {
  return SYMPTOM_LABELS[id] || formatName(id);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

function icon(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

/**
 * ============================================================================
 * 2. PROLOG API
 * ============================================================================
 */
const knowledge = {
  isLoaded: false,
  conditions: {},          // id -> condition, from the full review list
  highRiskSymptoms: new Set()
};

async function queryPrologCandidates(category, answers) {
  const response = await fetch("/api/triage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, answers })
  });
  if (!response.ok) {
    throw new Error(`server replied ${response.status}`);
  }
  return response.json();
}

// Sends the finished patient to Prolog, which saves it to
// data/intake_records.txt for the C triage program.
async function savePatient(name, age, answers) {
  const response = await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, answers })
  });
  if (!response.ok) {
    throw new Error("The record was not saved. Check that the Prolog server is running, then try again.");
  }
  return response.json();
}

/**
 * ============================================================================
 * 3. ASSESSMENT STATE
 * ============================================================================
 */
const state = {
  category: null,
  initialPool: [],
  candidates: [],
  answers: [],
  currentSymptom: null,
  matchedDisease: null,
  isFinished: false,
  busy: false,
  view: "empty"            // empty | question | record | saved
};

async function startCategorySession(category) {
  if (!knowledge.isLoaded) return;

  state.category = category;
  state.answers = [];
  state.matchedDisease = null;
  state.isFinished = false;

  // Keep the .pl order (no sorting in JS)
  state.initialPool = (await queryPrologCandidates(category, [])).candidates;
  await recomputeEngineState();
  state.view = "question";
  render();
}

async function recomputeEngineState() {
  const yesSet = new Set(state.answers.filter(a => a.answer === "yes").map(a => a.symptom));
  const noSet = new Set(state.answers.filter(a => a.answer === "no").map(a => a.symptom));

  // 1. Ask Prolog which conditions still fit the answers
  state.candidates = (await queryPrologCandidates(state.category, state.answers)).candidates;

  if (state.candidates.length === 0) {
    state.matchedDisease = null;
    state.currentSymptom = null;
    state.isFinished = true;
    return;
  }

  // 2. Conditions with every symptom answered "yes"; keep the most specific
  const matchedCandidates = state.candidates.filter(disease =>
    disease.symptoms.every(sym => yesSet.has(sym))
  );
  state.matchedDisease = matchedCandidates.length > 0
    ? [...matchedCandidates].sort((a, b) => b.symptoms.length - a.symptoms.length)[0]
    : null;

  // 3. Next unasked symptom across the remaining conditions, in .pl order.
  // Questioning continues after a full match while similar conditions
  // still have unasked symptoms (e.g. influenza vs measles).
  state.currentSymptom = null;
  for (const candidate of state.candidates) {
    const unasked = candidate.symptoms.find(sym => !yesSet.has(sym) && !noSet.has(sym));
    if (unasked) {
      state.currentSymptom = unasked;
      break;
    }
  }
  state.isFinished = state.currentSymptom === null;
}

// Runs one Prolog round trip at a time, so a fast double key press
// cannot record the same question twice.
async function whenIdle(task) {
  if (state.busy) return;
  state.busy = true;
  try {
    await task();
  } finally {
    state.busy = false;
  }
}

function recordAnswer(answerValue) {
  return whenIdle(async () => {
    if (state.view !== "question" || !state.currentSymptom) return;

    state.answers.push({ symptom: state.currentSymptom, answer: answerValue });
    await recomputeEngineState();
    if (state.isFinished) state.view = "record";
    render();
    if (state.view === "record") document.getElementById("patient-name").focus();
  });
}

function undoLastAnswer() {
  return whenIdle(async () => {
    if (state.answers.length === 0) return;
    state.answers.pop();
    await recomputeEngineState();
    state.view = "question";
    render();
  });
}

function resetSession() {
  state.category = null;
  state.initialPool = [];
  state.candidates = [];
  state.answers = [];
  state.currentSymptom = null;
  state.matchedDisease = null;
  state.isFinished = false;
  state.view = "empty";
  document.getElementById("patient-name").value = "";
  document.getElementById("patient-age").value = "";
  document.getElementById("save-error").textContent = "";
  render();
}

/**
 * ============================================================================
 * 4. RENDERING
 * ============================================================================
 */
function render() {
  renderComplaints();
  renderLivePanel();
  renderDifferential();
  renderFindings();
}

function renderComplaints() {
  document.querySelectorAll(".complaint-btn").forEach(btn => {
    btn.disabled = !knowledge.isLoaded || state.view === "saved";
    btn.setAttribute("aria-pressed", String(btn.dataset.cat === state.category));
  });
}

function renderLivePanel() {
  const views = ["empty", "question", "record", "saved"];
  views.forEach(v => {
    document.getElementById(`view-${v}`).hidden = state.view !== v;
  });

  const label = document.getElementById("live-label");
  const meta = document.getElementById("live-meta");
  const answered = state.answers.length;

  if (state.view === "empty") {
    label.textContent = "Assessment";
    meta.textContent = "";
  }

  if (state.view === "question") {
    label.textContent = `Question ${answered + 1}`;
    meta.textContent = COMPLAINTS[state.category];

    const symptom = state.currentSymptom;
    document.getElementById("question-symptom").textContent = symptomName(symptom) + "?";
    document.getElementById("question-risk").hidden = !knowledge.highRiskSymptoms.has(symptom);

    const match = document.getElementById("question-match");
    if (state.matchedDisease) {
      const others = state.candidates.filter(d => d.id !== state.matchedDisease.id).length;
      match.hidden = false;
      match.textContent = `All signs of ${formatName(state.matchedDisease.id)} are present. ` +
        `Checking ${others} similar condition${others === 1 ? "" : "s"} before recording.`;
    } else {
      match.hidden = true;
    }

    document.getElementById("btn-undo").disabled = answered === 0;
    document.getElementById("btn-end").disabled = answered === 0;
  }

  if (state.view === "record") {
    label.textContent = "Record patient";
    meta.textContent = `${answered} answer${answered === 1 ? "" : "s"} · ${COMPLAINTS[state.category]}`;
    const summary = document.getElementById("record-summary");
    if (state.matchedDisease) {
      summary.textContent = `Questioning complete. All signs of ${formatName(state.matchedDisease.id)} are present. Enter patient details to add them to the triage queue.`;
    } else if (state.candidates.length === 0) {
      summary.textContent = "No condition in the knowledge base fits every answer. The record will carry the closest matches. Enter patient details to add them to the triage queue.";
    } else {
      summary.textContent = "Enter patient details to add them to the triage queue. The record will carry the closest matching conditions.";
    }
  }

  if (state.view === "saved") {
    label.textContent = "Saved";
    meta.textContent = "";
  }
}

function renderDifferential() {
  const body = document.getElementById("diff-body");
  const empty = document.getElementById("diff-empty");
  const count = document.getElementById("diff-count");
  const yesSet = new Set(state.answers.filter(a => a.answer === "yes").map(a => a.symptom));

  body.innerHTML = "";

  if (!state.category) {
    count.textContent = knowledge.isLoaded ? "No complaint selected" : "Knowledge base offline";
    empty.textContent = "Conditions still consistent with the findings appear here.";
    empty.hidden = false;
    return;
  }

  count.textContent = `${state.candidates.length} of ${state.initialPool.length} conditions consistent`;

  if (state.candidates.length === 0) {
    empty.textContent = "No condition fits every answer. Undo the last answer, or record the patient with the closest matches.";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  // Most signs present first; ties keep the .pl order
  const rows = state.candidates
    .map((d, i) => ({ d, i, matched: d.symptoms.filter(s => yesSet.has(s)).length }))
    .sort((a, b) => b.matched - a.matched || a.i - b.i);

  rows.forEach(({ d, matched }) => {
    const complete = matched === d.symptoms.length;
    const meter = d.symptoms.map((_, n) => `<i class="${n < matched ? "on" : ""}"></i>`).join("");
    const tags = [];
    if (complete) tags.push(`<span class="tag full">All signs</span>`);
    if (d.high_risk) tags.push(`<span class="tag risk">High risk</span>`);

    const row = document.createElement("tr");
    if (complete) row.className = "complete";
    row.title = d.description;
    row.innerHTML = `
      <td class="cond-name">${escapeHtml(formatName(d.id))}</td>
      <td class="cond-system">${escapeHtml(BODY_SYSTEMS[d.category] || formatName(d.category))}</td>
      <td><span class="meter" aria-hidden="true">${meter}</span>${matched} of ${d.symptoms.length}</td>
      <td>${tags.join(" ")}</td>
    `;
    body.appendChild(row);
  });
}

function renderFindings() {
  const body = document.getElementById("findings-body");
  const empty = document.getElementById("findings-empty");
  const yesCount = state.answers.filter(a => a.answer === "yes").length;

  document.getElementById("findings-count").textContent =
    `${state.answers.length} recorded · ${yesCount} present`;

  body.innerHTML = "";
  empty.hidden = state.answers.length > 0;

  const riskFound = [];
  state.answers.forEach(item => {
    const isRisk = item.answer === "yes" && knowledge.highRiskSymptoms.has(item.symptom);
    if (isRisk) riskFound.push(symptomName(item.symptom));

    const row = document.createElement("tr");
    if (isRisk) row.className = "risk";
    row.innerHTML = `
      <td>${escapeHtml(symptomName(item.symptom))}</td>
      <td class="tick">${item.answer === "yes" ? icon("check") : ""}</td>
      <td class="tick">${item.answer === "no" ? icon("x") : ""}</td>
    `;
    row.setAttribute("aria-label", `${symptomName(item.symptom)}: ${item.answer}`);
    body.appendChild(row);
  });

  const summary = document.getElementById("risk-summary");
  summary.classList.toggle("show", riskFound.length > 0);
  document.getElementById("risk-summary-text").textContent =
    `High-risk sign${riskFound.length === 1 ? "" : "s"}: ${riskFound.join(", ")}. Inform the triage nurse or doctor now.`;
}

function renderSaved(result) {
  const name = document.getElementById("patient-name").value.trim();
  const age = document.getElementById("patient-age").value.trim();
  const condition = knowledge.conditions[result.condition];
  const others = (result.possible || []).filter(c => c !== result.condition).map(formatName);
  const highRisk = result.high_risk === "YES";

  document.getElementById("saved-id").textContent = `Patient #${result.id}`;
  document.getElementById("saved-details").innerHTML = `
    <dt>Patient</dt><dd>${escapeHtml(name)}, ${escapeHtml(age)} y</dd>
    <dt>Initial impression</dt>
    <dd>
      <div class="impression">${escapeHtml(formatName(result.condition))}</div>
      ${condition ? `<p class="note">${escapeHtml(condition.description)}</p>` : ""}
    </dd>
    <dt>Also consider</dt><dd>${others.length ? escapeHtml(others.join(", ")) : "None"}</dd>
    <dt>High-risk flag</dt><dd class="${highRisk ? "flag-yes" : ""}">${highRisk ? "Yes, do not leave in the waiting queue" : "No"}</dd>
    <dt>Expected resources</dt><dd>${result.resources}</dd>
  `;
}

/**
 * ============================================================================
 * 5. STARTUP & EVENTS
 * ============================================================================
 */
async function connectToKnowledgeBase() {
  const status = document.getElementById("kb-status");
  const text = document.getElementById("kb-status-text");
  try {
    const all = await queryPrologCandidates("extended", []);
    all.candidates.forEach(c => { knowledge.conditions[c.id] = c; });
    knowledge.highRiskSymptoms = new Set(all.high_risk_symptoms);
    knowledge.isLoaded = true;
    status.className = "status online";
    text.textContent = `Knowledge base online · ${all.candidates.length} conditions`;
  } catch (error) {
    knowledge.isLoaded = false;
    status.className = "status offline";
    text.textContent = "Knowledge base offline. Start it with: swipl prolog/server.pl";
  }
  render();
}

document.querySelectorAll(".complaint-btn").forEach(btn => {
  btn.addEventListener("click", () => startCategorySession(btn.dataset.cat));
});

document.getElementById("btn-yes").addEventListener("click", () => recordAnswer("yes"));
document.getElementById("btn-no").addEventListener("click", () => recordAnswer("no"));
document.getElementById("btn-undo").addEventListener("click", undoLastAnswer);

document.getElementById("btn-end").addEventListener("click", () => {
  state.view = "record";
  render();
  document.getElementById("patient-name").focus();
});

document.getElementById("btn-record-back").addEventListener("click", () => {
  if (!state.currentSymptom) {
    // Nothing left to ask: going back means changing the last answer
    undoLastAnswer();
    return;
  }
  state.view = "question";
  render();
});

document.getElementById("view-record").addEventListener("submit", async event => {
  event.preventDefault();
  const name = document.getElementById("patient-name").value.trim();
  const age = document.getElementById("patient-age").value.trim();
  const errorText = document.getElementById("save-error");

  if (name === "" || age === "") {
    errorText.textContent = "Enter the patient's name and age before saving.";
    (name === "" ? document.getElementById("patient-name") : document.getElementById("patient-age")).focus();
    return;
  }

  const saveBtn = document.getElementById("btn-save");
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving…";
  try {
    const result = await savePatient(name, Number(age), state.answers);
    errorText.textContent = "";
    renderSaved(result);
    state.view = "saved";
    render();
    document.getElementById("btn-next").focus();
  } catch (error) {
    errorText.textContent = error.message;
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save to triage queue";
  }
});

document.getElementById("view-record").addEventListener("input", () => {
  document.getElementById("save-error").textContent = "";
});

document.getElementById("btn-next").addEventListener("click", resetSession);

// Keyboard: Y / N answer, U undoes. Ignored while typing in a field.
document.addEventListener("keydown", event => {
  if (event.target.closest("input, textarea") || event.ctrlKey || event.metaKey || event.altKey) return;
  if (state.view !== "question") return;
  const key = event.key.toLowerCase();
  if (key === "y") recordAnswer("yes");
  if (key === "n") recordAnswer("no");
  if (key === "u") undoLastAnswer();
});

connectToKnowledgeBase();
