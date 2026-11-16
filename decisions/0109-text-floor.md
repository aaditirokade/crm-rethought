# 0109 · No readable text below 12px

**Date:** 2026-11-16

**Decision:** the small labels in the case study story (confidence lines, flag and approve labels, the correction tallies) go from 10 to 11.5px up to 12px, the size of the `meta` token. A size check across the portfolio found them as the only text under 12px in Groundwork.

**What it cost:** the story's sample cards grow slightly taller.

**Checks:** typecheck and lint on the changed file pass.
