# Medical Triage (Prolog + C)

- **Prolog** – symptom checker. Asks the questions and saves the patient to `data/intake_records.txt`.
- **C** – triage. Reads that file, decides the ESI level and assigns a bed.

## How to use

1. Open a terminal in the project folder.
2. Start Prolog:
   ```
   swipl private/intake.pl
   ```
3. Type `start.` and answer the questions.
4. Run the C program to read the saved patients.

## Web page (optional)

```
swipl -q -s private/server.pl -g "start_server(8000), thread_get_message(_)" -t halt
```

Then open <http://localhost:8000/>.

## Folders

- `private/` – Prolog code
- `public/` – web page
- `data/` – the file Prolog writes and C reads
- `docs/` – file format details
