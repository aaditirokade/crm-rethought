# 0027 · Scroll past the end to open the next tab

**Date:** 2026-11-06

**Decision:** in the prototype, each main tab (Today, Accounts, Opportunities, Review, Imports) ends with a quiet footer that names the next tab. Once the page has been scrolled to the bottom, scrolling on with a wheel, trackpad or touch fills a hairline under it; when the line is full (about 360px of extra scroll), the next tab opens at its top. Imports is the last step, so it has no footer. Pages inside a tab, like a brief, a log or an account, are left alone.

**Guard rails:** nothing changes until someone has reached the end and keeps going; scrolling up or pausing for 0.7 seconds empties the line again. The footer is also a plain link ("Next: Accounts"), so keyboard and screen reader users take the same step on purpose instead of by scrolling.

**Why:** the dock already reads as a sequence of the day's work (prep, know, pursue, decide, import). Letting the scroll carry on into the next step makes the prototype easy to walk through in one motion, which is how most people look at a portfolio piece.

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling; the footer sits above the dock on phones.
