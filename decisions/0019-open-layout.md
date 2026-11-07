# 0019 · Open layout: the page is the surface

**Date:** 2026-11-06

**Decision:** stop drawing a card around every section. Content runs the full width of the screen with fixed outer gutters (20px on phones, 32px on desktop, plus room for the dock), and sections are divided by full rules, the way an editorial page is set. Two surfaces stay: Ask, where the AI speaks, and triage, where a person decides. AI drafts keep their violet material.

| Before | After |
| --- | --- |
| Content capped at 1760px | No cap; fixed gutters at every width |
| Every section in a lifted card | Sections sit on the page under a rule |
| Tiles lift on hover | A darker rule draws across the top of a row on hover or focus |
| Ask highlights a tile with a ring | A violet rule draws across the account Ask is talking about |
| Meetings on the day strip in boxes | Meetings hang from the timeline on a thin rule |
| Page title 34px | Page title grows with the screen, 34px to 64px |

**Why:** the author found the app boxed up next to editorial portfolio sites that use the whole width. Boxes inside boxes made every section look equally important; rules and space let the type and the data lead, and leave the remaining surfaces (Ask, triage, drafts) clearly special.

**Checks:** no sideways scrolling from 375px to 1920px; axe clean on all eight prototype pages; hover and Ask motion off under reduced motion.
