# 0050 · Color blocking across the app

**Date:** 2026-11-07

**Decision:** the prototype uses three kinds of colored block, so Ask's dark block no longer sits alone.

- **Sand, for supporting panels:**
  - Today: "Your day" and the side rail ("Waiting for you", "Later this week", "Your tasks").
  - Accounts: the portfolio map.
  - An account's page: the band of facts (health, renewal, last touch, next step) and the side rail.
  - The brief's side rail and the log's transcript moments.
- **Periwinkle wash, for places the AI works for you:** Lists on Accounts, next to the drafts that already use it.
- **Ink, for the bar where you commit:** the save and import bars on Review, Imports, Log and Quick log. They now float just above the dock on phones and a little off the bottom edge on desktop, where before they sat under the dock on phones.

Ask keeps its indigo, now a step softer, with less glow and a lighter shadow. Opportunities already had sand pipeline columns, so it needed nothing new.

Each block redefines the color tokens inside it. Tracks, chips and buttons inside stay visible without their own rules.

This updates decision 0019 (open layout). Most content still sits on the page itself, and blocks mark the panels that support it and the places where you act.

**Why:** with one dark block and nothing else colored, Ask looked out of place, and the rest of the interface stayed flat.

**Checks:** axe clean in light and dark at 375px and 1440px on Today, Accounts, an account, Opportunities, Review, Imports, the brief and the log; no sideways scrolling.
