# Working prototype

**As of:** 2026-11-06 · Phase 4 · Live at [/prototype](https://crm-rethought.vercel.app/prototype) · Built in [Signal](tokens.md) · Scope: the full meeting loop ([decision 0007](../decisions/0007-converge-meeting-loop.md))

One scenario, start to finish: Daniel Okoro (account manager, persona 2) on Thursday, Nov 12. All data is made up ([content/prototype.ts](../content/prototype.ts)).

## Try the loop

1. **Today** (`/prototype`): three meetings, what is waiting for approval, your tasks.
2. **Meeting brief** (`/prototype/brief/fernhill-qbr`): what changed since Oct 14, every line with a source. Approve the record fix: Lena Ortiz is marked as left on the account.
3. **Log a call** (`/prototype/log/fernhill-qbr`): approve, edit or dismiss each drafted line, then save. Open the email draft; there is no send button.
4. **Account** (`/prototype/accounts/fernhill`): saved lines land on the timeline with who approved them and when; Priya is added, the next step changes.
5. **Next brief** (`/prototype/brief/fernhill-pricing`): Monday's brief is built only from lines a person approved. Dismissed lines never appear. Before the log is saved, it is empty and says why.
6. **Review** (`/prototype/review`): every pending line across accounts, approved in one sitting.

Also: Brightwater's brief flags a possible duplicate contact, and the AI stops there, because merging is people only ([decision 0008](../decisions/0008-ai-drafts-people-decide.md)).

## How it works

- State lives in the browser (localStorage) through a small external store (`components/proto/store.ts`), so approvals carry across pages and reloads. "Reset demo" starts the day again.
- The account record is derived: base data plus every saved change. Nothing the AI drafted changes it until a person approves.
- Deals at risk and Imports appear in the navigation as later.

## Checks

axe clean on every page, light and dark, at 1280px and 375px; no horizontal scroll on phones; changes are announced to screen readers.
