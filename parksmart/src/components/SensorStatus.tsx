import { Car, Circle } from "lucide-react";
import { SensorSpace } from "@/lib/types";

export default function SensorStatus({ space }: { space: SensorSpace }) {
  const occupied = space.status === "occupied";
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border p-3 ${
        occupied
          ? "border-red-100 bg-red-50/60"
          : "border-emerald-100 bg-emerald-50/60"
      }`}
    >
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
          occupied ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
        }`}
      >
        <Car className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold text-zinc-800">Space {space.id}</p>
        <p className="flex items-center gap-1 text-xs text-zinc-500">
          <Circle
            className={`h-2 w-2 ${occupied ? "fill-red-500 text-red-500" : "fill-emerald-500 text-emerald-500"}`}
          />
          {occupied ? "Occupied" : "Available"}
        </p>
      </div>
      <span className="text-[11px] text-zinc-400">{space.updatedAt}</span>
    </div>
  );
}
