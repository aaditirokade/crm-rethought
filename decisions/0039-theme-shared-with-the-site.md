# 0039 · One theme with aaditirokade.com

**Date:** 2026-11-07

**Decision:** Groundwork keeps its light or dark choice under the portfolio site's own key (`theme`) instead of its own. It is served on the same domain ([0038](0038-served-at-aaditirokade-com-groundwork.md)), so the two share the setting.

- **Dark on the site:** the case study, both prototypes and the wireframes open dark.
- **A switch made in Groundwork:** it carries back to the site.
- **No choice yet:** Groundwork opens light, like the site, instead of following the system setting.

The choice is still set before the first paint, so neither theme flashes.

**Why:** moving from the site into the case study should not change the theme under the visitor.

**Checks:** at localhost:3000, dark on Case Studies opened /groundwork dark; switching to light there turned Case Studies light; with no choice and a dark system setting, /groundwork/prototype opened light.
