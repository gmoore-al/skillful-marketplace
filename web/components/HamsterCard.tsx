import Link from "next/link";
import { Hamster, SPECIES, formatAge, formatFee } from "@/lib/api";
import { Octagon } from "@/components/ui/Octagon";

// Card colour palette — each card picks a (bg, fg, accent) trio that
// reads cleanly on its own. Deterministic based on hamster.id so cards
// don't reshuffle on re-render.
const CARD_PALETTES: { bg: string; fg: string; accent: string; chip: string; chipFg: string }[] = [
  { bg: "var(--peach-base)", fg: "var(--coral-dark)", accent: "var(--coral)", chip: "var(--ink)", chipFg: "var(--cream)" },
  { bg: "var(--mustard-base)", fg: "var(--mustard-dark)", accent: "var(--mustard)", chip: "var(--ink)", chipFg: "var(--cream)" },
  { bg: "var(--pink-base)", fg: "var(--rose-dark)", accent: "var(--rose)", chip: "var(--ink)", chipFg: "var(--cream)" },
  { bg: "var(--teal-base)", fg: "var(--teal-dark)", accent: "var(--teal)", chip: "var(--ink)", chipFg: "var(--cream)" },
  { bg: "var(--cream-deep)", fg: "var(--ink)", accent: "var(--coral)", chip: "var(--ink)", chipFg: "var(--cream)" },
];

/**
 * Hamster preview card — Tesoro pattern: each card is a fully tinted
 * coloured block (bg + matching dark text), with an octagon photo on
 * a darker accent of the same family. The card carries the colour;
 * the photo carries the personality.
 */
export function HamsterCard({ hamster }: { hamster: Hamster }) {
  const speciesLabel =
    SPECIES.find((s) => s.value === hamster.species)?.label ?? hamster.species;
  const palette = CARD_PALETTES[hamster.id % CARD_PALETTES.length];

  return (
    <Link
      href={`/hamsters/${hamster.id}`}
      className="group relative flex h-full flex-col gap-5 rounded-[1.75rem] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7"
      style={{ background: palette.bg, color: palette.fg }}
    >
      <div className="flex justify-center">
        <Octagon
          className="aspect-square w-full max-w-[280px]"
          style={{ background: palette.accent }}
        >
          {hamster.photo_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={hamster.photo_url}
              alt={hamster.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-110"
              style={{ fontSize: "clamp(72px, 10vw, 120px)", lineHeight: 1 }}
            >
              🐹
            </div>
          )}
        </Octagon>
      </div>

      <div className="flex flex-col gap-1">
        <h3
          className="font-display"
          style={{
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 0.95,
            fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)",
            color: palette.fg,
          }}
        >
          {hamster.name}
        </h3>
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: palette.fg, opacity: 0.7 }}
        >
          {[speciesLabel, formatAge(hamster.age_months), hamster.color]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <div
        className="mt-auto flex items-center justify-between gap-3 pt-3"
        style={{ borderTop: `1px solid color-mix(in srgb, ${palette.fg} 15%, transparent)` }}
      >
        <span
          className="text-xs font-semibold"
          style={{ color: palette.fg, opacity: 0.75 }}
        >
          {hamster.location ? `📍 ${hamster.location}` : "📍 nearby"}
        </span>
        <span
          className="rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide"
          style={{ background: palette.chip, color: palette.chipFg }}
        >
          {formatFee(hamster.adoption_fee_cents).toUpperCase()}
        </span>
      </div>
    </Link>
  );
}
