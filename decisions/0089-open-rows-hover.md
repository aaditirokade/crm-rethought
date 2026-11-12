# 0089 · Built in the open: rows light up under the pointer

**Date:** 2026-11-12

**Decision:** the four link rows in chapter 05, Built in the open (decision records, prompt log, research, wireframes), light up under the pointer or with keyboard focus. Each row gets the light draft wash with the violet edge down the left, like Waiting for you and the swatch tiles, with 14px corners. The row reaches a little past the rules on each side, so the text does not move. Keyboard focus also gets a violet outline.

**Why:** the author asked for a hover highlight on these links.

**Checks:** the page's tokens are already checked against the draft wash in light and dark (decisions 0083, 0084). The highlight fades in over 160ms, with no fade for anyone who asks for reduced motion.
