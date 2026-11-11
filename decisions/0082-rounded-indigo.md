# 0082 · Every indigo block is rounded

**Date:** 2026-11-11

**Decision:** the other indigo backgrounds get rounded corners like Ask's box: Waiting for you and the Lists section at 20px; every card in Review's rows (so a card keeps its shape when it lights up under the pointer) and the pipeline's Idea cards at 14px. Lists drops its violet rule down the left edge, which a rounded corner would bend.

**Why:** the author asked for the rest of the dark indigo backgrounds to have rounded corners too.

**Checks:** CSS only; the corners follow the same radii as Ask's box and the pipeline cards.
