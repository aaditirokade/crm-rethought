# 0100 · A task chosen in Ask lands on Your tasks, and Undo is an icon

**Date:** 2026-11-12

**Decision:**

- **Add task** on one of Ask's suggested actions now really adds the task to Your tasks on Today, first in the list, marked FROM ASK, with its due date and the source it names (the ticket, for Fernhill). Before, only the row's label changed.
- **View task** sits on the row once the task is added: it scrolls Your tasks into view and puts focus on the new task. On the phone it opens Next up, which now lists Your tasks, at that task.
- **Undo** on a chosen action is a round icon button with a back arrow instead of the word, labeled "Undo" for screen readers and on hover. It takes a draft out of Review or a task off the list.

**Why:** the author asked for a way to view the added task, as with Review it for drafts (decision 0099), and for Undo as an icon.

**Checks:** previewed on the local server: Add task on the Fernhill answer, then View task, which scrolls to "Ask support for a fix date on ticket 4821", FROM ASK, due today 10:00, and focuses it. Type check and lint clean.
