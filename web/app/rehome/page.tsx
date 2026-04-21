import { RehomeForm } from "./RehomeForm";

/** Rehome-a-hamster page; delegates all interactivity to the client form. */
export default function RehomePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rehome your hamster</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Tell us about them. Every listing gets a story so the next human
          arrives prepared.
        </p>
      </div>
      <RehomeForm />
    </div>
  );
}
