"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

export type SortKey =
  | "best"
  | "cheapest"
  | "closest"
  | "available"
  | "rated";

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: "best", label: "Best overall" },
  { key: "cheapest", label: "Cheapest" },
  { key: "closest", label: "Closest" },
  { key: "available", label: "Most available" },
  { key: "rated", label: "Best rated" },
];

export default function FilterBar({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Sort:{" "}
        <span className="font-semibold text-blue-700">
          {OPTIONS.find((o) => o.key === value)?.label}
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-52 rounded-xl border border-zinc-200 bg-white p-1 shadow-xl">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => {
                onChange(o.key);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                value === o.key
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {o.label}
              {value === o.key && <span className="text-blue-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
