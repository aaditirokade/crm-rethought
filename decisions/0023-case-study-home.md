# 0023 · The home page is the case study

**Date:** 2026-11-06

**Decision:** replace the list of links at `/` with a case study in the same shape as Firstword's: a hero with the promise and the way in, then numbered chapters with text on one side and a visual on the other. Four short recordings of the real prototype carry the story, each in light and dark:

| Recording | What it shows |
| --- | --- |
| Ask | Asking "Why is Fernhill slipping?": what the AI reads, the answer with a source after each claim, the numbers, the next move |
| Review | Opening a draft's source, approving a record fix (saves at once) and a log line (saves with the batch), then saving |
| Lists | Typing a list in plain words, seeing how it was understood as chips, removing the wrong chip |
| Mobile | From the next meeting to approving drafts one card at a time, then saving |

**How the recordings work:** captured from the running prototype as keyframes at twice the screen resolution (1520x960 for desktop, 750x1624 for the phone), then put together with a drawn cursor, click rings and a short scroll, and saved as MP4 video with a still poster frame. The page loads only the video for the theme on screen (the other is never fetched), every video has a Pause button that stops it on the current frame, and people who ask for reduced motion get the poster first and press Play if they want motion. Each has a caption for screen readers that describes the whole sequence.

**Revised 2026-11-06, GIF to video:** the first version used GIFs captured at screen resolution. On a sharp display they looked soft, and the 256 color limit added dithering to the warm backgrounds. A WebP version at twice the resolution showed blocky artifacts on text. MP4 at twice the resolution keeps text crisp and is smaller than the GIFs were: 0.4 to 1.1 MB each, 6.2 MB for all eight.

**Also on the page:** the problem in three sourced numbers, the competitive read as a chart (13 products, six capabilities, with a table for screen readers), the palette, and links to the decisions, prompts, research and wireframes.

**Why:** a hiring manager opens the live link first. The old home was a list of links; the new one shows what the product does and how I worked before anyone clicks into the prototype.

**Checks:** axe clean in light and dark at 375px and 1440px; no sideways scrolling at 375, 768 or 1920px.
