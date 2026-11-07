# 0036 · The walkthrough without its own stepper

**Date:** 2026-11-07

**Decision:** "How it works" on the case study home is no longer pinned with a stepper of its own. Its three recordings run one after another on every screen size, each with a dotted title and a line of text above it, the same way the Firstword case study shows its recordings. Each recording plays while it is on screen, and the Pause button sits under the introduction. The chapter timeline beside the case study is now the only stepper on the page.

**Why:** with the chapter timeline on the left, the pinned walkthrough put a stepper inside a stepper. Two sets of dots tracking the same scroll competed with each other, and the pinned section held the page in place for three screens.

**Supersedes:** the pinned walkthrough in [0025](0025-scroll-walkthrough.md).

**Checks:** the timeline marks How it works while it is on screen; axe clean in light and dark at 375px and 1440px; no sideways scrolling.
