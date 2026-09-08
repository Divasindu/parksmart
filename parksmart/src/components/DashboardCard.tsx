import { LucideIcon } from "lucide-react";

export default function DashboardCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "blue",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  color?: "blue" | "green" | "orange" | "red" | "zinc";
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    zinc: "bg-zinc-100 text-zinc-600",
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold text-zinc-900">{value}</p>
          <p className="text-xs font-medium text-zinc-500">{label}</p>
        </div>
      </div>
      {sub && <p className="mt-2 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}
