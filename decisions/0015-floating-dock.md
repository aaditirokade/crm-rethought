# 0015 · A floating dock instead of a sidebar

**Date:** 2026-11-06

**Decision:** replace the 216px sidebar with a floating dock. On wide screens it sits on the left, vertically centred, as a stepper of the day's work: PREP (Today), KNOW (Accounts), PURSUE (Opportunities), DECIDE (Review), IMPORT (Imports). Each step shows what is waiting there (AI suggestions, lines to approve) and a label with its status on hover or focus. On phones it becomes a bar at the bottom. Reset demo and a link to the mobile app sit at the end of the dock.

**Options considered:** keep the sidebar · collapse it to icons · a floating dock framed as steps.

**Why:** the sidebar took a sixth of the screen for five links. Framing the tabs as steps tells the product's story (prepare, know, pursue, decide, bring in) every time someone navigates.

**Accessibility:** every icon link has a text name with its status; labels show on keyboard focus, not only on hover; the current step is marked with `aria-current`.
