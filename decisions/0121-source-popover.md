# 0121 · Sources open in a popover, not a drawer

**Date:** 2026-11-19

**Decision:** a source chip (CALL 12:05, EMAIL Nov 3...) opens a small popover beside it instead of a full height side drawer. The popover is as wide as its content needs, up to 22rem, with an arrow pointing at the chip; it sits below the chip, or above when there is no room, and follows it on scroll. It closes with Escape, a click outside or Close.

**Why:** a source is a quick check (who said it, the exact words). A drawer covered half the screen for two lines of text and pulled the eye away from the line being approved.

**Checks:** the chip says it opens a dialog and whether it is open; focus moves into the popover when it opens and back to the chip when it closes. Same everywhere a chip appears. Typecheck, lint and tests pass.

**Revisit if:** a source ever needs more than a short excerpt (a whole email thread); that would want the drawer back, for that kind only.
