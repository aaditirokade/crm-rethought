# 0061 · Free flowing, with Ask as the one band

**Date:** 2026-11-11

**Decision:** Ask gets more emphasis and loses its rounded box, and the outlines left after decision 0060 go.

- **Ask** is a square band of the AI's color that runs off both edges of the window, behind the dock. The question is bigger, the field is a line to write on instead of a box, the Ask button is a violet word with an arrow, and the suggested questions are underlined words in a row.
- **Buttons other than the main action** (Brief, Log, Review, Undo, the suggestions) read as underlined words. The pressed one is underlined in violet. The main action keeps its solid shape, and the round icon buttons in Review keep theirs.
- **One line inputs** (Lists, Imports) are a line to write on, like Ask's.
- **Sources** are the kind and the time with a dotted underline, not a pill. **Health** is the colored word and its mark, without the pastel pill. **The draft count** on an account is a violet dot and words.
- **Rows and tiles** keep the rule that draws across their top on hover; the rounded wash behind them goes.
- **Drafts** keep their violet tint and edge, with square corners. **The time range** on an account is words in a row with the chosen one underlined. **The day** has a hairline for the hours instead of a gray track.

**Why:** the author asked for Ask to carry more weight, for the rounded boxes to go and the color block to bleed into the margins, and for a freer UI with fewer bounding boxes.

**Checks:** every text color on the band passes AA: in light ink 12.1:1, secondary ink 6.5:1, violet 6.9:1 and control rules 3.4:1 on #dcdffa; in dark the 0051 tokens on #25274f. Previewed on Today, Accounts, an account, Opportunities and Review in light and dark before commit; type check and lint clean.
