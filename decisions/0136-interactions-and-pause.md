# 0136 · Interactions in color, and the Pause button off the phone

**Date:** 2026-11-19

**Decision:**
- The Interactions list on the account record runs in two columns when there is room, and each entry carries its family's color: periwinkle for calls and video, green for in person and events, lavender for email, amber for tickets. A firm left edge and a faint wash of the same color; the type word stays, so color is never the only cue.
- On the phone recordings in the case study, the Play and Pause button sits under the silver phone instead of over the tab bar. It moved out of the recording's frame in the code, so the frame's overflow cannot clip it.
- The phone loop recording was tightened from 19 to about 15 seconds.

**Why:** the interactions were a run of identical white cards; the colors let a scan read the mix of touches at a glance, and two columns halve the scrolling. The Pause button covered the app's own tab bar on the phone clips.

**Checks:** ink on every wash passes AA in both themes; the colors follow the chart families (decision 0119). The left edge survives the flat pass deliberately: it is a marker, not an elevation. Typecheck, lint and the build pass.

**Revisit if:** interaction types grow past these four families.
