# 0033 · Slender account charts

**Date:** 2026-11-07

**Decision:** on an account page, "Who talks to whom" and "Usage and every touch, last 8 weeks" are drawn at their real size instead of being stretched to the full width, and sit side by side from 1280px up (stacked and centered below that).

- **Who talks to whom:** smaller nodes (3px), lines from 0.75px to 3.5px with round ends, a finer dash for quiet or lost relationships, and 12.5px names with 10px roles.
- **Usage and every touch:** a 1.5px usage line on lighter week rules, a shorter plot, smaller touch marks on one row, and 10px labels.

**Why:** stretched to the full width, both charts grew to about 450px tall with 22px type and 7px lines. Drawn at size, each is about 300px tall, the type matches the page, and the two read together.

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling.
