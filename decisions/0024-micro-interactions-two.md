# 0024 · Micro interactions, round two: everything answers the pointer

**Date:** 2026-11-06

**Decision:** after the open layout (0019) removed card backgrounds, hovering a tile changed almost nothing. Every row, tile and control now answers the pointer:

| Where | On hover or focus | On press |
| --- | --- | --- |
| Account pulse tiles, outreach cards, interactions, side lists | A soft wash fades in behind the row, a little wider than its text, plus the drawing rule from 0019 | |
| Account pulse tiles | The trend line thickens, its last point grows, the name underlines | |
| Buttons and chips | Rise a pixel, border darkens, a small shadow | Press in (96%) |
| Pipeline cards | Lift with a shadow | Tilt slightly, like picking up a card |
| Table rows | Tint | |
| Dock icons | Spring up to 108% | Press to 94% |

**Rules:** washes are 5% ink in light and 7% in dark, so they never compete with AI drafts (violet) or status pills; everything a person triggers stays under 260ms; under reduced motion the wash still appears but nothing moves or scales.

**Why:** the author found the app static. A wash says "this whole row opens", which matters more now that rows have no boxes.

**Added the same day:** draft entries on Review, Log and Brief deepen their violet and lift a pixel on hover or focus (text still passes AA on the deeper tint), and decided entries get the wash. Review now lays entries out as cards in two columns from 768px and three from 1280px, instead of one line across the whole page, so more of the queue is visible at once and each decision sits next to its text.
