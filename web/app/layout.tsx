import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Header } from "@/components/nav/Header";
import { PageTransition } from "@/components/transition/PageTransition";
import { HamstrFooter } from "@/components/footer/HamstrFooter";

// Display: Plus Jakarta Sans at 800 — the closest free match to Tesoro's
// "Polymath Display" (chunky, slightly humanist, works at 100px+).
const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

// Body: Inter — clean modern grotesk, mirrors Tesoro's "Systemia" body font.
const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hamstr — soft landings for small lives",
  description:
    "A gentle, story-driven marketplace for rehoming hamsters with care. Made in Canada for hamsters everywhere.",
  openGraph: {
    title: "Hamstr — soft landings for small lives",
    description:
      "A gentle, story-driven marketplace for rehoming hamsters with care.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbf6ee",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SmoothScroll />
        <Header />
        <PageTransition />
        <main className="w-full">{children}</main>
        <HamstrFooter />
      </body>
    </html>
  );
}
