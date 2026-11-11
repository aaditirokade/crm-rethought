# 0063 · Darker color blocks

**Date:** 2026-11-11

**Decision:** a few places carry a dark block so each screen has somewhere for the eye to land.

- **Ask** is deep indigo (#2b2b74), in light and in dark, running off both edges of the window. On the phone, the Ask field sits on the same indigo.
- **Waiting for you** on Today, where a person decides, is an ink block (#20222b; #2a2e42 in dark) that runs off the right edge of the window.
- **On an account,** the lines waiting for its owner run as an ink band across the window.
- Inside each block the tokens flip to light on dark: on the indigo, ink 11.1:1, secondary ink 7.2:1, violet 7.2:1 and control rules 4.1:1; on the ink block, 14.2:1, 9.3:1, 9.3:1 and 5.2:1. The status colors on the indigo are 6.2:1 or more.

**Why:** the author asked for darker color blocking to make the screens pop, on the content that makes most sense: where the AI speaks and where a person approves.

**Checks:** contrast computed for every pair above; previewed on Today, an account and the phone in light and dark; type check and lint clean.
