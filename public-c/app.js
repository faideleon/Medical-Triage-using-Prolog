(function () {
  "use strict";
  var CAPACITY = 5, MAX_PATIENTS = 100, MAX_SYMPTOMS = 10, MAX_VISIBLE = 5, MAX_NAME = 49, MAX_SYMPTOM_LEN = 29;
  var VISIBLE = [["Heavy bleeding", 1], ["Unconscious", 1], ["Severe burn", 2], ["Broken leg", 3], ["Deep cut", 3], ["Sprained joint", 4], ["Minor scrape", 5]];
  var EMERGENCY = ["stroke", "sepsis", "meningitis", "meningococcemia", "ischemic_heart_disease", "diphtheria", "rabies", "tetanus"];
  var LABEL = { 1: "Critical", 2: "Emergent", 3: "Urgent", 4: "Less urgent", 5: "Non-urgent" };

  var S = { records: [], queue: [], nextArrival: 1, sample: true };
  var A = { symptoms: [], visible: [] };   /* the "Add patient" form */
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var pad = function (n) { return "P" + String(n).padStart(3, "0"); };
  var human = function (s) { return s.replace(/_/g, " "); };
  var chip = function (p) { return '<span class="pchip p' + p + '"><b>' + p + "</b>" + LABEL[p] + "</span>"; };

  /* Same rules as compute_priority() in the C code, plus the reason that decided it. */
  function computePriority(p) {
    var best = 5, why = "No symptoms or visible conditions recorded.";
    if (p.symptoms.length > 0) { best = 4; why = "Symptoms reported."; }
    if (p.likely && EMERGENCY.indexOf(p.likely.toLowerCase()) !== -1) { best = 1; why = "Likely condition " + human(p.likely) + " is on the emergency list."; }
    p.visible.forEach(function (i) {
      if (VISIBLE[i][1] < best) { best = VISIBLE[i][1]; why = VISIBLE[i][0] + " is visible."; }
    });
    return { priority: best, why: why };
  }

  /* Same ordering as insert_to_queue(): lower priority number first, then earlier arrival. */
  function insertQueue(idx) {
    var np = S.records[idx], pos = S.queue.length;
    for (var i = 0; i < S.queue.length; i++) {
      var q = S.records[S.queue[i]];
      if (np.priority < q.priority || (np.priority === q.priority && np.arrival < q.arrival)) { pos = i; break; }
    }
    S.queue.splice(pos, 0, idx);
  }

  function addRecord(d) {
    if (S.records.length >= MAX_PATIENTS) return { ok: false, msg: "Records array is full." };
    var p = {
      id: d.id || pad(S.nextArrival), name: d.name, category: d.category || "", likely: d.likely || "",
      symptoms: d.symptoms.slice(0, MAX_SYMPTOMS), visible: (d.visible || []).slice(0, MAX_VISIBLE),
      status: "waiting", arrival: S.nextArrival++, bed: 0
    };
    p.priority = computePriority(p).priority;
    S.records.push(p);
    insertQueue(S.records.length - 1);
    return { ok: true, p: p };
  }

  function admittedCount() { return S.records.filter(function (r) { return r.status === "admitted"; }).length; }

  function admitNext() {
    if (!S.queue.length) return { ok: false, msg: "Nobody is waiting." };
    if (admittedCount() >= CAPACITY) return { ok: false, msg: "No free beds! Hospital is full." };
    var idx = S.queue.shift(), p = S.records[idx];
    var used = S.records.filter(function (r) { return r.status === "admitted"; }).map(function (r) { return r.bed; });
    for (var b = 1; b <= CAPACITY; b++) { if (used.indexOf(b) === -1) { p.bed = b; break; } }
    p.status = "admitted";
    return { ok: true, p: p };
  }

  function discharge(idx) {
    var p = S.records[idx];
    if (!p || p.status !== "admitted") return { ok: false, msg: "Invalid selection." };
    p.status = "discharged"; p.bed = 0;
    return { ok: true, p: p };
  }

  /* toast */
  var toastTimer;
  function toast(msg, err) {
    $("toast-msg").textContent = msg;
    $("toast").className = "toast" + (err ? " err" : "");
    $("toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $("toast").hidden = true; }, 4200);
  }
  function report(res, okMsg) { toast(res.ok ? okMsg : res.msg, !res.ok); }

  /* The queue shows the same columns as print_queue(): position, ID, name, priority, condition. */
  function detail(p) { return "Condition: " + (p.likely ? human(p.likely) : "-"); }

  /* render */
  function renderStats() {
    var a = admittedCount();
    var dis = S.records.filter(function (r) { return r.status === "discharged"; }).length;
    $("st-beds").innerHTML = a + "<small> / " + CAPACITY + "</small>";
    var t = ""; for (var i = 0; i < CAPACITY; i++) t += '<span class="tick' + (i < a ? " on" : "") + '"></span>';
    $("st-ticks").innerHTML = t;
    $("st-wait").textContent = S.queue.length;
    $("st-dis").textContent = dis;
    $("q-count").textContent = S.queue.length ? "(" + S.queue.length + ")" : "";
    $("admit-btn").disabled = !S.queue.length;
    $("sample-note").hidden = !S.sample;
  }

  function renderQueue() {
    var el = $("queue");
    if (!S.queue.length) { el.innerHTML = '<li class="empty">The waiting queue is empty.</li>'; return; }
    el.innerHTML = S.queue.map(function (idx, n) {
      var p = S.records[idx];
      return '<li class="qrow' + (n === 0 ? " next" : "") + '"><div class="pos">' + (n === 0 ? "<em>Next</em>" : "") + (n + 1) + "</div>" +
        '<div class="who"><strong>' + esc(p.name) + '</strong><span class="id">' + esc(p.id) + '</span><span class="sub">' + esc(detail(p)) + "</span></div>" + chip(p.priority) + "</li>";
    }).join("");
  }

  function renderBeds() {
    var html = "";
    for (var b = 1; b <= CAPACITY; b++) {
      var idx = -1;
      S.records.forEach(function (r, i) { if (r.status === "admitted" && r.bed === b) idx = i; });
      if (idx === -1) {
        html += '<li class="bed free"><div class="bednum"><small>BED</small><b>' + b + '</b></div><div>Free</div></li>';
      } else {
        var p = S.records[idx];
        html += '<li class="bed"><div class="bednum"><small>BED</small><b>' + b + '</b></div><div class="who"><strong>' + esc(p.name) + '</strong><span class="id">' + esc(p.id) + "</span>" +
          '<div class="meta">' + chip(p.priority) + '</div></div><button class="btn ghost small" type="button" data-discharge="' + idx + '">Discharge</button></li>';
      }
    }
    $("beds").innerHTML = html;
  }

  /* search_patient(): partial, case-insensitive name match; shows ID, Name, Priority only. */
  function renderSearch() {
    var q = $("s-q").value.trim().toLowerCase(), out = $("s-results");
    if (!q) { out.innerHTML = '<p class="hint">Type part of a name to see matching patients.</p>'; return; }
    var hits = S.records.filter(function (r) { return r.name.toLowerCase().indexOf(q) !== -1; });
    if (!hits.length) { out.innerHTML = "<p>No patient found.</p>"; return; }
    out.innerHTML = hits.map(function (p) {
      return '<div class="hit"><dl class="kv"><dt>ID</dt><dd class="mono">' + esc(p.id) + "</dd><dt>Name</dt><dd>" + esc(p.name) + "</dd><dt>Priority</dt><dd>" + chip(p.priority) + "</dd></dl></div>";
    }).join("");
  }

  function renderAll() { renderStats(); renderQueue(); renderBeds(); renderSearch(); renderImportPreview(); renderAddForm(); }

  /* ---------- Import from Prolog (import_prolog_file) ----------
     The whole file is ONE patient: NAME, ID, CATEGORY, LIKELY and SYMPTOMS all come from the file.
     Later lines overwrite earlier ones, and symptoms from every SYMPTOMS line add up to 10. */
  function parseProlog(text) {
    var d = { name: "", id: "", category: "", likely: "", symptoms: [], found: false };
    text.split(/\r?\n/).forEach(function (line) {
      var eq = line.indexOf("=");
      if (eq < 1) return;
      var key = line.slice(0, eq).trim().toUpperCase(), val = line.slice(eq + 1).trim();
      if (key === "NAME") { d.name = val.slice(0, MAX_NAME); d.found = true; }
      else if (key === "ID") { d.id = val.slice(0, 9); d.found = true; }
      else if (key === "CATEGORY") { d.category = val.slice(0, 29); d.found = true; }
      else if (key === "LIKELY") { d.likely = val.slice(0, 49); d.found = true; }
      else if (key === "SYMPTOMS") {
        d.found = true;
        val.split(",").forEach(function (s) {
          s = s.trim().slice(0, MAX_SYMPTOM_LEN);
          if (s && d.symptoms.length < MAX_SYMPTOMS) d.symptoms.push(s);
        });
      }
    });
    return d;
  }

  /* An ID already on the board (waiting, admitted or discharged) cannot be imported a second time. */
  function idExists(id) {
    return S.records.some(function (r) { return r.id.toLowerCase() === id.toLowerCase(); });
  }

  function renderImportPreview() {
    var d = parseProlog($("i-text").value), out = $("i-parsed"), dup = false;
    if (!d.found) {
      out.innerHTML = '<p class="muted">Choose a file or load the example to see the patient in it.</p>';
    } else {
      dup = !!d.id && idExists(d.id);
      var r = computePriority({ symptoms: d.symptoms, visible: [], likely: d.likely });
      out.innerHTML = '<div class="item' + (dup || !d.name ? " bad" : "") + '"><div class="top"><strong>' + esc(d.name || "No NAME in this file") + "</strong>" + chip(r.priority) + '</div><span class="sub">' +
        esc((d.id || pad(S.nextArrival)) + " · " + (d.likely ? "Likely: " + human(d.likely) : (d.category || "no condition")) + " · " + (d.symptoms.length ? d.symptoms.map(human).join(", ") : "no symptoms")) +
        " · " + esc(r.why) + "</span>" +
        (!d.name ? '<span class="sub">Add a NAME= line to the Prolog file to import this patient.</span>' : "") +
        (dup ? '<span class="sub">ID ' + esc(d.id) + " is already in the records, so it cannot be imported again.</span>" : "") + "</div>";
    }
    $("i-submit").disabled = !d.found || !d.name || dup || S.records.length >= MAX_PATIENTS;
  }

  function submitImport() {
    var d = parseProlog($("i-text").value), name = d.name;
    if (!d.found) { toast("No patient data was found in the file.", true); return; }
    if (!name) { toast("No NAME= line was found in the file.", true); return; }
    if (d.id && idExists(d.id)) { toast("Patient " + d.id + " is already in the records.", true); return; }
    var res = addRecord({ id: d.id, name: name, category: d.category, likely: d.likely, symptoms: d.symptoms });
    if (res.ok) { $("i-text").value = ""; $("i-file").value = ""; }
    renderAll();
    report(res, res.ok ? "Imported " + res.p.name + " (" + res.p.id + ") with Priority " + res.p.priority + "." : "");
  }

  /* ---------- Add patient (add_patient_manual) ---------- */
  function renderAddForm() {
    $("a-chips").innerHTML = A.symptoms.map(function (s, i) {
      return '<span class="chip">' + esc(human(s)) + '<button type="button" aria-label="Remove ' + esc(human(s)) + '" data-rm="' + i + '">×</button></span>';
    }).join("");
    $("a-sym").disabled = A.symptoms.length >= MAX_SYMPTOMS;
    $("a-sym-add").disabled = A.symptoms.length >= MAX_SYMPTOMS;

    $("a-vis").innerHTML = VISIBLE.map(function (v, i) {
      var on = A.visible.indexOf(i) !== -1;
      var full = !on && A.visible.length >= MAX_VISIBLE;
      return '<button class="vbtn" type="button" data-vis="' + i + '" aria-pressed="' + on + '"' + (full ? " disabled" : "") + "><span>" + esc(v[0]) + "</span>" + chip(v[1]) + "</button>";
    }).join("");

    var r = computePriority({ symptoms: A.symptoms, visible: A.visible, likely: "" });
    $("a-preview").innerHTML = chip(r.priority) + "<p>" + esc(r.why) + "</p>";
    $("a-submit").disabled = !$("a-name").value.trim() || S.records.length >= MAX_PATIENTS;
  }

  /* Symptoms are lower-cased and spaces become underscores, like the C code. */
  function addSymptom() {
    var raw = $("a-sym").value.trim();
    if (!raw || A.symptoms.length >= MAX_SYMPTOMS) return;
    A.symptoms.push(raw.slice(0, MAX_SYMPTOM_LEN).toLowerCase().replace(/ /g, "_"));
    $("a-sym").value = "";
    renderAddForm();
    $("a-sym").focus();
  }

  function submitAdd() {
    var name = $("a-name").value.trim().slice(0, MAX_NAME);
    if (!name) { toast("Enter the patient name.", true); return; }
    var res = addRecord({ name: name, symptoms: A.symptoms.slice(), visible: A.visible.slice() });
    if (res.ok) { A = { symptoms: [], visible: [] }; $("a-name").value = ""; $("a-sym").value = ""; }
    renderAll();
    report(res, res.ok ? "Added " + res.p.name + " (" + res.p.id + ") with Priority " + res.p.priority + "." : "");
  }

  /* events */
  $("admit-btn").addEventListener("click", function () {
    var res = admitNext(); renderAll();
    report(res, res.ok ? "Admitted " + res.p.name + " (" + res.p.id + ")." : "");
  });
  $("beds").addEventListener("click", function (e) {
    var b = e.target.closest("[data-discharge]"); if (!b) return;
    var res = discharge(Number(b.getAttribute("data-discharge"))); renderAll();
    report(res, res.ok ? "Patient " + res.p.id + " discharged." : "");
  });
  $("clear-btn").addEventListener("click", function () {
    S = { records: [], queue: [], nextArrival: 1, sample: false }; renderAll(); toast("The board is empty. Add the first patient below.");
  });
  document.querySelector(".tabs").addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab]"); if (!t) return;
    ["imp", "add", "sea"].forEach(function (k) {
      var on = k === t.getAttribute("data-tab");
      $("t-" + k).setAttribute("aria-selected", on); $("p-" + k).hidden = !on;
    });
  });

  $("i-text").addEventListener("input", renderImportPreview);
  $("i-submit").addEventListener("click", submitImport);
  /* Example Prolog export files: one block per patient, with the name stored in Prolog.
     Each click on "Load an example file" brings in the next patient that is not on the board yet. */
  var EXAMPLES = [
    "NAME=Carlos Mendoza\nID=PL-021\nCATEGORY=infectious\nLIKELY=meningitis\nSYMPTOMS=fever,stiff_neck,headache,photophobia",
    "NAME=Elena Ramos\nID=PL-022\nCATEGORY=respiratory\nLIKELY=asthma\nSYMPTOMS=wheezing,shortness_of_breath",
    "NAME=Josefa Villanueva\nID=PL-023\nCATEGORY=neurological\nLIKELY=stroke\nSYMPTOMS=facial_droop,slurred_speech,arm_weakness",
    "NAME=Miguel Torres\nID=PL-024\nCATEGORY=infectious\nLIKELY=sepsis\nSYMPTOMS=fever,rapid_heartbeat,confusion",
    "NAME=Liza Fernando\nID=PL-025\nCATEGORY=digestive\nLIKELY=gastroenteritis\nSYMPTOMS=nausea,vomiting,diarrhea",
    "NAME=Andres Lim\nID=PL-026\nCATEGORY=infectious\nLIKELY=tetanus\nSYMPTOMS=jaw_spasm,muscle_stiffness,fever",
    "NAME=Grace Aquino\nID=PL-027\nCATEGORY=neurological\nLIKELY=migraine\nSYMPTOMS=headache,nausea,light_sensitivity",
    "NAME=Ramon Delgado\nID=PL-028\nCATEGORY=cardiac\nLIKELY=ischemic_heart_disease\nSYMPTOMS=chest_pain,shortness_of_breath,sweating",
    "NAME=Bea Castillo\nID=PL-029\nCATEGORY=allergy\nLIKELY=allergic_rhinitis\nSYMPTOMS=sneezing,runny_nose"
  ];
  var exCursor = 0;
  $("i-example").addEventListener("click", function () {
    var pick = -1;
    for (var k = 0; k < EXAMPLES.length; k++) {
      var j = (exCursor + k) % EXAMPLES.length;
      if (!idExists(parseProlog(EXAMPLES[j]).id)) { pick = j; break; }
    }
    if (pick === -1) { toast("All the example patients are already imported.", true); return; }
    exCursor = (pick + 1) % EXAMPLES.length;
    $("i-text").value = EXAMPLES[pick];
    renderImportPreview();
  });
  $("i-file").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () { $("i-text").value = String(r.result); renderImportPreview(); };
    r.onerror = function () { toast("Could not open file!", true); };
    r.readAsText(f);
  });

  $("a-name").addEventListener("input", renderAddForm);
  $("a-sym-add").addEventListener("click", addSymptom);
  $("a-sym").addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); addSymptom(); } });
  $("a-chips").addEventListener("click", function (e) {
    var b = e.target.closest("[data-rm]"); if (!b) return;
    A.symptoms.splice(Number(b.getAttribute("data-rm")), 1); renderAddForm();
  });
  $("a-vis").addEventListener("click", function (e) {
    var b = e.target.closest("[data-vis]"); if (!b) return;
    var i = Number(b.getAttribute("data-vis")), at = A.visible.indexOf(i);
    if (at !== -1) A.visible.splice(at, 1); else if (A.visible.length < MAX_VISIBLE) A.visible.push(i);
    renderAddForm();
  });
  $("a-submit").addEventListener("click", submitAdd);

  $("s-q").addEventListener("input", renderSearch);
  $("emerg-list").textContent = EMERGENCY.join(", ");

  /* example patients, built with the same functions as real entries */
  [
    { name: "Maria Santos", symptoms: ["leg_pain", "swelling"], visible: [3] },
    { name: "Jun Reyes", symptoms: ["fever", "cough"], visible: [] },
    { name: "Lito Navarro", symptoms: [], visible: [0] },
    { name: "Ana Dizon", symptoms: [], visible: [6] },
    { id: "PL-014", name: "Rafael Cruz", category: "infectious", likely: "meningitis", symptoms: ["fever", "stiff_neck", "headache"], visible: [] },
    { name: "Ines Bautista", symptoms: ["ankle_pain"], visible: [5] },
    { name: "Paolo Garcia", symptoms: ["pain"], visible: [2] }
  ].forEach(function (d) { addRecord(d); });
  admitNext(); admitNext(); admitNext();
  discharge(S.records.findIndex(function (r) { return r.status === "admitted"; }));

  renderAll();
})();