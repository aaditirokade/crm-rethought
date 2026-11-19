# 0132 · Confidence as bars and a color

**Date:** 2026-11-19

**Decision:** wherever the AI states its confidence (every draft card, briefs, logs, Ask's answers, Imports' column matches and fixes), three small rising bars sit before the words: three green bars for high, two amber for medium (with "check this"), one coral for low. The words stay.

**Why:** "CONFIDENCE HIGH" in small gray capitals read the same as "CONFIDENCE MEDIUM"; the bars let a person scan a row of cards and spot the ones to check.

**Checks:** color is never the only cue: the bar count and the word carry the level too. The bars use the chart health colors, checked for colorblind separation (decision 0119). Typecheck, lint and tests pass.

**Revisit if:** levels grow beyond three.
