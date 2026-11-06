# 0010 · Visual direction: Signal

**Date:** 2026-11-06

**Decision:** build on Signal, a dense, precise work tool look: IBM Plex Sans and Plex Mono, cool grays, one electric blue. Two changes from the [/directions](https://crm-rethought.vercel.app/directions) preview: the base size rises from 13px to 14px, and the mono source chip becomes the signature element. Tokens: [design/tokens.md](../design/tokens.md), live at [/tokens](https://crm-rethought.vercel.app/tokens).

**Options considered:** Ledger (calm, editorial, deep green, italic drafts) · Signal (dense, technical, DRAFT tags) · Margin note (warm, clay, sticky note drafts).

**Why:**
- **The tool:** account teams keep a CRM open all day and scan many lines between calls; density helps. Mono for sources, times and status makes "a source on every line" look like what it is: fact from the system.
- **Accessibility:** the DRAFT tag is a word, so it reaches screen readers and people with low vision. Ledger relied on italics and Margin note on a tint.
- **The audience:** the target employers (data dense SaaS, fintech, enterprise tools) build dense, precise products. Signal looks like it belongs in theirs. Margin note's clay accent also sat too close to the warning colors a risk flag needs.
- **Range:** the Firstword case study already shows a calm, editorial side.

**Risk:** Signal is the most familiar look of the three. What makes it distinct is the trust layer's details (draft to approved, source chips, gates), not the palette.

**Revisit if:** usability testing shows 14px is too dense for long logs, or drafts and approved lines are confused.
