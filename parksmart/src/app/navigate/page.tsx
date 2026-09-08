"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Navigation,
  MapPin,
  Clock,
  Car,
  TrafficCone,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import ParkingMap from "@/components/ParkingMapDynamic";
import { useApp } from "@/lib/context";
import { DESTINATIONS } from "@/lib/data";
import { formatDistance, trafficColor } from "@/lib/utils";
import { DemoModeBadge } from "@/components/LiveDataIndicator";

function NavigateContent() {
  const { parkings, destination, showToast } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const parkingId = searchParams.get("parking");
  const parking =
    parkings.find((p) => p.id === parkingId) ||
    parkings.find((p) => p.availableSpaces > 0) ||
    parkings[0];

  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [arrived, setArrived] = useState(false);

  const activeDest = destination || DESTINATIONS[0];
  const remaining = Math.max(0, Math.round(parking.drivingDistanceKm - progress));

  useEffect(() => {
    if (!started || arrived) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + parking.drivingDistanceKm / 80;
        if (next >= parking.drivingDistanceKm) {
          clearInterval(interval);
          setArrived(true);
          showToast("You have arrived at your parking!", "success");
          return parking.drivingDistanceKm;
        }
        return next;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [started, arrived, parking.drivingDistanceKm, showToast]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900">
            Navigate to {parking.name}
          </h1>
          <p className="text-sm text-zinc-500">{parking.address}</p>
        </div>
        <DemoModeBadge />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        {/* Left: instructions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <MapPin className="h-4 w-4 text-blue-600" />
              Destination:{" "}
              <span className="font-bold text-zinc-800">{activeDest.name}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-zinc-900">
                  <Car className="h-4 w-4 text-blue-600" />
                  {parking.drivingDistanceKm} km
                </div>
                <div className="text-[11px] text-zinc-500">Distance</div>
              </div>
              <div className="border-x border-zinc-200">
                <div className="flex items-center justify-center gap-1 text-lg font-bold text-zinc-900">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {parking.drivingMinutes} min
                </div>
                <div className="text-[11px] text-zinc-500">Est. time</div>
              </div>
              <div>
                <div
                  className={`flex items-center justify-center gap-1 text-lg font-bold ${trafficColor(parking.trafficLevel)}`}
                >
                  <TrafficCone className="h-4 w-4" />
                  {parking.trafficLevel}
                </div>
                <div className="text-[11px] text-zinc-500">Traffic</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{formatDistance(remaining * 1000)} remaining</span>
                <span>{Math.round((progress / parking.drivingDistanceKm) * 100)}%</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${(progress / parking.drivingDistanceKm) * 100}%`,
                  }}
                />
              </div>
            </div>

            {!started && (
              <button
                onClick={() => setStarted(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <Navigation className="h-5 w-5" /> Start Navigation
              </button>
            )}

            {arrived && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-5 w-5" /> You have arrived
                </div>
                <p className="mt-1 text-sm">
                  Simulated sensor confirms your reserved space.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      router.push(`/reserve?parking=${parking.id}`)
                    }
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    Reserve
                  </button>
                  <button
                    onClick={() => router.push(`/parking/${parking.id}`)}
                    className="rounded-xl border border-emerald-300 px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Turn-by-turn simulation */}
          {started && !arrived && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-800">
                Turn-by-turn (simulated)
              </h3>
              <div className="mt-3 space-y-3">
                {[
                  "Head straight on Galle Road towards your parking",
                  "Turn left at the next junction",
                  "Continue 400 m — parking entrance on your right",
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        progress > (i + 1) * 30
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {progress > (i + 1) * 30 ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                    <p className="text-sm text-zinc-700">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alert */}
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
            <div className="text-sm text-amber-800">
              <p className="font-bold">Traffic notice</p>
              <p className="mt-0.5">
                ParkSmart simulates live traffic data. Your route uses the best
                available path.
              </p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 lg:sticky lg:top-20 h-[50vh] lg:h-[calc(100vh-10rem)]">
          <ParkingMap
            parkings={[parking]}
            destination={activeDest}
            selectedId={parking.id}
            showRoute
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}

export default function NavigatePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading…</div>}>
      <NavigateContent />
    </Suspense>
  );
}