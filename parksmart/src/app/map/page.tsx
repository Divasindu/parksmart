"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Navigation, Star } from "lucide-react";
import ParkingMap from "@/components/ParkingMapDynamic";
import ParkingCard from "@/components/ParkingCard";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import PriceBadge from "@/components/PriceBadge";
import SecurityBadge from "@/components/SecurityBadge";
import LiveDataIndicator, { DemoModeBadge } from "@/components/LiveDataIndicator";
import { useApp } from "@/lib/context";
import { DESTINATIONS } from "@/lib/data";

function MapContent() {
  const { parkings, destination, toggleFavorite, isFavorite } = useApp();
  const searchParams = useSearchParams();
  const parkParam = searchParams.get("parking");
  const [selectedId, setSelectedId] = useState<string | null>(parkParam);

  const sorted = useMemo(
    () => [...parkings].sort((a, b) => b.availableSpaces - a.availableSpaces),
    [parkings]
  );

  const selected = parkings.find((p) => p.id === selectedId) || null;
  const activeDest = destination || DESTINATIONS[0];

  return (
    <div className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-extrabold text-zinc-900">
              <MapPin className="h-5 w-5 text-blue-600" /> Parking Availability Map
            </h1>
            <p className="text-sm text-zinc-500">
              {selected
                ? `${selected.name} · click a marker to switch`
                : `${activeDest.name} · tap a marker to focus a parking lot`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LiveDataIndicator />
            <DemoModeBadge />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-600">
          <span className="font-semibold text-zinc-800">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" /> Many spaces
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-orange-500" /> Limited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500" /> Full
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-600" /> Destination
          </span>
          {selected && (
            <button
              onClick={() => setSelectedId(null)}
              className="ml-auto rounded-lg bg-zinc-100 px-3 py-1 font-semibold text-zinc-700 hover:bg-zinc-200"
            >
              Show all parkings
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-6">
        <div className="grid gap-5 lg:grid-cols-5">
          {/* Left list */}
          <div className="lg:col-span-2 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar lg:max-h-[calc(100vh-12rem)]">
            {selected ? (
              /* Focus mode: show ONLY the selected parking */
              <div className="rounded-2xl border-2 border-blue-200 bg-white p-5 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-zinc-900">
                      {selected.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="h-3 w-3" /> {selected.area},{" "}
                      {selected.address}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-sm font-bold text-emerald-600">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      {selected.availableSpaces} / {selected.totalSpaces} spaces
                      available
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-50"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <AvailabilityBadge
                    available={selected.availableSpaces}
                    total={selected.totalSpaces}
                  />
                  <PriceBadge pricePerHour={selected.pricePerHour} />
                  <SecurityBadge level={selected.securityLevel} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                    {selected.walkingDistance} m away
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="h-4 w-4 text-zinc-400" />
                    {selected.drivingMinutes} min drive
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-zinc-800">
                    {selected.rating}
                  </span>
                  <span className="text-zinc-400">rating</span>
                  <span className="ml-auto text-zinc-500">
                    Rs. {selected.pricePerHour}/hr
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/parking/${selected.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/reserve?parking=${selected.id}`}
                    className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    Reserve
                  </Link>
                </div>

                <div className="mt-3">
                  <ParkingCard
                    parking={selected}
                    favorited={isFavorite(selected.id)}
                    onToggleFavorite={() => toggleFavorite(selected.id)}
                  />
                </div>
              </div>
            ) : (
              sorted.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className="w-full text-left"
                >
                  <ParkingCard
                    parking={p}
                    favorited={isFavorite(p.id)}
                    onToggleFavorite={() => toggleFavorite(p.id)}
                  />
                </button>
              ))
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 h-[70vh] lg:h-[calc(100vh-10rem)]">
            <ParkingMap
              parkings={sorted}
              destination={activeDest}
              selectedId={selectedId}
              onSelect={setSelectedId}
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading…</div>}>
      <MapContent />
    </Suspense>
  );
}