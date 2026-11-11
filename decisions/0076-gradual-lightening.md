# 0076 · Ask lightens gradually, with no jump

**Date:** 2026-11-11

**Decision:** decision 0075's light answer area goes; it switched from indigo to lavender in about a line, which read as a jump. Instead, with an answer open, the whole Ask box is one vertical gradient from deep indigo (#2a2878) at the top to a lighter indigo (#5550c8) at the bottom, stretched over the box's full height, so it lightens a little more as the answer grows. A soft glow stays in the top left corner. The larger figures from 0075 stay.

The gradient stops at #5550c8 rather than near white: light text would fail AA below that, and switching to dark text partway down needs exactly the hard edge this replaces. On the lightest point the box's tokens give white 6.2:1, secondary text #f1f0fd 5.5:1, violet #e6e8ff 5.2:1, the status colors 4.5:1 or more and control rules #c3c5ec 3.7:1. The box uses these tokens open or closed.

**Why:** the author asked for no sudden jump: the box should lighten toward the bottom very gradually as the panel extends.

**Checks:** previewed on the local server with the Fernhill answer open; contrast computed for every pair on the lightest point.
