# Requirements Checklist

`[x]` = done. `[ ]` = not done yet.

**How the two parts work together:** the Prolog part asks the patient's
symptoms and saves the patient in `data/intake_records.txt`. The C part
opens that file, puts the patients in line and gives them beds.
How the file looks is explained in [docs/INTAKE_FILE_FORMAT.md](docs/INTAKE_FILE_FORMAT.md).

**Words used here:**
- **Priority** – how fast the patient must be seen. 1 = right now, 5 = can wait.
- **ESI** – the hospital's 1 to 5 scale for priority.
- **High-risk** – a sign that the patient should not wait in line.

---

## Part A: Prolog

### A1. The list of illnesses (`prolog/knowledge.pl`)
- [x] 4 groups of illnesses (fever and breathing, stomach, skin and eyes, heart and brain)
- [x] Each illness has its group and its list of symptoms
- [x] Each illness has a short note for the nurse
- [x] Each illness says what the hospital will need (lab test, x-ray, IV...)
- [x] A list of high-risk symptoms
- [x] A list of high-risk illnesses
- [x] A list of emergency signs (patient needs help right now)
- [ ] A check that no illness is missing its note or its needs list
- [ ] A doctor or nurse has checked the medical facts

### A2. The rules (`prolog/triage.pl`)
- [x] Finds the 3 illnesses that match the most symptoms
- [x] Picks the best match, or says `none` if nothing matches
- [x] Says the patient is high-risk if they have a high-risk symptom, or all the symptoms of a high-risk illness
- [x] Counts what the hospital will need for the best match (0 if `none`)
- [x] Does **not** set the priority (the C part does that)

### A3. The server (`prolog/server.pl`)
- [x] Starts with `swipl prolog/server.pl` on port 8000
- [x] Can use another port: `swipl prolog/server.pl 8080`
- [x] Shows the intake page at http://localhost:8000/
- [x] Works no matter which folder you start it from
- [x] Tells the page which illnesses still match the answers so far
- [x] An illness still matches if it has every "yes" symptom and no "no" symptom
- [x] Saves the patient and sends back the patient number and results
- [ ] Checks that the name is not empty and the age is a number
- [ ] Sends the emergency signs to the page (the list exists but is not used)

### A4. Saving patients (`prolog/records.pl`)
- [x] Saves to `data/intake_records.txt` and makes the `data/` folder if needed
- [x] Only adds new patients at the end; never changes old ones
- [x] Each patient starts with `BEGIN` and ends with `END`
- [x] Gives each patient a number (1, 2, 3...) and the time they were saved
- [x] Saves name, age, group, symptoms, best match, top 3 matches, high-risk, and hospital needs
- [ ] Two patients saved at the exact same time cannot get the same number
- [ ] A name with `=` or a line break cannot break the file

### A5. The intake page (`prolog/web/`)
- [x] Simple HTML, CSS and JavaScript (nothing to install)
- [x] The nurse picks a group to start
- [x] Asks one yes/no question at a time
- [x] Only asks about symptoms of illnesses that still match
- [x] Shows the illnesses that still match, with the nurse notes
- [x] Shows high-risk signs as soon as they are answered
- [x] Can undo the last answer
- [x] Can stop the questions early
- [x] Keys: `Y` = yes, `N` = no, `U` = undo
- [x] Pressing a key twice fast does not save the answer twice
- [x] Name and age must be filled in before saving
- [x] Shows the result after saving (patient number, best match, high-risk)
- [x] "Next patient" clears the page
- [x] The result is a guess to help the nurse, not a diagnosis
- [ ] Asks the emergency signs first, and stops if one is found

### A6. Terminal version (`prolog/conditions.pl`)
- [x] Runs with `swipl prolog/conditions.pl`, then type `start.`
- [x] Asks yes/no questions and shows the matching illnesses
- [ ] Uses the same illness list as `knowledge.pl` (it has its own copy now)

---

## Part B: C

### B1. Terminal program (`c/triage.c`)

**Running it**
- [x] Build with `gcc c/triage.c -o triage`
- [x] Menu: add, import, show line, admit, discharge, search, beds, exit

**How it keeps patients**
- [x] Keeps up to 100 patients
- [x] The waiting line is a linked list, ordered by priority
- [x] Each patient is waiting, admitted or discharged
- [x] Frees memory when the program closes

**Import from Prolog (menu 2)**
- [x] Press Enter to use `data/intake_records.txt`
- [x] Also finds the file when run from inside the `c/` folder
- [x] Reads every patient from `BEGIN` to `END`
- [x] Names with spaces are read correctly
- [x] Reads number, name, age, group, best match, high-risk and symptoms
- [x] Skips lines it does not know
- [x] Shows patient 3 as `PL-003`
- [x] Skips patients already imported, so you can import the same file again for new patients
- [x] Asks for the name only if the file has none
- [x] Can still read the old file style (one patient, no `BEGIN`/`END`)
- [x] Says how many were imported and how many were skipped
- [ ] Uses the saved time for "first come, first served" (uses import order now)
- [ ] Uses the hospital needs count
- [ ] Shows the top 3 matches

**Priority**
- [x] A deadly illness (stroke, sepsis, meningitis...) = priority 1
- [x] High-risk = priority 2 or higher
- [x] Has symptoms = priority 4; nothing = priority 5
- [x] Things the staff can see (heavy bleeding, broken leg...) can raise the priority
- [x] Same priority: whoever came first goes first
- [ ] Uses the hospital needs count: 0 needs = 5, 1 need = 4, 2 or more = 3
- [ ] No match (`none`) = priority 3, to be safe
- [ ] Deadly illness list matches the Prolog high-risk list (it is copied by hand now)

**Beds and search**
- [x] Add a patient by typing their details
- [x] Admit the first patient in line, only if a bed is free (5 beds)
- [x] Discharge a patient
- [x] Search by name (small or capital letters both work)
- [x] Show beds used, patients waiting and patients discharged

**Safety**
- [ ] Typing a letter in the menu does not break the program
- [ ] Checks that memory was given before using it
- [ ] Keeps the patients after the program closes (all lost now)

### B2. Web board (`c/web/`)
- [x] Open `c/web/index.html` in a browser (no server needed)
- [x] Same priority rules as the C program, and shows why
- [x] Same line order as the C program
- [x] Import by choosing the file or pasting it, and see the patients first
- [x] Marks patients with no name, or already on the board
- [x] Form to add a patient by hand
- [x] Bed map: admit the next patient and discharge from a bed
- [x] Search by name
- [x] Shows beds used, waiting and discharged
- [x] Same limits as the C program (100 patients, 5 beds, 10 symptoms)
- [ ] Keeps the board after the page is refreshed
- [ ] Same missing items as B1 (saved time, hospital needs count)

---

## Part C: Both parts
- [x] The file format is written down in `docs/INTAKE_FILE_FORMAT.md`
- [x] The README says how to run both parts
- [x] The `data/` folder is not saved in git
- [ ] Tests for the Prolog rules and the C file reader
- [ ] One sample file to test both the C program and the web board
