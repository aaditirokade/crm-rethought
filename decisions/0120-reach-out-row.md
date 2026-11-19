# 0120 · Reach out this week as a row of cards; health as a filled tag

**Date:** 2026-11-19

**Decision:** on Opportunities, Reach out this week becomes a row of glass cards that scrolls sideways, with arrows. Closed, a card shows its rank, the account, its health and the top reason; "Why, and the next move" opens it wider to show every reason, the suggested next move and Move earlier, Move later and Snooze. The pipeline moves below, at full width, in the middle of the page. Health everywhere becomes a filled tag (mint, amber, coral), with its shape inside.

**Why:** the list took half the page and pushed the pipeline aside; most of the time a seller only needs to see who and why in one line. A filled tag makes "Needs a look" read at a glance.

**Checks:** the toggle is a button with aria-expanded and aria-controls; the hidden part is hidden from assistive tech until opened. White on the day tags is 4.8:1 or more; dark text on the night tags 7.8:1 or more. Typecheck, lint and tests pass.

**Revisit if:** people miss the reasons because they stay closed.
