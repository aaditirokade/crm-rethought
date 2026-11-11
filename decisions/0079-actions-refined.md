# 0079 · Suggested actions, refined

**Date:** 2026-11-11

**Decision:**

- **Each suggested action row** darkens a step under the pointer, or with keyboard focus inside it, as a hover highlight. A darkening overlay only adds contrast, so every text pair stays above AA.
- **The action buttons** (Draft it, Add task, Draft invite, Open, Undo) are secondary: an outline pill in white on the indigo, all the same width (8.5rem), so they line up down the right edge.
- **Clear** is a plain underlined link with a trailing cancel mark, not a pill.

**Why:** the author asked for a hover highlight on the suggestion rows, secondary buttons of the same width, and Clear as an underlined link with a trailing cancel icon.

**Checks:** previewed on the local server: the hovered row darkens, all three buttons measure the same width, Clear shows its underline and mark; type check and lint clean.
