"use client";

import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { ParkingLocation } from "@/lib/types";
import { calculateScore } from "@/lib/utils";
import { useApp } from "@/lib/context";

export default function RecommendationCard({
  parking,
  destinationName,
}: {
  parking: ParkingLocation;
  destinationName?: string;
}) {
  const { destination } = useApp();
  const score = calculateScore(parking, destination);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-lg">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-4 h-28 w-28 rounded-full bg-white/10" />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" />
          Recommended for you
        </div>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">{parking.name}</h3>
            <p className="mt-0.5 text-sm text-blue-100">
              {destinationName
                ? `${parking.walkingDistance} m from ${destinationName}`
                : `Best overall option`}
            </p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40">
            <span className="text-lg font-bold">{score.total}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white/10 p-3">
          <div className="flex items-center gap-1 text-amber-300">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-bold">
              Best overall option · Smart Score {score.total}/100
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-blue-50">
            Recommended because it has{" "}
            <span className="font-semibold text-white">
              {score.reasons.join(", ")}
            </span>
            .
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/parking/${parking.id}`}
            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-bold text-blue-700 hover:bg-blue-50"
          >
            View Details
          </Link>
          {parking.availableSpaces > 0 && parking.reservationAvailable && (
            <Link
              href={`/reserve?parking=${parking.id}`}
              className="flex-1 rounded-xl bg-blue-800 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-blue-900"
            >
              Reserve
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
