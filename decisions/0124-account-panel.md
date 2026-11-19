# 0124 · A bubble on the map opens the account in a side panel

**Date:** 2026-11-19

**Decision:** on Accounts, picking a bubble on the portfolio map opens the account in a side panel over the page: health, renewal, the 8 week usage change, last touch, stores, the next step, lines waiting for approval, people, opportunities and the latest interactions, with "Open the full record" at the foot. Escape, the close button or a click outside closes it, and the map is where you left it. A click that asks for a new tab still opens the full record. The full record page gets a clear "All accounts" button at the top.

**The panel's head (same day):** the name, health and numbers sit on a night periwinkle block with the leaves, its lower edge an S that blends into the panel (rounding off on the left, running on down the right edge); renewal, usage, last touch and stores sit in one row of small frosted tiles, and the next step moved below, so the head is short.

**Options:** a back link on the record page alone; or the panel. The author preferred the panel.

**Why:** from the record there was no obvious way back, and most of the time a seller only needs the account at a glance while comparing it with the others on the map.

**Checks:** the panel is a modal dialog labelled by the account's name; focus returns to the bubble on close. Typecheck, lint and tests pass.

**Revisit if:** people open the full record from the panel nearly every time; then the bubble should go straight there.
