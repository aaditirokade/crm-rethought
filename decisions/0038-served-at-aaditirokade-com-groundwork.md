# 0038 · Served at aaditirokade.com/groundwork

**Date:** 2026-11-07

**Decision:** Groundwork is served at aaditirokade.com/groundwork instead of its own vercel.app address. It stays a separate app and a separate Vercel project, built with the base path `/groundwork`. The portfolio site forwards every request under `/groundwork` to this deployment.

- **Inside the app:** Next adds the base path to links, the router and its own assets. The few plain paths it doesn't touch (the case study recordings and the "Wireframes" link in "Built in the open") read it from `lib/base.ts`.
- **Old address:** crm-rethought.vercel.app and any old path on it (/, /prototype, /mobile...) redirect to the same page under `/groundwork`.
- **On the portfolio:** the Case Studies circle links to `/groundwork` in the same tab, as a plain link, because it is a different app.
- **Development:** the app runs at localhost:3001/groundwork, and the portfolio at localhost:3000/groundwork forwards to it.
- **Deploy order:** deploy this repo before the portfolio, so `/groundwork` has something to forward to.

**Why:** visitors stay on aaditirokade.com from the case study list through the prototype, and the address reads as part of the portfolio.

**Checks:** through localhost:3000/groundwork the case study, its recordings, the prototype and the way back all load; localhost:3001/prototype redirects to /groundwork/prototype.
