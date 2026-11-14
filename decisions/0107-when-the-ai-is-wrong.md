# 0107 · Designed for the moment the AI is wrong

**Date:** 2026-11-14

**Decision:** confidence, saying why something was wrong, and a feedback loop to the team now run through the whole prototype:

- **Why it was wrong.** A dismissed AI line offers three one tap reasons: Wrong, Out of date, Wrong source. Skipping is fine, the same reason again clears it, and Undo clears it too. It works on brief lines, gated lines, record fixes and the phone's swipe cards.
- **Ask says how sure it is.** Every answer shows its confidence and why: high when it read the cited calls, emails and tickets; medium when assembled from the record alone; low when no account matched. Medium and low add "check this".
- **Flag this answer.** Any Ask answer can be flagged with the same three reasons; flagging it again takes it back.
- **What people corrected.** Review collects every reason and flag for the team, counted by reason and by source, and names the source behind most corrections.
- **The case study** gets a section, Designed for the moment the AI is wrong, showing the three steps.

**Why:** one bad suggestion makes people doubt the next several. Trust comes from seeing why, how sure, and having a quick way to say no that someone acts on.

**Checks:** three new unit tests (10 in all); type check and lint clean; seen in the browser at 1280 pixels.
