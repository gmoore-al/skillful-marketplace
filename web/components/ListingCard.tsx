import Link from "next/link";
import { CONDITIONS, Listing, formatPrice } from "@/lib/api";

/**
 * Render a compact listing preview optimized for a mobile list/grid view.
 */
export function ListingCard({ listing }: { listing: Listing }) {
  const conditionLabel =
    CONDITIONS.find((c) => c.value === listing.condition)?.label ??
    listing.condition;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-sm transition active:scale-[0.99]"
    >
      <div className="relative aspect-square w-28 flex-none bg-[color:var(--border)]/40 sm:w-36">
        {listing.image_url ? (
          // Use plain <img> so any remote host works without next.config image allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.image_url}
            alt={listing.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-[color:var(--muted)]">
            🚲
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold group-hover:underline">
            {listing.title}
          </h3>
          <p className="mt-0.5 text-xs text-[color:var(--muted)]">
            {[listing.brand, listing.frame_size, conditionLabel]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {listing.location ? (
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              📍 {listing.location}
            </p>
          ) : null}
        </div>
        <div className="mt-2 text-lg font-semibold text-[color:var(--accent)]">
          {formatPrice(listing.price_cents)}
        </div>
      </div>
    </Link>
  );
}
