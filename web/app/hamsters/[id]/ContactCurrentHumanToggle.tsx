"use client";

import { useState } from "react";

/**
 * Reveals the current human's email on click so scrapers get a little less
 * of a free ride.
 */
export function ContactCurrentHumanToggle({
  email,
  hamsterName,
}: {
  email: string;
  hamsterName: string;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-2 w-full rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white active:scale-[0.99]"
      >
        I&rsquo;d like to meet {hamsterName}
      </button>
    );
  }

  return (
    <a
      href={`mailto:${email}?subject=${encodeURIComponent(
        `About ${hamsterName} on Hamstr`,
      )}`}
      className="mt-2 block w-full break-all rounded-lg border border-[color:var(--accent)] px-4 py-2 text-center text-sm font-medium text-[color:var(--accent)]"
    >
      {email}
    </a>
  );
}
