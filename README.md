# Medical Triage (Prolog + C)

- **Web page** – asks the patient's symptoms.
- **Prolog server** – checks the symptoms and saves the patient to `data/intake_records.txt`.
- **C** – triage. Reads that file, decides the ESI level and assigns a bed.

## How to use

1. Open a terminal in the project folder.
2. Start the Prolog server:
   ```
   swipl private/server.pl
   ```
   (Another port: `swipl private/server.pl 8080`.)
3. Open <http://localhost:8000/> and answer the questions.
4. Type the patient's name and age, then confirm. The patient is saved.
5. Run the C program to read the saved patients:
   ```
   gcc private/triage.c -o triage
   ./triage
   ```

## Folders

`private/` is the backend and `public/` is the frontend.

- `private/server.pl` – Prolog web server (loads `knowledge.pl`, `triage.pl`, `records.pl`)
- `private/conditions.pl` – standalone terminal symptom checker (`swipl private/conditions.pl`, then `start.`)
- `private/triage.c` – C triage program: waiting queue, priority and beds
- `public/` – intake web page served by the Prolog server
- `public-c/` – web version of the C triage program (open `public-c/index.html` in a browser)
- `data/` – the file Prolog writes and C reads
- `docs/` – file format details
