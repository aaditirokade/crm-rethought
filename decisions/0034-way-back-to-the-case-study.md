# 0034 · A clear way back to the case study

**Date:** 2026-11-07

**Decision:** both prototypes carry a "← Case study" button that returns to the case study home.

- **Desktop prototype:** in the header on every page, beside the sample data label. On narrow phones the wordmark steps aside (it stays the logo link's accessible name) so the header keeps to one line.
- **Mobile app on a desktop:** "← Back to the case study" above the introduction beside the phone preview.
- **Mobile app on a phone:** a slim bar above the app with "← Case study" and the sample data label; the app fills the rest of the screen.

**Why:** people often arrive at a prototype from the case study, and the only way back was the browser's back button or the address bar.

**Checks:** axe clean in light and dark at 375px and 1440px on both prototypes; no sideways scrolling; the phone app's tab bar still sits inside the screen.
