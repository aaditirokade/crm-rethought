# 0017 · Canvas: space instead of boxes

**Date:** 2026-11-06 · Replaces the look of [decision 0010](0010-visual-direction-signal.md); its trust rules stay.

**Decision:** move from Signal (IBM Plex, cool grays, "borders do the work") to **Canvas**:

- **Space, not boxes.** One warm canvas; sections grouped by space and type. Hairlines are rare.
- **Lift where you act.** Cards people act on are white, rounded (20px) and softly shadowed; everything else sits flat.
- **One friendly face.** Geist for everything, 15px base, a 34px display size. Labels use the same face with tabular figures instead of a monospace.
- **The AI has a material.** Violet belongs to the AI: drafts sit on a violet tint with a violet edge, Ask glows faintly violet, waiting counts are violet.
- **Ink means decide.** Approve and other decisions are solid ink pill buttons, so the person's actions and the AI's suggestions never share a color.
- **Never color alone,** as before.

**Options considered:** calm canvas · spatial depth (translucent layers) · editorial (serif, rules).

**Why:** the boxed, monospace look read as cold and "military", like the CRMs people already dislike. Calm canvas keeps density where it matters (lists, charts) but feels like the modern tools the target employers build and admire. Spatial depth risked text contrast; editorial felt less like a tool used all day.

**Checks:** every text token passes AA on every background in light and dark (table at /tokens); axe is clean on every page at desktop and phone width.
