# 0025 · A walkthrough that follows the scroll

**Date:** 2026-11-06

**Decision:** on the case study home, the three recordings that sat in separate chapters (Review, Lists, Mobile) become one "How it works" walkthrough. On wide screens it pins to the screen while the page scrolls: a stepper on the left moves to the next step as you scroll, and the recording on the right switches with it. Each step can also be picked directly. Below 1024px it is a plain list, and each recording plays while it is on screen. The portfolio's Firstword case study gets the same pattern with five steps.

**Details:** each step owns a slice of the scroll (75% of the screen height); the step whose slice crosses the middle of the screen is current. Only the current recording plays, and it starts from the top when its step begins. Recordings start paused for anyone who asks for reduced motion, and a Pause button stops them for everyone else. The stepper uses ink, not violet, because violet belongs to the AI.

**Why:** three recordings in three chapters read as three separate features. One walkthrough tells them as a sequence, keeps the step and the recording side by side, and shortens the page by two chapters. The Ask recording stays in the hero.

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling.
