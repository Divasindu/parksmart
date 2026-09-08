import { Car, LogIn, LogOut, MapPin } from "lucide-react";
import { VehicleEntry } from "@/lib/types";

export default function VehicleStatus({ vehicle }: { vehicle: VehicleEntry }) {
  const parked = vehicle.status === "parked";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
          parked ? "bg-blue-600 text-white" : "bg-zinc-200 text-zinc-600"
        }`}
      >
        <Car className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <p className="font-mono text-sm font-bold uppercase text-zinc-900">
          {vehicle.plate}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <LogIn className="h-3 w-3 text-emerald-500" /> {vehicle.entryTime}
          </span>
          {vehicle.exitTime && (
            <span className="flex items-center gap-1">
              <LogOut className="h-3 w-3 text-red-500" /> {vehicle.exitTime}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {vehicle.parkingName} · {vehicle.space}
          </span>
        </div>
      </div>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          parked ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {parked ? "Parked" : "Exited"}
      </span>
    </div>
  );
}
