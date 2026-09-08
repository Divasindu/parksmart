"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin, CreditCard, Eye, XCircle } from "lucide-react";
import { Reservation } from "@/lib/types";
import { formatLKR } from "@/lib/utils";
import { useApp } from "@/lib/context";

export default function ReservationCard({
  reservation,
}: {
  reservation: Reservation;
}) {
  const { cancelReservation, showToast } = useApp();

  const statusStyles: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700",
    upcoming: "bg-blue-50 text-blue-700",
    completed: "bg-zinc-100 text-zinc-600",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-zinc-900">{reservation.parkingName}</h3>
          <span
            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
              statusStyles[reservation.status]
            }`}
          >
            {reservation.status}
          </span>
        </div>
        <span className="font-mono text-xs font-semibold text-zinc-400">
          {reservation.id}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-zinc-400" /> {reservation.date}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-zinc-400" /> {reservation.arrivalTime} ·{" "}
          {reservation.durationHours}h
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-zinc-400" /> Space {reservation.space}
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-4 w-4 text-zinc-400" />
          {formatLKR(reservation.cost)}
        </div>
      </div>

      {reservation.status === "active" && (
        <div className="mt-3 flex gap-2">
          <Link
            href={`/reservation/${reservation.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Eye className="h-4 w-4" /> View Pass
          </Link>
          <button
            onClick={() => {
              cancelReservation(reservation.id);
              showToast("Reservation cancelled", "info");
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
          >
            <XCircle className="h-4 w-4" /> Cancel
          </button>
        </div>
      )}
      {reservation.status === "upcoming" && (
        <Link
          href={`/reservation/${reservation.id}`}
          className="mt-3 block rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
        >
          View Pass
        </Link>
      )}
    </div>
  );
}
