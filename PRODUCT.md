# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Triage nurses at a hospital emergency department intake desk. The nurse asks the arriving patient about symptoms, records yes/no answers, enters the patient's name and age, and saves the patient to the triage queue. Patients do not operate the page.

## Product Purpose

A symptom-based intake tool for emergency triage. A Prolog knowledge base narrows the possible conditions as answers come in, and on save writes an intake record (symptoms, working impression, high-risk flag, expected resource count) to `data/intake_records.txt`. A separate C program reads that file, assigns the ESI level and a bed.

Success: the nurse completes an intake quickly and accurately, and high-risk patients are never missed.

## Operating Context

- Desktop computer at the intake desk, mouse and keyboard, wide screen.
- Busy ED environment; interruptions are common, so the current state must be readable at a glance.
- The page is served by the local Prolog server (`swipl prolog/server.pl`, http://localhost:8000/).

## Capabilities and Constraints

- Plain static HTML/CSS/JS in `prolog/web/`, no build step, no framework.
- APIs: `POST /api/triage` (remaining candidate conditions), `POST /api/save` (save patient, returns patient number).
- Prolog gives a working impression only; it does not assign the ESI level. The C program does.
- Knowledge base content is a school project starting point and must be reviewed by clinicians before real use.

## Product Principles

1. Staff tool, not patient advice: wording is clinical and addressed to the nurse.
2. Never hide risk: high-risk findings are visible as soon as they are answered.
3. The system suggests, the clinician decides: results are a working impression, not a diagnosis.
4. Speed at the desk: keyboard-friendly, minimal steps, current question always obvious.
