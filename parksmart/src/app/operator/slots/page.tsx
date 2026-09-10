"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ParkingSquare, Radio, Users } from "lucide-react";
import { useApp } from "@/lib/context";
import ParkingMap from "@/components/ParkingMapDynamic";
import SlotMap from "@/components/SlotMap";
import SimulationControl from "@/components/SimulationControl";
import { DemoModeBadge, SimulationBadge } from "@/components/LiveDataIndicator";
import { DESTINATIONS } from "@/lib/data";

function SlotsContent() {
  const { parkings, slotsByParking, getSlotCounts } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const parkParam = searchParams.get("parking");

  const parking =
    parkings.find((p) => p.id === parkParam) ?? parkings[0];

  const slots = slotsByParking[parking.id] ?? [];
  const counts = getSlotCounts(parking.id);

  const demand = useMemo(() => {
    const total = parkings.reduce((s, p) => s + p.totalSpaces, 0);
    const avail = parkings.reduce((s, p) => s + p.availableSpaces, 0);
    return Math.round((avail / total) * 100);
  }, [parkings]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <ParkingSquare className="h-6 w-6 text-blue-600" /> Parking Attendant —
            Slot Management
          </h1>
          <p className="text-sm text-zinc-500">
            Click a slot to mark it occupied or available. Drivers see the
            change instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoModeBadge />
          <SimulationBadge />
        </div>
      </div>

      {/* Facility selection via map */}
      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold text-zinc-900">
            <Users className="h-5 w-5 text-blue-600" /> Select your facility
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Choose the parking lot you are working at. The layout below switches
            automatically.
          </p>
          <div className="mt-4 h-64 overflow-hidden rounded-xl">
            <ParkingMap
              parkings={parkings}
              destination={DESTINATIONS[0]}
              selectedId={parking.id}
              onSelect={(id) => router.replace(`/operator/slots?parking=${id}`)}
              height="100%"
            />
          </div>
          <div className="mt-4 max-h-56 space-y-2 overflow-y-auto">
            {parkings.map((p) => {
              const active = p.id === parking.id;
              return (
                <button
                  key={p.id}
                  onClick={() =>
                    router.replace(`/operator/slots?parking=${p.id}`)
                  }
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-blue-300 bg-blue-50"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-zinc-800">{p.name}</p>
                    <p className="text-xs text-zinc-500">
                      {p.area} · {getSlotCounts(p.id).available} available
                    </p>
                  </div>
                  {active && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live summary */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-zinc-900">
                {counts.total}
              </p>
              <p className="text-xs text-zinc-500">Total</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-red-600">
                {counts.occupied}
              </p>
              <p className="text-xs text-red-500">Occupied</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-amber-600">
                {counts.reserved}
              </p>
              <p className="text-xs text-amber-600">Reserved</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center shadow-sm">
              <p className="text-2xl font-extrabold text-emerald-700">
                {counts.available}
              </p>
              <p className="text-xs text-emerald-600">Available</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
            <span className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Radio className="h-4 w-4 text-emerald-500" />
              City-wide availability: {demand}%
            </span>
            <span className="text-xs text-zinc-500">
              {counts.occupied} + {counts.reserved} + {counts.available} ={" "}
              {counts.total} slots · always in sync
            </span>
            <span className="ml-auto">
              <SimulationControl />
            </span>
          </div>

          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
            Real-time scenario: a vehicle arrives without reserving → click its
            slot and <span className="font-bold">Mark Occupied</span>. Any driver
            viewing this lot immediately sees it turn red and the available count
            drop.
          </p>
        </div>
      </div>

      {/* Slot map */}
      <div className="mt-8">
        <SlotMap parking={parking} slots={slots} mode="manage" />
      </div>
    </div>
  );
}

export default function OperatorSlotsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading…</div>}>
      <SlotsContent />
    </Suspense>
  );
}