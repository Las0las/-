# LAWRENCE — Composer, Context Chips, Surface Hierarchy

This is the implemented design-system contract for the workbench shell. It is
one bounded interaction slice, not a general visual redesign: it fixes
workspace utilisation, background-to-surface contrast, persistent composer
behaviour, the Ask/Plan/Act/Review grammar, context chips with bounded
truncation and `+N`, context inspection, and hover/focus emphasis.

## 1. Surface hierarchy

LAWRENCE is an operating workbench, not a communication surface. Whitespace
ratios borrowed from marketing pages do not apply — density is the point.
Five tiers, each *unmistakably* different from the one above it. Not five
barely distinguishable shades of blue.

| Tier | Token | Role |
| --- | --- | --- |
| 0 | `env` | Environment. Rail and gutters. Carries no product weight. |
| 1 | `workspace` | The dominant operational surface. Owns the width it needs. |
| 2 | `surface` / `raised` | Cards, rows, inspector, composer, overlays. |
| 3 | `interactive` / `selected` | Hover, selected, dragging. |
| 4 | `edge-focus` + `authority` | Keyboard focus ring and consequential affordances. |

Defined once in [`src/lawrence/palette.js`](../src/lawrence/palette.js).
`tailwind.config.js` maps them to utilities *and* emits them as `--lw-*`
custom properties, so CSS and Tailwind can never drift apart. The same file
re-tunes the neutral ramp, which is what raises contrast across the existing
modules without rewriting several thousand class names.

Spatially:

```
| rail | PRIMARY WORKSPACE              | inspector |
       |                                |           |
       | dense useful operating area    | context   |
       |───────────────────────────────────────────|
       | persistent contextual composer             |
```

## 2. Context chips

The design rule:

> **Truncate identity, never truncate consequence.**

Identity is recoverable — the full string is always the accessible name, and
one click opens the context inspector. Consequence is operational semantics;
abbreviating it changes what the operator believes.

Implemented in [`src/lawrence/context.ts`](../src/lawrence/context.ts):

- one line, `≥32px` control height, ellipsis, full accessible name
- max width ≈ `220px` desktop, `160px` compact (follows the viewport)
- **end ellipsis** for ordinary semantic labels — `SAP Transformation Program…`
- **middle ellipsis** where the suffix carries identity —
  `candidate_resume…final.pdf`, `acct_9182…731a`
- **no truncation** for consequence: `Authorization required`, `Blocked`,
  `Due today`, `Production`, `$175/hr`, `Expires Aug 9`, `Policy denied`
- consequence chips are also never hidden behind `+N`; they pin to the front
- click → focus / inspector, `×` → detach where removable
- AI-added context prefers a readable alias (`Interview evidence`) over
  storage names or opaque ids

## 3. `+N` is an inspector, not a dropdown

Overflow opens the same inspection grammar used everywhere else: grouped by
object type, canonical value plus qualifier, individually detachable, with
`Remove all` / `Manage context` in the footer. Claude-like simplicity in the
chip row without losing LAWRENCE explainability.

## 4. Composer — the persistent interaction anchor

Docked, never floating in a void. Modes are the system's own operating
grammar, not personas:

| Mode | Meaning |
| --- | --- |
| Ask | Understand / explain / retrieve |
| Plan | Construct bounded next moves |
| Act | Propose governed consequential action |
| Review | Inspect evidence / delta / execution |

`⌘/Ctrl + 1–4` switches mode; `Enter` submits, `Shift+Enter` newlines.
Selecting **Act** visibly escalates the composer to the authority treatment
and changes the submit verb to *Propose action* — the mode changes what
submitting means, so it changes how the composer looks.

## 5. Interaction grammar

Every stage below is a real surface, not a diagram:

```
ORIENT      rail
FIND        sticky toolbar
FOCUS       row selection (tier 3 + authority edge)
UNDERSTAND  persistent inspector
COMPOSE     docked composer
AUTHORIZE   explicit confirmation, Act only
EXECUTE     receipt
OBSERVE     activity log
RESUME      focus and context survive the round trip
```

The persistent inspector is preferable for ordinary object exploration;
overlays and modals are reserved for bounded high-focus operations. Clicking a
candidate's name focuses it in the inspector without losing the surrounding
list; the eye action still opens the full profile drawer.

## Scope and limits

- No model is wired to the composer in this build. Non-consequential modes
  land in the activity log as `Queued`; `Act` stops at `Authorization
  required` until explicitly authorised, and only then emits a receipt.
  Nothing here fabricates an answer.
- Seeded operating context (mission, job, account, evidence, file, rate floor)
  exists so the chip rules are exercised against real shapes, in the same
  spirit as the module's seeded candidates and jobs.
- Rail sections other than Candidates are rendered inert — visible orientation,
  no dead ends, no pretend modules.
- Below `1024px` the inspector becomes an overlay reached from the right-edge
  tab, and chips drop to the compact width budget.
