# 0009 · Wireframes in code, in grayscale

**Date:** 2026-11-06

**Decision:** wireframe the meeting loop as grayscale screens in the Next.js app, deployed with the site, instead of drawing them in a design tool.

**Options considered:** drawn wireframes in the case study · a design tool file · coded wireframes.

**Why:**
- They're clickable, so the approve in place interaction can be tried, not just described.
- They live in the public repo, which is the point of building in the open.
- Phase 4 builds on the same components instead of redrawing them.
- Grayscale keeps the review on structure; the visual direction is chosen separately before tokens are set.

**Revisit if:** layout changes become slower in code than they would be on a canvas.
