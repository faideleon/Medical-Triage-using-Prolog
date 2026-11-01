---
version: 1
slug: "prolog-web-index-html"
primary_target: "prolog/web/index.html"
related_targets: ["prolog/web/app.js"]
---

# Triage intake page

Scope: prolog/web/index.html + prolog/web/app.js. Mode: Operate. Desktop at ED intake desk, mouse + keyboard.
Job: triage nurse asks yes/no symptom questions, sees remaining differential and high-risk findings, enters name/age, saves the patient for the C ESI program.
Constraints: static HTML/CSS/JS, Prolog API unchanged in shape, working impression only (no ESI decision).

## Direction contract

THESIS: The screen is a printed nursing assessment sheet that fills itself in; it refuses the consumer symptom-checker look (big friendly cards, "you" voice, green YES / red NO).

OWN-WORLD: Pale blue-grey form-tint ground, white boxed fields ruled in thin ink-blue hairlines, small uppercase field labels, dark navy ink text, tabular figures. One reserved ink (deep teal) marks only the active question. Escalation red and amber bands come from early-warning observation charts and appear only on high-risk findings.

STORY: The nurse knows at a glance which question is live, what has been recorded, which conditions remain, and whether anything is high risk; saves in one form step.

FIRST VIEWPORT: Top bar (title, connection status). Left 2/3: complaint selector row, then the live question box with Yes (Y) / No (N) and Undo (U). Right 1/3: findings sheet as a Y/N tick grid. Bottom of left: differential table with match counts. Save form opens as an inline panel replacing the question box when questioning ends.

FORM: Assessment sheet, candidate 4 of 7. seed:84a601eff06bcadc. Raises: from orienteering map, one reserved ink for the active item only; from Japanese high-density web, ruled dense modules instead of padded cards.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
