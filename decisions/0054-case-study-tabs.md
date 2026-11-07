# 0054 · Tabs between the case studies

**Date:** 2026-11-07

**Decision:** small tabs above the case study's title read "CASE STUDY I | CASE STUDY II". The first is Groundwork, the second Firstword, in the same order as the circles on aaditirokade.com's home page. Firstword's page has the same tabs.

- **Current page:** its tab is in ink with the site's solid pink rule. The other is quieter and shows the site's dotted underline on hover.
- **Screen readers:** each tab also names its study, for example "Case study II: Firstword". The current one is marked as the current page.
- **Plain links:** Firstword lives on the site, outside this app's /groundwork base path, so both tabs load a full page.

**Why:** a reader who finished one case study had to go back to the home page to find the other.

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling.
