import Link from "next/link";
import { FallingHamstrShapes } from "./FallingHamstrShapes";
import { MailingListForm } from "./MailingListForm";

/**
 * Site-wide footer — Tesoro pattern: dark/inky background, all link
 * content in the upper third, then a HUGE "hamstr" wordmark at the
 * bottom with a pile of coloured octagons settled on top of it.
 *
 * The shape pile lives in its own absolutely-positioned layer in the
 * bottom 60% so it never overlaps the link columns.
 */
export function HamstrFooter() {
  return (
    <footer
      data-tone="ink"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--ink)", color: "var(--cream)" }}
    >
      <div
        className="relative z-10 mx-auto flex w-full flex-col"
        style={{
          maxWidth: 1440,
          paddingLeft: "var(--site-edge)",
          paddingRight: "var(--site-edge)",
          paddingTop: "clamp(4rem, 9vh, 7rem)",
          paddingBottom: 0,
          gap: "clamp(2rem, 4vh, 3rem)",
        }}
      >
        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-8">
            <h2
              className="display-lg"
              style={{ color: "var(--cream)", maxWidth: "16ch" }}
            >
              made in canada,
              <br />
              <span style={{ color: "var(--mustard)" }}>for hamsters everywhere.</span>
            </h2>
            <p
              className="body-main max-w-md"
              style={{ color: "color-mix(in srgb, var(--cream) 75%, transparent)" }}
            >
              One gentle email a month. New listings near you, care tips,
              and the occasional Beatrice update.
            </p>
            <MailingListForm />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterCol title="Browse" links={[
              { label: "All hamsters", href: "/" },
              { label: "Rehome yours", href: "/rehome" },
              { label: "How it works", href: "/#how-it-works" },
            ]} />
            <FooterCol title="About" links={[
              { label: "Our story", href: "/#story" },
              { label: "Get in touch", href: "mailto:hello@hamstr.test" },
              { label: "Care guides", href: "#" },
            ]} />
            <FooterCol title="Follow" links={[
              { label: "Instagram", href: "#" },
              { label: "TikTok", href: "#" },
              { label: "Substack", href: "#" },
            ]} />
          </div>
        </div>

        <div
          className="mt-6 flex flex-col items-start justify-between gap-3 border-t pt-5 text-xs sm:flex-row sm:items-center"
          style={{
            borderColor: "color-mix(in srgb, var(--cream) 18%, transparent)",
            color: "color-mix(in srgb, var(--cream) 65%, transparent)",
          }}
        >
          <span>© {new Date().getFullYear()} Hamstr · Canada</span>
          <span>Drag the shapes below — they&apos;re bouncy.</span>
        </div>
      </div>

      {/* The shape pile + wordmark area. The shape canvas occupies the
          full area; shapes settle near the bottom and rest on the
          wordmark below. Compact height so there's no empty dark
          gap between the link columns and the pile. */}
      <div
        className="relative mt-6 w-full overflow-hidden sm:mt-10"
        style={{ height: "clamp(260px, 34vh, 420px)" }}
      >
        {/* Big wordmark — anchored at the bottom of the area, full bleed */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex w-full items-end justify-center"
          aria-hidden
        >
          <h2
            className="display-xxl select-none text-center leading-none"
            style={{
              fontSize: "clamp(6rem, 26vw, 24rem)",
              color: "var(--cream)",
              letterSpacing: "-0.06em",
              lineHeight: 0.82,
              transform: "translateY(10%)",
            }}
          >
            hamstr
          </h2>
        </div>
        <FallingHamstrShapes />
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav className="flex flex-col gap-3">
      <span
        className="label-eyebrow"
        style={{ color: "color-mix(in srgb, var(--cream) 55%, transparent)" }}
      >
        {title}
      </span>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="transition-colors hover:text-[color:var(--mustard)]"
              style={{ color: "var(--cream)" }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
