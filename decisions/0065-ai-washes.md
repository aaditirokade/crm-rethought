# 0065 · AI washes

**Date:** 2026-11-11

**Decision:** a slightly darker gradient of the AI's color, the AI wash, marks five places the AI works for you:

- **Ask's query field,** a step darker than the Ask block around it.
- **The Lists section,** with its violet rule still down the left.
- **The Idea column in the pipeline:** its cards and the idea the AI suggests there, which keeps its dashed edge.
- **Every card Spotted by AI** in Review.
- **A group of cards in Review under the pointer,** such as the 9 cards from Fernhill's quarterly review, which lights up with the wash as a hover highlight.

The wash runs from #dcdbff to #cbcff9 in light and from #383a80 to #2d2f68 in dark. Inside it the tokens are Ask's own, with control rules and the status colors a step deeper in light, so every text pair passes AA on the end of the gradient nearest the text color: in light ink 10.4:1, secondary ink 5.6:1, violet 6.0:1, the status colors 5.0:1 or more and control rules 3.6:1; in dark ink 8.6:1, secondary ink 5.9:1, violet 5.9:1, the status colors 5.1:1 or more and control rules 3.3:1.

**Update, same day:** made a step darker at the author's request. It first ran from #e7e6ff to #d5d8fb in light and from #2e2f63 to #23254e in dark.

The Ask, Lists and Review recordings on the case study and the home card were made again to match.

**Why:** the author chose these elements, after decision 0064 took back the dark blocks, and asked for a slightly darker gradient on each.

**Checks:** contrast computed for every pair above; previewed on Today, Accounts, Opportunities and Review in light and dark; type check and lint clean.
