# 0103 · Built in code: a walkthrough chapter and tests on the approval rules

**Date:** 2026-11-13

**Decision:** the case study gets a chapter, 06 · Built in code, and Next moves to 07. It covers:

- why this stack (Next.js, React, strict TypeScript, Tailwind CSS, no component library);
- three changes worth walking through: one approval gate for every AI line, one store shared by the phone and the web, and the Review it and View task buttons after Ask drafts something;
- the tests and how AI was used.

The approval rules now have unit tests (`test/store.test.ts`), run by `npm test` with Node's built in test runner and no new dependencies; `npm run typecheck` runs the type check. The store exports `getState()` so the tests can read it outside React.

**Why:** design roles now ask whether the designer writes CSS, React or TypeScript in a real codebase. This chapter shows how, and the tests back the case study's main promise: nothing saves without a person.

**Checks:** 7 tests pass; type check and lint are clean.
