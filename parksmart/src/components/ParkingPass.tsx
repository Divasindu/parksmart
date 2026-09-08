"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Navigation, Eye, XCircle, Car } from "lucide-react";
import { Reservation } from "@/lib/types";
import { formatLKR } from "@/lib/utils";
import { useApp } from "@/lib/context";

export default function ParkingPass({
  reservation,
}: {
  reservation: Reservation;
}) {
  const { cancelReservation, showToast } = useApp();

  const qrValue = `ParkSmart|${reservation.id}|${reservation.parkingName}|${reservation.space}|${reservation.date}|${reservation.arrivalTime}`;

  return (
    <div className="mx-auto max-w-md">
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <Car className="h-5 w-5" />
              </span>
              <span className="font-bold">ParkSmart</span>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold">
              ● PASS
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-emerald-200">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-lg font-bold">Parking Reserved</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="text-center">
            <h3 className="text-xl font-bold text-zinc-900">
              {reservation.parkingName}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Space {reservation.space} · {reservation.date}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            <span className="font-semibold">{reservation.arrivalTime}</span>
            <span className="text-zinc-400">→</span>
            <span className="font-semibold">
              {(() => {
                const [t, period] = reservation.arrivalTime.split(" ");
                const [h, m] = t.split(":");
                let nh = parseInt(h, 10) + reservation.durationHours;
                let nperiod = period;
                if (nh >= 12 && period === "AM" && nh < 13) nperiod = "PM";
                if (nh >= 13) nperiod = "PM";
                if (nh >= 24) {
                  nh = nh - 12;
                }
                if (nh > 12) nh -= 12;
                if (nh === 0) nh = 12;
                return `${nh}:${m} ${nperiod}`;
              })()}
            </span>
          </div>

          {/* QR */}
          <div className="mt-5 flex justify-center">
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
              <QRCodeSVG
                value={qrValue}
                size={160}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="M"
              />
            </div>
          </div>

          {/* Details */}
          <div className="mt-5 space-y-2 rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Reservation ID</span>
              <span className="font-mono font-semibold text-zinc-800">
                {reservation.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Duration</span>
              <span className="font-semibold text-zinc-800">
                {reservation.durationHours} hour
                {reservation.durationHours > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Vehicle</span>
              <span className="font-semibold text-zinc-800">
                {reservation.vehicleType}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-2">
              <span className="font-semibold text-zinc-700">Total cost</span>
              <span className="font-bold text-zinc-900">
                {formatLKR(reservation.cost)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 border-t border-zinc-100 px-6 py-4">
          <Link
            href={`/navigate?parking=${reservation.parkingId}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Navigation className="h-4 w-4" /> Open Navigation
          </Link>
          <Link
            href={`/parking/${reservation.parkingId}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <Eye className="h-4 w-4" /> View Reservation Details
          </Link>
          <button
            onClick={() => {
              cancelReservation(reservation.id);
              showToast("Reservation cancelled", "info");
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100"
          >
            <XCircle className="h-4 w-4" /> Cancel Reservation
          </button>
        </div>
      </div>
    </div>
  );
}
