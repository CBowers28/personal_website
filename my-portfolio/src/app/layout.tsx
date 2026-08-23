import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Advercase — retro serif display face (Indieground). Used as the site's
// primary typeface; Geist Sans is kept as the metrics-compatible fallback.
const advercase = localFont({
  src: "./fonts/Advercase-Regular.woff2",
  variable: "--font-advercase",
  display: "swap",
  weight: "400",
  fallback: ["Geist", "Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Christopher Bowers",
  description: "CS grad student at UF building systems that matter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${advercase.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
