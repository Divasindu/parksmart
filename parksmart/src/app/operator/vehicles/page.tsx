"use client";

import { useState } from "react";
import {
  ScanLine,
  Car,
  LogOut,
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import VehicleStatus from "@/components/VehicleStatus";
import { DemoModeBadge } from "@/components/LiveDataIndicator";
import { VEHICLE_ENTRIES, PARKING_LOCATIONS } from "@/lib/data";
import { VehicleEntry } from "@/lib/types";
import { useApp } from "@/lib/context";

const PLATES = [
  "WP CAB-1234",
  "WP CEE-7701",
  "WP GBA-8842",
  "WP ACH-9921",
  "WP HHC-2246",
  "WP CDF-5310",
];

export default function VehiclesPage() {
  const { parkings, showToast } = useApp();
  const [parkingId, setParkingId] = useState(PARKING_LOCATIONS[0].id);
  const [entries, setEntries] = useState<VehicleEntry[]>(VEHICLE_ENTRIES);
  const [scanning, setScanning] = useState(false);
  const [current, setCurrent] = useState<VehicleEntry | null>(null);

  const parking = parkings.find((p) => p.id === parkingId) || parkings[0];

  const simulatedEntry = () => {
    setScanning(true);
    setTimeout(() => {
      const plate = PLATES[Math.floor(Math.random() * PLATES.length)];
      const now = new Date();
      const entry: VehicleEntry = {
        plate,
        entryTime: now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        parkingName: parking.name,
        space: `A-${String(Math.floor(Math.random() * 40) + 1).padStart(2, "0")}`,
        status: "parked",
      };
      setCurrent(entry);
      setEntries((prev) => [entry, ...prev]);
      setScanning(false);
      showToast(
        `ANPR recognized ${plate} — space assigned ${entry.space}`,
        "success"
      );
    }, 1800);
  };

  const exitVehicle = (v: VehicleEntry) => {
    const now = new Date();
    setEntries((prev) =>
      prev.map((e) =>
        e.plate === v.plate
          ? {
              ...e,
              status: "exited" as const,
              exitTime: now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
            }
          : e
      )
    );
    setCurrent(null);
    showToast(`Vehicle ${v.plate} checked out. Space freed.`, "info");
  };

  const parked = entries.filter((e) => e.status === "parked");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <ScanLine className="h-6 w-6 text-indigo-600" /> ANPR / Vehicle Entry
            Simulation
          </h1>
          <p className="text-sm text-zinc-500">
            Prototype of automatic number-plate recognition at the barrier
          </p>
        </div>
        <DemoModeBadge />
      </div>

      {/* Notice */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
        <div className="text-sm text-amber-800">
          <p className="font-bold">Simulation notice</p>
          <p>
            No real camera recognition is used. Number plates are simulated to
            demonstrate how ANPR would automate vehicle entry and exit.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Entry terminal */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-zinc-900">
            <Camera className="h-5 w-5 text-indigo-600" /> Entry terminal
          </h2>

          {/* Camera view */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-zinc-900 p-6 text-center">
            <div className="mx-auto flex h-28 w-48 items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800">
              {scanning ? (
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <ScanLine className="h-8 w-8 animate-pulse" />
                  <span className="text-xs">Scanning number plate…</span>
                </div>
              ) : current ? (
                <div className="text-center">
                  <p className="font-mono text-lg font-bold tracking-widest text-emerald-400">
                    {current.plate}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {current.parkingName} · Space {current.space}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                  <Car className="h-8 w-8" />
                  <span className="text-xs">Waiting for vehicle…</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-zinc-600">
              Parking facility
            </label>
            <select
              value={parking.id}
              onChange={(e) => setParkingId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800"
            >
              {parkings.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={simulatedEntry}
            disabled={scanning}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            <ScanLine className="h-5 w-5" />
            {scanning ? "Scanning…" : "Simulate vehicle entry"}
          </button>

          {/* Last detected */}
          {current && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="h-5 w-5" /> Vehicle identified
              </div>
              <div className="mt-3 space-y-2 text-sm text-emerald-900">
                <p className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-mono font-bold">{current.plate}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Entry: {current.entryTime}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {current.parkingName} · Space{" "}
                  {current.space}
                </p>
              </div>
              <button
                onClick={() => exitVehicle(current)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <LogOut className="h-4 w-4" /> Simulate vehicle exit
              </button>
            </div>
          )}
        </div>

        {/* Today's log */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-zinc-900">
            Today&apos;s vehicle log ({parked.length} parked)
          </h2>
          <p className="text-xs text-zinc-500">
            Space availability updates automatically as vehicles enter and exit
          </p>

          <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto">
            {entries.map((v) => (
              <div key={v.plate}>
                <VehicleStatus vehicle={v} />
                {v.status === "parked" && (
                  <button
                    onClick={() => exitVehicle(v)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-50"
                  >
                    Simulate exit
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data flow explanation */}
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-5 text-white">
        <h2 className="font-bold">How ANPR would work in production</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3 text-sm text-indigo-100">
          <div>
            <p className="font-semibold text-white">1. Entry</p>
            <p>Camera reads the number plate as the vehicle reaches the barrier.</p>
          </div>
          <div>
            <p className="font-semibold text-white">2. Match</p>
            <p>Plate is matched against reservations and assigned an open space.</p>
          </div>
          <div>
            <p className="font-semibold text-white">3. Update</p>
            <p>Occupancy, revenue and the smart map all update immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}