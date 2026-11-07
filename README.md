# Groundwork

**CRM, rethought.** A B2B CRM for account teams, redesigned from the ground up with AI inside every workflow, and built in the open with AI as a teammate.

**Live:** [crm-rethought.vercel.app](https://crm-rethought.vercel.app/)

**Concept prototype · sample data.** Every company, person and number in this repo is made up. User research is simulated and labeled SIMULATED wherever it appears.

## The question

If a CRM were designed today, with AI in every workflow, what would it look like? Here, AI does the gathering, sorting and first draft. A person makes every call, and every AI output shows its sources and how confident it is.

## How it is being built

Design and code are done by Aaditi Rokade, prompting LLMs in VS Code and the terminal. Nothing is hidden:

| Folder | What is in it |
| --- | --- |
| `prompts/` | Every working session: the prompts as written, what came back, what was kept or dropped, and what was changed by hand |
| `decisions/` | One short record per design or product decision, with the reasoning |
| `research/` | Desk research with linked sources, and simulated personas and interviews (labeled SIMULATED) |
| `design/` | Where AI belongs, information architecture, and notes on the wireframes |
| `app/prototype/` | The working prototype of the meeting loop, live at /prototype |
| `app/mobile/` | The phone app for the minutes between meetings, live at /mobile |
| `app/wireframes/` | Coded grayscale wireframes of the meeting loop, live at /wireframes |
| `app/` | The prototype (Next.js, React, TypeScript, Tailwind) |
| `updates.md` | One line per commit |

## Clean room

This project is not a copy of any CRM the author worked on. It uses no screens, data, terms or workflows from a past employer, only standard CRM ideas, public sources and the author's own design skills. See `decisions/0001-clean-room.md`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Roadmap

0. Setup: repo, logs, live deploy
1. Research: desk research, simulated interviews
2. Define: personas, jobs to be done, where AI belongs, 4 flows picked
3. Design: information architecture, wireframes, tokens
4. Build: the 4 flows in code, light and dark, phone sizes, accessibility checks
5. Test and tell: simulated usability pass, case study page
