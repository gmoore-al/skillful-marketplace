/**
 * Thin fetch wrapper around the FastAPI backend.
 *
 * All functions throw on non-2xx responses so callers can surface errors
 * via standard try/catch or React error boundaries.
 */

export type Condition =
  | "new"
  | "like_new"
  | "good"
  | "fair"
  | "parts_only";

export const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "parts_only", label: "Parts only" },
];

export interface Listing {
  id: number;
  title: string;
  description: string;
  price_cents: number;
  condition: Condition;
  brand: string;
  frame_size: string;
  location: string;
  image_url: string;
  seller_name: string;
  seller_email: string;
  created_at: string;
}

export interface ListingCreate {
  title: string;
  description: string;
  price_cents: number;
  condition: Condition;
  brand: string;
  frame_size: string;
  location: string;
  image_url: string;
  seller_name: string;
  seller_email: string;
}

export interface ListingFilters {
  q?: string;
  brand?: string;
  condition?: Condition;
  location?: string;
  min_price_cents?: number;
  max_price_cents?: number;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

/**
 * Build a query string from a plain object, dropping undefined/empty values.
 */
function toQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "number" && Number.isNaN(value)) continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return (await res.json()) as T;
}

/** Fetch listings from the API, honoring the given filters. */
export async function fetchListings(
  filters: ListingFilters = {},
  init?: RequestInit,
): Promise<Listing[]> {
  const res = await fetch(`${API_BASE}/listings${toQuery({ ...filters })}`, {
    cache: "no-store",
    ...init,
  });
  return handle<Listing[]>(res);
}

/** Fetch a single listing by id. */
export async function fetchListing(
  id: number,
  init?: RequestInit,
): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings/${id}`, {
    cache: "no-store",
    ...init,
  });
  return handle<Listing>(res);
}

/** Create a new listing. */
export async function createListing(
  payload: ListingCreate,
): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle<Listing>(res);
}

/** Format an integer cent amount as a localized USD price string. */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
