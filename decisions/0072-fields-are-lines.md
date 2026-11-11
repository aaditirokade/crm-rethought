# 0072 · Fields are a line, not a box

**Date:** 2026-11-11

**Decision:** every form field in the web and phone prototypes (the pipeline's stage menus, Imports' column menus, Lists, a list's name, Quick log, Triage's edit box, the phone's Ask and voice note) loses its outline, rounded corners and fill, and keeps one bottom line in the control color, which passes 3:1 on every background it sits on. Under the pointer the line turns violet; with keyboard focus it turns violet and thickens to 2px, which replaces the focus ring as the indicator. Ask's query field keeps its light fill on the indigo box (decision 0066).

**Why:** the author asked for no bounding box around any form field, only a bottom line.

**Checks:** previewed the pipeline's menus on the local server; computed styles show no top, side or radius and a 1.5px bottom line.
