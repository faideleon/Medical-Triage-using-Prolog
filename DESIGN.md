# Design

The triage intake page is a nursing assessment sheet that fills itself in: ruled form sections on a pale form-tint ground, small uppercase field labels, dark navy ink. It is a staff tool, so it stays calm and dense; colour only appears where it means something.

## Colour

| Token | Value | Job |
|---|---|---|
| `--ground` | `#e6ecf1` | Page ground (form tint) |
| `--sheet` | `#fbfcfd` | Section and field paper |
| `--rule` / `--rule-strong` | `#c3cfda` / `#8a9db0` | Hairlines; input and button borders |
| `--ink` / `--ink-2` | `#13263a` / `#475b6e` | Text; labels and secondary text |
| `--header` | `#13263a` | Top bar, selected complaint |
| `--active` / `--active-tint` | `#0a6b6b` / `#e1f1ef` | Reserved for the live panel and its primary action only |
| `--risk` / `--risk-band` | `#b42318` / `#fbe3df` | High-risk signs and conditions only |
| `--amber` / `--amber-band` | `#8a5300` / `#fcefd2` | A condition with all signs present |

Rules: teal never appears outside the live panel. Red and amber are bands like an early-warning observation chart, never decoration. Yes/No are not coloured green/red; the tick and cross carry the answer.

## Type

Public Sans (Google Fonts), falling back to Segoe UI / system-ui. Tabular figures everywhere.

- Section labels: 11.5px, 700, uppercase, 0.08em tracking, `--ink-2`.
- Body: 15px / 1.45.
- Live symptom: 34px (28px on narrow screens), 700.
- Saved patient number: 34px, 700. Initial impression: 24px, 700.

## Components

- **Sheet**: white section, 1px `--rule` border, 3px radius, header row with label left and meta right, ruled off from the body. No shadows, no nested cards.
- **Live panel**: a sheet with a 2px `--active` border and tinted header. Shows one of four views: empty, question, record, saved.
- **Complaint row**: four segmented buttons in one ruled row; the pressed one fills with `--header`.
- **Buttons**: 40px min height (52px for Yes/No), 1px border, 3px radius. Primary is solid teal. Quiet buttons are text-only and underline on hover. Keyboard shortcuts shown as small outlined `kbd`.
- **Tables** (differential, findings): uppercase header row, 1px row rules, sticky headers inside a scroll area. The match meter is a row of small square cells, filled for each sign present.
- **Icons**: inline SVG sprite (check, x, undo, alert), 2.2 stroke, round caps.

## Layout

Desktop first: a 1440px max workspace with a main column and a 360px findings column that stays in view. Below 960px it becomes one column; below 720px the complaint row becomes 2x2 and the body-system column is hidden.

## Voice

Written for the triage nurse: "Does the patient have…", clinical terms with plain-language hints, and short triage notes. Results are an "initial impression"; the ESI level comes from the triage program, and clinical judgement takes priority.
