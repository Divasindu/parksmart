"use client";

import { Heart } from "lucide-react";
import { useApp } from "@/lib/context";

export default function ClientActions({ parkingId }: { parkingId: string }) {
  const { toggleFavorite, isFavorite, showToast } = useApp();
  const fav = isFavorite(parkingId);

  return (
    <button
      onClick={() => {
        toggleFavorite(parkingId);
        showToast(fav ? "Removed from favorites" : "Saved to favorites", "info");
      }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
        fav
          ? "border-red-200 bg-red-50 text-red-500"
          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
      }`}
      aria-label={fav ? "Remove from favorites" : "Save to favorites"}
    >
      <Heart className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
      {fav ? "Saved" : "Save"}
    </button>
  );
}

export function SaveButton({ parkingId }: { parkingId: string }) {
  const { toggleFavorite, isFavorite, showToast } = useApp();
  const fav = isFavorite(parkingId);

  return (
    <button
      onClick={() => {
        toggleFavorite(parkingId);
        showToast(fav ? "Removed from favorites" : "Saved to favorites", "info");
      }}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 font-bold text-zinc-700 hover:bg-zinc-50"
    >
      <Heart className={`h-5 w-5 ${fav ? "fill-red-500 text-red-500" : ""}`} />
      {fav ? "Saved" : "Save Parking"}
    </button>
  );
}