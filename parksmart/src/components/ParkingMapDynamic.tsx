"use client";

import dynamic from "next/dynamic";

const ParkingMap = dynamic(() => import("./ParkingMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-zinc-100 text-sm text-zinc-500">
      Loading map…
    </div>
  ),
});

export default ParkingMap;