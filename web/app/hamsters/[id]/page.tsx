import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GENDERS,
  Hamster,
  SPECIES,
  fetchHamster,
  formatAge,
  formatFee,
} from "@/lib/api";
import { ContactCurrentHumanToggle } from "./ContactCurrentHumanToggle";

/**
 * Render a single hamster's details. 404s if the id is non-numeric or missing.
 */
export default async function HamsterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  let hamster: Hamster;
  try {
    hamster = await fetchHamster(numericId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("404")) notFound();
    throw err;
  }

  const speciesLabel =
    SPECIES.find((s) => s.value === hamster.species)?.label ?? hamster.species;
  const genderLabel =
    GENDERS.find((g) => g.value === hamster.gender)?.label ?? hamster.gender;

  return (
    <article className="flex flex-col gap-4">
      <Link
        href="/"
        className="text-sm text-[color:var(--muted)] hover:underline"
      >
        ← Back to all hamsters
      </Link>

      <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="relative aspect-square w-full bg-[color:var(--border)]/40">
          {hamster.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hamster.photo_url}
              alt={hamster.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">
              🐹
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div>
            <h1 className="text-2xl font-bold leading-tight">{hamster.name}</h1>
            <p className="mt-1 text-2xl font-semibold text-[color:var(--accent)]">
              {formatFee(hamster.adoption_fee_cents)}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <Spec label="Species" value={speciesLabel} />
            <Spec label="Age" value={formatAge(hamster.age_months)} />
            <Spec label="Gender" value={genderLabel} />
            <Spec label="Color" value={hamster.color || "—"} />
            <Spec label="Temperament" value={hamster.temperament || "—"} />
            <Spec label="Location" value={hamster.location || "—"} />
          </dl>

          {hamster.story ? (
            <section>
              <h2 className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
                Their story
              </h2>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {hamster.story}
              </p>
            </section>
          ) : null}

          {hamster.includes ? (
            <section>
              <h2 className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
                Comes with
              </h2>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                {hamster.includes}
              </p>
            </section>
          ) : null}

          <div className="mt-2 rounded-lg border border-[color:var(--border)] p-3">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
              Current human
            </p>
            <p className="mt-1 font-medium">{hamster.current_human_name}</p>
            <ContactCurrentHumanToggle
              email={hamster.current_human_email}
              hamsterName={hamster.name}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[color:var(--muted)]">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </>
  );
}
