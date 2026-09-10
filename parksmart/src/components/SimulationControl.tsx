"use client";

import { Play, Pause, RotateCcw } from "lucide-react";
import { useApp } from "@/lib/context";

export default function SimulationControl() {
  const {
    simulationRunning,
    startSimulation,
    stopSimulation,
    resetSimulation,
  } = useApp();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-sm">
      <span className="px-1.5 text-[11px] font-semibold text-zinc-500">
        Live simulation
      </span>
      {simulationRunning ? (
        <button
          onClick={stopSimulation}
          className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-amber-600"
        >
          <Pause className="h-3.5 w-3.5" /> Pause
        </button>
      ) : (
        <button
          onClick={startSimulation}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
        >
          <Play className="h-3.5 w-3.5" /> Start
        </button>
      )}
      <button
        onClick={resetSimulation}
        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Reset
      </button>
    </div>
  );
}