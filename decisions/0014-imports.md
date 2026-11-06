# 0014 · Imports: the AI maps and checks, a person decides

**Date:** 2026-11-06

**Decision:** Imports, planned as a light screen ([decision 0006](0006-four-flows.md)), gets the trust layer too. For a trade show lead list (214 rows, sample data):

1. The AI proposes a field for each column, with a reason and a confidence. A person can change any of them and must confirm the mapping.
2. Problems become **fixes** with before and after previews (two date formats; a company name that matches an existing account). Each fix is approved for all its rows at once, or dismissed.
3. Calls about people are **people only**: a possible duplicate contact, rows with no email. The AI lists the options and recommends none.
4. Nothing is written until Import. Imported booth notes land on account timelines as notes, not facts, with the file as their source. Undo is available.

**Why:** a bad import pollutes every record at once, and sales ops lose hours fixing rows by hand (Arjun, interview 04, SIMULATED). Approving a fix as a rule keeps the work small without giving up control.

**Revisit if:** testing shows people want to approve a fix row by row for small files.
