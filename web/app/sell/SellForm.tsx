"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CONDITIONS, Condition, createListing } from "@/lib/api";

interface FormState {
  title: string;
  description: string;
  price: string;
  condition: Condition;
  brand: string;
  frame_size: string;
  location: string;
  image_url: string;
  seller_name: string;
  seller_email: string;
}

const INITIAL: FormState = {
  title: "",
  description: "",
  price: "",
  condition: "good",
  brand: "",
  frame_size: "",
  location: "",
  image_url: "",
  seller_name: "",
  seller_email: "",
};

/**
 * Client-side form that validates inputs and POSTs to the API.
 *
 * Uses native HTML5 validation plus a couple of explicit checks for
 * the price field so we can return integer cents to the API.
 */
export function SellForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const priceNum = Number(values.price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Price must be a non-negative number.");
      return;
    }

    setSubmitting(true);
    try {
      const listing = await createListing({
        title: values.title.trim(),
        description: values.description.trim(),
        price_cents: Math.round(priceNum * 100),
        condition: values.condition,
        brand: values.brand.trim(),
        frame_size: values.frame_size.trim(),
        location: values.location.trim(),
        image_url: values.image_url.trim(),
        seller_name: values.seller_name.trim(),
        seller_email: values.seller_email.trim(),
      });
      router.push(`/listings/${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post listing");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm"
    >
      <Field label="Title" required>
        <input
          required
          minLength={3}
          maxLength={140}
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="2019 Trek FX 3 Disc"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (USD)" required>
          <input
            required
            type="number"
            inputMode="decimal"
            min={0}
            step="1"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="450"
            className={inputClass}
          />
        </Field>
        <Field label="Condition" required>
          <select
            value={values.condition}
            onChange={(e) => update("condition", e.target.value as Condition)}
            className={inputClass}
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Brand">
          <input
            maxLength={64}
            value={values.brand}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="Trek"
            className={inputClass}
          />
        </Field>
        <Field label="Frame size">
          <input
            maxLength={32}
            value={values.frame_size}
            onChange={(e) => update("frame_size", e.target.value)}
            placeholder="M / 54cm"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Location">
        <input
          maxLength={120}
          value={values.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="Seattle, WA"
          className={inputClass}
        />
      </Field>

      <Field label="Image URL">
        <input
          type="url"
          maxLength={500}
          value={values.image_url}
          onChange={(e) => update("image_url", e.target.value)}
          placeholder="https://…"
          className={inputClass}
        />
      </Field>

      <Field label="Description">
        <textarea
          rows={4}
          maxLength={5000}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Condition details, upgrades, any flaws…"
          className={`${inputClass} min-h-24`}
        />
      </Field>

      <div className="grid grid-cols-1 gap-3 border-t border-[color:var(--border)] pt-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            required
            minLength={1}
            maxLength={120}
            value={values.seller_name}
            onChange={(e) => update("seller_name", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Contact email" required>
          <input
            required
            type="email"
            value={values.seller_email}
            onChange={(e) => update("seller_email", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-300 bg-red-50 p-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[color:var(--accent)] px-4 py-3 text-base font-semibold text-white disabled:opacity-50"
      >
        {submitting ? "Posting…" : "Post listing"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-[color:var(--border)] bg-transparent px-3 py-2 text-base";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[color:var(--muted)]">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}
