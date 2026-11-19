# 0122 · The portfolio map answers the pointer

**Date:** 2026-11-19

**Decision:** on Accounts, a dotted vertical line follows the pointer across the portfolio map, with a small label at its foot giving the days until renewal it marks. Hovering or focusing a bubble shows a tooltip with the numbers behind it: health, the renewal date and days to go, the 8 week usage change and the store count. The bubble under the pointer keeps its solid color and gets an ink ring.

**Why:** the map shows where accounts sit, but not the exact numbers; the line makes it easy to read across to the day axis, and the tooltip saves opening each account.

**Checks:** the tooltip also opens on keyboard focus; it is hidden from assistive tech because each bubble's link already reads the same facts aloud. Typecheck and lint pass.

**Revisit if:** the line gets in the way on touch screens (it only appears with a pointer that hovers).
