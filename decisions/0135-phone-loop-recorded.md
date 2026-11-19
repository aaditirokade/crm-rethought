# 0135 · The case study plays the phone loop instead of embedding the app

**Date:** 2026-11-19

**Decision:** the "For the minutes between meetings" section plays a recording of the whole phone loop: approve a waiting card, ask about Fernhill and read the sourced answer, record a voice note and draft log lines. The live app moved behind the "Try the working app" link to /mobile. The clips public/case/phone-tour-{light,dark}.mp4 are recorded like the rest of the case media.

**Why:** the embedded app asked a reader to click through it to see what it does, and most do not. A recording shows the exact workflow unasked; whoever wants their hands on it is one link away.

**Checks:** the recording honors reduced motion the way every case clip does: a still until Play is pressed. The alt says the steps. Typecheck and lint pass.

**Revisit if:** readers miss that the app is live.
