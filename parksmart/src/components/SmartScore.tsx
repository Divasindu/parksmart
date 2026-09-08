import { Gauge } from "lucide-react";

export default function SmartScore({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-blue-600" : "text-amber-600";
  const ring =
    score >= 80 ? "ring-emerald-500" : score >= 60 ? "ring-blue-500" : "ring-amber-500";
  const dim =
    size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${dim} ${ring} relative inline-flex items-center justify-center rounded-full bg-white ring-2`}
      >
        <span className={`font-bold ${color}`}>{score}</span>
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-1 text-xs font-semibold text-zinc-800">
          <Gauge className="h-3.5 w-3.5 text-blue-600" />
          Smart Score
        </div>
        <div className="text-[11px] text-zinc-500">/100</div>
      </div>
    </div>
  );
}
