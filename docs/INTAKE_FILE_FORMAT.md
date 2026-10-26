# Intake file format (Prolog → C)

This file is the agreement between the two programs. The Prolog symptom checker
**writes** it, and the C triage program **reads** it.

- Default location: `data/intake_records.txt` (in this project).
  Set the `TRIAGE_FILE` environment variable to use a different path, for example
  a folder both programs can reach.
- Encoding: UTF-8, one `KEY=value` per line.
- Prolog only **appends**. It never edits or deletes old records.
  The C program should remember which `ID`s it has already processed
  instead of deleting lines from the file.

## One patient = one block

```
BEGIN
ID=P20261026-003
DATE=2026-10-26
TIME=14:30:05
ARRIVED=2026-10-26 14:27:40
NAME=Juan Dela Cruz
AGE=45
SEX=M
EMERGENCY=NO
EMERGENCY_SIGNS=
CATEGORY=fever_breathing
SYMPTOMS_YES=fever,cough,phlegm,shortness_of_breath,chest_pain
SYMPTOMS_NO=runny_nose,sore_throat,fast_breathing
CONFUSED=NO
PAIN=6
HEART_RATE=112
RESP_RATE=24
SPO2=93
TEMP_C=38.6
SYSTOLIC_BP=
HIGH_RISK=YES
HIGH_RISK_REASONS=shortness_of_breath,chest_pain,pneumonia
LIKELY_CONDITIONS=pneumonia:5/5,acute_respiratory_infection:2/3,influenza:2/3
RESOURCES=labs,xray,iv_medication
RESOURCE_COUNT=3
END
```

### Reading tips for C

- Read line by line with `fgets`. Start a new patient on `BEGIN`, finish it on `END`.
- Split each line at the **first** `=` only (`strchr(line, '=')`).
  The value can contain spaces or commas (for example a name).
- An **empty value** means "not known / not measured". Do not treat it as 0.
- Lists are comma-separated with no spaces. Split them with `strtok(value, ",")`.
- Strip the trailing `\n` (and `\r` on Windows) from each line.

## Fields

| Key | Values | Meaning |
|---|---|---|
| `ID` | `P<yyyymmdd>-<nnn>` | Patient number, counts up each day |
| `DATE`, `TIME` | `2026-10-26`, `14:30:05` | When the nurse saved the record |
| `ARRIVED` | `2026-10-26 14:27:40` | When the nurse started the intake (`?- start.`). The C program can measure waiting time from here |
| `NAME` | text | Patient name. `Unknown` for an unidentified emergency arrival |
| `AGE` | 0–130, may be empty | Years. Only an emergency arrival can have it empty |
| `SEX` | `M` / `F` / `U` | `U` = unknown |
| `EMERGENCY` | `YES` / `NO` | `YES` = an emergency sign was ticked. **All other medical fields are empty.** |
| `EMERGENCY_SIGNS` | list | Which signs, see below |
| `CATEGORY` | `fever_breathing`, `stomach_urinary`, `skin_eyes`, `heart_brain`, `unknown` | Body area of the best matching condition. Useful for choosing a section |
| `SYMPTOMS_YES` / `SYMPTOMS_NO` | list | Symptoms the patient confirmed / denied |
| `CONFUSED` | `YES` / `NO` | Confused, very sleepy or not making sense |
| `PAIN` | 0–10 | Pain score |
| `HEART_RATE` | /min, may be empty | |
| `RESP_RATE` | /min, may be empty | |
| `SPO2` | %, may be empty | |
| `TEMP_C` | °C, may be empty | |
| `SYSTOLIC_BP` | mmHg, may be empty | |
| `HIGH_RISK` | `YES` / `NO` | Prolog thinks the patient should not wait |
| `HIGH_RISK_REASONS` | list | High-risk symptoms or conditions, plus `confused_or_drowsy` and `severe_pain` (pain ≥ 7) |
| `LIKELY_CONDITIONS` | list of `name:matched/total` | Best 3 matches, best first |
| `RESOURCES` | list | Resources the best match usually needs |
| `RESOURCE_COUNT` | number, may be empty | How many resource types are in `RESOURCES`. Empty when no condition matched (unknown – treat as needing a nurse's judgement) |

Emergency signs: `not_breathing`, `unresponsive`, `severe_breathing`,
`active_seizure`, `severe_bleeding`, `allergic_reaction`, `shock`, `major_trauma`.

Resource types: `labs`, `ecg`, `xray`, `imaging` (CT/MRI/ultrasound), `iv_fluids`,
`iv_medication` (IV, IM or nebulized), `specialist_consult`, `simple_procedure`,
`complex_procedure`.

## How the C program can use this for ESI

The Emergency Severity Index (ESI) has 5 levels. Prolog gives the inputs,
C makes the final decision:

| ESI question | Field(s) to use | Result |
|---|---|---|
| A. Needs life-saving care now? | `EMERGENCY=YES` | ESI 1 |
| B. High-risk, confused, or severe pain? | `HIGH_RISK=YES` | ESI 2 |
| C. How many resources? | `RESOURCE_COUNT` | 0 → ESI 5, 1 → ESI 4, 2+ → ESI 3 |
| D. Danger-zone vital signs? (only when C gave ESI 3) | `HEART_RATE`, `RESP_RATE`, `SPO2`, `AGE` | consider ESI 2 |

Common adult danger-zone limits: heart rate > 100, breathing rate > 20,
SpO₂ < 92%. Children have different limits by age.
Check the exact thresholds with the hospital's clinical staff.
