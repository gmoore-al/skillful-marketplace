"use client";

import { useState } from "react";

/**
 * Reveals the seller email on click so scrapers get a little less of a free ride.
 */
export function ContactSellerToggle({ email }: { email: string }) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-2 w-full rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white active:scale-[0.99]"
      >
        Contact seller
      </button>
    );
  }

  return (
    <a
      href={`mailto:${email}?subject=${encodeURIComponent(
        "Interested in your bike on Skillful Cycles",
      )}`}
      className="mt-2 block w-full break-all rounded-lg border border-[color:var(--accent)] px-4 py-2 text-center text-sm font-medium text-[color:var(--accent)]"
    >
      {email}
    </a>
  );
}
