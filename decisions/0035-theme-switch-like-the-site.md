# 0035 · The theme switch matches the portfolio site

**Date:** 2026-11-07

**Decision:** on the case study home, the "Dark mode" / "Light mode" pill in the header becomes the same switch as on aaditirokade.com: a 36px round button pinned to the bottom right corner, with a filled crescent moon in light mode and a sun in dark mode. It shows where a click leads, not the current mode. Like the site's, it grows a little on hover or keyboard focus, presses in when clicked, and has a soft shadow. Colors come from Groundwork's own tokens, so it sits in both themes. With reduced motion it doesn't move.

**Why:** the case study is reached from the portfolio, and the same control should look and sit in the same place on both.

**Checks:** switching works both ways and its label follows ("Switch to dark mode" / "Switch to light mode"); axe clean in light and dark at 375px and 1440px; no sideways scrolling.
