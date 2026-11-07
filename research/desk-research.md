# Desk research

**As of:** 2026-11-05 · AI assisted, every claim linked. Labels: **[survey]** = a named survey with a method; **[vendor blog]** = a company selling CRM or AI tools, read with care; **[secondary]** = a blog quoting someone else's study.

## What account teams struggle with

| # | Finding | Label | Source |
| --- | --- | --- | --- |
| F1 | The average seller spends **40%** of their time selling. Gen Z sellers lose about 2 hours a week to manual data entry. | [survey] Salesforce, 4,050 sales pros, 22 countries, Aug to Sep 2025 | [Salesforce State of Sales 2026](https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/) |
| F2 | **76%** of CRM users and admins say less than half of their CRM data is accurate. | [secondary] Validity 2025 survey of 602 users, via Cirrus Insight | [Cirrus Insight](https://www.cirrusinsight.com/blog/sales-productivity-statistics?hs_amp=true) |
| F3 | **68%** of sellers say note taking and data input are the most time consuming tasks. | [secondary] Salesforce State of Sales 6th edition, via Attention | [Attention](https://attention.com/blog-posts/crm-data-entry-tax-rep-time-2026) |
| F4 | **51%** of sales leaders using AI say disconnected systems slow their AI work; **74%** prioritize cleaning their data. | [survey] Salesforce 2026 | [Salesforce State of Sales 2026](https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/) |
| F5 | Reps dislike CRMs because they are built for management reporting, need manual entry, feel like surveillance, lack context, and hold dirty data. | [vendor blog] | [DevRev](https://devrev.ai/blog/sales-reps-hate-crm) |
| F6 | AI saves sellers about **4.8 hours a week**, but **72%** of organizations don't reinvest that time. | [secondary] Gartner 2026 survey of 210 CSOs, via Cirrus Insight | [Cirrus Insight](https://www.cirrusinsight.com/blog/sales-productivity-statistics?hs_amp=true) |
| F7 | **54%** of sellers have used AI agents; nearly 9 in 10 plan to by 2027. | [survey] Salesforce 2026 | [Salesforce State of Sales 2026](https://www.salesforce.com/news/stories/state-of-sales-report-announcement-2026/) |

**Watch out:** secondary blogs disagree on several numbers (selling time quoted as 28% to 40%; data trust quoted as 2% to 35%). This project only uses figures traced to a named survey, and labels secondary ones.

## What CRMs ship for AI today (late 2026)

| Product | AI features | Notes on trust and control | Source |
| --- | --- | --- | --- |
| HubSpot Breeze | Prospecting Agent, Data Agent (plain language questions), Company Research Agent (beta, briefs before calls), Customer Health Agent (beta), Breeze Assistant, call summaries | Audit cards show what actions agents took | [SyncBricks guide](https://syncbricks.com/hubspot-breeze-ai-complete-guide-2026/), [Digital Applied](https://www.digitalapplied.com/blog/crm-ai-agent-salesforce-hubspot-zoho-2026-guide) |
| Salesforce Agentforce | Sales agents on top of Sales Cloud, listed at $125 a user a month as an add-on | Guardrails on by default: data access, allowed actions, escalation to a person | [Digital Applied](https://www.digitalapplied.com/blog/crm-ai-agent-salesforce-hubspot-zoho-2026-guide) |
| Attio | Ask Attio (search, update, create with AI), call intelligence that logs calls as you speak, custom agents, an MCP server | Agent access scoped to the user's permissions | [Attio AI](https://attio.com/ai) |
| Zoho Zia | Predictive scoring, anomaly detection, next best action, email sentiment, Agent Studio | Teams are told to learn when to trust and when to override | [Digital Applied](https://www.digitalapplied.com/blog/crm-ai-agent-salesforce-hubspot-zoho-2026-guide) |

## Gaps Groundwork can own (our reading, to test)

1. **Trust you can see.** Most tools add agents; few show, line by line, which record each AI sentence came from and how sure it is.
2. **Approve in place.** AI work lands where people already are, with approve, edit and dismiss right there, not in a separate agent console.
3. **Data quality as a workflow.** F2 and F4 say bad data blocks AI. Fixing records should be a daily, one tap job, not a cleanup project.
4. **Meeting prep as the front door.** Prep is where time is lost and where a good brief shows value on day one.
