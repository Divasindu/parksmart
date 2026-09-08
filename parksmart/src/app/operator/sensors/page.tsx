"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Radio,
  AlertTriangle,
  Wifi,
  CircleDot,
  RefreshCw,
  Server,
} from "lucide-react";
import SensorStatus from "@/components/SensorStatus";
import { DemoModeBadge } from "@/components/LiveDataIndicator";
import { generateSensorSpaces, PARKING_LOCATIONS } from "@/lib/data";
import { SensorSpace } from "@/lib/types";

export default function SensorsPage() {
  const [spaces, setSpaces] = useState<SensorSpace[]>(() =>
    generateSensorSpaces(24)
  );
  const [lastSync, setLastSync] = useState("just now");

  useEffect(() => {
    const interval = setInterval(() => {
      setSpaces((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          status:
            idx % 2 === 0
              ? "occupied"
              : Math.random() > 0.5
              ? "available"
              : "occupied",
          updatedAt: "just now",
        };
        return next;
      });
      setLastSync("just now");
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const occupied = spaces.filter((s) => s.status === "occupied").length;
  const available = spaces.filter((s) => s.status === "available").length;

  const groups = useMemo(() => {
    return ["A", "B", "C"].map((level, li) => ({
      level,
      spaces: spaces.filter((_, i) => i % 3 === li),
    }));
  }, [spaces]);

  const parking = PARKING_LOCATIONS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <Radio className="h-6 w-6 text-emerald-600" /> IoT Sensor Simulation
          </h1>
          <p className="text-sm text-zinc-500">
            Prototype of future connected parking sensors at {parking.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoModeBadge />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <Wifi className="h-3.5 w-3.5" /> 24/24 sensors online
          </span>
        </div>
      </div>

      {/* Notice */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
        <div className="text-sm text-amber-800">
          <p className="font-bold">Simulation notice</p>
          <p>
            No real sensors are connected. This dashboard simulates how future
            IoT sensors would report live occupancy for each space.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-zinc-900">{spaces.length}</p>
          <p className="text-xs text-zinc-500">Sensors deployed</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-emerald-700">{available}</p>
          <p className="text-xs text-emerald-600">Available</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-red-600">{occupied}</p>
          <p className="text-xs text-red-500">Occupied</p>
        </div>
      </div>

      {/* Live status */}
      <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Receiving updates
        </span>
        <span>· {lastSync}</span>
        <button
          onClick={() => {
            setSpaces(generateSensorSpaces(24));
            setLastSync("just now");
          }}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Simulate refresh
        </button>
      </div>

      {/* Levels */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {groups.map((g) => (
          <div key={g.level}>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-white">
                {g.level}
              </span>
              <h2 className="font-bold text-zinc-800">Level {g.level}</h2>
              <span className="ml-auto text-xs text-zinc-400">
                {g.spaces.filter((s) => s.status === "occupied").length}/
                {g.spaces.length} occupied
              </span>
            </div>
            <div className="space-y-2">
              {g.spaces.map((s) => (
                <SensorStatus key={s.id} space={s} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Server,
            title: "Sensor network",
            desc: "Each space has a simulated IoT sensor reporting occupancy in real time.",
          },
          {
            icon: Wifi,
            title: "Gateway",
            desc: "Sensors relay status to the ParkSmart platform every few seconds.",
          },
          {
            icon: CircleDot,
            title: "Live dashboard",
            desc: "Occupancy is reflected instantly across map, search and operator views.",
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
    </div>
  );
}