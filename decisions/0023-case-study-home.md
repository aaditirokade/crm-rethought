# 0023 · The home page is the case study

**Date:** 2026-11-06

**Decision:** replace the list of links at `/` with a case study in the same shape as Firstword's: a hero with the promise and the way in, then numbered chapters with text on one side and a visual on the other. Four GIFs of the real prototype carry the story, each in light and dark:

| GIF | What it shows |
| --- | --- |
| Ask | Asking "Why is Fernhill slipping?": what the AI reads, the answer with a source after each claim, the numbers, the next move |
| Review | Opening a draft's source, approving a record fix (saves at once) and a log line (saves with the batch), then saving |
| Lists | Typing a list in plain words, seeing how it was understood as chips, removing the wrong chip |
| Mobile | From the next meeting to approving drafts one card at a time, then saving |

**How the GIFs work:** recorded from the running prototype as keyframes, then put together with a drawn cursor, click rings and a short scroll. The page shows only the GIF for the theme on screen (the other is never fetched), every GIF has a Pause button that swaps in a still frame, and people who ask for reduced motion get the still frame first. Each has alt text that describes the whole sequence.

**Also on the page:** the problem in three sourced numbers, the competitive read as a chart (13 products, six capabilities, with a table for screen readers), the palette, and links to the decisions, prompts, research and wireframes.

**Why:** a hiring manager opens the live link first. The old home was a list of links; the new one shows what the product does and how I worked before anyone clicks into the prototype.

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling at 375, 768 or 1920px.
