"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  Zap,
  Eye,
  Accessibility,
  Bike,
  Building2,
  CalendarCheck,
  ShieldCheck,
  Car,
  Banknote,
  DoorOpen,
} from "lucide-react";
import { DESTINATIONS } from "@/lib/data";
import {
  formatLKR,
  getAvailabilityStatus,
  ratingStars,
  calculateScore,
} from "@/lib/utils";
import { useApp } from "@/lib/context";
import { useMemo } from "react";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import SmartScore from "@/components/SmartScore";
import LiveDataIndicator, {
  DemoModeBadge,
} from "@/components/LiveDataIndicator";
import ClientActions, { SaveButton } from "./ClientActions";
import ParkingMap from "@/components/ParkingMapDynamic";
import SlotMap from "@/components/SlotMap";

function ParkingDetailsContent({ id }: { id: string }) {
  const { parkings, slotsByParking, getSlotCounts } = useApp();
  const router = useRouter();
  const parking = parkings.find((p) => p.id === id);

  const score = useMemo(
    () => calculateScore(parking ?? parkings[0], DESTINATIONS[0]),
    [parking, parkings]
  );
  const status = getAvailabilityStatus(
    parking?.availableSpaces ?? 0,
    parking?.totalSpaces ?? 1
  );
  const areaParkings = parkings.filter(
    (p) => p.id !== parking?.id && p.area === parking?.area
  );

  if (!parking) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-700">Parking not found</p>
        <p className="mt-1 text-sm text-zinc-500">
          This parking location no longer exists.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Back to search
        </Link>
      </div>
    );
  }

  const slots = slotsByParking[parking.id] ?? [];
  const counts = getSlotCounts(parking.id);
  const dest = DESTINATIONS[0]; // preview destination

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back */}
      <Link
        href="/search"
        className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-zinc-800"
      >
        ← Back to search
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-zinc-900">
                {parking.name}
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-zinc-500">
                <MapPin className="h-4 w-4" /> {parking.address}
              </p>
              <div className="mt-2 flex items-center gap-2 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold text-zinc-800">{parking.rating}</span>
                <span className="text-zinc-400">{ratingStars(parking.rating)}</span>
              </div>
            </div>
            <ClientActions parkingId={parking.id} />
          </div>

          {/* Live status */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LiveDataIndicator />
            <DemoModeBadge />
            <AvailabilityBadge
              available={parking.availableSpaces}
              total={parking.totalSpaces}
            />
          </div>

          {/* Live slot counts */}
          <div className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm">
            <div>
              <p className="text-xl font-extrabold text-zinc-900">
                {counts.total}
              </p>
              <p className="text-xs text-zinc-500">Total</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-red-600">
                {counts.occupied}
              </p>
              <p className="text-xs text-zinc-500">Occupied</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-amber-600">
                {counts.reserved}
              </p>
              <p className="text-xs text-zinc-500">Reserved</p>
            </div>
          </div>

          {/* Smart score */}
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <div className="flex items-start gap-4">
              <SmartScore score={score.total} size="lg" />
              <div>
                <h2 className="font-bold text-zinc-900">
                  Why this parking suits you
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Best option because it has{" "}
                  <span className="font-semibold">
                    {score.reasons.join(", ")}
                  </span>
                  .
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: "Availability", value: score.availability },
                    { label: "Distance", value: score.distance },
                    { label: "Price", value: score.price },
                    { label: "Security", value: score.security },
                    { label: "Traffic", value: score.traffic },
                  ].map((s) => (
                    <span
                      key={s.label}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs text-zinc-600 border border-zinc-200"
                    >
                      <span className="font-semibold text-zinc-800">
                        {s.label}
                      </span>{" "}
                      · {s.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Parking info grid */}
          <h2 className="mt-8 text-lg font-bold text-zinc-900">
            Parking information
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoTile
              icon={MapPin}
              label="Distance from destination"
              value={`${parking.walkingDistance} m · ${parking.drivingMinutes} min drive`}
            />
            <InfoTile
              icon={Car}
              label="Available / Total"
              value={`${parking.availableSpaces} / ${parking.totalSpaces} spaces`}
            />
            <InfoTile
              icon={Clock}
              label="Opening hours"
              value={`${parking.openingTime} – ${parking.closingTime}`}
            />
            <InfoTile
              icon={Banknote}
              label="Daily maximum"
              value={formatLKR(parking.dailyMax)}
            />
            <InfoTile
              icon={ShieldCheck}
              label="Security"
              value={`${parking.securityLevel} security`}
            />
            <InfoTile
              icon={Zap}
              label="EV charging"
              value={parking.evCharging ? "Available" : "Not available"}
            />
            <InfoTile
              icon={Eye}
              label="CCTV"
              value={parking.cctv ? "Yes" : "No"}
            />
            <InfoTile
              icon={Accessibility}
              label="Accessible parking"
              value={parking.accessibleParking ? "Yes" : "No"}
            />
            <InfoTile
              icon={Bike}
              label="Motorcycle parking"
              value={parking.motorcycleParking ? "Yes" : "No"}
            />
            <InfoTile
              icon={Building2}
              label="Covered"
              value={parking.covered ? "Covered" : "Open air"}
            />
            <InfoTile
              icon={CalendarCheck}
              label="Reservation"
              value={parking.reservationAvailable ? "Available" : "Walk-in only"}
            />
            <InfoTile
              icon={Navigation}
              label="Traffic"
              value={parking.trafficLevel}
            />
          </div>

          <p className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
            {parking.description}
          </p>

          {/* Live slot layout preview */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-zinc-900">
              Live parking slots
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Choose an exact slot and reserve it — occupied and overlapping
              reservations are blocked automatically.
            </p>
            <div className="mt-4">
              <SlotMap
                parking={parking}
                slots={slots}
                mode="select"
                onSelect={(slotId) =>
                  router.push(`/reserve?parking=${parking.id}&slot=${slotId}`)
                }
              />
            </div>
          </div>

          {/* Map */}
          <h2 className="mt-8 text-lg font-bold text-zinc-900">
            Location on map
          </h2>
          <div className="mt-3 h-80 rounded-2xl overflow-hidden">
            <ParkingMap
              parkings={parkings}
              destination={dest}
              selectedId={parking.id}
              height="100%"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Price card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-500">Price</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-zinc-900">
                {formatLKR(parking.pricePerHour)}
              </span>
              <span className="text-zinc-500">/hour</span>
            </div>
            <p className="text-sm text-zinc-500">
              Daily max {formatLKR(parking.dailyMax)}
            </p>
            <div className="mt-4 space-y-2">
              {parking.reservationAvailable && status !== "full" ? (
                <Link
                  href={`/reserve?parking=${parking.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <DoorOpen className="h-5 w-5" /> Choose a Slot & Reserve
                </Link>
              ) : (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
                  {status === "full"
                    ? "Currently full"
                    : "Reservation not available"}
                </div>
              )}
              <Link
                href={`/navigate?parking=${parking.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 font-bold text-zinc-700 hover:bg-zinc-50"
              >
                <Navigation className="h-5 w-5" /> Start Navigation
              </Link>
              <SaveButton parkingId={parking.id} />
            </div>
          </div>

          {/* Comparison */}
          {areaParkings.length > 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-zinc-900">Compare nearby</h3>
              <div className="mt-3 space-y-2">
                {[parking, ...areaParkings.slice(0, 2)].map((p) => (
                  <Link
                    key={p.id}
                    href={`/parking/${p.id}`}
                    className="flex items-center justify-between rounded-xl border border-zinc-100 p-3 hover:bg-zinc-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">{p.name}</p>
                      <p className="text-xs text-zinc-500">
                        {p.walkingDistance} m · {formatLKR(p.pricePerHour)}/hr
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        getAvailabilityStatus(p.availableSpaces, p.totalSpaces) ===
                        "available"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {p.availableSpaces} left
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/map"
                className="mt-3 block text-center text-sm font-semibold text-blue-600 hover:underline"
              >
                Compare all parking
              </Link>
            </div>
          )}

          {/* Safety */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="flex items-center gap-2 font-bold text-emerald-800">
              <ShieldCheck className="h-5 w-5" /> Safe Parking
            </h3>
            <p className="mt-2 text-sm text-emerald-700">
              This is a legal, permitted parking facility. Avoid roadside parking
              that blocks pedestrian walkways and creates unsafe conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParkingDetailsPage() {
  const params = useParams<{ id: string }>();
  return <ParkingDetailsContent key={params.id} id={params.id} />;
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <Icon className="h-4 w-4 text-blue-600" />
      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-zinc-800">{value}</p>
    </div>
  );
}