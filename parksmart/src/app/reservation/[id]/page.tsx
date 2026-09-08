"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/lib/context";
import ParkingPass from "@/components/ParkingPass";
import { DemoModeBadge } from "@/components/LiveDataIndicator";

function PassContent() {
  const { id } = useParams<{ id: string }>();
  const { reservations } = useApp();
  const reservation = reservations.find((r) => r.id === id);

  if (!reservation) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-lg font-semibold text-zinc-700">
          Reservation not found
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          This reservation may have been cancelled or expired.
        </p>
        <a
          href="/dashboard"
          className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="mb-6 flex items-center justify-center">
        <DemoModeBadge />
      </div>
      <ParkingPass reservation={reservation} />
    </div>
  );
}

export default function ReservationPassPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-500">Loading…</div>}>
      <PassContent />
    </Suspense>
  );
}