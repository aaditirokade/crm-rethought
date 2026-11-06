# Working prototype

**As of:** 2026-11-06 · Phase 4 · Live at [/prototype](https://crm-rethought.vercel.app/prototype) · Built in [Signal](tokens.md) · Scope: the full meeting loop ([decision 0007](../decisions/0007-converge-meeting-loop.md))

One scenario, start to finish: Daniel Okoro (account manager, persona 2) on Thursday, Nov 12. All data is made up ([content/prototype.ts](../content/prototype.ts)).

## Try the loop

1. **Today** (`/prototype`): a living board. **Ask** at the top: try the suggested questions, ask about any account by name, or press **Play demo** to watch three questions typed and answered in a row ([decision 0012](../decisions/0012-ask-and-living-board.md)). Below it, your day as a time strip with a now line, and a pulse tile per account (usage trend, renewal countdown, top reason, drafts waiting). The accounts an answer is about light up.
2. **Meeting brief** (`/prototype/brief/fernhill-qbr`): what changed since Oct 14, every line with a source. Approve the record fix: Lena Ortiz is marked as left on the account.
3. **Log a call** (`/prototype/log/fernhill-qbr`): approve, edit or dismiss each drafted line, then save. Open the email draft; there is no send button.
4. **Account** (`/prototype/accounts/fernhill`): saved lines land on the timeline with who approved them and when; Priya is added, the next step changes.
5. **Next brief** (`/prototype/brief/fernhill-pricing`): Monday's brief is built only from lines a person approved. Dismissed lines never appear. Before the log is saved, it is empty and says why.
6. **Review** (`/prototype/review`): every pending line across accounts, approved in one sitting.

7. **Opportunities** (`/prototype/opportunities`): who to reach out to this week, ranked by reasons with sources; move up, move down, snooze. New opportunities and stage changes the AI spotted wait for approval ([decision 0011](../decisions/0011-widen-scope.md)).
8. **Log from notes** (`/prototype/quick-log/expo`): a booth chat with no recording. Write a few sentences (or use the sample), choose Standard or High stakes, and each sentence becomes a line to approve.
9. **High stakes brief** (`/prototype/brief/harbor-owner`): not recorded, and the line the AI is unsure of stays hidden until you ask.
10. **Lists in plain words** (`/prototype/accounts`): type "quiet for 2 weeks with more than 10 stores", remove any chip that's wrong, see why each account matches, save the list.
11. **Interactions** (any account page): filter by type, and see who on our side last spoke to each person.

12. **Pictures on every tab** ([decision 0013](../decisions/0013-tab-upgrades.md)): the portfolio map on Accounts; who talks to whom and the 8 week strip on an account; the pipeline with ghost moves (drag, or use the card menu) on Opportunities; triage mode with keys on Review.

Also: Brightwater's brief flags a possible duplicate contact, and the AI stops there, because merging is people only ([decision 0008](../decisions/0008-ai-drafts-people-decide.md)).

## How it works

- Lists are parsed by a small rule set (`lib/listQuery.ts`) so the prototype is honest about what it understood; a live product would have a language model draft the same chips.
- Lines drafted from notes are one per sentence, each linked back to the notes as its source.
- State lives in the browser (localStorage) through a small external store (`components/proto/store.ts`), so approvals carry across pages and reloads. "Reset demo" starts the day again.
- The account record is derived: base data plus every saved change. Nothing the AI drafted changes it until a person approves.
- Imports appears in the navigation as later. Deals at risk became the ranked outreach on Opportunities.

## Checks

axe clean on every page, light and dark, at 1280px and 375px; no horizontal scroll on phones; changes are announced to screen readers.
