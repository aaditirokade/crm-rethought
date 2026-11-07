/** Re-mounts on every navigation, so each page enters with a short, staggered rise. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
