import { Hamster, fetchHamsters } from "@/lib/api";
import { Hero } from "@/components/home/Hero";
import { FounderLetter } from "@/components/home/FounderLetter";
import { HamsterGrid } from "@/components/home/HamsterGrid";
import { HowItWorks } from "@/components/home/HowItWorks";

/**
 * Hamstr home — a Tesoro-style colour-block scroll: hero (cream),
 * founder letter (peach), hamster grid (teal), how-it-works (mustard),
 * and the falling-shapes footer (handled by the root layout).
 *
 * Server-rendered so the initial paint is instant and the listings
 * stream in as part of the document rather than from a client fetch.
 */
export default async function HomePage() {
  let hamsters: Hamster[] = [];
  let error: string | null = null;
  try {
    hamsters = await fetchHamsters();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load hamsters";
  }

  return (
    <>
      <Hero />
      <FounderLetter />
      <HamsterGrid hamsters={hamsters} error={error} />
      <HowItWorks />
    </>
  );
}
