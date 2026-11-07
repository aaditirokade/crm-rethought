# 0020 · Daylight: a friendlier palette

**Date:** 2026-11-06

**Decision:** keep Canvas's structure and trust rules, and swap its colors for a warmer, friendlier set, after a reference the author shared (cream pages, periwinkle washes, soft data colors).

| Token | Before (light / dark) | After (light / dark) |
| --- | --- | --- |
| bg | warm grey #f6f4f0 / near black #141312 | cream #fffbf4 / dusk indigo #1f1e2c |
| surface-2 | #efece6 / #262421 | sand #f4efe4 / #302f43 |
| ink | #1d1b18 / #efece6 | warm cocoa #2b2620 / cream #f6f1e7 |
| accent (the AI) | violet #5b3fd9 / #b3a1ff | periwinkle indigo #4c50c9 / #aeb6ff |
| draft | #f3f0ff / #221f33 | periwinkle wash #edf1fc / #2b2f4f |
| data (new) | charts used ink-2 | #7d8be0 / #97a3f2 for sparklines, bars and the day strip |

Account health reads as a soft pastel pill (mint for healthy, butter for needs a look, blush for at risk), with the icon and words kept so color is never the only cue. The page also gets two soft glows at the top (periwinkle on the left, a little peach on the right), Ask sits on a periwinkle wash, and shadows are tinted warm brown instead of black.

**Why:** pure black text and a near black night mode made the tool feel harsh. Cream, cocoa and periwinkle read as calm and friendly while keeping the AI's color distinct from everything else.

**Checks:** every text color passes AA on bg, surface, surface-2 and draft in both modes (table at /tokens); axe clean on all prototype pages, /mobile and /tokens in light and dark.

**Revised the same day:** at night the indigo background and periwinkle charts made everything read violet. Dark mode is now a deep warm charcoal (#121211) with cream text, charts use a soft teal in both modes (#4f97a8 / #7fc4d4) so only AI material is violet, and the night page drops the violet glow. Checks repeated: AA on every background, axe clean in both modes.
