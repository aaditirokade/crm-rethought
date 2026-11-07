# 0031 · The tabs flow like one page

**Date:** 2026-11-07

**Decision:** in the prototype, the main tabs read as one long page in the dock's order, in both directions.

- **Down:** at the end of a tab, keep scrolling and a hairline fills; the page slides up and fades as the next tab glides in from below, starting at its top.
- **Up:** at the top of a tab, keep scrolling up and a small "Keep scrolling for" pill fills; the page slides down as the previous tab glides in from above, already scrolled to its end, so reading carries on where it left off.
- The pull is shorter than before (200px instead of 360px), both tabs are prefetched, and the page moves as one piece instead of the usual staggered rise.
- A switch never chains: the new tab ignores the gesture that brought it there, including trackpad momentum, until input pauses for a beat.
- With reduced motion, the tab switches without movement. The footer stays a plain link for keyboard and screen reader users, and the dock still reaches every tab.

Pages inside a tab (a brief, a log, an account) are left alone, as before.

**Why:** the switch felt like a page load: a long pull, a jump to the top and a fresh stagger. Moving the whole page in the direction of the scroll makes the tabs feel like anchors on one page, and scrolling back up should work the same way.

**Supersedes:** the one way switch in [0027](0027-scroll-to-next-tab.md).

**Checks:** switching down and up tested from Accounts; a continuous scroll does not skip past a tab; axe clean in light and dark at 375px and 1440px; no sideways scrolling.
