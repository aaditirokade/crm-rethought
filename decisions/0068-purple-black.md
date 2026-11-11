# 0068 · The highlight turns purple black

**Date:** 2026-11-11

**Decision:** the background highlight of decisions 0065 and 0067 becomes a gradient of purple mixed with black: #3b2150 to #1d1228 in light, #46285e to #2c1a3d in dark. It replaces two lighter periwinkle steps tried the same day. Inside it the tokens are light on dark, the same in light and dark: ink #f6f1fa, secondary text #dacde6, lilac #e0c4ff for the AI's color, control rules #a68cbd, and light status colors. Every pair passes AA on the lighter end of the gradient: in light ink 12.4:1, secondary text 9.1:1, lilac 8.9:1, status 8.8:1 or more, rules 4.7:1; in dark 10.9:1, 8.0:1, 7.8:1, 7.8:1 or more and 4.1:1.

It covers the Lists section, the pipeline's Idea cards, every card Spotted by AI, a group of Review cards under the pointer, and Waiting for you. Ask keeps its own indigo box and light field (decision 0066).

**Why:** the author found the periwinkle steps too light and asked for a darker highlight, a mix of black and purple.

**Checks:** contrast computed for every pair above; previewed on Today, Accounts and Review on the local server; type check and lint clean.
