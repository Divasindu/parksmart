"use client";

import Link from "next/link";
import {
  MapPin,
  Footprints,
  Car,
  Heart,
  Route,
  Zap,
  Star,
  Eye,
} from "lucide-react";
import { ParkingLocation } from "@/lib/types";
import { getAvailabilityStatus, ratingStars } from "@/lib/utils";
import AvailabilityBadge from "./AvailabilityBadge";
import PriceBadge from "./PriceBadge";
import SecurityBadge from "./SecurityBadge";

export default function ParkingCard({
  parking,
  recommended,
  rank,
  onToggleFavorite,
  favorited,
}: {
  parking: ParkingLocation;
  recommended?: boolean;
  rank?: number;
  onToggleFavorite?: () => void;
  favorited?: boolean;
}) {
  const status = getAvailabilityStatus(parking.availableSpaces, parking.totalSpaces);

  return (
    <div
      className={`relative rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        recommended ? "border-blue-300 ring-2 ring-blue-100" : "border-zinc-200"
      }`}
    >
      {recommended && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
          <Star className="h-3 w-3 fill-current" /> Recommended
        </span>
      )}
      {rank && (
        <span className="absolute -top-2.5 left-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-white shadow">
          {rank}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-zinc-900">
            {parking.name}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
            <MapPin className="h-3 w-3" /> {parking.area} · {parking.address}
          </p>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`shrink-0 rounded-full p-1.5 transition-colors ${
            favorited ? "text-red-500 hover:bg-red-50" : "text-zinc-300 hover:bg-zinc-100"
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AvailabilityBadge
          available={parking.availableSpaces}
          total={parking.totalSpaces}
        />
        <PriceBadge pricePerHour={parking.pricePerHour} />
        <SecurityBadge level={parking.securityLevel} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-600">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
          {parking.walkingDistance} m away
        </div>
        <div className="flex items-center gap-1">
          <Footprints className="h-3.5 w-3.5 text-zinc-400" />
          {parking.drivingMinutes} min drive
        </div>
        <div className="flex items-center gap-1">
          <Car className="h-3.5 w-3.5 text-zinc-400" />
          {parking.drivingDistanceKm} km
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
        <div className="flex items-center gap-2 text-xs text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-semibold text-zinc-800">{parking.rating}</span>
          <span className="text-zinc-400">{ratingStars(parking.rating)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {parking.evCharging && (
            <Zap className="h-4 w-4 text-blue-600" aria-label="EV charging" />
          )}
          {parking.cctv && (
            <Eye className="h-4 w-4 text-zinc-500" aria-label="CCTV" />
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          href={`/parking/${parking.id}`}
          className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Details
        </Link>
        {status !== "full" && parking.reservationAvailable ? (
          <Link
            href={`/reserve?parking=${parking.id}`}
            className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Reserve
          </Link>
        ) : (
          <Link
            href={`/map?parking=${parking.id}`}
            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-zinc-100 px-3 py-2 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-200"
          >
            <Route className="h-3.5 w-3.5" /> Navigate
          </Link>
        )}
      </div>
    </div>
  );
}
