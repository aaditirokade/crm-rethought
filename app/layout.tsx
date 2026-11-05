import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Rethought",
  description:
    "A B2B CRM redesigned with AI inside every workflow, built in the open by Aaditi Rokade. Concept prototype with sample data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-svh antialiased">{children}</body>
    </html>
  );
}
