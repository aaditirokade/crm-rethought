# Competitive analysis

**As of:** 2026-11-06 · Seven products that already put AI around the meeting, read against the six things CRM Rethought plans to do. Built from each vendor's public pages, plus third-party reviews where the vendor's own page couldn't be read. This is a reading of marketing pages, not hands-on testing, so the products may do more than their pages say.

## Capability matrix

| Product | Brief before a meeting | Call log into the CRM | Deal risk with a reason | Source on each AI line | Person approves first | What changed since last time |
| --- | --- | --- | --- | --- | --- | --- |
| Salesforce Agentforce Sales | Yes | Yes | Partly | — | Yes, or fully automatic | — |
| HubSpot Breeze | Partly (beta) | Partly | Partly (accounts) | — | Yes | — |
| Attio | Yes | Yes | Partly | — | — | — |
| Gong | Yes | Partly | Yes | — | — | Partly |
| Clari | — | Yes | Partly | — | — | Partly |
| Day.ai | Partly | Yes | Partly | Partly | Partly (outbound only) | Partly |
| Granola | Yes | Yes | — | Partly | Yes | Partly |
| **CRM Rethought (planned)** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |

"—" means we found no mention on the pages we read, not that the feature is absent.

## Evidence, by product

- **Salesforce Agentforce Sales.** Summaries to "walk into every conversation prepared"; Conversation Capture logs calls, emails and events; deal scores show "recent positives and negatives"; pipeline updates can be reviewed in "suggestive mode, or update automatically". A change summary exists for territories, not deals. [AI for sales](https://www.salesforce.com/sales/artificial-intelligence/) · [Meeting prep](https://www.salesforce.com/se/agentforce/use-cases/sales-service-prep/)
- **HubSpot Breeze.** Prep for calls and AI-suggested next steps after calls; the Prospecting Agent asks people to approve CRM updates and follow-ups after meetings. A Company Research Agent (beta) and a Customer Health Agent (account churn risk) appear in a third-party guide. [HubSpot AI](https://www.hubspot.com/products/artificial-intelligence) · [Breeze guide, third party](https://www.syncbricks.com/hubspot-breeze-ai-complete-guide-2026/)
- **Attio.** Account briefs and "know which deals need attention"; calls recorded, transcribed and logged as you speak; records update "instantly", with no review step described. [Attio AI](https://attio.com/ai)
- **Gong.** Deal briefs to prepare for the next meeting; automatic capture of interactions and CRM field updates from deal boards; warnings for low engagement, single threading, stalled deals and pricing concerns; an activity timeline. [Platform](https://www.gong.io/platform/) · [Understanding deals](https://help.gong.io/docs/understanding-deals)
- **Clari.** Per a third-party review: call summaries and automatic CRM field updates; deal health scoring and risk flags; deal movement views. clari.com now redirects to Salesloft, so the vendor page was not read. [Clari review by Docket, a competitor](https://docket.io/resources/research/clari-review)
- **Day.ai.** Preps meetings and captures meetings and emails into the CRM; a deal risk flag fires after a recorded meeting; questions surface supporting snippets; "nothing went out without your approval" refers to outbound actions. [Day.ai](https://day.ai/) · [Review by folk, a competitor](https://www.folk.app/articles/day-ai-review)
- **Granola.** A brief before every external meeting (who's attending, what you discussed last time); notes push into HubSpot, Attio or Affinity; folder questions return cited results; a person reviews what goes into the CRM. No conversation analytics. [Granola for sales](https://www.granola.ai/use-cases/sales) · [Granola on CRM data entry](https://www.granola.ai/blog/eliminate-crm-data-entry-ai-notetakers-auto-populate-pipeline)

## What we take from it

1. **Briefs and automatic logs are now expected.** A CRM that only adds them would not stand out.
2. **Approval is spreading, but as a setting.** Salesforce offers both suggestive and fully automatic modes. Nobody we read builds approval into every line where the AI writes.
3. **Sources are the clearest gap.** None of the seven shows a source on every AI line. Day.ai and Granola cite sources when you ask a question, not on each line of a brief or a log.
4. **"What changed since last time" is mostly missing.** Granola's brief covers what you discussed last time and Gong shows an activity timeline, but no one makes the change the first thing you read.
5. **So CRM Rethought competes on the loop, not the features:** a brief that leads with what changed, a log that feeds the next brief, a source on every line, and a person approving in place ([decision 0007](../decisions/0007-converge-meeting-loop.md)).

## Limits

- Marketing pages, not product trials.
- The Clari row rests on a review by Docket, a competitor; two Day.ai cells rest on a review by folk, also a competitor; HubSpot's briefing agent comes from a third-party guide.
- Re-check before any interview where these products come up; this market changes monthly.
