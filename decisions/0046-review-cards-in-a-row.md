# 0046 · Review's cards in a row that scrolls sideways

**Date:** 2026-11-07

**Decision:** on Review, each group ("Fernhill Outfitters · Quarterly review", "Spotted by AI · opportunities") shows its cards in one row that scrolls sideways, instead of a grid that grows down the page.

- **Cards:** up to 21rem wide each, all the same height, and they snap into place as the row scrolls.
- **Moving through:** a count ("9 cards") and two arrow buttons sit above the row. Each arrow moves about a screenful, and is disabled at its end. A trackpad, touch, or Shift with the wheel scrolls the row directly, and Tab moves through each card's buttons.
- **Edges:** an edge fades out while more cards wait past it.
- **Short groups:** a group that fits on screen shows no arrows.
- **Reduced motion:** the arrows jump instead of gliding.

I chose this over a stack that fans out on hover. A stack hides cards behind each other, and hover doesn't exist on touch or for keyboard users. The row keeps every card reachable and shows what's left at a glance.

**Why:** the longest group pushed every other group several screens down the page. One row per group keeps all of them in view.

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling of the page itself.
