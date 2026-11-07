# 0040 · Links back to the case study load the page

**Date:** 2026-11-07

**Problem:** on aaditirokade.com, "← Case study" in the prototype gave a 404. When the router moves to the case study home, it asks for that page's data. Vercel, on the portfolio side, rewrote that request to `/groundwork.rsc`, which matched none of the forwarding rules. Groundwork serves its root's data as `/groundwork/index.rsc`. Moves between other pages worked, because their data paths line up on both sides.

**Decision:** every link to the case study home is a plain link that loads the page fully. That covers "← Case study" in the desktop prototype, both links on the mobile app page, and the Groundwork logo in the case study header. On its side, the portfolio forwards `/groundwork.rsc` and `/groundwork.segments/...` to Groundwork's `index` paths as well, so a route to the root also works.

**Why:** the way back has to work whatever the router does. A full load of the case study is quick and resets nothing a visitor would miss.

**Checks:** on the live site, moving between tabs in the prototype stayed in the app and the root was the only path that failed; locally, "← Case study" from localhost:3000/groundwork/prototype opens the case study.
