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
  hospital.c/.h    the triage rules: priority, waiting queue, beds, reading the file
  triage.c         terminal program (menu) that uses hospital.c
  server.c         web server that uses hospital.c
  web/             triage board page served by server.c
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
3. Run the C side. Either one works; both use the same rules in `hospital.c`.

   **Web board** – start the C server:
   ```
   gcc c/server.c c/hospital.c -o triage-server -lws2_32
   ./triage-server
   ```
   (On Linux or Mac leave out `-lws2_32`. Another port: `./triage-server 8081`.)
   Open <http://localhost:8001/>, click **Load data/intake_records.txt**, then **Import**.

   **Terminal** – choose **2. Import patients** (press Enter for the default file):
   ```
   gcc c/triage.c c/hospital.c -o triage
   ./triage
   ```

The terminal symptom checker: `swipl prolog/conditions.pl`, then `start.`
