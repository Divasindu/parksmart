"use client";

import {
  Navigation,
  Car,
  MapPin,
  Footprints,
  Clock,
} from "lucide-react";
import { ParkingLocation } from "@/lib/types";
import { trafficColor, formatDistance } from "@/lib/utils";

export default function NavigationCard({
  parking,
  onStart,
}: {
  parking: ParkingLocation;
  onStart?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-zinc-900">{parking.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-zinc-500">
            <MapPin className="h-3.5 w-3.5" /> {parking.address}
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          Destination
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-zinc-50 p-3 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-lg font-bold text-zinc-900">
            <Car className="h-4 w-4 text-blue-600" />
            {parking.drivingDistanceKm} km
          </div>
          <div className="text-[11px] text-zinc-500">Distance</div>
        </div>
        <div className="border-x border-zinc-200">
          <div className="flex items-center justify-center gap-1 text-lg font-bold text-zinc-900">
            <Clock className="h-4 w-4 text-blue-600" />
            {parking.drivingMinutes} min
          </div>
          <div className="text-[11px] text-zinc-500">Drive time</div>
        </div>
        <div>
          <div
            className={`flex items-center justify-center gap-1 text-lg font-bold ${trafficColor(
              parking.trafficLevel
            )}`}
          >
            {parking.trafficLevel}
          </div>
          <div className="text-[11px] text-zinc-500">Traffic</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-sm text-zinc-600">
        <Footprints className="h-4 w-4 text-zinc-400" />
        Walking from parking to destination:{" "}
        <span className="font-semibold">{formatDistance(parking.walkingDistance)}</span>
      </div>

      <button
        onClick={onStart}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-sm hover:bg-blue-700"
      >
        <Navigation className="h-5 w-5" /> Start Navigation
      </button>
    </div>
  );
}
