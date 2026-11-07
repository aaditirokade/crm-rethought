# 0041 · The title, styled like the portfolio site

**Date:** 2026-11-07

**Decision:** the case study's title and line ("Groundwork" and "CRM, rethought. The AI does the groundwork; your team makes every call.") match the Firstword case study and "The Action Items" on aaditirokade.com.

- **Title:** Fraunces light at the site's heading size: 1.7rem, or 2rem from 640px.
- **Line:** the text size and quieter ink of Firstword's line, kept in Geist.
- **Motion:** both slide up from behind a clipped edge on load, the line 150ms after the title. The site uses the same curve and timing (1.1s, cubic-bezier(0.22, 1, 0.36, 1)).
- **Reduced motion:** both simply appear.

Fraunces is loaded only for this title; the rest of Groundwork stays in Geist ([0017](0017-canvas.md)).

**Why:** Groundwork now sits under aaditirokade.com; its opening should read as one of the site's case studies.

**Checks:** axe clean in light and dark at 375px and 1440px.

**Update (same day):** at her request, both case study titles (this one and Firstword's on the site) are a touch bolder and bigger: Fraunces regular (400) at 1.9rem, or 2.25rem from 640px.
