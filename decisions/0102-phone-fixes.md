# 0102 · Checked on phones, and fixed

**Date:** 2026-11-12

**Decision:** the case study, every prototype screen and the phone app were checked at 375 and 320 pixels wide. What changed:

- **A grid with no column count** can no longer grow past a phone's edge: it gets one column that may shrink below its widest content (a rule in the base layer, so every grid-cols utility still wins).
- **Ask's field and its Ask button share one line** on a phone instead of the button dropping below the field.
- **The relationship web and the usage chart** on an account keep a readable width and scroll sideways on a phone, instead of shrinking their labels to about 7 pixels.
- **The sparkline's last point** on Account pulse stays a circle when the tile stretches it; it used to turn into a dash.

**Why:** the author asked for every page to work on a phone.

**Checks:** no page scrolls sideways at 375 or 320 pixels; desktop layouts unchanged.
