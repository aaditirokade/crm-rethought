# 0082 · Every indigo block is rounded

**Date:** 2026-11-11

**Decision:** the other indigo backgrounds get rounded corners like Ask's box: Waiting for you and the Lists section at 20px; Review's cards on the indigo (the cards Spotted by AI and a card under the pointer) and the pipeline's Idea cards at 14px. Lists drops its violet rule down the left edge, which a rounded corner would bend. Review's other draft cards keep their square corners until they light up.

**Why:** the author asked for the rest of the dark indigo backgrounds to have rounded corners too.

**Checks:** CSS only; the corners follow the same radii as Ask's box and the pipeline cards.
