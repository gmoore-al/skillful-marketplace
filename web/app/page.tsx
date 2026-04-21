import Link from "next/link";
import { HamsterCard } from "@/components/HamsterCard";
import {
  GENDERS,
  Gender,
  Hamster,
  HamsterFilters,
  SPECIES,
  Species,
  fetchHamsters,
} from "@/lib/api";

type SearchParams = Record<string, string | string[] | undefined>;

function firstString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseFilters(params: SearchParams): HamsterFilters {
  const feeToCents = (dollars?: string): number | undefined => {
    if (!dollars) return undefined;
    const n = Number(dollars);
    if (Number.isNaN(n) || n < 0) return undefined;
    return Math.round(n * 100);
  };

  const species = firstString(params.species);
  const gender = firstString(params.gender);
  return {
    q: firstString(params.q) || undefined,
    location: firstString(params.location) || undefined,
    species:
      species && SPECIES.some((s) => s.value === species)
        ? (species as Species)
        : undefined,
    gender:
      gender && GENDERS.some((g) => g.value === gender)
        ? (gender as Gender)
        : undefined,
    max_fee_cents: feeToCents(firstString(params.max_fee)),
  };
}

/**
 * Home feed: search + filter form, followed by a responsive hamster grid.
 *
 * Server-rendered to keep the initial payload small and SEO-friendly.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);

  let hamsters: Hamster[] = [];
  let error: string | null = null;
  try {
    hamsters = await fetchHamsters(filters);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load hamsters";
  }

  const activeSpecies = new Set<Species | "">(
    filters.species ? [filters.species] : [""],
  );

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Hamsters looking for a home</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Every listing comes with a full story.{" "}
          <Link href="/rehome" className="text-[color:var(--accent)] underline">
            Rehome yours
          </Link>
          .
        </p>
      </section>

      <form
        method="GET"
        action="/"
        className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-sm"
      >
        <input
          type="search"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Search by name (e.g. Beatrice, Mochi)"
          className="w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            name="location"
            defaultValue={filters.location ?? ""}
            placeholder="Location"
            className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base"
          />
          <input
            name="max_fee"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={
              filters.max_fee_cents !== undefined
                ? String(filters.max_fee_cents / 100)
                : ""
            }
            placeholder="Max fee $"
            className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            label="Any species"
            name="species"
            value=""
            active={activeSpecies.has("")}
          />
          {SPECIES.map((s) => (
            <Chip
              key={s.value}
              label={s.label}
              name="species"
              value={s.value}
              active={activeSpecies.has(s.value)}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {GENDERS.map((g) => (
            <Chip
              key={g.value}
              label={g.label}
              name="gender"
              value={g.value}
              active={filters.gender === g.value}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white"
          >
            Apply filters
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[color:var(--border)] px-4 py-2 text-sm font-medium"
          >
            Reset
          </Link>
        </div>
      </form>

      {error ? (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      ) : hamsters.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[color:var(--border)] p-8 text-center text-sm text-[color:var(--muted)]">
          No hamsters here yet. Maybe yours is the first?{" "}
          <Link
            href="/rehome"
            className="text-[color:var(--accent)] underline"
          >
            Rehome one
          </Link>
          .
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {hamsters.map((hamster) => (
            <li key={hamster.id}>
              <HamsterCard hamster={hamster} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({
  label,
  name,
  value,
  active,
}: {
  label: string;
  name: string;
  value: string;
  active: boolean;
}) {
  return (
    <label
      className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
          : "border-[color:var(--border)] text-[color:var(--muted)]"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={active}
        className="sr-only"
      />
      {label}
    </label>
  );
}
