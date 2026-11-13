# 0104 · No orphan words anywhere

**Date:** 2026-11-13

**Decision:** body text wraps with `text-wrap: pretty` and every heading with `text-wrap: balance`, set once in the base layer of globals.css. The property is inherited, so it reaches every paragraph, list item, label and caption in the case study, the prototype and the phone app. It extends the case study only rule from decision 0045 to the whole app.

**Why:** the author asked that no line anywhere end with one word on its own.

**Checks:** a script that finds paragraphs whose last line holds one word found none on the case study at 375 and 1280 pixels.
