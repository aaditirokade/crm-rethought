import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

/* Canvas type: Geist, one friendly face for everything (decision 0017). */
const ui = Geist({ subsets: ["latin"], variable: "--font-ui", display: "swap" });

export const metadata: Metadata = {
  title: "CRM Rethought",
  description:
    "A B2B CRM redesigned with AI inside every workflow, built in the open by Aaditi Rokade. Concept prototype with sample data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={ui.variable}>
      <body className="min-h-svh antialiased">{children}</body>
    </html>
  );
}
