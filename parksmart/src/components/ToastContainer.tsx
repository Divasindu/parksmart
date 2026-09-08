"use client";

import { useApp } from "@/lib/context";
import { CheckCircle2, XCircle, Info } from "lucide-react";

export default function ToastContainer() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 z-[1200] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast-in flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-lg"
        >
          {t.type === "success" && (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          )}
          {t.type === "error" && (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          )}
          {t.type === "info" && (
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          )}
          <p className="text-sm font-medium text-zinc-800">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
