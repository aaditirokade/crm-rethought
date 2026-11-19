# 0128 · The brief: what changed and the open promises side by side

**Date:** 2026-11-19

**Decision:** on a meeting brief, "What changed since..." sits in the left half and "Promises still open" in the right half of the main column, from 1280px, with the side panel (In this meeting, pins, how to read) staying on the right. The other sections (Suggested agenda, Open issues...) follow full width below. Each section sits on its own surface with a line count: glass for most, a warm amber wash for the promises still owed. The side panel is on the leaves block.

**Why:** the brief was one long column of text on the bare page; the two things to know before walking in now read at a glance, together.

**Checks:** works for every brief: it pairs the first section with the promises when there are any, otherwise the first two. Text on the amber wash keeps its contrast. Typecheck, lint and tests pass.

**Revisit if:** a brief has many more changes than promises, leaving one half much taller.
