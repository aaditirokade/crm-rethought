# 0080 · Ask without a box

**Date:** 2026-11-11

**Decision:**

- **Ask loses its box:** no edge, rounded corners or shadow. The indigo becomes a color block on a layer behind the content that runs 2rem past it on every side and fades into the page over that 2rem, so there is no edge to read as a box. All text sits inside the fully colored area, so the contrast pairs of decisions 0076 and 0077 still hold. Open, the block keeps its gradual lightening toward the bottom.
- **Suggested action rows lighten** under the pointer (white at 8% over the indigo) instead of darkening. The hovered row's tokens move a step lighter so it still passes AA on the lightest point: secondary text 4.9:1, violet 4.6:1, status 4.6:1 or more, rules 3.7:1.
- **The suggestion pills are shorter:** 1.75rem tall, 0.8125rem text.

**Why:** the author asked for a lighter hover, smaller pills, and no bounding box around Ask: a color block that disappears into the page at its edges.

**Checks:** previewed on the local server, closed and with an answer open, with a row hovered; contrast computed for every hovered pair.
