# 0055 · The two case studies line up

**Date:** 2026-11-07

**Decision:** the Groundwork case study now uses the same frame as Firstword's, so switching between them with the tabs moves nothing at the top of the page.

- **Container:** the page sits in the same centered container as Firstword: 72rem wide, 80rem from 1280px, with 1.5rem side padding. It used to run the full width with its own side padding.
- **Top of the page:**
  - The nav lines up with that container at rest, with the same line height for AR.
  - The tabs start 7rem down and have 2.5rem below them.
- **Title block, the same type and spacing as Firstword:**
  - The line above the title is "Concept case study · 2026" in 14px sentence case, instead of small capitals.
  - The title keeps normal letter spacing.
  - The facts row uses 14px text.
- **Top aligned:** the text column starts at the top on both pages, and each visual aligns on its own, so a taller or shorter visual can't push the title around.

**Why:** the nav, tabs and title shifted when switching between the two case studies.

**Checks:** at 375px, 1200px and 1440px, AR, the tabs, the line above the title, the title and the line under it sit at the same position on both pages; axe clean in light and dark; no sideways scrolling.
