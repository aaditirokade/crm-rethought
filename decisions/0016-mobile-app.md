# 0016 · A mobile app for the minutes between meetings

**Date:** 2026-11-06

**Decision:** start a phone app at `/mobile` that does two jobs, not the whole CRM: get ready for the next meeting, and log what happened after it. Four tabs:

1. **Next up:** the next meeting, a countdown, three things to know (each with its source), and how many drafts wait.
2. **Approve:** one card at a time; swipe right to approve, left to dismiss, or use the buttons. Saving is a separate step, as on the desktop.
3. **Ask:** the same sourced, read only answers as the desktop.
4. **Voice note:** talk after a conversation; each sentence becomes a line to approve. The conversation itself is never recorded.

It shares state with the desktop prototype, so an approval on the phone shows on the desktop. On a laptop it shows inside a phone frame with a short explanation; on a phone it fills the screen.

**Why:** account teams prepare in the car or the lobby and log in the hallway. The desktop is for planning; the phone is for the moments around a meeting.

**Revisit if:** testing shows people want the account record or the pipeline on the phone.
