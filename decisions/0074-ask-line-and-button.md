# 0074 · Ask's field is a line, and Ask is a real button

**Date:** 2026-11-11

**Decision:**

- **Ask's query field** loses its light fill (decision 0066) and becomes a line like every other field (decision 0072): white text on the indigo over a bottom line in the control color, which turns white under the pointer and with focus. Text and placeholder are 5.7:1 or more on the glow, the line 3.1:1.
- **The Ask button** is the primary action, not a link with an arrow: a white pill with indigo text (11.4:1; 9.6:1 on hover) and the arrow inside it. Until a question is typed it shows at half strength, as disabled. With keyboard focus it gets a white ring.
- **On the phone,** the Ask entry on Next up is a line as well.

**Why:** the author asked for no bounding box on any field, search included, and for Ask to be a primary button.

**Checks:** previewed on the local server in light and dark, empty and with a question typed; contrast computed for every pair above.
