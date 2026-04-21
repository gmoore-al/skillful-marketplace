import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hamstr — soft landings for small lives",
  description:
    "A gentle, story-driven marketplace for rehoming hamsters with care.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f6e6a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-10 border-b border-[color:var(--border)] bg-[color:var(--surface)]/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              ham<span className="text-[color:var(--accent)]">str</span>
            </Link>
            <Link
              href="/rehome"
              className="rounded-full bg-[color:var(--accent)] px-4 py-1.5 text-sm font-medium text-white shadow-sm active:scale-95"
            >
              Rehome
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-4">
          {children}
        </main>
        <nav
          className="fixed inset-x-0 bottom-0 z-10 border-t border-[color:var(--border)] bg-[color:var(--surface)]/95 backdrop-blur"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto grid max-w-3xl grid-cols-2 text-center text-sm">
            <Link href="/" className="py-3 font-medium">
              Browse
            </Link>
            <Link
              href="/rehome"
              className="py-3 font-medium text-[color:var(--accent)]"
            >
              Rehome
            </Link>
          </div>
        </nav>
      </body>
    </html>
  );
}
