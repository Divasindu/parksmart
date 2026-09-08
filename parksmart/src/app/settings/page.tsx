"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  SlidersHorizontal,
  User,
  Bell,
  Car,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { DemoModeBadge } from "@/components/LiveDataIndicator";

export default function SettingsPage() {
  const { preferences, setPreferences, showToast } = useApp();
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof preferences) => {
    setPreferences({ [key]: !preferences[key] });
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
    showToast("Preferences saved — recommendations updated!", "success");
  };

  const preferencesList = [
    { key: "cheapest" as const, label: "Cheapest", desc: "Prioritize low price" },
    { key: "closest" as const, label: "Closest", desc: "Prioritize distance" },
    { key: "highestAvailability" as const, label: "Highest availability", desc: "Most open spaces" },
    { key: "highestSecurity" as const, label: "Highest security", desc: "Secure & monitored" },
    { key: "covered" as const, label: "Covered parking", desc: "Only covered lots" },
    { key: "evCharging" as const, label: "EV charging", desc: "Charge while parked" },
    { key: "accessible" as const, label: "Accessible parking", desc: "Disabled-friendly" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <Settings className="h-6 w-6 text-blue-600" /> Settings
          </h1>
          <p className="text-sm text-zinc-500">
            Manage your profile and parking preferences
          </p>
        </div>
        <DemoModeBadge />
      </div>

      {/* Profile */}
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-zinc-900">
          <User className="h-4 w-4 text-blue-600" /> Profile
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-zinc-600">Name</label>
            <input
              defaultValue="Amal Kumarasinghe"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800 focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">Email</label>
            <input
              defaultValue="amal@example.com"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800 focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={save}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Save profile
        </button>
      </div>

      {/* Vehicle */}
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-zinc-900">
          <Car className="h-4 w-4 text-blue-600" /> Vehicle
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-zinc-600">
              Number plate
            </label>
            <input
              defaultValue="WP CAB-1234"
              className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 font-mono text-zinc-800"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-600">
              Vehicle type
            </label>
            <select className="mt-1 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-800">
              <option>Car</option>
              <option>Motorcycle</option>
              <option>Van</option>
              <option>SUV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-zinc-900">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Parking
          preferences
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          These power the smart recommendation algorithm.
        </p>

        <div className="mt-4 grid gap-2">
          {preferencesList.map((p) => (
            <button
              key={p.key}
              onClick={() => toggle(p.key)}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left hover:bg-zinc-50"
            >
              <div>
                <p className="font-semibold text-zinc-800">{p.label}</p>
                <p className="text-xs text-zinc-500">{p.desc}</p>
              </div>
              <span
                className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences[p.key] ? "bg-blue-600" : "bg-zinc-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    preferences[p.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={save}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
        >
          {saved && <CheckCircle2 className="h-5 w-5" />}
          {saved ? "Preferences saved" : "Save preferences"}
        </button>
      </div>

      {/* Notifications + security */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-zinc-900">
            <Bell className="h-4 w-4 text-amber-500" /> Notifications
          </h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            <label className="flex items-center justify-between">
              Reservation reminders
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
            </label>
            <label className="flex items-center justify-between">
              Availability alerts
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
            </label>
            <label className="flex items-center justify-between">
              Price drop alerts
              <input type="checkbox" className="h-4 w-4 accent-blue-600" />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-bold text-zinc-900">
            <Lock className="h-4 w-4 text-blue-600" /> Security
          </h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            <label className="flex items-center justify-between">
              Two-factor auth
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
            </label>
            <label className="flex items-center justify-between">
              Sign in with Google
              <input type="checkbox" className="h-4 w-4 accent-blue-600" />
            </label>
          </div>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}