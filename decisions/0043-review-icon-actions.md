# 0043 · Icon actions on Review's tiles

**Date:** 2026-11-07

**Decision:** on Review, each tile's Approve, Edit and Dismiss are round icon buttons: a check (filled, the main action), a pencil and a cross. On hover or keyboard focus, the button's label slides out beside its icon (280ms, cubic-bezier(0.2, 0.8, 0.2, 1)) and slides back when the pointer or focus leaves.

- **Accessible name:** the label is always inside the button, so it is the name screen readers hear.
- **Touch screens:** nothing hovers, so the labels stay out.
- **Reduced motion:** the labels appear without sliding.
- **Elsewhere:** the call log, quick log and phone keep their worded buttons. There a line has room, and the words help on first use.

**Why:** with three worded buttons on every tile, the actions crowded the line they act on. Icons give the line back its space, and the label is one hover away.

**Checks:** each icon button is at least 36px square; axe clean in light and dark at 375px and 1440px.
