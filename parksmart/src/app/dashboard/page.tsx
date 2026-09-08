"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  History,
  Heart,
  BellRing,
  Sparkles,
  Gauge,
  ArrowRight,
  Car,
} from "lucide-react";
import { useApp } from "@/lib/context";
import SearchBar from "@/components/SearchBar";
import ParkingCard from "@/components/ParkingCard";
import ReservationCard from "@/components/ReservationCard";
import RecommendationCard from "@/components/RecommendationCard";
import { DemoModeBadge } from "@/components/LiveDataIndicator";
import { calculateScore } from "@/lib/utils";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const {
    parkings,
    reservations,
    favorites,
    toggleFavorite,
    isFavorite,
    destination,
    showToast,
    preferences,
  } = useApp();

  const active = reservations.filter(
    (r) => r.status === "active" || r.status === "upcoming"
  );
  const recent = reservations.filter((r) => r.status === "completed");
  const favParkings = parkings.filter((p) => favorites.includes(p.id));

  const nearby = useMemo(
    () =>
      [...parkings]
        .sort(
          (a, b) =>
            calculateScore(b, destination, preferences).total -
            calculateScore(a, destination, preferences).total
        )
        .slice(0, 4),
    [parkings, destination, preferences]
  );

  const recommended = nearby[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900">{greeting()}!</h1>
          <p className="text-zinc-500">Where are you going today?</p>
        </div>
        <DemoModeBadge />
      </div>

      <div className="mt-6">
        <SearchBar autoFocus />
      </div>

      {/* Recommendation */}
      {recommended && destination && (
        <div className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-zinc-800">
            <Sparkles className="h-4 w-4 text-blue-600" /> Recommended for you
          </h2>
          <RecommendationCard
            parking={recommended}
            destinationName={destination.name}
          />
        </div>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Left: Nearby + Recent */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-zinc-800">
                <Gauge className="h-4 w-4 text-blue-600" /> Nearby parking
              </h2>
              <Link
                href="/map"
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
              >
                Open map <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {nearby.map((p) => (
                <ParkingCard
                  key={p.id}
                  parking={p}
                  recommended={!!(destination && p.id === recommended.id)}
                  favorited={isFavorite(p.id)}
                  onToggleFavorite={() => {
                    toggleFavorite(p.id);
                    showToast(
                      isFavorite(p.id) ? "Removed from favorites" : "Saved to favorites",
                      "info"
                    );
                  }}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-zinc-800">
                <CalendarCheck className="h-4 w-4 text-blue-600" /> Your
                reservations
              </h2>
              <Link
                href="/history"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View history
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {active.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
                  No active reservations. Find parking to reserve a space.
                  <div className="mt-3">
                    <Link
                      href="/search"
                      className="inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                    >
                      Find parking
                    </Link>
                  </div>
                </div>
              ) : (
                active.map((r) => <ReservationCard key={r.id} reservation={r} />)
              )}
            </div>
          </section>
        </div>

        {/* Right column: favorites + recent */}
        <div className="space-y-8">
          <section>
            <h2 className="flex items-center gap-2 font-bold text-zinc-800">
              <Heart className="h-4 w-4 text-red-500" /> Favorite parking
            </h2>
            <div className="mt-4 space-y-3">
              {favParkings.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-zinc-300 p-4 text-center text-sm text-zinc-500">
                  No favorites yet. Tap ♥ on any parking to save it.
                </p>
              ) : (
                favParkings.map((p) => (
                  <Link
                    key={p.id}
                    href={`/parking/${p.id}`}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm hover:shadow-md"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-zinc-800">{p.name}</p>
                      <p className="text-xs text-emerald-600 font-semibold">
                        ● {p.availableSpaces} spaces · Rs. {p.pricePerHour}/hr
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 font-bold text-zinc-800">
              <History className="h-4 w-4 text-blue-600" /> Recent parking
            </h2>
            <div className="mt-4 space-y-3">
              {recent.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                      <Car className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-zinc-800">
                        Fort City Parking
                      </p>
                      <p className="text-xs text-zinc-500">
                        Sep 8, 2026 · 2 hours · Rs. 200
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                recent.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                        <Car className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-zinc-800">
                          {r.parkingName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {r.date} · {r.durationHours}h · Rs. {r.cost}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 font-bold text-zinc-800">
              <BellRing className="h-4 w-4 text-amber-500" /> Quick actions
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/map"
                className="rounded-xl bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Find Parking
              </Link>
              <Link
                href="/favorites"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Favorites
              </Link>
              <Link
                href="/private-parking"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Private Parking
              </Link>
              <Link
                href="/operator"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Operator Demo
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}