"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Navigation, AlertTriangle } from "lucide-react";
import CityMap from "@/components/CityMapDynamic";
import { useApp } from "@/lib/context";
import { DemoModeBadge } from "@/components/LiveDataIndicator";

export default function SafeParkingPage() {
  const { parkings } = useApp();
  const [selected, setSelected] = useState<string | null>(parkings[0]?.id ?? null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <ShieldCheck className="h-6 w-6 text-emerald-600" /> Safe Parking
          </h1>
          <p className="text-sm text-zinc-500">
            Legal and permitted parking so you never block walkways
          </p>
        </div>
        <DemoModeBadge />
      </div>

      {/* Alert */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-600" />
        <div className="text-sm text-emerald-800">
          <p className="font-bold">Legal parking only</p>
          <p>
            Avoid roadside parking that blocks pedestrian walkways and creates
            unsafe conditions. Use ParkSmart to find legal, monitored spaces.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600">
        <span className="font-semibold text-zinc-800">Parking zones:</span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-emerald-500" /> Legal parking
          (ParkSmart verified)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-amber-400" /> Limited time
          parking
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-red-500" /> No parking
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        {/* Zones list */}
        <div className="lg:col-span-2 space-y-3">
          {/* Legal facilities */}
          {parkings.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selected === p.id
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-800">{p.name}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  LEGAL
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {p.area} · {p.walkingDistance} m · Managed parking
              </p>
            </button>
          ))}

          {/* No park zones (illustrative) */}
          <div className="rounded-xl border border-red-100 bg-red-50/50 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-800">
                Chatham Street (Fort)
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                NO PARKING
              </span>
            </div>
            <p className="mt-1 flex items-start gap-1 text-xs text-red-500">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              Roadside stopping blocks walkways — vehicles towed.
            </p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-800">
                Galle Face Promenade Edge
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                LIMITED · 30 MIN
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-700">
              Pay-and-display, 30 minute maximum.
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 lg:sticky lg:top-20 h-[60vh] lg:h-[calc(100vh-10rem)]">
          <CityMap
            legalParkings={parkings}
            selectedId={selected}
            onSelect={setSelected}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: MapPin,
            title: "Use managed lots",
            desc: "Verified lots have attendants, CCTV and clear rules.",
          },
          {
            icon: Navigation,
            title: "Navigate to legal spots",
            desc: "ParkSmart routes you to legal parking, never roadside stops.",
          },
          {
            icon: ShieldCheck,
            title: "Protect pedestrians",
            desc: "Legal parking keeps walkways clear and streets safe.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <f.icon className="h-5 w-5 text-emerald-600" />
            <h3 className="mt-2 text-sm font-bold text-zinc-800">{f.title}</h3>
            <p className="mt-1 text-xs text-zinc-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/map"
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          Explore all parking
        </Link>
      </div>
    </div>
  );
}