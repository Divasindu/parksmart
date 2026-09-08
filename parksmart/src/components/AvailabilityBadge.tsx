import { getAvailabilityStatus } from "@/lib/utils";
import { CircleDot } from "lucide-react";

export default function AvailabilityBadge({
  available,
  total,
  showText = true,
}: {
  available: number;
  total: number;
  showText?: boolean;
}) {
  const status = getAvailabilityStatus(available, total);
  const styles = {
    available: "bg-emerald-50 text-emerald-700 border-emerald-200",
    limited: "bg-orange-50 text-orange-600 border-orange-200",
    full: "bg-red-50 text-red-600 border-red-200",
  };
  const labels = {
    available: "Available",
    limited: "Limited",
    full: "Full",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <CircleDot className="h-3.5 w-3.5" />
      {showText && (
        <span>
          {available} / {total} spaces · {labels[status]}
        </span>
      )}
    </span>
  );
}
