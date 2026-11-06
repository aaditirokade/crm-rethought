/** Small line icons for the dock. Decorative: the link around each icon carries its name. */
const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const IconToday = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
    <circle cx="12" cy="15.5" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);
export const IconAccounts = () => (
  <svg {...base}>
    <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <path d="M16 9h2a2 2 0 0 1 2 2v10M8 7h4M8 11h4M8 15h4M3 21h18" />
  </svg>
);
export const IconPipeline = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 12l6.5-6.5M15 5h4v4" />
  </svg>
);
export const IconReview = () => (
  <svg {...base}>
    <path d="M3 13h5l2 3h4l2-3h5" />
    <path d="M5.5 5h13l2.5 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" />
    <path d="M9 9l2 2 4-4" />
  </svg>
);
export const IconImport = () => (
  <svg {...base}>
    <path d="M12 3v11M7.5 9.5L12 14l4.5-4.5" />
    <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </svg>
);
export const IconReset = () => (
  <svg {...base}>
    <path d="M3 4v6h6" />
    <path d="M3.6 14.5A9 9 0 1 0 6 6.3L3 10" />
  </svg>
);
export const IconPhone = () => (
  <svg {...base}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 18.5h3" />
  </svg>
);
