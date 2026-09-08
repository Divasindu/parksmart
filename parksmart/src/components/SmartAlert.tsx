import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function SmartAlert({
  message,
  remaining,
}: {
  message: string;
  remaining: number;
}) {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <div className="flex-1">
          <p className="font-bold text-amber-800">Parking is filling up quickly</p>
          <p className="mt-0.5 text-sm text-amber-700">
            {message} Only {remaining} space{remaining === 1 ? "" : "s"} remain.
          </p>
        </div>
      </div>
      <Link
        href="/map"
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
      >
        Find Alternative Parking <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
