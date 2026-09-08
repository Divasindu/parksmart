"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  ClipboardCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/lib/context";

type Role = "driver" | "attendant";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<Role>("driver");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!email || !password) {
      showToast("Please enter your email and password", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "attendant") {
        showToast("Signed in as Parking Attendant", "success");
        router.push("/operator/slots");
      } else {
        showToast(
          mode === "login" ? "Welcome back!" : "Account created successfully!",
          "success"
        );
        router.push("/dashboard");
      }
    }, 900);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <Car className="h-7 w-7" />
          </span>
        </div>
        <h1 className="mt-4 text-center text-2xl font-extrabold text-zinc-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-center text-sm text-zinc-500">
          Find it. Reserve it. Park it.
        </p>

        {/* Mode toggle */}
        <div className="mt-6 flex rounded-xl bg-zinc-100 p-1">
          {(
            [
              { key: "login", label: "Login" },
              { key: "signup", label: "Sign up" },
            ] as const
          ).map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                mode === m.key
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Role selection */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-zinc-600">
            Continue as
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              onClick={() => setRole("driver")}
              className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm transition-colors ${
                role === "driver"
                  ? "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <Car className="h-5 w-5" />
              <span className="font-bold">Driver / User</span>
              <span className="text-[10px] text-zinc-500">
                find, reserve & navigate
              </span>
            </button>
            <button
              onClick={() => setRole("attendant")}
              className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm transition-colors ${
                role === "attendant"
                  ? "border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <ClipboardCheck className="h-5 w-5" />
              <span className="font-bold">Parking Attendant</span>
              <span className="text-[10px] text-zinc-500">
                manage live slots
              </span>
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
              <Mail className="h-4 w-4 text-zinc-400" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-semibold text-zinc-600">
              <Lock className="h-4 w-4 text-zinc-400" /> Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 pr-11 text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
              <button
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {role === "attendant" ? (
            <ShieldCheck className="h-5 w-5" />
          ) : mode === "login" ? (
            <LogIn className="h-5 w-5" />
          ) : (
            <UserPlus className="h-5 w-5" />
          )}
          {loading
            ? "Processing…"
            : role === "attendant"
            ? "Continue as Attendant"
            : mode === "login"
            ? "Login"
            : "Create account"}
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-zinc-400">
          <div className="h-px flex-1 bg-zinc-200" />
          OR
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Continue as Guest <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Prototype authentication — any email & password works. Sign in as an
          attendant to manage live parking slots.
        </p>
      </div>
    </div>
  );
}