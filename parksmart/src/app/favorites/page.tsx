"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useApp } from "@/lib/context";
import ParkingCard from "@/components/ParkingCard";
import { DemoModeBadge } from "@/components/LiveDataIndicator";

export default function FavoritesPage() {
  const { parkings, favorites, toggleFavorite, showToast } = useApp();

  const favParkings = parkings.filter((p) => favorites.includes(p.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <Heart className="h-6 w-6 text-red-500" /> Favorite Parking
          </h1>
          <p className="text-sm text-zinc-500">
            Your saved parking locations for quick access
          </p>
        </div>
        <DemoModeBadge />
      </div>

      <div className="mt-6">
        {favParkings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-zinc-300" />
            <h3 className="mt-4 text-lg font-bold text-zinc-800">
              No favorites yet
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Save parking locations you use often and they&apos;ll appear here.
            </p>
            <Link
              href="/map"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Explore parking
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {favParkings.map((p) => (
              <ParkingCard
                key={p.id}
                parking={p}
                favorited
                onToggleFavorite={() => {
                  toggleFavorite(p.id);
                  showToast("Removed from favorites", "info");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}