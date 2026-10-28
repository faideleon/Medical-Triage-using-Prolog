# Intake file format (Prolog → C)

This file is the agreement between the two programs:

- **Prolog** is the symptom checker. It asks the questions, finds the possible
  conditions (initial diagnosis) and **writes** the patient to the file.
- **C** is the triage. It **reads** the file, decides the ESI level and puts
  the patient in a bed.

Location: `data/intake_records.txt` (run both programs from the project root).
Prolog only **appends** new patients at the end. It never changes old ones.

## One patient = one block

A normal patient:

```
BEGIN
ID=1
ARRIVED=2026-10-29 14:30:05
NAME=Juan Dela Cruz
AGE=45
SEX=M
EMERGENCY=NO
EMERGENCY_SIGNS=
CATEGORY=fever_breathing
SYMPTOMS=fever,cough,sore_throat,loss_of_smell,fast_breathing
CONDITION=covid_19
POSSIBLE_CONDITIONS=covid_19,acute_respiratory_infection,influenza
HIGH_RISK=YES
RESOURCES=1
PAIN=6
HEART_RATE=112
RESP_RATE=
SPO2=93
END
```

An emergency patient (Prolog stops asking questions, so the block is short):

```
BEGIN
ID=2
ARRIVED=2026-10-29 14:31:10
NAME=Unknown
EMERGENCY=YES
EMERGENCY_SIGNS=unresponsive,severe_bleeding
END
```

## Fields

| Key | Example | Meaning |
|---|---|---|
| `ID` | `1` | Patient number, counts up: 1, 2, 3... |
| `ARRIVED` | `2026-10-29 14:30:05` | When the patient was saved. Use it for "first come, first served" |
| `NAME` | `Juan Dela Cruz` | `Unknown` if an emergency patient has no name yet |
| `AGE` | `45` | Years |
| `SEX` | `M` / `F` | |
| `EMERGENCY` | `YES` / `NO` | `YES` = an emergency sign was picked |
| `EMERGENCY_SIGNS` | `unresponsive,shock` | Which emergency signs |
| `CATEGORY` | `fever_breathing` | Main problem area: `fever_breathing`, `stomach_urinary`, `skin_eyes`, `heart_brain` |
| `SYMPTOMS` | `fever,cough` | Symptoms the patient has |
| `CONDITION` | `covid_19` | Best matching condition. `none` if nothing matched |
| `POSSIBLE_CONDITIONS` | `covid_19,influenza` | Up to 3 matches, best first |
| `HIGH_RISK` | `YES` / `NO` | `YES` if a dangerous symptom or dangerous condition was found |
| `RESOURCES` | `3` | How many hospital resources the condition usually needs (labs, x-ray, IV...). `0` if `CONDITION=none` |
| `PAIN` | `6` | Pain score 0-10 |
| `HEART_RATE` | `112` | Beats per minute. Empty = not measured |
| `RESP_RATE` | `24` | Breaths per minute. Empty = not measured |
| `SPO2` | `93` | Oxygen level %. Empty = not measured |

**A missing key or an empty value means "unknown".** Do not treat it as 0.
For example an emergency block has no `AGE` or `PAIN`.

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
| 1. Needs life-saving care now? | `EMERGENCY=YES` | ESI 1 |
| 2. High risk, or severe pain? | `HIGH_RISK=YES`, or `PAIN` 7 or more | ESI 2 |
| 3. How many resources? | `RESOURCES` | 0 → ESI 5, 1 → ESI 4, 2 or more → ESI 3 |
| 4. Dangerous vital signs? (only if step 3 gave ESI 3) | `HEART_RATE` > 100, `RESP_RATE` > 20, `SPO2` < 92 | ESI 2 |

If `CONDITION=none`, nothing matched, so a nurse should check the patient.
C can treat it as ESI 3 to be safe.

These limits are for adults. Children have different limits.
