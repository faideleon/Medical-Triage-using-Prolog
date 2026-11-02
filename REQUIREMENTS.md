# Requirements Checklist

Checked against `main` (commit `13ba5f6`).
`[x]` = done in the code now. `[ ]` = not done yet, or only partly done (see the note).

The two programs share one file, `data/intake_records.txt`, in the format in
[docs/INTAKE_FILE_FORMAT.md](docs/INTAKE_FILE_FORMAT.md). Prolog writes it, C reads it.

---

## Part A: Prolog (intake and symptom checker)

### A1. Knowledge base (`prolog/knowledge.pl`)
- [x] Only facts in this file; the rules are in `triage.pl`
- [x] 4 body-area categories: `category(Id, Label)`
- [x] Conditions with category and symptom list: `condition(Name, Category, Symptoms)`
- [x] A staff triage note for every condition: `description(Name, Text)`
- [x] Expected hospital resources for every condition: `resources(Name, List)`
- [x] High-risk symptoms list: `high_risk_symptom/1`
- [x] High-risk conditions list: `high_risk_condition/1`
- [x] Emergency signs (ESI 1) with staff questions: `emergency_sign(Id, Question)`
- [ ] Every `condition/3` has a matching `description/2` and `resources/2` (no automatic check yet)
- [ ] Medical content reviewed by a doctor or nurse (the file says this is still needed)

### A2. Rules (`prolog/triage.pl`)
- [x] `has_symptom/2`: a symptom belongs to a condition
- [x] `match_count/3`: how many of a condition's symptoms the patient has
- [x] `likely_conditions/2`: top 3 matches, most matching symptoms first, at least 1 match
- [x] `best_condition/2`: first match, or `none` when nothing matched
- [x] `condition_category/2`: `unknown` when the condition is `none`
- [x] `high_risk/1`: any high-risk symptom, or all symptoms of a high-risk condition
- [x] `resource_count/2`: number of resources, `0` for `none`
- [x] Prolog does not decide the ESI level (left to C)

