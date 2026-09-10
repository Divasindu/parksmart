import { ParkingSlot, SlotStatus } from "./types";
import { addHours, minutesToTime12 } from "./utils";

// Lightweight in-memory real-time parking-status simulation.
//
// The simulation produces a stream of slot status events that the parking
// context applies periodically. It is structured as discrete events so that,
// in the future, events coming from real sensors / an API / a backend can
// replace the simulated events without rebuilding the UI.

export interface SimulatedSlotEvent {
  parkingId: string;
  slotId: string;
  from: SlotStatus;
  to: SlotStatus;
}

// Builds a small, gradual demo sequence against the CURRENT live slot layout.
// Events cover every parking currently in the system (the built-in demo lots
// and any partner-registered facility) so the driver, attendant and partner
// views all watch the same live status. Targets are resolved at build time so
// every event only references a slot that really has the required starting
// status right now. One change is applied every few seconds while the
// simulation runs.
export function buildDemoSimulationEvents(
  slotsByParking: Record<string, ParkingSlot[]>
): SimulatedSlotEvent[] {
  const events: SimulatedSlotEvent[] = [];

  const find = (
    parkingId: string,
    status: SlotStatus,
    index: number
  ): ParkingSlot | null => {
    const list = slotsByParking[parkingId] ?? [];
    return list.filter((s) => s.status === status)[index] ?? null;
  };

  // For every parking produce a realistic gradual sequence:
  //   available -> reserved -> occupied (full viewing cycle on one slot),
  //   occupied -> available, available -> occupied, available -> reserved,
  //   reserved -> available.
  for (const parkingId of Object.keys(slotsByParking)) {
    const a = find(parkingId, "available", 2);
    if (a) {
      events.push(
        { parkingId, slotId: a.id, from: "available", to: "reserved" },
        { parkingId, slotId: a.id, from: "reserved", to: "occupied" }
      );
    }
    const d = find(parkingId, "occupied", 0);
    if (d) {
      events.push({ parkingId, slotId: d.id, from: "occupied", to: "available" });
    }
    const e = find(parkingId, "available", 0);
    if (e && e.id !== a?.id) {
      events.push({ parkingId, slotId: e.id, from: "available", to: "occupied" });
    }
    const b = find(parkingId, "available", 1);
    if (b && b.id !== a?.id && b.id !== e?.id) {
      events.push({ parkingId, slotId: b.id, from: "available", to: "reserved" });
    }
    const c = find(parkingId, "reserved", 0);
    if (c) {
      events.push({ parkingId, slotId: c.id, from: "reserved", to: "available" });
    }

    if (events.length >= 30) break;
  }

  // Fallback so the demo never stalls: reserve one available slot anywhere.
  if (events.length === 0) {
    for (const [pid, list] of Object.entries(slotsByParking)) {
      const avail = list.find((s) => s.status === "available");
      if (avail) {
        events.push({
          parkingId: pid,
          slotId: avail.id,
          from: "available",
          to: "reserved",
        });
        break;
      }
    }
  }

  return events;
}

// Applies a single event to the slot map. Returns null when the precondition
// is no longer true (e.g. the slot changed status between steps).
export function applySimulationEvent(
  slotsByParking: Record<string, ParkingSlot[]>,
  event: SimulatedSlotEvent
): Record<string, ParkingSlot[]> | null {
  const list = slotsByParking[event.parkingId];
  if (!list) return null;
  const slot = list.find((s) => s.id === event.slotId);
  if (!slot || slot.status !== event.from) return null;

  let next: ParkingSlot;
  if (event.to === "reserved") {
    // A simulated reservation holds a fixed time window so the driver-side
    // overlap logic treats it like a real user reservation.
    const startMin = 14 * 60 + (list.indexOf(slot) % 30);
    const reservedFrom = minutesToTime12(startMin);
    next = {
      ...slot,
      status: "reserved",
      reservedFrom,
      reservedTo: addHours(reservedFrom, 2),
      updatedAt: "just now",
    };
  } else {
    next = {
      ...slot,
      status: event.to,
      reservedFrom: undefined,
      reservedTo: undefined,
      updatedAt: "just now",
    };
  }

  return {
    ...slotsByParking,
    [event.parkingId]: list.map((s) => (s.id === event.slotId ? next : s)),
  };
}