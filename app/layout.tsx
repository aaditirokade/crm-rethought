import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import { THEME_SCRIPT } from "@/components/proto/ThemeToggle";

/* Canvas type: Geist, one friendly face for everything (decision 0017). */
const ui = Geist({ subsets: ["latin"], variable: "--font-ui", display: "swap" });
/* The case study's title, in the portfolio site's display face (decision 0041). */
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "Groundwork · CRM, rethought",
  description:
    "A B2B CRM redesigned with AI inside every workflow, built in the open by Aaditi Rokade. Concept prototype with sample data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ui.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-svh antialiased">{children}</body>
    </html>
  );
}
