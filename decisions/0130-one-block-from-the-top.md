# 0130 · One block from the top

**Date:** 2026-11-19

**Decision:** Today's greeting block and every page's title block reach up behind the top bar, so the Groundwork logo, the "Concept prototype · sample data" line and the way back to the case study sit on the same leaves block as the title. The bar's content lines up with the title inside the block. Titles move up by about 55px, and the title blocks are a little shorter at the bottom, so more of each page shows above the fold.

**Why:** the bar sat alone on the page above a separate block, which spent height on two gaps.

**Checks:** measured on every page in light and dark: the block starts 8px from the top, the logo sits inside it, and the logo and the title share one left edge. The phone app is unchanged. Typecheck, lint and tests pass.

**Revisit if:** the bar needs to stay visible while scrolling; it would then need its own surface again.
