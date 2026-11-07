# 0018 · Motion that explains

**Date:** 2026-11-06

**Decision:** add micro interactions where motion tells people what just happened, and nowhere else:

| Moment | Motion | What it explains |
| --- | --- | --- |
| Any page opens | Sections rise in, 50ms apart | Where to look first |
| Any action | A toast slides up and fades ("Approved. Not saved yet.") | The result, without hunting for it |
| A draft is approved | The violet tint fades to plain; the approved stamp pops in | The AI's draft became the person's fact |
| A line is dismissed | The row slides in collapsed | It is gone, and Undo is right there |
| Counts change | Dock and tab badges bounce | Something new waits there |
| Numbers appear | They roll up from zero | The size of the number |
| Charts appear | Sparklines draw left to right, bubbles grow in, renewal bars fill | Charts read as a trend, not a picture |
| A source opens | The drawer slides in over a fading backdrop | Where the source came from |
| Hover a tile | It lifts slightly | It can be opened |
| Inbox zero | A small burst of dots | The work is done |
| Mobile tabs | Screens rise in | Which screen changed |

**Rules:** under 450ms for everything a person triggers; nothing loops except the Ask cursor and the recording pulse; every animation is off when the system asks for reduced motion (toasts then appear and fade without moving); the live region still announces every result, and the toast is hidden from screen readers so it isn't read twice.

**Why:** the author asked for the tool to feel alive. Motion here also teaches the product: the moment a draft turns into a fact is the core idea, so it gets the most care.
