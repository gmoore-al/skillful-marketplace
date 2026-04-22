"use client";

import { ConnectedPills } from "@/components/ui/ConnectedPills";
import { PillCTA } from "@/components/ui/PillCTA";
import { RevealChars } from "@/components/motion/RevealChars";
import { RevealUp } from "@/components/motion/RevealUp";
import { CursorHamster } from "@/components/CursorHamster";

/**
 * Hero — Tesoro pattern: center-aligned, small intro stack at top, HUGE
 * brand wordmark at the bottom of the viewport. Cream background,
 * teal accents. No floating stickers (those caused overlap chaos).
 *
 * Layout: [eyebrow pills] → [intro headline] → [supporting copy] →
 * [pill CTAs] → [photo / illustration band] → [HUGE "hamstr" mark]
 */
export function Hero() {
  return (
    <section
      data-tone="cream"
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--cream)", color: "var(--ink)" }}
    >
      {/* Cursor hamster scoped to hero */}
      <CursorHamster containerSelector="#hero" />

      <div
        className="relative mx-auto flex w-full flex-col items-center text-center"
        style={{
          maxWidth: 1440,
          paddingLeft: "var(--site-edge)",
          paddingRight: "var(--site-edge)",
          paddingTop: "clamp(7rem, 13vh, 11rem)",
          paddingBottom: "clamp(2rem, 6vh, 5rem)",
          gap: "clamp(1.5rem, 3vh, 2.75rem)",
        }}
      >
        <RevealUp className="flex flex-col items-center gap-5">
          <ConnectedPills
            parts={["EST. CANADA", "2019"]}
            tones={["mustard", "ink"]}
          />
        </RevealUp>

        {/* The headline — big but not the wordmark; Tesoro keeps the
            brand mark itself as the showstopper. */}
        <h1
          className="display-xl mx-auto"
          style={{ maxWidth: "16ch", color: "var(--ink)" }}
        >
          <RevealChars as="span">soft landings for </RevealChars>
          <RevealChars as="span" delay={0.1} className="text-[color:var(--teal)]">
            small lives.
          </RevealChars>
        </h1>

        <RevealUp delay={0.4}>
          <p className="body-lead mx-auto max-w-[52ch] text-[color:var(--ink-soft)]">
            A gentle marketplace for rehoming hamsters with care. Every
            listing comes with a story, a photo, and the kind of details
            that help small humans match with the right small life.
          </p>
        </RevealUp>

        <RevealUp delay={0.55} className="flex flex-wrap items-center justify-center gap-3">
          <PillCTA href="/#hamsters">meet the hamsters</PillCTA>
          <PillCTA href="/rehome" variant="cream">
            rehome yours
          </PillCTA>
        </RevealUp>
      </div>

      {/* The HUGE wordmark — full-bleed across the bottom. Tesoro
          signature: brand wordmark scales with viewport so it dominates
          the hero edge-to-edge. The `gradient-flow` class paints a
          wide multi-stop brand gradient onto the letters and slowly
          drifts it horizontally for a living, breathing feel.

          The next section (FounderLetter / peach) is pulled up with a
          negative margin to cover the bottom 15% of this wordmark. */}
      <h2
        className="display-xxl gradient-flow text-center leading-none"
        style={{
          fontSize: "clamp(5rem, 24vw, 22rem)",
          letterSpacing: "-0.06em",
          // Calmer, more hypnotic sweep — still visibly flowing but
          // doesn't compete with the hero copy for attention.
          ["--gradient-flow-duration" as string]: "24s",
        }}
      >
        hamstr
      </h2>
    </section>
  );
}
