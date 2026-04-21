import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CONDITIONS,
  Listing,
  fetchListing,
  formatPrice,
} from "@/lib/api";
import { ContactSellerToggle } from "./ContactSellerToggle";

/**
 * Render a single listing's details. 404s if the id is non-numeric or missing.
 */
export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  let listing: Listing;
  try {
    listing = await fetchListing(numericId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("404")) notFound();
    throw err;
  }

  const conditionLabel =
    CONDITIONS.find((c) => c.value === listing.condition)?.label ??
    listing.condition;

  return (
    <article className="flex flex-col gap-4">
      <Link
        href="/"
        className="text-sm text-[color:var(--muted)] hover:underline"
      >
        ← Back to listings
      </Link>

      <div className="overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
        <div className="relative aspect-square w-full bg-[color:var(--border)]/40">
          {listing.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.image_url}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">
              🚲
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div>
            <h1 className="text-2xl font-bold leading-tight">{listing.title}</h1>
            <p className="mt-1 text-3xl font-semibold text-[color:var(--accent)]">
              {formatPrice(listing.price_cents)}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <Spec label="Brand" value={listing.brand || "—"} />
            <Spec label="Condition" value={conditionLabel} />
            <Spec label="Frame size" value={listing.frame_size || "—"} />
            <Spec label="Location" value={listing.location || "—"} />
          </dl>

          {listing.description ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {listing.description}
            </p>
          ) : null}

          <div className="mt-2 rounded-lg border border-[color:var(--border)] p-3">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted)]">
              Seller
            </p>
            <p className="mt-1 font-medium">{listing.seller_name}</p>
            <ContactSellerToggle email={listing.seller_email} />
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
