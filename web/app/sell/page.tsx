import { SellForm } from "./SellForm";

/** Create-listing page; delegates all interactivity to the client form. */
export default function SellPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Post a bike</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Takes about a minute. No account required.
        </p>
      </div>
      <SellForm />
    </div>
  );
}
