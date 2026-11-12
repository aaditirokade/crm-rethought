# 0092 · Clear takes you back to the top

**Date:** 2026-11-12

**Decision:** when a person clears an answer in Ask, the page scrolls back up and focus moves to the question field, ready for the next question. On the desktop, if Ask's box sits in the first screen of the page (as it does on Today), the page goes to its very top; otherwise it stops just above the box. On the phone, the Ask screen scrolls to its top. The scroll is smooth, and instant for anyone who asks for reduced motion.

**Why:** the author asked for it. Clearing a long answer used to leave the person far down the page, looking at whatever sat below Ask.

**Checks:** Clear disappears when it is pressed, so focus moving to the question field also keeps keyboard and screen reader users in place. The field takes focus without a second jump (preventScroll).
