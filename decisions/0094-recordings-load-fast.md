# 0094 · The case study's recordings load without a black box

**Date:** 2026-11-12

**Decision:** the hero recording shows its still straight away. Both stills (light and dark) are in the first HTML, and the page's theme, set before the first paint, shows the right one; the hero's still loads first (eager, high fetch priority). The video sits on top, hidden until it has a frame to show, then fades in, and it starts playing as soon as the page knows motion is welcome. The problem reel ("CRMs are built for reporting") waits until it scrolls into view and starts from its first beat there, instead of having played out unseen below the fold; it waits again while off screen.

**Why:** the author saw a black box while the hero loaded, and the problem reel seemed slow to start.

**Checks:** without script the stills show; with reduced motion the video stays on its still until Play.

**Follow up (same day):** the rule that hides a video until it has a frame applied to every recording on the page, but only the hero marked its video ready, so the three walkthrough recordings in 03 · How it works showed as empty boxes. They now load the same way as the hero: their stills show at once and each video fades in over its still.
