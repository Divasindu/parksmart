"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { MapPin, Navigation, Table2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ParkingCard from "@/components/ParkingCard";
import FilterBar, { SortKey } from "@/components/FilterBar";
import RecommendationCard from "@/components/RecommendationCard";
import ParkingMap from "@/components/ParkingMapDynamic";
import SmartAlert from "@/components/SmartAlert";
import LiveDataIndicator, { DemoModeBadge } from "@/components/LiveDataIndicator";
import { useApp } from "@/lib/context";
import { DESTINATIONS } from "@/lib/data";
import { calculateScore } from "@/lib/utils";
import Link from "next/link";

function SearchContent() {
  const {
    parkings,
    destination,
    toggleFavorite,
    isFavorite,
    preferences,
    showToast,
  } = useApp();
  const searchParams = useSearchParams();
  const destName = searchParams.get("dest") || destination?.name || "Colombo Fort";
  const [sort, setSort] = useState<SortKey>("best");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeDest =
    destination ||
    DESTINATIONS.find((d) => d.name.toLowerCase() === destName.toLowerCase()) ||
    DESTINATIONS[0];

  const sorted = useMemo(() => {
    const list = [...parkings].filter((p) => p.availableSpaces > 0 || true);
    switch (sort) {
      case "cheapest":
        return list.sort((a, b) => a.pricePerHour - b.pricePerHour);
      case "closest":
        return list.sort((a, b) => a.walkingDistance - b.walkingDistance);
      case "available":
        return list.sort((a, b) => b.availableSpaces - a.availableSpaces);
      case "rated":
        return list.sort((a, b) => b.rating - a.rating);
      case "best":
      default:
        return list.sort(
          (a, b) =>
            calculateScore(b, activeDest, preferences).total -
            calculateScore(a, activeDest, preferences).total
        );
    }
  }, [parkings, sort, activeDest, preferences]);

  const recommended = sorted[0];

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-zinc-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <MapPin className="h-4 w-4 text-blue-600" />
              Searching near
              <span className="font-bold text-zinc-900">{activeDest.name}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <LiveDataIndicator />
              <DemoModeBadge />
            </div>
          </div>
          <SearchBar size="md" initialQuery={activeDest.name} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">
              Nearby parking ({sorted.length})
            </h2>
            <p className="text-sm text-zinc-500">
              {sorted.length} options near {activeDest.name}
            </p>
          </div>
          <FilterBar value={sort} onChange={setSort} />
        </div>

        {/* Recommendation */}
        {recommended && sort === "best" && (
          <div className="mt-6">
            <RecommendationCard parking={recommended} destinationName={activeDest.name} />
          </div>
        )}

        {/* Smart alerts / alternative parking */}
        {(() => {
          const low = sorted.find(
            (p) => p.availableSpaces > 0 && p.availableSpaces <= 5
          );
          const full = sorted.filter((p) => p.availableSpaces <= 3).slice(0, 3);
          return (
            <>
              {low && (
                <div className="mt-6">
                  <SmartAlert
                    message={`${low.name} is filling up quickly near ${activeDest.name}.`}
                    remaining={low.availableSpaces}
                  />
                </div>
              )}
              {full.length > 0 && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="font-bold text-red-800">
                    Some parking is nearly full — here are alternatives
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {full.map((p) => (
                      <Link
                        key={p.id}
                        href={`/parking/${p.id}`}
                        className="rounded-xl border border-red-100 bg-white p-3 hover:shadow-sm"
                      >
                        <p className="font-semibold text-zinc-800">1. {p.name}</p>
                        <p className="text-xs text-zinc-500">
                          {p.walkingDistance} m · {p.availableSpaces} left
                        </p>
                        <span className="mt-1 inline-block text-xs font-semibold text-blue-600">
                          Choose alternative →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {sorted.length === 0 ? (
          <div className="mt-16 text-center">
            <Navigation className="mx-auto h-12 w-12 text-zinc-300" />
            <h3 className="mt-4 text-lg font-bold text-zinc-800">
              No parking found nearby
            </h3>
            <p className="mt-1 text-zinc-500">
              Try a different destination or adjust your preferences.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Return to dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Left: list */}
            <div className="space-y-4">
              {sorted.map((p) => (
                <ParkingCard
                  key={p.id}
                  parking={p}
                  recommended={sort === "best" && p.id === recommended.id}
                  onToggleFavorite={() => {
                    toggleFavorite(p.id);
                    showToast(
                      isFavorite(p.id)
                        ? "Removed from favorites"
                        : "Saved to favorites",
                      "info"
                    );
                  }}
                  favorited={isFavorite(p.id)}
                />
              ))}
            </div>

            {/* Right: map */}
            <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
              <div className="flex items-center justify-between pb-3">
                <h3 className="font-bold text-zinc-800">Map view</h3>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Reset view
                </button>
              </div>
              <div className="h-[50vh] lg:h-[calc(100vh-8rem)]">
                <ParkingMap
                  parkings={sorted}
                  destination={activeDest}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  height="100%"
                />
              </div>
              {/* Mobile bottom card */}
              {selectedId && (
                <div className="mt-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg lg:hidden">
                  {(() => {
                    const p = parkings.find((x) => x.id === selectedId);
                    if (!p) return null;
                    return <ParkingCard parking={p} favorited={isFavorite(p.id)} />;
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price comparison table */}
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            <Table2 className="h-5 w-5 text-blue-600" /> Compare parking at a glance
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Transparent prices so you know the cost before you arrive.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">Parking</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Security</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 8).map((p) => {
                  const isRec = sort === "best" && p.id === recommended.id;
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-zinc-100 last:border-0 hover:bg-zinc-50 ${
                        isRec ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-800">
                            {p.name}
                          </span>
                          {isRec && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                              ★ Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {p.walkingDistance} m
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            p.availableSpaces <= 5
                              ? "font-semibold text-orange-500"
                              : "font-semibold text-emerald-600"
                          }
                        >
                          {p.availableSpaces} spaces
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-zinc-800">
                        Rs. {p.pricePerHour}/hr
                      </td>
                      <td className="px-4 py-3 text-zinc-600">
                        {p.securityLevel}
                      </td>
                      <td className="px-4 py-3 text-amber-500">
                        ★ {p.rating}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/reserve?parking=${p.id}`}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                        >
                          Reserve
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading…</div>}>
      <SearchContent />
    </Suspense>
  );
}
