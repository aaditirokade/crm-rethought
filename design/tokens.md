# Tokens · Signal

**As of:** 2026-11-06 · Phase 3 · [Decision 0010](../decisions/0010-visual-direction-signal.md) · Live with computed contrast at [/tokens](https://crm-rethought.vercel.app/tokens) · Source: [app/globals.css](../app/globals.css), [content/tokens.ts](../content/tokens.ts)

## Principles

1. **Mono is the machine.** Sources, times, status and AI tags are set in Plex Mono. What people say and decide is set in Plex Sans.
2. **One accent, one action.** The accent marks the single primary action on a view, and the DRAFT tag. Nothing else.
3. **Drafts look unfinished.** A line the AI drafted sits on a tint with a DRAFT tag. Approval removes both and stamps who and when.
4. **Never color alone.** Every status pairs color with a word.

## Color

| Token | Role | Light | Dark | Lowest contrast (light / dark) |
| --- | --- | --- | --- | --- |
| bg | Page background | #f4f5f7 | #0d0f13 | |
| surface | Cards, panels, controls | #ffffff | #151820 | |
| surface-2 | Hover, sunken areas, gates | #eceef2 | #1c2029 | |
| draft | Behind lines the AI drafted | #eef2ff | #182038 | |
| ink | Text people read | #111318 | #e8eaf0 | 16.0 / 13.4 |
| ink-2 | Quiet text, metadata | #535866 | #9aa1b0 | 6.1 / 6.2 |
| accent | Primary action, DRAFT tag | #2853f0 | #7d9bff | 5.0 / 6.2 |
| accent-ink | Label on the accent | #ffffff | #0b1020 | 5.9 / 7.2 |
| good | Approved, healthy | #17784a | #5fd39b | 4.7 / 8.7 |
| warn | Needs a look | #8a5a00 | #f2c062 | 5.1 / 9.6 |
| risk | At risk, overdue | #c0362c | #ff8a80 | 4.7 / 7.1 |
| line-strong | Control borders (3:1) | #7f8594 | #687080 | 3.2 / 3.3 |
| line | Dividers, decorative | #dde0e6 | #262a34 | |

Text ratios are the lowest across bg, surface, surface-2 and draft.

## Type

IBM Plex Sans and IBM Plex Mono, loaded with `next/font`.

| Step | Size / line height | Font |
| --- | --- | --- |
| h1 | 28 / 36 | Sans 600 |
| h2 | 20 / 28 | Sans 600 |
| h3 | 16 / 24 | Sans 600 |
| body | 14 / 22 | Sans 400 |
| small | 13 / 20 | Sans 400 |
| meta | 12 / 16 | Mono 400 |

## Space and shape

A 4px grid (4, 8, 12, 16, 24, 32, 48). Corners: 4px on controls, 6px on cards. No shadows; borders do the work.

## Signature components

`.sig-source` (source chip: mono, kind in caps, then date or moment) · `.sig-draft-tag` · `.sig-approved-tag` · `.sig-row-draft` · `.sig-btn` and `.sig-btn-primary`. All in `app/globals.css`.
