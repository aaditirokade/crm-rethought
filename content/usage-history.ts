import type { InteractionType } from "./prototype";

/**
 * SIMULATED sample data for the longer ranges on an account's usage chart.
 * PULSE_EARLIER holds the 44 weekly dashboard view counts before the last 8 (weeks of Nov 17, 2025 to Sep 14, 2026),
 * so PULSE_EARLIER plus PULSE makes a full year. TOUCHES_EARLIER holds the touches from those months,
 * drawn on the chart only; the record's history starts at the last 8 weeks.
 */
export const PULSE_EARLIER: Record<string, number[]> = {
  fernhill: [369, 366, 393, 381, 393, 390, 384, 349, 340, 349, 342, 354, 363, 372, 358, 361, 371, 379, 372, 369, 383, 363, 383, 371, 369, 369, 374, 387, 373, 384, 386, 381, 386, 349, 350, 354, 366, 357, 356, 362, 360, 358, 402, 401],
  harbor: [122, 125, 127, 130, 127, 120, 127, 102, 104, 106, 99, 104, 98, 103, 103, 100, 102, 95, 97, 95, 94, 91, 93, 93, 88, 88, 82, 86, 84, 86, 83, 77, 77, 72, 67, 69, 65, 63, 62, 65, 60, 60, 65, 66],
  brightwater: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  kestrel: [180, 189, 200, 209, 211, 215, 208, 188, 190, 201, 205, 200, 204, 207, 210, 217, 221, 218, 216, 227, 228, 235, 245, 243, 242, 247, 251, 241, 261, 261, 266, 267, 262, 246, 243, 256, 247, 246, 252, 253, 260, 256, 280, 286],
  alder: [507, 513, 526, 545, 541, 531, 534, 474, 475, 471, 486, 504, 495, 496, 489, 490, 496, 495, 507, 494, 492, 512, 504, 497, 506, 496, 507, 517, 516, 513, 505, 508, 504, 481, 478, 483, 475, 469, 481, 485, 483, 483, 526, 525],
};

type Touch = { date: string; type: InteractionType; title: string };

export const TOUCHES_EARLIER: Record<string, Touch[]> = {
  fernhill: [
    { date: "2025-12-04", type: "Call", title: "Monthly check in with Lena Ortiz" },
    { date: "2026-01-14", type: "In person", title: "Quarterly review at Fernhill HQ" },
    { date: "2026-02-10", type: "Email", title: "Holiday results summary to Lena Ortiz" },
    { date: "2026-03-05", type: "Call", title: "Monthly check in with Lena Ortiz" },
    { date: "2026-04-15", type: "In person", title: "Quarterly review at Fernhill HQ" },
    { date: "2026-05-19", type: "Ticket", title: "Ticket 3310: store map missing two locations" },
    { date: "2026-06-11", type: "Call", title: "Monthly check in with Lena Ortiz" },
    { date: "2026-07-15", type: "In person", title: "Quarterly review at Fernhill HQ" },
    { date: "2026-08-20", type: "Email", title: "Q4 rollout outline to Lena Ortiz" },
    { date: "2026-09-09", type: "Video", title: "Regional view scoping with Priya Nair" },
  ],
  harbor: [
    { date: "2025-12-10", type: "Call", title: "Monthly check in with Theo Marsh" },
    { date: "2026-02-18", type: "Email", title: "Usage summary to Theo Marsh" },
    { date: "2026-04-08", type: "Video", title: "Quarterly review with Theo Marsh" },
    { date: "2026-06-24", type: "Email", title: "Check in to Theo Marsh, no reply" },
    { date: "2026-08-12", type: "Ticket", title: "Ticket 3702: export times out" },
  ],
  brightwater: [
    { date: "2026-08-06", type: "Video", title: "Discovery call with Dana Whitfield" },
    { date: "2026-09-02", type: "In person", title: "Demo at Brightwater's Boston office" },
    { date: "2026-09-16", type: "Email", title: "Proposal to Dana Whitfield" },
  ],
  kestrel: [
    { date: "2025-12-02", type: "Call", title: "Monthly check in with Mei Tanaka" },
    { date: "2026-01-20", type: "Event", title: "Mei Tanaka at the retail analytics meetup" },
    { date: "2026-03-11", type: "Video", title: "Quarterly review with Mei Tanaka" },
    { date: "2026-05-06", type: "Call", title: "Expansion talk with Mei Tanaka" },
    { date: "2026-06-17", type: "Video", title: "Quarterly review with Mei Tanaka" },
    { date: "2026-08-26", type: "Email", title: "West region pricing to Mei Tanaka" },
  ],
  alder: [
    { date: "2025-12-09", type: "In person", title: "Holiday floor walk with Ruth Calloway" },
    { date: "2026-02-03", type: "Call", title: "Quarterly review with Ruth Calloway" },
    { date: "2026-04-21", type: "Email", title: "Renewal confirmed by Ruth Calloway" },
    { date: "2026-05-05", type: "Call", title: "Quarterly review with Ruth Calloway" },
    { date: "2026-07-29", type: "Ticket", title: "Ticket 3655: weekly report sent late" },
    { date: "2026-08-04", type: "Call", title: "Quarterly review with Ruth Calloway" },
  ],
};
