# 0125 · The pipeline's stage menu in the app's own style

**Date:** 2026-11-19

**Decision:** the stage field on each pipeline card ("In Qualified") is a field drawn like the cards, and choosing it opens a small panel right below it with the four stages, the current one checked in rose. It replaces the system's native menu, which opened over the card in the operating system's own style.

**Why:** the native menu jumped over the card and looked foreign next to the glass cards and pills.

**Checks:** a listbox pattern: the field says it opens a listbox and whether it is open; arrow keys move, Enter or Space picks, Escape or Tab closes, a click outside closes, and focus returns to the field. An open panel lifts its card above the cards below. Typecheck, lint and tests pass.

**Revisit if:** a stage list ever grows past what fits under a card.
