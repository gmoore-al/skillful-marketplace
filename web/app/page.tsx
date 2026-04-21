import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";
import {
  CONDITIONS,
  Condition,
  Listing,
  ListingFilters,
  fetchListings,
} from "@/lib/api";

type SearchParams = Record<string, string | string[] | undefined>;

function firstString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseFilters(params: SearchParams): ListingFilters {
  const priceToCents = (dollars?: string): number | undefined => {
    if (!dollars) return undefined;
    const n = Number(dollars);
    if (Number.isNaN(n) || n < 0) return undefined;
    return Math.round(n * 100);
  };

  const condition = firstString(params.condition);
  return {
    q: firstString(params.q) || undefined,
    brand: firstString(params.brand) || undefined,
    location: firstString(params.location) || undefined,
    condition:
      condition && CONDITIONS.some((c) => c.value === condition)
        ? (condition as Condition)
        : undefined,
    min_price_cents: priceToCents(firstString(params.min_price)),
    max_price_cents: priceToCents(firstString(params.max_price)),
  };
}

/**
 * Home feed: search + filter form, followed by a responsive listing grid.
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

  let listings: Listing[] = [];
  let error: string | null = null;
  try {
    listings = await fetchListings(filters);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load listings";
  }

  const activeConditions = new Set<Condition | "">(
    filters.condition ? [filters.condition] : [""],
  );

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Used bicycles</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Browse bikes near you or{" "}
          <Link href="/sell" className="text-[color:var(--accent)] underline">
            post your own
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
          placeholder="Search titles (e.g. Trek, gravel, kids)"
          className="w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            name="brand"
            defaultValue={filters.brand ?? ""}
            placeholder="Brand"
            className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base"
          />
          <input
            name="location"
            defaultValue={filters.location ?? ""}
            placeholder="Location"
            className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base"
          />
          <input
            name="min_price"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={
              filters.min_price_cents !== undefined
                ? String(filters.min_price_cents / 100)
                : ""
            }
            placeholder="Min $"
            className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base"
          />
          <input
            name="max_price"
            type="number"
            inputMode="numeric"
            min={0}
            defaultValue={
              filters.max_price_cents !== undefined
                ? String(filters.max_price_cents / 100)
                : ""
            }
            placeholder="Max $"
            className="rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <ConditionChip
            label="Any"
            name="condition"
            value=""
            active={activeConditions.has("")}
          />
          {CONDITIONS.map((c) => (
            <ConditionChip
              key={c.value}
              label={c.label}
              name="condition"
              value={c.value}
              active={activeConditions.has(c.value)}
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
      ) : listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[color:var(--border)] p-8 text-center text-sm text-[color:var(--muted)]">
          No listings match your filters. Try widening your search or{" "}
          <Link
            href="/sell"
            className="text-[color:var(--accent)] underline"
          >
            post the first one
          </Link>
          .
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ConditionChip({
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
