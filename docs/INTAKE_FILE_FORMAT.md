# Intake file format (Prolog → C)

This file is the agreement between the two programs:

- **Prolog** is the symptom checker. The web page asks the questions, and when
  the patient is confirmed, the Prolog server finds the possible conditions
  (initial diagnosis) and **writes** the patient to the file.
- **C** is the triage. It **reads** the file, decides the ESI level and puts
  the patient in a bed.

Location: `data/intake_records.txt` (run both programs from the project root).
Prolog only **appends** new patients at the end. It never changes old ones.

## One patient = one block

```
BEGIN
ID=1
ARRIVED=2026-10-29 14:30:05
NAME=Juan Dela Cruz
AGE=45
CATEGORY=fever_breathing
SYMPTOMS=fever,cough,sore_throat,loss_of_smell
CONDITION=covid_19
POSSIBLE_CONDITIONS=covid_19,influenza,measles
HIGH_RISK=NO
RESOURCES=1
END
```

## Fields

| Key | Example | Meaning |
|---|---|---|
| `ID` | `1` | Patient number, counts up: 1, 2, 3... |
| `ARRIVED` | `2026-10-29 14:30:05` | When the patient was saved. Use it for "first come, first served" |
| `NAME` | `Juan Dela Cruz` | Patient name |
| `AGE` | `45` | Years |
| `CATEGORY` | `fever_breathing` | Body area of the best match: `fever_breathing`, `stomach_urinary`, `skin_eyes`, `heart_brain`, or `unknown` |
| `SYMPTOMS` | `fever,cough` | Symptoms the patient said "yes" to |
| `CONDITION` | `covid_19` | Best matching condition. `none` if nothing matched |
| `POSSIBLE_CONDITIONS` | `covid_19,influenza` | Up to 3 matches, best first |
| `HIGH_RISK` | `YES` / `NO` | `YES` if a dangerous symptom or dangerous condition was found |
| `RESOURCES` | `3` | How many hospital resources the condition usually needs (labs, x-ray, IV...). `0` if `CONDITION=none` |

## Reading tips for C

- Read line by line with `fgets`.
- `BEGIN` starts a new patient, `END` means the patient is complete.
- Split each line at the **first** `=` (`strchr(line, '=')`). The value can
  have spaces, like a name.
- Remove the `\n` (and `\r` on Windows) at the end of each line.
- Lists are separated by commas with no spaces. Use `strtok(value, ",")`.
- Ignore keys you do not know, so Prolog can add new ones later.

## How C can decide the ESI level

| Step | Fields | Result |
|---|---|---|
| 1. Needs life-saving care now? | Checked by staff in the C program (e.g. heavy bleeding, unconscious) | ESI 1 |
| 2. High risk? | `HIGH_RISK=YES` | ESI 2 |
| 3. How many resources? | `RESOURCES` | 0 → ESI 5, 1 → ESI 4, 2 or more → ESI 3 |

If `CONDITION=none`, nothing matched, so a nurse should check the patient.
C can treat it as ESI 3 to be safe.
