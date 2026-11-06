# Information architecture

**As of:** 2026-11-06 · Phase 3. Scope: the meeting loop ([decision 0007](../decisions/0007-converge-meeting-loop.md)).

## Objects

| Object | What it is | Key fields |
| --- | --- | --- |
| Account | A customer company | Name, owner, renewal date, health, people, deals |
| Person | Someone at the account | Name, role, status (active, left), last touch |
| Meeting | A scheduled conversation | Account, time, attendees, brief, log |
| Source | Anything the AI can point to | Kind (email, ticket, call moment, record change), date, link |
| Suggestion | A line the AI drafted | Text, sources, confidence, status (pending, approved, edited, dismissed) |
| Log | The approved record of a meeting | Approved suggestions only, who approved, when |
| Task | A follow up someone owns | Owner, due date, source line |

The **Suggestion** is the new object. Briefs, logs, record fixes and follow ups are all lists of suggestions, so one pattern (source, confidence, approve, edit, dismiss) works everywhere.

## Navigation

Three top level places, in the order of a day:

1. **Today:** today's meetings and anything waiting for approval. Light version of My day.
2. **Accounts:** one page per account, with its timeline of approved logs.
3. **Review:** every pending suggestion across accounts, for people who prefer to clear them in one sitting.

Deals at risk and Imports come later; they appear in the map as planned, not built.

## Screen map

```
Today ──► Meeting brief ──► (the call) ──► Log a call ──► Account timeline
  │            │                               │                ▲
  │            └── Source drawer ◄─────────────┘                │
  └──► Review (all pending suggestions) ────────────────────────┘
Later: Deals at risk · Imports
```

Built as wireframes now: Today, Meeting brief, Log a call, and the source drawer inside both. The account page and Review are linked but stubbed.

## Naming

Plain verbs and nouns, no AI branding: "Brief", "Log", "Suggested", "Approve". The AI is a way the screen works, not a character.
