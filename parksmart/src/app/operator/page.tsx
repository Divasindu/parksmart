"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Car,
  ParkingCircle,
  Wallet,
  CalendarCheck,
  TrendingUp,
  Clock,
  Plus,
  Radio,
  ScanLine,
  CircleDot,
} from "lucide-react";
import { useApp } from "@/lib/context";
import DashboardCard from "@/components/DashboardCard";
import { DemoModeBadge, SimulationBadge } from "@/components/LiveDataIndicator";
import { VEHICLE_ENTRIES, generateSensorSpaces } from "@/lib/data";
import SensorStatus from "@/components/SensorStatus";
import VehicleStatus from "@/components/VehicleStatus";

export default function OperatorDashboard() {
  const { parkings, showToast } = useApp();

  const totalSpaces = parkings.reduce((s, p) => s + p.totalSpaces, 0);
  const available = parkings.reduce((s, p) => s + p.availableSpaces, 0);
  const occupied = Math.max(0, totalSpaces - available);
  const occupancyPct = Math.round((occupied / totalSpaces) * 100);

  const reservations = 34;
  const totalSensors = useMemo(() => generateSensorSpaces(12), []);
  const recentVehicles = VEHICLE_ENTRIES.slice(0, 2);
  const occupiedSensors = totalSensors.filter((s) => s.status === "occupied").length;

  const topParking = [...parkings].sort((a, b) => b.availableSpaces / b.totalSpaces - a.availableSpaces / a.totalSpaces)[0];
  const busyParking = [...parkings].sort((a, b) => a.availableSpaces / a.totalSpaces - b.availableSpaces / b.totalSpaces)[0];

  const trendData = [42, 38, 45, 40, 35, 39, 42, 38, 41, 37, 40, 42];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900">
            Operator Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            Manage occupancy, reservations and revenue for Fort City Parking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoModeBadge />
          <SimulationBadge />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <DashboardCard icon={Building2} label="Total Spaces" value={totalSpaces} color="blue" />
        <DashboardCard icon={Car} label="Occupied" value={occupied} color="orange" />
        <DashboardCard icon={ParkingCircle} label="Available" value={available} color="green" />
        <DashboardCard icon={Wallet} label="Today's Revenue" value="Rs. 18,400" color="green" />
        <DashboardCard icon={CalendarCheck} label="Reservations" value={reservations} color="blue" />
        <DashboardCard icon={TrendingUp} label="Occupancy" value={`${occupancyPct}%`} color="orange" />
      </div>

      {/* Quick access: attendant slot management */}
      <div className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-bold text-zinc-900">
              <ParkingCircle className="h-5 w-5 text-blue-600" /> Attendant —
              Manage live parking slots
            </h2>
            <p className="text-sm text-zinc-500">
              Click a parking facility to open its slot layout and update
              individual spaces. Drivers see changes instantly.
            </p>
          </div>
          <Link
            href="/operator/slots"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            Open slot manager →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {parkings.slice(0, 8).map((p) => (
            <Link
              key={p.id}
              href={`/operator/slots?parking=${p.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50/60"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-zinc-800">{p.name}</p>
                <p className="text-xs text-zinc-500">
                  {p.availableSpaces} available · {p.totalSpaces} total
                </p>
              </div>
              <ParkingCircle className="ml-2 h-4 w-4 shrink-0 text-blue-600" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Occupancy visualization */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-zinc-900">Occupancy</h2>

          {/* Donut */}
          <div className="relative mx-auto mt-5 h-36 w-36">
            <div
              className="h-full w-full rounded-full"
              style={{
                background: `conic-gradient(#2563eb 0% ${occupancyPct}%, #e5e7eb ${occupancyPct}% 100%)`,
              }}
            />
            <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white">
              <span className="text-2xl font-extrabold text-zinc-900">
                {occupancyPct}%
              </span>
              <span className="text-xs text-zinc-500">Occupied</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <p className="text-lg font-bold text-emerald-700">{available}</p>
              <p className="text-xs text-emerald-600">Available ({100 - occupancyPct}%)</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-2.5">
              <p className="text-lg font-bold text-blue-700">{occupied}</p>
              <p className="text-xs text-blue-600">Occupied ({occupancyPct}%)</p>
            </div>
          </div>
        </div>

        {/* Occupancy trend */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-zinc-900">Occupancy trend</h2>
          <p className="text-xs text-zinc-500">Last 12 intervals · simulated</p>
          <div className="mt-5 flex h-36 items-end gap-1.5">
            {trendData.map((v, i) => (
              <div key={i} className="group relative flex-1">
                <div
                  className={`rounded-t-lg ${
                    v < 40 ? "bg-emerald-400" : v < 45 ? "bg-amber-400" : "bg-blue-500"
                  }`}
                  style={{ height: `${v * 2}px` }}
                />
                <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 rounded bg-zinc-800 px-1 text-[10px] text-white group-hover:block">
                  {v}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-zinc-400">
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>22:00</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/operator/sensors"
              className="rounded-xl bg-blue-50 px-3 py-2.5 text-center text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Radio className="h-4 w-4" /> Sensor view
              </span>
            </Link>
            <Link
              href="/operator/vehicles"
              className="rounded-xl bg-indigo-50 px-3 py-2.5 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <span className="flex items-center justify-center gap-1.5">
                <ScanLine className="h-4 w-4" /> Vehicle entry
              </span>
            </Link>
          </div>
        </div>

        {/* Quick management */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-zinc-900">Quick management</h2>
          <div className="mt-4 space-y-2">
            <button
              onClick={() => showToast("New space added to your lot!", "success")}
              className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 p-3 text-left hover:bg-zinc-50"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Plus className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-800">Add parking space</p>
                <p className="text-xs text-zinc-500">expand capacity</p>
              </div>
            </button>
            <button
              onClick={() => showToast("Price updated successfully", "success")}
              className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 p-3 text-left hover:bg-zinc-50"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Wallet className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-800">Manage prices</p>
                <p className="text-xs text-zinc-500">Rs. 100/hr currently</p>
              </div>
            </button>
            <button
              onClick={() => showToast("Opening hours saved", "success")}
              className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 p-3 text-left hover:bg-zinc-50"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-800">Opening hours</p>
                <p className="text-xs text-zinc-500">06:00 – 23:00</p>
              </div>
            </button>
          </div>

          {/* IoT simulation summary */}
          <div className="mt-4 rounded-xl bg-zinc-50 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
              <CircleDot className="h-4 w-4 text-emerald-500" />
              IoT Sensor Simulation
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {occupiedSensors} of {totalSensors.length} sensor spaces
              currently occupied. This simulates future connected sensors.
            </p>
          </div>
        </div>
      </div>

      {/* Sensor preview */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">Live sensor board</h2>
            <Link
              href="/operator/sensors"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {totalSensors.slice(0, 6).map((s) => (
              <SensorStatus key={s.id} space={s} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">Recent vehicle entries</h2>
            <Link
              href="/operator/vehicles"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentVehicles.map((v) => (
              <VehicleStatus key={v.plate} vehicle={v} />
            ))}
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-5 text-white">
        <h2 className="font-bold">Smart insights</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-zinc-400">Most available right now</p>
            <p className="font-bold">{topParking.name} — {topParking.availableSpaces} spaces</p>
          </div>
          <div>
            <p className="text-sm text-zinc-400">Filling up fastest</p>
            <p className="font-bold">{busyParking.name} — {busyParking.availableSpaces} spaces left</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-amber-400">
              ⚠️ Consider opening overflow capacity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}