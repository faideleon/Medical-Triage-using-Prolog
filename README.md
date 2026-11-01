# Medical Triage (Prolog + C)

- **Prolog** – the intake web page asks the patient's symptoms, finds the likely condition and saves the patient to `data/intake_records.txt`.
- **C** – the triage. Reads that file, puts patients in a queue by priority and assigns beds.

## Folders

```
prolog/            Prolog side
  server.pl        web server (loads knowledge.pl, triage.pl, records.pl)
  knowledge.pl     conditions, symptoms, high-risk lists, triage notes
  triage.pl        rules that find the likely conditions
  records.pl       writes data/intake_records.txt
  conditions.pl    standalone terminal symptom checker
  web/             intake web page served by server.pl
c/                 C side
  triage.c         C triage program: waiting queue, priority and beds
  web/             web version of the C triage program
data/              the file Prolog writes and C reads (not in git)
docs/              file format between Prolog and C
```

## How to use

Run everything from the project root folder.

1. Start the Prolog server:
   ```
   swipl prolog/server.pl
   ```
   (Another port: `swipl prolog/server.pl 8080`.)
2. Open <http://localhost:8000/>, answer the questions, then type the patient's name and age and save.
3. Run the C program and choose **2. Import patients** (press Enter for the default file):
   ```
   gcc c/triage.c -o triage
   ./triage
   ```
   Or open `c/web/index.html` in a browser and import `data/intake_records.txt`.

The terminal symptom checker: `swipl prolog/conditions.pl`, then `start.`
