"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  PARKING_LOCATIONS,
  INITIAL_NOTIFICATIONS,
  generateAllSlots,
  generateSlotsForParking,
} from "@/lib/data";
import {
  ParkingLocation,
  ParkingSlot,
  Reservation,
  Notification,
  UserPreferences,
  DestinationOption,
  SlotStatus,
} from "@/lib/types";
import {
  addHours,
  timeToMinutes,
  windowsOverlap,
  generateSearchId,
} from "@/lib/utils";
import {
  buildDemoSimulationEvents,
  applySimulationEvent,
  SimulatedSlotEvent,
} from "./simulation";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  parkings: ParkingLocation[];
  reservations: Reservation[];
  notifications: Notification[];
  unreadCount: number;
  favorites: string[];
  preferences: UserPreferences;
  destination: DestinationOption | null;
  lastUpdated: string;
  slotsByParking: Record<string, ParkingSlot[]>;
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  setPreferences: (p: Partial<UserPreferences>) => void;
  setDestination: (d: DestinationOption | null) => void;
  addReservation: (
    r: Omit<Reservation, "id" | "createdAt" | "status">
  ) => string;
  cancelReservation: (id: string) => void;
  completeReservation: (id: string) => void;
  clearToasts: () => void;
  updateSlotStatus: (
    parkingId: string,
    slotId: string,
    status: SlotStatus,
    window?: { reservedFrom?: string; reservedTo?: string }
  ) => void;
  getSlotCounts: (
    parkingId: string
  ) => { total: number; occupied: number; reserved: number; available: number };
  canSelectSlot: (
    parkingId: string,
    slotId: string,
    arrival: string,
    durationHours: number
  ) => { selectable: boolean; reason: string };
  partnerFacilities: string[];
  addParking: (input: Omit<ParkingLocation, "id">) => string;
  updateParking: (
    id: string,
    changes: Partial<
      Pick<
        ParkingLocation,
        | "name"
        | "pricePerHour"
        | "dailyMax"
        | "description"
        | "securityLevel"
        | "reservationAvailable"
      >
    >
  ) => void;
  simulationRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [parkings, setParkings] = useState<ParkingLocation[]>(PARKING_LOCATIONS);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [notifications, setNotifications] =
    useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [favorites, setFavorites] = useState<string[]>(["p1", "p2", "p4"]);
  const [preferences, setPreferencesState] = useState<UserPreferences>({
    cheapest: false,
    closest: true,
    highestAvailability: true,
    highestSecurity: false,
    covered: false,
    evCharging: false,
    accessible: false,
  });
  const [destination, setDestinationState] = useState<DestinationOption | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState("just now");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [slotsByParking, setSlotsByParking] = useState<
    Record<string, ParkingSlot[]>
  >(() => generateAllSlots(PARKING_LOCATIONS));
  const [partnerFacilities, setPartnerFacilities] = useState<string[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(true);
  const lastUpdateMinute = useRef(0);
  const toastId = useRef(0);
  const slotsRef = useRef(slotsByParking);
  const simEventsRef = useRef<SimulatedSlotEvent[]>([]);
  const simEventIndexRef = useRef(0);

  useEffect(() => {
    slotsRef.current = slotsByParking;
  }, [slotsByParking]);

  const recomputeParkingFromSlots = useCallback(
    (slots: Record<string, ParkingSlot[]>) => {
      setParkings((prev) =>
        prev.map((p) => {
          const list = slots[p.id];
          if (!list) return p;
          const available = list.filter(
            (s) => s.status === "available"
          ).length;
          return { ...p, availableSpaces: available };
        })
      );
    },
    []
  );

  // Simulated real-time parking-status updates: one slot changes every ~4
  // seconds (available -> reserved -> occupied -> available), driving live
  // availability across the whole app. Events are reusable, so live data from
  // sensors/API could replace them later without rebuilding the UI.
  useEffect(() => {
    if (!simulationRunning) return;

    const interval = setInterval(() => {
      let events = simEventsRef.current;
      if (simEventIndexRef.current >= events.length) {
        events = buildDemoSimulationEvents(slotsRef.current);
        simEventsRef.current = events;
        simEventIndexRef.current = 0;
      }
      const event = events[simEventIndexRef.current];
      simEventIndexRef.current += 1;

      const nextSlots = applySimulationEvent(slotsRef.current, event);
      if (!nextSlots) return;
      slotsRef.current = nextSlots;
      setSlotsByParking(nextSlots);
      recomputeParkingFromSlots(nextSlots);
      lastUpdateMinute.current += 1;
      setLastUpdated(
        `${lastUpdateMinute.current} second${
          lastUpdateMinute.current === 1 ? "" : "s"
        } ago`
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [simulationRunning, recomputeParkingFromSlots]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      const id = ++toastId.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const clearToasts = useCallback(() => setToasts([]), []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const setPreferences = useCallback((p: Partial<UserPreferences>) => {
    setPreferencesState((prev) => ({ ...prev, ...p }));
  }, []);

  const setDestination = useCallback((d: DestinationOption | null) => {
    setDestinationState(d);
  }, []);

  const addReservation = useCallback(
    (r: Omit<Reservation, "id" | "createdAt" | "status">) => {
      const id = generateSearchId("PS");
      const newRes: Reservation = {
        ...r,
        id,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      setReservations((prev) => [newRes, ...prev]);
      if (r.slotId) {
        const reservedTo = addHours(r.arrivalTime, r.durationHours);
        setSlotsByParking((prev) => {
          const list = prev[r.parkingId] ?? [];
          const slot = list.find((s) => s.id === r.slotId);
          if (!slot) return prev;
          const nextList = list.map((s) =>
            s.id === r.slotId
              ? {
                  ...s,
                  status: "reserved" as SlotStatus,
                  reservedFrom: r.arrivalTime,
                  reservedTo,
                  updatedAt: "just now",
                }
              : s
          );
          const nextSlots = { ...prev, [r.parkingId]: nextList };
          const available = nextList.filter(
            (s) => s.status === "available"
          ).length;
          setParkings((cur) =>
            cur.map((p) =>
              p.id === r.parkingId ? { ...p, availableSpaces: available } : p
            )
          );
          return nextSlots;
        });
      } else {
        // Decrement available spaces for that parking
        setParkings((prev) =>
          prev.map((p) =>
            p.id === r.parkingId
              ? { ...p, availableSpaces: Math.max(0, p.availableSpaces - 1) }
              : p
          )
        );
      }
      return id;
    },
    []
  );

  const updateSlotStatus = useCallback(
    (
      parkingId: string,
      slotId: string,
      status: SlotStatus,
      window?: { reservedFrom?: string; reservedTo?: string }
    ) => {
      setSlotsByParking((prev) => {
        const list = prev[parkingId];
        if (!list) return prev;
        const slot = list.find((s) => s.id === slotId);
        if (!slot) return prev;
        const nextList = list.map((s) =>
          s.id === slotId
            ? {
                ...s,
                status,
                reservedFrom: window?.reservedFrom,
                reservedTo: window?.reservedTo,
                updatedAt: "just now",
              }
            : s
        );
        const nextSlots = { ...prev, [parkingId]: nextList };
        const available = nextList.filter(
          (s) => s.status === "available"
        ).length;
        setParkings((cur) =>
          cur.map((p) =>
            p.id === parkingId ? { ...p, availableSpaces: available } : p
          )
        );
        return nextSlots;
      });
    },
    []
  );

  const getSlotCounts = useCallback(
    (parkingId: string) => {
      const list = slotsByParking[parkingId] ?? [];
      const occupied = list.filter((s) => s.status === "occupied").length;
      const reserved = list.filter((s) => s.status === "reserved").length;
      return {
        total: list.length,
        occupied,
        reserved,
        available: list.length - occupied - reserved,
      };
    },
    [slotsByParking]
  );

  const canSelectSlot = useCallback(
    (
      parkingId: string,
      slotId: string,
      arrival: string,
      durationHours: number
    ) => {
      const list = slotsByParking[parkingId] ?? [];
      const slot = list.find((s) => s.id === slotId);
      if (!slot) return { selectable: false, reason: "Slot not found" };
      if (slot.status === "occupied")
        return { selectable: false, reason: "Occupied" };
      if (slot.status === "available")
        return { selectable: true, reason: "" };
      if (
        slot.status === "reserved" &&
        slot.reservedFrom &&
        slot.reservedTo
      ) {
        const userStart = timeToMinutes(arrival);
        const userEnd = timeToMinutes(addHours(arrival, durationHours));
        const resStart = timeToMinutes(slot.reservedFrom);
        const resEnd = timeToMinutes(slot.reservedTo);
        if (windowsOverlap(userStart, userEnd, resStart, resEnd)) {
          return {
            selectable: false,
            reason: `Reserved ${slot.reservedFrom} – ${slot.reservedTo}`,
          };
        }
        return { selectable: true, reason: "" };
      }
      return { selectable: true, reason: "" };
    },
    [slotsByParking]
  );

  const cancelReservation = useCallback(
    (id: string) => {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
      );
      // restore space
      setReservations((prev) => {
        const res = prev.find((r) => r.id === id);
        if (res) {
          if (res.slotId) {
            setSlotsByParking((cur) => {
              const list = cur[res.parkingId] ?? [];
              const nextList = list.map((s) =>
                s.id === res.slotId
                  ? {
                      ...s,
                      status: "available" as SlotStatus,
                      reservedFrom: undefined,
                      reservedTo: undefined,
                      updatedAt: "just now",
                    }
                  : s
              );
              const nextSlots = { ...cur, [res.parkingId]: nextList };
              const available = nextList.filter(
                (s) => s.status === "available"
              ).length;
              setParkings((cur2) =>
                cur2.map((p) =>
                  p.id === res.parkingId
                    ? { ...p, availableSpaces: available }
                    : p
                )
              );
              return nextSlots;
            });
          } else {
            setParkings((cur) =>
              cur.map((p) =>
                p.id === res.parkingId
                  ? {
                      ...p,
                      availableSpaces: Math.min(
                        p.totalSpaces,
                        p.availableSpaces + 1
                      ),
                    }
                  : p
              )
            );
          }
        }
        return prev;
      });
    },
    []
  );

  const completeReservation = useCallback((id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "completed" } : r))
    );
  }, []);

  // Partner: register a whole parking facility at once (name, address,
  // location, total spaces, price, security, ...). The facility and its full
  // slot layout are added to the existing ParkSmart parking system.
  const addParking = useCallback((input: Omit<ParkingLocation, "id">) => {
    const id = `pt-${Math.random().toString(36).slice(2, 8)}`;
    const parking: ParkingLocation = { ...input, id };
    setParkings((prev) => [...prev, parking]);
    setSlotsByParking((prev) => ({
      ...prev,
      [id]: generateSlotsForParking(parking),
    }));
    setPartnerFacilities((prev) => [...prev, id]);
    setNotifications((prev) => [
      {
        id: generateSearchId("NT"),
        title: "Parking facility registered",
        message: `${parking.name} is now live on ParkSmart with ${parking.totalSpaces} slots.`,
        time: "just now",
        type: "success",
        read: false,
      },
      ...prev,
    ]);
    return id;
  }, []);

  const updateParking = useCallback(
    (
      id: string,
      changes: Partial<
        Pick<
          ParkingLocation,
          | "name"
          | "pricePerHour"
          | "dailyMax"
          | "description"
          | "securityLevel"
          | "reservationAvailable"
        >
      >
    ) => {
      setParkings((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
      );
    },
    []
  );

  const startSimulation = useCallback(() => setSimulationRunning(true), []);
  const stopSimulation = useCallback(() => setSimulationRunning(false), []);
  const resetSimulation = useCallback(() => {
    const rebuilt = generateAllSlots(parkings);
    slotsRef.current = rebuilt;
    setSlotsByParking(rebuilt);
    recomputeParkingFromSlots(rebuilt);
    simEventsRef.current = [];
    simEventIndexRef.current = 0;
    lastUpdateMinute.current = 0;
    setLastUpdated("just now");
  }, [parkings, recomputeParkingFromSlots]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const value: AppContextType = {
    parkings,
    reservations,
    notifications,
    unreadCount,
    favorites,
    preferences,
    destination,
    lastUpdated,
    slotsByParking,
    toasts,
    showToast,
    markNotificationRead,
    markAllNotificationsRead,
    toggleFavorite,
    isFavorite,
    setPreferences,
    setDestination,
    addReservation,
    cancelReservation,
    completeReservation,
    updateSlotStatus,
    getSlotCounts,
    canSelectSlot,
    clearToasts,
    partnerFacilities,
    addParking,
    updateParking,
    simulationRunning,
    startSimulation,
    stopSimulation,
    resetSimulation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
