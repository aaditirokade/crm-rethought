# 0095 · Research: the coverage bars fill from left to right

**Date:** 2026-11-12

**Decision:** in 02 · Research, the six coverage bars fill slowly from left to right, one row after another, the first time the chart scrolls into view (2.2 seconds a bar, a quarter second apart). The bars are hidden only when script runs, so without it the chart shows complete, and anyone who asks for reduced motion sees it complete and still. The numbers and the table for screen readers do not change.

**Why:** the author asked for an opening animation on the chart.

**Checks:** the chart's colors and labels are unchanged; the animation only reveals.
