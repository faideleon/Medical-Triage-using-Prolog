# Medical Triage (Prolog + C)

- **Web page** – asks the patient's symptoms.
- **Prolog server** – checks the symptoms and saves the patient to `data/intake_records.txt`.
- **C** – triage. Reads that file, decides the ESI level and assigns a bed.

## How to use

1. Open a terminal in the project folder.
2. Start the Prolog server:
   ```
   swipl -q -s private/server.pl -g "start_server(8000), thread_get_message(_)" -t halt
   ```
3. Open <http://localhost:8000/> and answer the questions.
4. Type the patient's name and age, then confirm. The patient is saved.
5. Run the C program to read the saved patients.

## Folders

- `private/` – Prolog code (server and rules)
- `public/` – web page
- `data/` – the file Prolog writes and C reads
- `docs/` – file format details
