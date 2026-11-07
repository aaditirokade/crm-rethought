# 0037 · Walkthrough rows: text beside the recording

**Date:** 2026-11-07

**Decision:** on screens 1024px and wider, each step of "How it works" is a row like the chapters around it: the text on the left (5 of 12 columns) and the recording on the right (7 of 12), centered on each other. The first row's text also carries the introduction ("Recorded from the working prototype, in three steps.") and the Pause button. The steps are now a run of headed rows instead of a list, so the introduction sits naturally with the first one. Below 1024px the text stays above each recording.

**Why:** with the text above, each recording pushed its step's words off screen. Side by side, the words and the recording read together, and the section matches the chapters' split.

**Builds on:** [0036](0036-walkthrough-without-its-own-stepper.md).

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling.
