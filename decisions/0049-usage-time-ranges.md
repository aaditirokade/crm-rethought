# 0049 · Time ranges on the usage chart

**Date:** 2026-11-07

**Decision:** on an account's page, "Usage and every touch" gets a segmented control for 4 weeks, 8 weeks, 6 months and 1 year. 8 weeks stays the default. The title follows the choice, for example "Usage and every touch, last 6 months".

- **Ticks:** the short ranges mark each week. The long ranges mark the first of each month, with the year on January.
- **Same chart:** the line, the touches and the moments all redraw for the chosen range, and the line draws in again.
- **Moment labels:** near the right edge, a label flips to the left of its line. When two labels would touch, the second drops to a lower row.
- **Data:** the 44 weeks before the last 8 are SIMULATED sample data (content/usage-history.ts), with older touches drawn on the chart only. The record's history still starts 8 weeks back.

I chose preset buttons over a calendar or a dropdown. Four ranges fit in one row, each is one click, and the current one is always visible. A calendar suits picking exact dates, which nobody needs here.

**Why:** 8 weeks shows the recent drop but not whether it's normal for the account. A year shows the baseline and the seasons.

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling; each button reports its pressed state to screen readers.
