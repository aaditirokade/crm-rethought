# 0044 · The dock as circles

**Date:** 2026-11-07

**Decision:** the prototype's dock is slimmer. Each main tab is its icon in a 40px circle: outlined in the control border color, filled with ink when it is the current tab, and washed on hover. On the side panel (1024px and up), a thin dotted line joins each circle to the next. The step words under the icons (PREP, KNOW, PURSUE, DECIDE, IMPORT) are gone. Each tab's name and status still show in its tooltip on hover or keyboard focus, and are still read out by screen readers. On the phone's bottom bar the circles are 36px with a little space between them, so the bar fits a 375px screen with room to spare.

**Why:** with a rounded square, a word under each icon and a solid line between them, the side panel was the heaviest thing on the screen. Circles and a dotted line keep the sequence readable at a third of the weight.

**Checks:** the outlines pass 3:1; axe clean in light and dark at 375px and 1440px; no sideways scrolling.
