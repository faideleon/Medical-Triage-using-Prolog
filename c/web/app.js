(function () {
  "use strict";
  /* Every rule (priority, queue, beds, reading the Prolog file) runs in the
     C server: c/server.c and c/hospital.c. This file only asks it and draws
     the answer. */
  var LABEL = { 1: "Critical", 2: "Emergent", 3: "Urgent", 4: "Less urgent", 5: "Non-urgent" };

  var S = null;                              /* the board, as the C server sent it */
  var A = { symptoms: [], visible: [] };     /* the "Add patient" form */
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var human = function (s) { return s.replace(/_/g, " "); };
  var oneLine = function (s) { return String(s).replace(/[\r\n]+/g, " "); };
  var chip = function (p) { return '<span class="prio p' + p + '"><b>' + p + "</b>" + LABEL[p] + "</span>"; };
  var icon = function (name) { return '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; };

  /* ---------- Talking to the C server ---------- */
  function api(path, body) {
    var opts = body === undefined ? {} : { method: "POST", headers: { "Content-Type": "text/plain" }, body: body };
    return fetch(path, opts).then(function (r) {
      if (!r.ok) throw new Error("The C server answered " + r.status + ".");
      return r.json();
    });
  }
  function offline() { toast("Cannot reach the C server. Start it with ./triage-server and reload the page.", true); }

  /* Run an action, then draw the board and show the message the server sends back. */
  function act(path, body) {
    return api(path, body).then(function (res) {
      S = res.state;
      renderAll();
      toast(res.message, !res.ok);
      return res;
    }).catch(function () { offline(); return { ok: false }; });
  }

  function admittedCount() { return S.records.filter(function (r) { return r.status === "admitted"; }).length; }

  /* toast */
  var toastTimer;
  function toast(msg, err) {
    $("toast-msg").textContent = msg;
    $("toast").className = "toast" + (err ? " err" : "");
    $("toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $("toast").hidden = true; }, 4200);
  }

  /* render */
  function renderStats() {
    var a = admittedCount(), cap = S.capacity;
    var dis = S.records.filter(function (r) { return r.status === "discharged"; }).length;
    $("st-beds").textContent = a + " / " + cap;
    var t = ""; for (var i = 0; i < cap; i++) t += '<i class="' + (i < a ? "on" : "") + '"></i>';
    $("st-ticks").innerHTML = t;
    $("beds-meta").textContent = a + " of " + cap + " in use";
    $("st-wait").textContent = S.queue.length;
    $("st-dis").textContent = dis;
    $("q-count").textContent = S.queue.length + " waiting";
    $("admit-btn").disabled = !S.queue.length || a >= cap;
    $("admit-note").textContent = !S.queue.length ? "Nobody is waiting."
      : a >= cap ? "No free beds. Discharge a patient to admit the next one."
      : "Next: " + S.records[S.queue[0]].name + ", priority " + S.records[S.queue[0]].priority + ".";
    $("sample-note").hidden = !S.sample;
  }

  /* The queue shows the same columns as print_queue(): position, ID, name, priority, condition. */
  function renderQueue() {
    $("queue-empty").hidden = S.queue.length > 0;
    $("queue").innerHTML = S.queue.map(function (idx, n) {
      var p = S.records[idx];
      return '<tr class="p' + p.priority + (n === 0 ? " next" : "") + '">' +
        '<td class="pos">' + (n === 0 ? '<span class="next-tag">Next</span>' : "") + (n + 1) + "</td>" +
        '<td class="who"><strong>' + esc(p.name) + '</strong><span class="id">' + esc(p.id) + "</span></td>" +
        '<td class="cond">' + esc(p.likely ? human(p.likely) : "Not recorded") + "</td>" +
        "<td>" + chip(p.priority) + "</td></tr>";
    }).join("");
  }

  function renderBeds() {
    var html = "";
    for (var b = 1; b <= S.capacity; b++) {
      var p = null;
      S.records.forEach(function (r) { if (r.status === "admitted" && r.bed === b) p = r; });
      if (!p) {
        html += '<li class="bed free"><div class="bednum"><small>BED</small><b>' + b + '</b></div><div class="who">Free</div></li>';
      } else {
        html += '<li class="bed"><div class="bednum"><small>BED</small><b>' + b + '</b></div><div class="who"><strong>' + esc(p.name) + '</strong><span class="id">' + esc(p.id) + "</span>" +
          "<div>" + chip(p.priority) + '</div></div><button class="btn btn-quiet" type="button" data-discharge="' + esc(p.id) + '">Discharge</button></li>';
      }
    }
    $("beds").innerHTML = html;
  }

  /* search_patient(): partial, case-insensitive name match, done by the C server. */
  var searchSeq = 0;
  function renderSearch() {
    if (!S) return;
    var q = $("s-q").value.trim(), out = $("s-results"), seq = ++searchSeq;
    if (!q) { out.innerHTML = '<p class="hint">Type part of a name to see matching patients.</p>'; return; }
    api("/api/search", "NAME=" + oneLine(q)).then(function (res) {
      if (seq !== searchSeq) return;
      var hits = res.results;
      if (!hits.length) { out.innerHTML = '<p class="hint">No patient found.</p>'; return; }
      out.innerHTML = '<div class="hits">' + hits.map(function (p) {
        return '<div class="hit"><dl class="kv"><dt>ID</dt><dd>' + esc(p.id) + "</dd><dt>Name</dt><dd>" + esc(p.name) + "</dd><dt>Priority</dt><dd>" + chip(p.priority) + "</dd><dt>Status</dt><dd>" + esc(p.status === "admitted" ? "Admitted, bed " + p.bed : p.status === "discharged" ? "Discharged" : "Waiting") + "</dd></dl></div>";
      }).join("") + "</div>";
    }).catch(offline);
  }

  function renderAll() { renderStats(); renderQueue(); renderBeds(); renderSearch(); renderImportPreview(); renderAddForm(); }

  /* ---------- Import from Prolog (import_prolog_file) ----------
     The C server reads the text the same way as the terminal program:
     each patient is a block from BEGIN to END. */
  var previewSeq = 0;
  function renderImportPreview() {
    if (!S) return;
    var text = $("i-text").value, out = $("i-parsed"), seq = ++previewSeq;
    var setButton = function (ready) {
      $("i-submit").textContent = ready > 1 ? "Import " + ready + " patients" : "Import patient";
      $("i-submit").disabled = !ready || S.records.length >= S.maxPatients;
    };
    if (!text.trim()) {
      out.innerHTML = '<p class="muted">Load the intake file, or an example record, to see the patients in it.</p>';
      setButton(0);
      return;
    }
    api("/api/preview", text).then(function (res) {
      if (seq !== previewSeq) return;
      var list = res.patients;
      if (!list.length) {
        out.innerHTML = '<p class="muted">No patients found in this text.</p>';
      } else {
        out.innerHTML = list.map(function (d) {
          return '<div class="item' + (d.duplicate || !d.hasName ? " bad" : "") + '"><div class="top"><strong>' + esc(d.name || "No NAME in this record") + "</strong>" + chip(d.priority) + '</div><span class="sub">' +
            esc((d.id || res.nextId) + " · " + (d.likely ? "Likely: " + human(d.likely) : (d.category || "no condition")) + " · " + (d.symptoms.length ? d.symptoms.map(human).join(", ") : "no symptoms")) +
            " · " + esc(d.why) + "</span>" +
            (!d.hasName ? '<span class="sub why-not">Add a NAME= line to import this patient.</span>' : "") +
            (d.duplicate ? '<span class="sub why-not">ID ' + esc(d.id) + " is already on the board.</span>" : "") + "</div>";
        }).join("");
      }
      setButton(list.filter(function (d) { return d.hasName && !d.duplicate; }).length);
    }).catch(offline);
  }

  function submitImport() {
    act("/api/import", $("i-text").value).then(function (res) {
      if (!res.ok) return;
      $("i-text").value = ""; $("i-file").value = "";
      renderImportPreview();
    });
  }

  /* ---------- Add patient (add_patient_manual) ---------- */
  function addForm() {
    return "NAME=" + oneLine($("a-name").value.trim()) + "\nSYMPTOMS=" + A.symptoms.join(",") + "\nVISIBLE=" + A.visible.join(",");
  }

  var addSeq = 0;
  function renderAddForm() {
    if (!S) return;
    $("a-chips").innerHTML = A.symptoms.map(function (s, i) {
      return '<span class="chip">' + esc(human(s)) + '<button type="button" aria-label="Remove ' + esc(human(s)) + '" data-rm="' + i + '">' + icon("x") + "</button></span>";
    }).join("");
    $("a-sym").disabled = A.symptoms.length >= S.maxSymptoms;
    $("a-sym-add").disabled = A.symptoms.length >= S.maxSymptoms;

    $("a-vis").innerHTML = S.visibleConditions.map(function (v, i) {
      var on = A.visible.indexOf(i) !== -1;
      var full = !on && A.visible.length >= S.maxVisible;
      return '<button class="vbtn" type="button" data-vis="' + i + '" aria-pressed="' + on + '"' + (full ? " disabled" : "") + "><span>" + esc(v.name) + "</span>" + chip(v.priority) + "</button>";
    }).join("");

    var seq = ++addSeq;
    api("/api/priority", addForm()).then(function (r) {
      if (seq !== addSeq) return;
      $("a-preview").innerHTML = chip(r.priority) + "<p>" + esc(r.why) + "</p>";
    }).catch(offline);
    $("a-submit").disabled = !$("a-name").value.trim() || S.records.length >= S.maxPatients;
  }

  /* Symptoms are lower-cased and spaces become underscores, like the C code. */
  function addSymptom() {
    var raw = $("a-sym").value.trim();
    if (!raw || A.symptoms.length >= S.maxSymptoms) return;
    A.symptoms.push(raw.slice(0, 29).toLowerCase().replace(/[ ,]/g, "_"));
    $("a-sym").value = "";
    renderAddForm();
    $("a-sym").focus();
  }

  function submitAdd() {
    act("/api/add", addForm()).then(function (res) {
      if (!res.ok) return;
      A = { symptoms: [], visible: [] }; $("a-name").value = ""; $("a-sym").value = "";
      renderAddForm();
    });
  }

  /* events */
  $("admit-btn").addEventListener("click", function () { act("/api/admit", ""); });
  $("beds").addEventListener("click", function (e) {
    var b = e.target.closest("[data-discharge]"); if (!b) return;
    act("/api/discharge", "ID=" + b.getAttribute("data-discharge"));
  });
  $("clear-btn").addEventListener("click", function () { act("/api/clear", ""); });
  document.querySelector(".segmented").addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab]"); if (!t) return;
    ["imp", "add", "sea"].forEach(function (k) {
      var on = k === t.getAttribute("data-tab");
      $("t-" + k).setAttribute("aria-selected", on); $("p-" + k).hidden = !on;
    });
  });

  $("i-text").addEventListener("input", renderImportPreview);
  $("i-submit").addEventListener("click", submitImport);
  /* The C server reads data/intake_records.txt itself, so no file picker is needed. */
  $("i-load").addEventListener("click", function () {
    api("/api/intake-file").then(function (res) {
      if (!res.ok) { toast(res.message, true); return; }
      $("i-text").value = res.text;
      renderImportPreview();
    }).catch(offline);
  });
  /* Example Prolog export files: one block per patient, with the name stored in Prolog.
     Each click on "Load an example record" brings in the next patient that is not on the board yet. */
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
    var onBoard = function (ex) {
      var id = ex.match(/ID=(\S+)/)[1].toLowerCase();
      return S.records.some(function (r) { return r.id.toLowerCase() === id; });
    };
    var pick = -1;
    for (var k = 0; k < EXAMPLES.length; k++) {
      var j = (exCursor + k) % EXAMPLES.length;
      if (!onBoard(EXAMPLES[j])) { pick = j; break; }
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
    if (at !== -1) A.visible.splice(at, 1); else if (A.visible.length < S.maxVisible) A.visible.push(i);
    renderAddForm();
  });
  $("a-submit").addEventListener("click", submitAdd);

  $("s-q").addEventListener("input", renderSearch);

  /* first load: get the board from the C server */
  api("/api/state").then(function (state) {
    S = state;
    $("emerg-list").textContent = S.emergency.join(", ");
    renderAll();
  }).catch(offline);
})();
