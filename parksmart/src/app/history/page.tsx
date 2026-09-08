"use client";

import Link from "next/link";
import {
  History,
  Clock,
  CalendarDays,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { formatLKR } from "@/lib/utils";
import { DemoModeBadge } from "@/components/LiveDataIndicator";

export default function HistoryPage() {
  const { reservations } = useApp();

  const items =
    reservations.length > 0
      ? reservations
      : [
          {
            id: "PS-20480",
            parkingId: "p1",
            parkingName: "Fort City Parking",
            date: "Sep 8, 2026",
            durationHours: 2,
            vehicleType: "Car",
            cost: 200,
            space: "A-24",
            status: "completed",
            arrivalTime: "2:30 PM",
          },
          {
            id: "PS-20392",
            parkingId: "p2",
            parkingName: "City Centre Parking",
            date: "Sep 6, 2026",
            durationHours: 1,
            vehicleType: "Car",
            cost: 150,
            space: "B-12",
            status: "completed",
            arrivalTime: "11:00 AM",
          },
        ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <History className="h-6 w-6 text-blue-600" /> Parking History
          </h1>
          <p className="text-sm text-zinc-500">
            Your past and current parking sessions
          </p>
        </div>
        <DemoModeBadge />
      </div>

      <div className="mt-6 space-y-4">
        {items.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-zinc-900">{r.parkingName}</h3>
                <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {r.status}
                </span>
              </div>
              <span className="font-mono text-xs text-zinc-400">{r.id}</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm text-zinc-600">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-zinc-400" /> {r.date}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-400" /> {r.arrivalTime}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-400" />
                {r.durationHours} hour{r.durationHours > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-zinc-400" />
                {formatLKR(r.cost)}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
              <span className="flex items-center gap-1 text-sm text-zinc-500">
                <MapPin className="h-3.5 w-3.5" /> Space {r.space}
              </span>
              <Link
                href={`/parking/${r.parkingId}`}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View parking
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}