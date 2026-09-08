import { ShieldCheck, Shield } from "lucide-react";

export default function SecurityBadge({
  level,
}: {
  level: "High" | "Medium" | "Low";
}) {
  const styles =
    level === "High"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : level === "Medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-600 border-red-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {level === "High" ? (
        <ShieldCheck className="h-3.5 w-3.5" />
      ) : (
        <Shield className="h-3.5 w-3.5" />
      )}
      {level} security
    </span>
  );
}
