"use client";

import { useState } from "react";
import {
  Car,
  Check,
  Lock,
  Clock,
  ArrowDown,
  ArrowUp,
  UserRoundX,
  UserRoundPlus,
  PauseCircle,
  XCircle,
} from "lucide-react";
import { ParkingLocation, ParkingSlot } from "@/lib/types";
import { useApp } from "@/lib/context";

function statusLabel(slot: ParkingSlot, disabled: boolean): string {
  if (slot.status === "occupied") return "Occupied";
  if (slot.status === "reserved") {
    if (slot.reservedFrom && slot.reservedTo && !disabled)
      return `Reserved ${slot.reservedFrom} – ${slot.reservedTo}`;
    if (slot.reservedFrom && slot.reservedTo)
      return `Reserved ${slot.reservedFrom} – ${slot.reservedTo} · overlaps your time`;
    return "Reserved";
  }
  return "Available";
}

export default function SlotMap({
  parking,
  slots,
  mode = "select",
  selectedSlotId,
  arrival = "2:30 PM",
  duration = 2,
  onSelect,
}: {
  parking: ParkingLocation;
  slots: ParkingSlot[];
  mode?: "select" | "manage";
  selectedSlotId?: string | null;
  arrival?: string;
  duration?: number;
  onSelect?: (slotId: string) => void;
}) {
  const { updateSlotStatus, canSelectSlot, showToast } = useApp();
  const [activeSlot, setActiveSlot] = useState<ParkingSlot | null>(null);

  const occupied = slots.filter((s) => s.status === "occupied").length;
  const reserved = slots.filter((s) => s.status === "reserved").length;
  const available = slots.length - occupied - reserved;

  const rows = [...new Set(slots.map((s) => s.row))].sort();

  const handleSlotClick = (slot: ParkingSlot) => {
    if (mode === "manage") {
      setActiveSlot(slot);
      return;
    }
    if (slot.status === "occupied") {
      showToast(`Slot ${slot.number} is currently occupied`, "error");
      return;
    }
    const { selectable, reason } = canSelectSlot(
      parking.id,
      slot.id,
      arrival,
      duration
    );
    if (!selectable) {
      showToast(`Slot ${slot.number} · ${reason}`, "error");
      return;
    }
    if (slot.status === "reserved") {
      showToast(
        `Slot ${slot.number} is free for your time window — selected!`,
        "info"
      );
    }
    onSelect?.(slot.id);
  };

  const applyStatus = (status: "occupied" | "available" | "reserved") => {
    if (!activeSlot) return;
    updateSlotStatus(parking.id, activeSlot.id, status);
    showToast(
      `Slot ${activeSlot.number} marked ${status} — drivers see this update instantly`,
      "success"
    );
    setActiveSlot(null);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {/* Header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
        <div>
          <h3 className="font-bold text-zinc-900">{parking.name}</h3>
          <p className="text-xs text-zinc-500">
            Select an exact parking slot from the live layout
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-red-300 bg-red-100" />
            Occupied
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-amber-300 bg-amber-100" />
            Reserved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-zinc-300 bg-white" />
            Available
          </span>
        </div>
      </div>

      {/* Live counters */}
      <div className="grid grid-cols-3 divide-x divide-zinc-100 border-b border-zinc-100 text-center">
        <div className="bg-red-50/60 px-3 py-2">
          <p className="text-lg font-extrabold text-red-600">{occupied}</p>
          <p className="text-[11px] font-semibold text-red-500">Occupied</p>
        </div>
        <div className="bg-amber-50/60 px-3 py-2">
          <p className="text-lg font-extrabold text-amber-600">{reserved}</p>
          <p className="text-[11px] font-semibold text-amber-600">Reserved</p>
        </div>
        <div className="bg-emerald-50/60 px-3 py-2">
          <p className="text-lg font-extrabold text-emerald-600">{available}</p>
          <p className="text-[11px] font-semibold text-emerald-600">
            Available
          </p>
        </div>
      </div>

      {/* Lot */}
      <div className="px-4 py-4">
        {/* Entrance */}
        <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-dashed border-blue-300 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
          <ArrowDown className="h-4 w-4" /> PARKING ENTRANCE
        </div>

        <div className="max-h-[520px] overflow-auto rounded-xl bg-zinc-50 p-3">
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-2">
                <div className="flex h-12 w-7 shrink-0 flex-col items-center justify-center rounded-md bg-zinc-800 text-xs font-bold text-white">
                  {row}
                </div>
                <div className="flex flex-1 gap-2 overflow-x-auto pb-0.5">
                  {slots
                    .filter((s) => s.row === row)
                    .map((s) => {
                      const disabled =
                        mode === "select" &&
                        s.status !== "available" &&
                        !canSelectSlot(
                          parking.id,
                          s.id,
                          arrival,
                          duration
                        ).selectable;
                      const selected = selectedSlotId === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => handleSlotClick(s)}
                          disabled={mode === "select" && disabled}
                          title={statusLabel(s, disabled)}
                          aria-label={`Slot ${s.number}, ${statusLabel(s, disabled)}`}
                          className={`group relative flex h-20 w-16 shrink-0 flex-col items-center justify-between rounded-lg border-4 border-b-4 px-1 pt-3 pb-1 transition-all duration-200 ${
                            s.status === "occupied"
                              ? "border-red-200 bg-red-50"
                              : s.status === "reserved"
                              ? "border-amber-200 bg-amber-50"
                              : "border-zinc-300 bg-white hover:border-emerald-300 hover:bg-emerald-50"
                          } ${
                            selected
                              ? "!border-blue-500 !bg-blue-50 ring-2 ring-blue-400 ring-offset-2 scale-105 shadow-md"
                              : ""
                          } ${
                            disabled
                              ? "cursor-not-allowed opacity-70"
                              : "cursor-pointer"
                          } ${mode === "manage" ? "hover:ring-2 hover:ring-blue-300" : ""}`}
                        >
                          {/* top painted line */}
                          <span
                            className={`absolute inset-x-1 top-0.5 h-px border-t-2 border-dashed ${
                              s.status === "occupied"
                                ? "border-red-300"
                                : s.status === "reserved"
                                ? "border-amber-300"
                                : "border-zinc-300"
                            }`}
                          />
                          <span className="text-[10px] font-bold text-zinc-500">
                            {s.number}
                          </span>
                          <span
                            className={`${
                              s.status === "occupied"
                                ? "text-red-500"
                                : s.status === "reserved"
                                ? "text-amber-500"
                                : selected
                                ? "text-blue-600"
                                : "text-zinc-400"
                            }`}
                          >
                            <Car className="h-5 w-5" />
                          </span>
                          {s.status === "reserved" ? (
                            <span
                              className={`flex items-center gap-0.5 text-[9px] font-semibold ${
                                disabled ? "text-amber-600" : "text-amber-600"
                              }`}
                            >
                              <Clock className="h-2.5 w-2.5" /> RESERVED
                            </span>
                          ) : s.status === "occupied" ? (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-red-500">
                              <Lock className="h-2.5 w-2.5" /> FULL
                            </span>
                          ) : selected ? (
                            <span className="flex items-center gap-0.5 text-[9px] font-bold text-blue-600">
                              <Check className="h-2.5 w-2.5" /> SELECTED
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-emerald-600">
                              FREE
                            </span>
                          )}
                          {mode === "manage" && s.status === "available" && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                              <UserRoundPlus className="h-3 w-3" />
                            </span>
                          )}
                          {mode === "manage" && s.status === "occupied" && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white">
                              <UserRoundX className="h-3 w-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exit */}
        <div className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-dashed border-zinc-300 bg-zinc-100 px-4 py-1.5 text-xs font-bold text-zinc-600">
          <ArrowUp className="h-4 w-4" /> EXIT
        </div>
      </div>

      {/* Attendant control panel */}
      {mode === "manage" && activeSlot && (
        <div className="border-t border-zinc-100 bg-zinc-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-zinc-900">
                Slot {activeSlot.row}-{activeSlot.number}
              </p>
              <p className="text-xs text-zinc-500">
                Current status:{" "}
                <span className="font-semibold text-zinc-700">
                  {activeSlot.status}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyStatus("occupied")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                <XCircle className="h-4 w-4" /> Mark Occupied
              </button>
              <button
                onClick={() => applyStatus("reserved")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-sm font-bold text-white hover:bg-amber-600"
              >
                <PauseCircle className="h-4 w-4" /> Mark Reserved
              </button>
              <button
                onClick={() => applyStatus("available")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
              >
                <Check className="h-4 w-4" /> Mark Available
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}