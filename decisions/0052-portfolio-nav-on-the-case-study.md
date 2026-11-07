# 0052 · The portfolio's nav on the case study

**Date:** 2026-11-07

**Decision:** the Groundwork case study opens with the aaditirokade.com nav instead of its own Groundwork header. "AR" on the left goes to the portfolio's home page; Gallery and Resume sit on the right. This matches the Firstword case study.

- **Same behavior as the site:** a plain bar at rest that lifts into a floating pill once the page scrolls. Hovering AR unfurls the moon phases, and hovering a link shows the dotted underline, in pink in light mode and soft blue in dark.
- **Lined up with the page:** at rest, AR sits on the same left edge as the content at every width.
- **Plain links:** Groundwork is its own app served under /groundwork, so the nav uses ordinary links that leave the app for the site's pages.
- **Dropped:** the Groundwork wordmark and the Prototype and GitHub links in the old header. "Open the prototype" sits in the hero, and the repository links sit in "Built in the open".
- **Chapter links** land below the floating nav instead of under it.

**Why:** a reader who arrived from the portfolio had no clear way back to it.

**Checks:** axe clean in light and dark at 375px and 1440px, at the top and scrolled; no sideways scrolling.
