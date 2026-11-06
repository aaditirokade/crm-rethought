# Tokens · Canvas

**As of:** 2026-11-06 · [Decision 0017](../decisions/0017-canvas.md) (replaces Signal, [decision 0010](../decisions/0010-visual-direction-signal.md)) · Live with computed contrast at [/tokens](https://crm-rethought.vercel.app/tokens) · Source: [app/globals.css](../app/globals.css), [content/tokens.ts](../content/tokens.ts)

## Principles

1. **Space, not boxes.** Sections are grouped by space and type on one canvas. Only things you act on lift off the page.
2. **The AI has a material.** Anything the AI drafted carries a soft violet tint and edge. Approval turns it into plain ink, stamped with who and when.
3. **Ink means decide.** Approve and other decisions are solid ink buttons. Violet belongs to the AI; ink belongs to the person.
4. **Never color alone.** Every status pairs color with a word.

## Color

| Token | Role | Light | Dark | Lowest contrast (light / dark) |
| --- | --- | --- | --- | --- |
| bg | The canvas | #f6f4f0 | #141312 | |
| surface | Cards you act on | #ffffff | #1d1c1a | |
| surface-2 | Chips, inputs, inner groups | #efece6 | #262421 | |
| draft | Behind lines the AI drafted | #f3f0ff | #221f33 | |
| ink | Text; primary buttons | #1d1b18 | #efece6 | 14.6 / 13.1 |
| ink-2 | Quiet text, labels | #5c5850 | #aca69b | 6.0 / 6.4 |
| accent | The AI: drafts, Ask, waiting counts | #5b3fd9 | #b3a1ff | 5.6 / 7.0 |
| accent-ink | Text on the accent | #ffffff | #16132b | 6.6 / 8.1 |
| good | Approved, healthy | #1d7348 | #6fd3a0 | 4.9 / 8.5 |
| warn | Needs a look | #8a5a00 | #f0c062 | 5.0 / 9.2 |
| risk | At risk, overdue | #b8352b | #ff8d82 | 5.0 / 6.9 |
| line-strong | Control borders (3:1) | #8c867c | #7a7469 | 3.1 / 3.3 |
| line | Hairlines, rare | #e9e5de | #2b2926 | |

## Type

Geist, loaded with `next/font`. One face for everything; labels use tabular figures.

| Step | Size / line height | Weight |
| --- | --- | --- |
| h1 | 34 / 40 | 600, tracking −2% |
| h2 | 22 / 30 | 600 |
| h3 | 17 / 24 | 600 |
| body | 15 / 24 | 400 |
| small | 13.5 / 21 | 400 |
| label | 12 / 18 | 500, tabular |

## Space, shape, depth

A 4px grid. Pills for controls and chips; 12 to 20px corners for cards. Two soft shadows: `--shadow` for cards, `--shadow-lift` for the dock, drawers and highlighted items.

## Signature components

`.sig-source` (source chip: a soft pill) · `.sig-draft-tag` (violet pill with a dot) · `.sig-approved-tag` · `.sig-row-draft` (violet tint and edge) · `.sig-btn` and `.sig-btn-primary` (ink pill). All in `app/globals.css`.
