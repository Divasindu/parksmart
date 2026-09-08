"use client";

import { Database, Activity } from "lucide-react";
import { useApp } from "@/lib/context";

export default function LiveDataIndicator() {
  const { lastUpdated } = useApp();

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm border border-zinc-200">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="font-semibold text-emerald-700">● Live data</span>
      <span className="text-zinc-400">Last updated: {lastUpdated}</span>
    </div>
  );
}

export function DemoModeBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      <Database className="h-3.5 w-3.5" />
      Demo Mode · Simulated data
    </div>
  );
}

export function SimulationBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
      <Activity className="h-3.5 w-3.5" />
      Simulation Active
    </div>
  );
}
