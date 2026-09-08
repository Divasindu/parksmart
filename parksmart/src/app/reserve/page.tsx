"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Car,
  CreditCard,
  MapPin,
  ArrowRight,
  Loader2,
  Lock,
  Check,
  ChevronLeft,
  ParkingCircle,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { formatLKR, getAvailabilityStatus } from "@/lib/utils";
import { DemoModeBadge } from "@/components/LiveDataIndicator";
import SlotMap from "@/components/SlotMap";

function ReserveContent() {
  const {
    parkings,
    destination,
    addReservation,
    showToast,
    slotsByParking,
    canSelectSlot,
    getSlotCounts,
  } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const parkingId = searchParams.get("parking");
  const slotParam = searchParams.get("slot");

  const parking = parkings.find((p) => p.id === parkingId) || parkings[0];

  const [step, setStep] = useState<1 | 2>(1);
  const initialSlots = slotsByParking[parking?.id ?? ""] ?? [];
  const preselected = slotParam
    ? initialSlots.find((s) => s.id === slotParam && s.status === "available")
    : undefined;
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(
    () => preselected?.id ?? null
  );
  const [date, setDate] = useState("Today");
  const [arrival, setArrival] = useState("2:30 PM");
  const [duration, setDuration] = useState(2);
  const [vehicle, setVehicle] = useState("Car");
  const [submitting, setSubmitting] = useState(false);

  const destName = destination?.name || "Colombo Fort";

  const slots = slotsByParking[parking.id] ?? [];
  const counts = getSlotCounts(parking.id);
  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  const cost = useMemo(() => parking.pricePerHour * duration, [parking, duration]);
  const status = getAvailabilityStatus(parking.availableSpaces, parking.totalSpaces);

  const goToStep2 = () => {
    if (!selectedSlot) {
      showToast("Please select an available parking slot first", "error");
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    if (status === "full") {
      showToast("This parking is currently full. Try an alternative.", "error");
      return;
    }
    if (!selectedSlot) {
      showToast("Please select a parking slot first", "error");
      return;
    }
    const { selectable, reason } = canSelectSlot(
      parking.id,
      selectedSlot.id,
      arrival,
      duration
    );
    if (!selectable) {
      showToast(`Slot ${selectedSlot.number} · ${reason}`, "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const id = addReservation({
        parkingId: parking.id,
        parkingName: parking.name,
        date,
        arrivalTime: arrival,
        durationHours: duration,
        vehicleType: vehicle,
        cost,
        space: `Slot ${selectedSlot.number}`,
        slotId: selectedSlot.id,
      });
      setSubmitting(false);
      showToast("Parking reserved successfully!");
      router.push(`/reservation/${id}`);
    }, 1200);
  };

  if (!parking) {
    return (
      <div className="p-12 text-center">
        <p className="text-lg font-semibold text-zinc-700">Parking not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900">
            Reserve Parking
          </h1>
          <p className="text-sm text-zinc-500">
            {parking.name} · {parking.address}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoModeBadge />
        </div>
      </div>

      {/* Stepper */}
      <div className="mt-5 flex items-center gap-3 text-sm">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-bold transition-colors ${
            step === 1
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-700 border border-zinc-200 hover:bg-blue-50"
          }`}
        >
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
              step === 1 ? "bg-white text-blue-600" : "bg-blue-100"
            }`}
          >
            {step === 2 ? <Check className="h-3 w-3" /> : "1"}
          </span>
          Choose your slot
        </button>
        <span className="h-px flex-1 max-w-16 bg-zinc-200" />
        <button
          disabled={step === 1}
          onClick={() => {
            if (selectedSlot) setStep(2);
          }}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-bold transition-colors ${
            step === 2
              ? "bg-blue-600 text-white"
              : "bg-white text-zinc-400 border border-zinc-200"
          }`}
        >
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
              step === 2 ? "bg-white text-blue-600" : "bg-zinc-200"
            }`}
          >
            2
          </span>
          Confirm details
        </button>
      </div>

      {step === 1 ? (
        <div className="mt-6 space-y-5">
          {/* Time controls */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-zinc-700">
              Pick your time window — the slot map only blocks slots reserved in
              this window.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <fieldset>
                <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                  <CalendarDays className="h-4 w-4 text-blue-600" /> Date
                </label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-zinc-800"
                >
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                </select>
              </fieldset>
              <fieldset>
                <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                  <Clock className="h-4 w-4 text-blue-600" /> Arrival time
                </label>
                <select
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-zinc-800"
                >
                  {[
                    "9:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "12:00 PM",
                    "1:00 PM",
                    "2:00 PM",
                    "2:30 PM",
                    "3:00 PM",
                    "4:00 PM",
                    "5:00 PM",
                    "6:00 PM",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </fieldset>
              <fieldset>
                <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                  <Clock className="h-4 w-4 text-blue-600" /> Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-zinc-800"
                >
                  {[1, 2, 3, 4, 6, 8, 12, 24].map((h) => (
                    <option key={h} value={h}>
                      {h} hour{h > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </fieldset>
            </div>
          </div>

          {/* Selected slot note */}
          {selectedSlot && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3">
              <span className="flex items-center gap-2 font-bold text-emerald-800">
                <Check className="h-5 w-5" />
                Selected slot: {selectedSlot.row}-{selectedSlot.number}
              </span>
              <button
                onClick={() => setSelectedSlotId(null)}
                className="text-sm font-semibold text-emerald-700 underline"
              >
                Choose another slot
              </button>
            </div>
          )}

          {/* Slot map */}
          <SlotMap
            parking={parking}
            slots={slots}
            mode="select"
            selectedSlotId={selectedSlotId}
            arrival={arrival}
            duration={duration}
            onSelect={setSelectedSlotId}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              <span className="font-semibold text-zinc-700">
                {counts.total} total
              </span>{" "}
              · {counts.occupied} occupied · {counts.reserved} reserved ·{" "}
              <span className="font-semibold text-emerald-700">
                {counts.available} available
              </span>
            </p>
            <button
              onClick={goToStep2}
              disabled={!selectedSlot}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Continue to reservation <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <button
            onClick={() => setStep(1)}
            className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-zinc-800"
          >
            <ChevronLeft className="h-4 w-4" /> Back to slot selection
          </button>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Form */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="font-bold text-zinc-900">Reservation details</h2>

              <div className="mt-4 space-y-3">
                <fieldset>
                  <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                    <MapPin className="h-4 w-4 text-blue-600" /> Destination
                  </label>
                  <input
                    value={destName}
                    readOnly
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-800"
                  />
                </fieldset>

                <fieldset>
                  <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                    <Car className="h-4 w-4 text-blue-600" /> Parking
                  </label>
                  <select
                    value={parking.id}
                    onChange={(e) => {
                      const p = parkings.find((x) => x.id === e.target.value);
                      if (p) {
                        router.replace(`/reserve?parking=${p.id}`);
                      }
                    }}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800"
                  >
                    {parkings.map((p) => (
                      <option
                        key={p.id}
                        value={p.id}
                        disabled={
                          getAvailabilityStatus(p.availableSpaces, p.totalSpaces) === "full"
                        }
                      >
                        {p.name} — {p.availableSpaces} spaces · {formatLKR(p.pricePerHour)}/hr
                        {getAvailabilityStatus(p.availableSpaces, p.totalSpaces) === "full" ? " (Full)" : ""}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <fieldset>
                  <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                    <ParkingCircle className="h-4 w-4 text-blue-600" /> Selected slot
                  </label>
                  <input
                    value={selectedSlot ? `${selectedSlot.row}-${selectedSlot.number}` : "None selected"}
                    readOnly
                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50 font-bold text-emerald-800 px-4 py-2.5"
                  />
                </fieldset>

                <div className="grid grid-cols-2 gap-3">
                  <fieldset>
                    <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                      <CalendarDays className="h-4 w-4 text-blue-600" /> Date
                    </label>
                    <select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800"
                    >
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                    </select>
                  </fieldset>
                  <fieldset>
                    <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                      <Clock className="h-4 w-4 text-blue-600" /> Arrival time
                    </label>
                    <select
                      value={arrival}
                      onChange={(e) => setArrival(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800"
                    >
                      {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "2:30 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </fieldset>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <fieldset>
                    <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                      <Clock className="h-4 w-4 text-blue-600" /> Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800"
                    >
                      {[1, 2, 3, 4, 6, 8, 12, 24].map((h) => (
                        <option key={h} value={h}>
                          {h} hour{h > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </fieldset>
                  <fieldset>
                    <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
                      <Car className="h-4 w-4 text-blue-600" /> Vehicle
                    </label>
                    <select
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800"
                    >
                      <option>Car</option>
                      <option>Motorcycle</option>
                      <option>Van</option>
                      <option>SUV</option>
                    </select>
                  </fieldset>
                </div>
              </div>

              {/* Price summary */}
              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-600">
                  <span>
                    {formatLKR(parking.pricePerHour)} × {duration} hour
                    {duration > 1 ? "s" : ""}
                  </span>
                  <span className="font-semibold">{formatLKR(cost)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-blue-100 pt-2">
                  <span className="font-bold text-zinc-900">Estimated cost</span>
                  <span className="text-lg font-extrabold text-blue-700">
                    {formatLKR(cost)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={submitting || status === "full" || !selectedSlot}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" /> Confirm Reservation · {formatLKR(cost)}
                  </>
                )}
              </button>
              {status === "full" && (
                <p className="mt-2 text-center text-sm font-semibold text-red-500">
                  This parking is full — select a different one above.
                </p>
              )}
              <p className="mt-2 text-center text-xs text-zinc-400">
                Prototype — no real payment is processed.
              </p>
            </div>

            {/* Parking summary */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-20 h-fit">
              <h2 className="font-bold text-zinc-900">You are reserving</h2>
              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-zinc-900">{parking.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-zinc-500">
                  <MapPin className="h-4 w-4" /> {parking.address}
                </p>
              </div>

              <div className="mt-4 space-y-2 rounded-xl bg-zinc-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Selected slot</span>
                  <span className="font-bold text-emerald-700">
                    {selectedSlot ? `${selectedSlot.row}-${selectedSlot.number}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Available</span>
                  <span
                    className={`font-semibold ${
                      status === "available" ? "text-emerald-600" : "text-orange-500"
                    }`}
                  >
                    {parking.availableSpaces} / {parking.totalSpaces} spaces
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Price</span>
                  <span className="font-semibold text-zinc-800">
                    {formatLKR(parking.pricePerHour)}/hr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Opening</span>
                  <span className="font-semibold text-zinc-800">
                    {parking.openingTime} – {parking.closingTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Security</span>
                  <span className="font-semibold text-zinc-800">{parking.securityLevel}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                <CreditCard className="h-4 w-4 shrink-0" />
                For this prototype, your exact slot is locked and confirmed
                instantly on a digital pass.
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                You&apos;ll get a QR pass you can show at the barrier.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReservePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading…</div>}>
      <ReserveContent />
    </Suspense>
  );
}