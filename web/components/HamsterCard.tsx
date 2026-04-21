import Link from "next/link";
import { Hamster, SPECIES, formatAge, formatFee } from "@/lib/api";

/**
 * Render a compact hamster preview optimized for a mobile list/grid view.
 */
export function HamsterCard({ hamster }: { hamster: Hamster }) {
  const speciesLabel =
    SPECIES.find((s) => s.value === hamster.species)?.label ?? hamster.species;

  return (
    <Link
      href={`/hamsters/${hamster.id}`}
      className="group flex overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm transition active:scale-[0.99]"
    >
      <div className="relative aspect-square w-28 flex-none bg-[color:var(--border)]/40 sm:w-36">
        {hamster.photo_url ? (
          // Use plain <img> so any remote host works without next.config image allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hamster.photo_url}
            alt={hamster.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-[color:var(--muted)]">
            🐹
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold group-hover:underline">
            {hamster.name}
          </h3>
          <p className="mt-0.5 text-xs text-[color:var(--muted)]">
            {[speciesLabel, formatAge(hamster.age_months), hamster.color]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {hamster.location ? (
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              📍 {hamster.location}
            </p>
          ) : null}
        </div>
        <div className="mt-2 text-base font-semibold text-[color:var(--accent)]">
          {formatFee(hamster.adoption_fee_cents)}
        </div>
      </div>
    </Link>
  );
}
