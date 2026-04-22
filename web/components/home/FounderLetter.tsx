import { ConnectedPills } from "@/components/ui/ConnectedPills";
import { Octagon } from "@/components/ui/Octagon";
import { RevealChars } from "@/components/motion/RevealChars";
import { RevealUp } from "@/components/motion/RevealUp";

/**
 * Section B — origin story. Tesoro pattern: pale base background of
 * one colour family (peach), connected pills as eyebrow, HUGE
 * center-aligned heading in the dark variant of the same family,
 * supporting copy below, then a card with portrait + quote.
 */
export function FounderLetter() {
  return (
    <section
      id="story"
      data-tone="peach-base"
      className="relative w-full"
      style={{
        background: "var(--peach-base)",
        color: "var(--coral-dark)",
      }}
    >
      <div
        className="mx-auto flex w-full flex-col items-center text-center"
        style={{
          maxWidth: 1280,
          paddingLeft: "var(--site-edge)",
          paddingRight: "var(--site-edge)",
          paddingTop: "clamp(5rem, 11vh, 9rem)",
          paddingBottom: "clamp(5rem, 11vh, 9rem)",
          gap: "clamp(2rem, 4vh, 3.5rem)",
        }}
      >
        <RevealUp className="flex flex-col items-center gap-6">
          <ConnectedPills
            parts={["FOR THE", "NEW HUMAN"]}
            tones={["coral", "peach"]}
          />
          <h2
            className="display-lg mx-auto"
            style={{ maxWidth: "18ch", color: "var(--coral-dark)" }}
          >
            <RevealChars as="span">it started with </RevealChars>
            <RevealChars as="span" delay={0.1} className="text-[color:var(--coral)]">
              beatrice.
            </RevealChars>
          </h2>
        </RevealUp>

        {/* Card with portrait + quote, sitting on a darker peach background */}
        <RevealUp delay={0.2} className="w-full">
          <div
            className="mx-auto flex flex-col items-stretch gap-6 overflow-hidden rounded-[2rem] p-6 text-left sm:p-10 lg:flex-row lg:items-center lg:p-12"
            style={{
              background: "var(--peach)",
              maxWidth: 1100,
            }}
          >
            <div className="flex shrink-0 items-center justify-center lg:justify-start">
              <div className="relative">
                <Octagon
                  className="aspect-square"
                  style={{
                    background: "var(--cream)",
                    width: "clamp(180px, 26vw, 320px)",
                  }}
                >
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ fontSize: "clamp(96px, 14vw, 180px)", lineHeight: 1 }}
                  >
                    🐹
                  </div>
                </Octagon>
                <span
                  className="sticker-shadow absolute -bottom-3 -right-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{
                    background: "var(--mustard)",
                    color: "var(--mustard-dark)",
                    transform: "rotate(-6deg)",
                  }}
                >
                  ★ Beatrice · 2019
                </span>
              </div>
            </div>

            <div
              className="flex flex-col gap-5"
              style={{ color: "var(--coral-dark)" }}
            >
              <p className="body-lead">
                In 2019 I picked up a Munchkin named Beatrice from a Brooklyn
                pet store. The clerk told me she was &ldquo;easy&rdquo; and
                handed her over in a cardboard tube. She was anything but
                easy &mdash; and I was anything but ready.
              </p>
              <p className="body-main">
                We figured each other out, eventually. But I kept thinking:
                what if there had been somewhere to read her actual story
                first? Where she came from, what she liked, what she
                didn&apos;t. The honest version. That&apos;s why Hamstr
                exists.
              </p>
              <p
                className="font-display text-xl sm:text-2xl"
                style={{ fontWeight: 700, color: "var(--coral-dark)" }}
              >
                &mdash; Greg, with Beatrice on his shoulder.
              </p>
            </div>
          </div>
        </RevealUp>
      </div>
    </section>
  );
}
