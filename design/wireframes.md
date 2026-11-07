# Wireframes

**As of:** 2026-11-06 · Phase 3 · Live at [/wireframes](https://crm-rethought.vercel.app/wireframes) · [Decision 0009](../decisions/0009-wireframes-in-code.md)

Grayscale on purpose: this round tests structure and the approve in place pattern. One scenario runs through all three screens: Daniel Orro (account manager, persona 2) prepares for and logs a quarterly review with Fernhill Outfitters. All sample data is made up ([content/sample.ts](../content/sample.ts)).

| Route | Screen | What it tests | Key interactions |
| --- | --- | --- | --- |
| `/wireframes/today` | Today | Can Daniel see which meeting needs prep and what waits for his approval? | Open brief · review a waiting fix or log |
| `/wireframes/brief` | Meeting brief | Does leading with what changed, with a source on every line, make prep take minutes? | Open a source · pin · dismiss and undo · approve a record fix in place |
| `/wireframes/log` | Log a call | Is approving line by line fast enough that people do it? | Approve · edit and approve · dismiss and undo · open the email draft · save approved lines |

## Patterns introduced

- **Source chip:** a dashed pill naming the source kind and date; opens a side drawer with the excerpt.
- **Confidence:** written out ("Confidence: medium · check this"), never a color or a percentage.
- **Gate:** a dashed box with Approve and "Not right". Used only where something is written to the shared record.
- **Save bar:** counts approved and waiting lines; nothing is saved until it's pressed.
- **Email draft:** opens inline with "You send this from your own inbox"; there is no send button.

## Open questions for testing

- Is per line approval tiring on a 9 line log? Would "Approve all high confidence" help or undo the point?
- Should pinned brief lines carry into the log as context?
- Where should Review live for managers who clear suggestions in one sitting?
