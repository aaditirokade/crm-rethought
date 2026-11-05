# 0005 · Tooling: VS Code, terminal, free local Coder

**Date:** 2026-11-05

**Decision:** build in VS Code and the terminal on a Mac, with LLMs as a coding and research partner. Push to a public GitHub repo; Vercel deploys every push to `main`. Coder (free and open source) runs locally in Docker only to show the same work in a cloud development workspace.

**Options considered:** a paid Coder plan · free self-hosted Coder · GitHub Codespaces · local VS Code only.

**Why:**
- Coder is free and open source; a paid tier adds nothing for one person.
- Interviewers care about the proof (repo, prompts, live prototype) more than the editor.
- Showing a cloud workspace once is enough to signal comfort with enterprise development setups.

**Revisit if:** a target employer asks to see work in a specific environment.
