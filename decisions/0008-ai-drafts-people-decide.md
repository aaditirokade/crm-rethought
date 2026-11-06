# 0008 · AI drafts; people decide

**Date:** 2026-11-06

**Decision:** the AI may read and draft anything, and may save or send nothing on its own. Every write to the shared record is approved by a person, one line at a time. Merges, owner changes, customer email and "at risk" messages to customers stay with people. Full map in [design/where-ai-belongs.md](../design/where-ai-belongs.md).

**Options considered:** automatic updates with an undo · approval as a setting (on or off) · approval on every write, by design.

**Why:**
- All five SIMULATED interviews made trust conditional on seeing why and approving (P2).
- The [competitive analysis](../research/competitive-analysis.md) found approval is rare and usually optional; making it the design is the clearest difference.
- One line at a time keeps approval fast: a person approves what they agree with and leaves the rest.

**Revisit if:** usability testing shows approval becomes a chore people click through without reading.
