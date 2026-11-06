# Synthesis · Phase 1

**As of:** 2026-11-06 · Built from [desk-research.md](desk-research.md) (real, linked) and five [interviews](interviews/) (SIMULATED). Counts below are out of the five simulated interviews, so they show patterns to test, not proof.

## The finding in one line

Account teams don't lose time in conversations; they lose it before and after them, in a CRM they don't trust. AI can win that time back only if it shows its reasons and lets a person approve.

## Pains, counted

| # | Pain | Interviews (of 5) | Who | Evidence |
| --- | --- | --- | --- | --- |
| P1 | The data can't be trusted (stale dates, people who left, duplicates) | 5 | Maya, Daniel, Priscilla, Arjun, Rosa | F2, F4 |
| P2 | AI is only useful if it shows why, and a person approves changes | 5 | Maya, Daniel, Priscilla, Arjun, Rosa | F4, F7 |
| P3 | Time lost before and after conversations (prep, logging) | 4 | Maya, Daniel, Priscilla, Rosa | F1, F3 |
| P4 | Context scattered across email, tickets, chat and spreadsheets | 4 | Maya, Daniel, Priscilla, Rosa | F4, F5 |
| P5 | Quiet deals and accounts noticed too late | 4 | Maya, Daniel, Priscilla, Rosa | F2, F5 |
| P6 | Promises and next steps lost at handoffs | 2 | Maya, Rosa | F3 |
| P7 | Imports and repeat report requests | 1 | Arjun | F2, F4 |

## Jobs to be done

- **Before a meeting,** I want to know what changed since we last spoke, so I don't walk in unprepared. (P3, P4)
- **After a call,** I want the log and follow ups drafted for me, so the record is right without a night of typing. (P3, P6)
- **Each morning,** I want to know who needs me today and why, so the quiet ones don't slip. (P5)
- **Every week,** I want to see which deals are at risk and the reason, so I can act before the customer does. (P5, P2)
- **Always,** I want to fix a wrong record in one move, the moment I notice it, so the data gets better as I work. (P1)

## The four flows to build in depth

| Flow | Answers | What AI does | What the person does |
| --- | --- | --- | --- |
| **1. My day** | P5, P3 | Ranks today's accounts and meetings, each with the signal behind it | Reorders, snoozes, opens |
| **2. Meeting brief** | P3, P4, P6 | One page per meeting: what changed, open issues, promises made, each line linked to its source | Pins, edits, dismisses lines |
| **3. Log a call** | P3, P6, P1 | Turns a transcript or voice memo into a log, follow ups and record fixes | Approves, edits, sends |
| **4. Deals at risk** | P5, P2, P1 | Flags deals gone quiet or slipping, with the reason and days since last touch | Decides the next move |

**Built into all four:** every AI line shows its source and a confidence level (P2), and a wrong record can be fixed in one move right where it shows up (P1). P7 (imports) becomes a light screen; P6 is handled inside the brief and the log.

## How we'll know they work

Checked in a SIMULATED usability pass in Phase 5, then in real sessions when possible.

| Measure | Today (from the interviews) | Target |
| --- | --- | --- |
| Time to prep a meeting | 15 to 40 minutes | Under 2 minutes |
| Time from call end to approved log | Hours, often the same night | Under 1 minute |
| AI lines that link to a source | Not shown today | Every line |
| At-risk deals shown with a reason | Found by reading every deal | Every flag has a reason and days quiet |
| AI changes saved without a person | Not applicable | None |

## Open questions

- Would real reps accept AI reading their call transcripts? (A privacy and trust question for real interviews.)
- Is "days since last touch" enough, or do managers want deal size weighed in?
- Who fixes a record that is wrong for everyone: the rep, ops, or the AI with approval?
