# 0012 · Ask, and a Today screen that reacts

**Date:** 2026-11-06

**Decision:** put an **Ask** panel at the top of Today. A person asks about any account in plain words; the answer appears above the board, shows what it is reading, writes itself with a source chip on every claim, and ends with the key numbers and a suggested next move. Answers are read only: nothing in the record changes. The board below it reacts: the accounts the answer is about light up, everything else steps back. Today itself becomes a **living board**: a strip of the day with a now line, and one pulse tile per account (usage trend, renewal countdown, the top reason to act, drafts waiting).

**Options considered:** a chat in a side drawer · a separate Ask page · Ask on Today, wired to the board.

**Why:**
- Asking is the fastest way into a CRM, and the author named it as missing.
- On Today, the answer and the board explain each other: the answer says why, the board shows where.
- Read only keeps the trust rule simple: Ask can say anything with a source; only the approval gates write.
- A "Play demo" mode types and answers three questions in a row, so the moment can be recorded for the case study.

**How it's built here:** three questions have written answers; any question that names an account gets an answer assembled from that account's record; anything else gets an honest "I couldn't tie that to an account" instead of a guess. A live product would use a language model over the same sources. Motion is turned off for people who ask for reduced motion.

**Revisit if:** testing shows people expect Ask to take actions ("move this deal"), which would need the approval gate inside the answer.
