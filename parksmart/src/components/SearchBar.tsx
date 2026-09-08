"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2 } from "lucide-react";
import { DESTINATIONS } from "@/lib/data";
import { useApp } from "@/lib/context";

export default function SearchBar({
  size = "md",
  autoFocus = false,
  initialQuery = "",
}: {
  size?: "lg" | "md";
  autoFocus?: boolean;
  initialQuery?: string;
}) {
  const router = useRouter();
  const { showToast, setDestination } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    return DESTINATIONS.filter((d) =>
      d.name.toLowerCase().includes(query.trim().toLowerCase())
    ).slice(0, 6);
  }, [query]);

  const handleSearch = (destinationName?: string) => {
    const name = destinationName || query.trim();
    if (!name) {
      showToast("Please enter a destination", "error");
      return;
    }
    const dest =
      DESTINATIONS.find(
        (d) => d.name.toLowerCase() === name.toLowerCase()
      ) ||
      DESTINATIONS.find((d) =>
        d.name.toLowerCase().includes(name.toLowerCase())
      ) || {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        latitude: 6.906,
        longitude: 79.855,
      };

    setLoading(true);
    setTimeout(() => {
      setDestination(dest);
      setLoading(false);
      setOpen(false);
      router.push(`/search?dest=${encodeURIComponent(dest.name)}`);
    }, 600);
  };

  return (
    <div className={`relative w-full ${size === "lg" ? "" : "max-w-xl"}`}>
      <div
        className={`flex items-center gap-2 rounded-full border border-zinc-200 bg-white shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 ${
          size === "lg" ? "px-4 py-4" : "px-3 py-2.5"
        }`}
      >
        <Search className="h-5 w-5 shrink-0 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Where are you going?"
          autoFocus={autoFocus}
          className="w-full bg-transparent text-base text-zinc-900 outline-none placeholder:text-zinc-400"
          aria-label="Search destination"
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          className={`flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 ${
            size === "lg" ? "px-5 py-2.5 text-sm" : "px-4 py-1.5 text-sm"
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <MapPin className="h-4 w-4" />
              {size === "lg" && "Find Parking"}
            </>
          )}
        </button>
      </div>

      {open && matches.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
          {matches.map((m) => (
            <button
              key={m.name}
              onMouseDown={() => {
                setQuery(m.name);
                handleSearch(m.name);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-blue-50"
            >
              <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-zinc-800">{m.name}</p>
                <p className="text-xs text-zinc-500">Colombo, Sri Lanka</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
