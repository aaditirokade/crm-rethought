# 0021 · A light and dark switch

**Date:** 2026-11-06

**Decision:** add a sun and moon button to the dock's tools. The system setting stays the default; a choice wins over it, is kept in this browser, and applies to the desktop prototype and the mobile app. A small script sets the theme before the first paint, so a saved choice never flashes the other theme.

**How:** every dark rule now has two triggers: the system asks for dark and nobody chose light, or someone chose dark. The button is a real button whose name says what it will do ("Switch to light mode"), with a tooltip like the other dock tools.

**Why:** reviewers and hiring managers look at the prototype on their own machines; they should be able to see both palettes without changing their system setting.

**Checks:** axe clean with the switch set to light while the system is dark; the dock still fits a 375px phone.
