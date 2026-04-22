"use client";

import { ConnectedPills } from "@/components/ui/ConnectedPills";
import { PillCTA } from "@/components/ui/PillCTA";
import { RevealChars } from "@/components/motion/RevealChars";
import { RevealUp } from "@/components/motion/RevealUp";
import { CursorHamster } from "@/components/CursorHamster";
import { Octagon } from "@/components/ui/Octagon";

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
            parts={["EST. BROOKLYN", "2019"]}
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

        {/* Photo band — Tesoro hero has a graphic in an octagon/pill.
            We use a row of three octagons in pale tones with hamster
            emoji as placeholders. They sit BETWEEN the CTAs and the
            big wordmark, no overlap. */}
        <RevealUp delay={0.7} className="mt-2 w-full">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-3 sm:gap-5">
            {[
              { bg: "var(--peach-base)", emoji: "🌻", size: 96 },
              { bg: "var(--mustard)", emoji: "🐹", size: 144 },
              { bg: "var(--pink-base)", emoji: "🥜", size: 96 },
            ].map((o, i) => (
              <Octagon
                key={i}
                className="aspect-square shrink-0"
                style={{
                  background: o.bg,
                  width: `clamp(${o.size * 0.55}px, ${o.size / 9}vw, ${o.size}px)`,
                }}
              >
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ fontSize: o.size * 0.55, lineHeight: 1 }}
                >
                  {o.emoji}
                </div>
              </Octagon>
            ))}
          </div>
        </RevealUp>
      </div>

      {/* The HUGE wordmark — full-bleed across the bottom. Tesoro
          signature: brand wordmark scales with viewport so it dominates
          the hero edge-to-edge. The `gradient-flow` class paints a
          wide multi-stop brand gradient onto the letters and slowly
          drifts it horizontally for a living, breathing feel. */}
      <div
        className="relative w-full overflow-hidden"
        aria-hidden
      >
        <h2
          className="display-xxl gradient-flow text-center leading-none"
          style={{
            fontSize: "clamp(5rem, 24vw, 22rem)",
            letterSpacing: "-0.06em",
            transform: "translateY(6%)",
            // Faster sweep on the hero wordmark so the motion is
            // immediately noticeable above the fold.
            ["--gradient-flow-duration" as string]: "8s",
          }}
        >
          hamstr
        </h2>
      </div>
    </section>
  );
}