### A3. Web server (`prolog/server.pl`)
- [x] Starts with `swipl prolog/server.pl`, default port 8000
- [x] Another port can be given: `swipl prolog/server.pl 8080`
- [x] Serves the page in `prolog/web/` at `/`
- [x] Works when started from any folder (paths come from the file's own folder)
- [x] `POST /api/triage`: takes the category and answers, returns the conditions that still fit plus the high-risk symptom list
- [x] A condition fits when it has every "yes" symptom and none of the "no" symptoms
- [x] Page categories map to knowledge-base categories (`fever`, `stomach` (also skin/eyes), `body`, `extended` = all)
- [x] `POST /api/save`: takes name, age, answers; saves the patient; returns ID, condition, possible conditions, high-risk, resources
- [ ] Server checks the input (empty name, age not a number, unknown symptom) instead of trusting the page
- [ ] Emergency signs are served to the page (the facts exist but no API uses them)

### A4. Intake file writer (`prolog/records.pl`)
- [x] Writes to `data/intake_records.txt` and creates `data/` if missing
- [x] Only appends; never changes or deletes old patients
- [x] One `BEGIN` … `END` block per patient
- [x] Adds `ID` (counts up from 1) and `ARRIVED` (`YYYY-MM-DD HH:MM:SS`)
- [x] Writes `NAME`, `AGE`, `CATEGORY`, `SYMPTOMS`, `CONDITION`, `POSSIBLE_CONDITIONS`, `HIGH_RISK`, `RESOURCES`
- [x] Lists are written comma-separated with no spaces
- [ ] Two saves at the same moment cannot get the same `ID` (no locking now)
- [ ] A name with a newline or `=` cannot break the file format

### A5. Intake web page (`prolog/web/`)
- [x] Plain HTML/CSS/JS, no build step, no framework
- [x] Nurse picks a complaint category to start
- [x] Asks one yes/no symptom question at a time
- [x] Next question comes from the conditions that still fit (order from the `.pl` file)
- [x] Keeps asking while similar conditions still have unasked symptoms
- [x] Live list of remaining conditions with their triage notes
- [x] High-risk findings are shown as soon as they are answered
- [x] Undo the last answer
- [x] End the questions early
- [x] Keyboard: `Y` yes, `N` no, `U` undo (ignored while typing in a field)
- [x] A fast double key press cannot record the same answer twice
- [x] Name and age are required before saving, with an error message
- [x] Shows the saved result (patient number, condition, high-risk, resources)
- [x] "Next patient" clears everything for a new intake
- [x] Clinical wording for the nurse; results are a working impression, not a diagnosis
- [ ] Emergency signs asked first, stopping the questions when one is present

### A6. Terminal symptom checker (`prolog/conditions.pl`)
- [x] Runs with `swipl prolog/conditions.pl`, then `start.`
- [x] Asks yes/no questions per category and lists the matching conditions
- [ ] Uses the same facts as `knowledge.pl` (it has its own copy of the conditions)

---

## Part B: C (triage, queue and beds)

### B1. Terminal program (`c/triage.c`)

**Build and run**
- [x] Builds with `gcc c/triage.c -o triage`
- [x] Menu: add, import, show queue, admit, discharge, search, occupancy, exit

**Data structures**
- [x] Patient records in an array (max 100)
- [x] Waiting queue as a linked list sorted by priority
- [x] Patient status: waiting, admitted, discharged
- [x] Queue memory is freed on exit

**Import from Prolog (menu 2)**
- [x] Default file `data/intake_records.txt`; also tries `../data/...` when run from `c/`
- [x] Reads line by line with `fgets`, removes `\n` and `\r`
- [x] Each `BEGIN` … `END` block is one patient; all blocks are imported
- [x] Splits each line at the first `=`, so values can have spaces
- [x] Reads `ID`, `NAME`, `AGE`, `CATEGORY`, `CONDITION` (or old `LIKELY`), `HIGH_RISK`, `SYMPTOMS`
- [x] Unknown keys are ignored
- [x] `ID=3` is shown as `PL-003`
- [x] A patient already on the board is skipped, so the file can be imported again for new arrivals
- [x] Asks for the name only if the file has none
- [x] Older format (no `BEGIN`/`END`) is read as one patient
- [x] Reports how many were imported and skipped
- [ ] Uses `ARRIVED` for first come, first served (uses import order now)
- [ ] Uses `RESOURCES` for the ESI level
- [ ] Uses or shows `POSSIBLE_CONDITIONS`

**Priority**
- [x] Emergency condition (stroke, sepsis, meningitis, ...) gives priority 1
- [x] `HIGH_RISK=YES` gives at least priority 2
- [x] Any symptoms give priority 4, nothing gives 5
- [x] Visible conditions entered by staff can raise the priority
- [x] Same priority: earlier arrival goes first
- [ ] ESI steps from the format doc: 1 life-saving, 2 high risk, then resources 0 → 5, 1 → 4, 2+ → 3
- [ ] `CONDITION=none` treated as ESI 3 to be safe
- [ ] Emergency list kept in step with `high_risk_condition/1` in Prolog (it is a hand-copied subset now)

**Manual add, beds and search**
- [x] Add a patient by hand with symptoms and visible conditions
- [x] Admit the head of the queue only when a bed is free (capacity 5)
- [x] Discharge an admitted patient
- [x] Search patients by name, ignoring case
- [x] Show occupancy: beds in use, waiting, discharged

**Robustness**
- [ ] Menu and number inputs handle letters without looping or breaking (`scanf("%d")` now)
- [ ] `malloc` result is checked
- [ ] Records are saved between runs (all data is lost on exit now)

### B2. Web board (`c/web/`)
- [x] Opens straight from `c/web/index.html`, no server needed
- [x] Same priority rules as `compute_priority()`, and shows the reason
- [x] Same queue order as `insert_to_queue()`
- [x] Import by choosing the intake file or pasting it, with a preview before importing
- [x] Preview marks records with no name or an ID already on the board
- [x] Manual add form with symptoms and visible conditions
- [x] Bed map with numbered beds; admit next and discharge from a bed
- [x] Search by name
- [x] Stats: beds in use, waiting, discharged
- [x] Same limits as the C program (100 patients, 5 beds, 10 symptoms)
- [ ] Board stays after a page reload
- [ ] Same gaps as B1: `ARRIVED`, `RESOURCES` and ESI steps not used yet

---

## Part C: Shared (both sides)
- [x] File format written down in `docs/INTAKE_FILE_FORMAT.md`
- [x] README explains how to run both programs from the project root
- [x] `data/` is not in git
- [ ] Automated tests for the Prolog rules and the C file reader
- [ ] One test intake file that both C and the C web board are checked against
