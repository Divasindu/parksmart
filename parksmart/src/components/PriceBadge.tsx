import { Banknote } from "lucide-react";
import { formatLKR } from "@/lib/utils";

export default function PriceBadge({ pricePerHour }: { pricePerHour: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
      <Banknote className="h-3.5 w-3.5 text-emerald-600" />
      {formatLKR(pricePerHour)}/hr
    </span>
  );
}
