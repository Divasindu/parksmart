"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DoorOpen,
  MapPin,
  Clock,
  BadgeCheck,
  Plus,
  Wallet,
  CalendarCheck,
  ShieldCheck,
  X,
} from "lucide-react";
import { PRIVATE_PARKINGS } from "@/lib/data";
import { useApp } from "@/lib/context";
import { formatLKR } from "@/lib/utils";
import { DemoModeBadge } from "@/components/LiveDataIndicator";

export default function PrivateParkingPage() {
  const { showToast } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState(PRIVATE_PARKINGS);
  const [form, setForm] = useState({
    name: "",
    price: 70,
    from: "09:00",
    to: "18:00",
  });

  const addListing = () => {
    if (!form.name.trim()) {
      showToast("Please enter a name for your space", "error");
      return;
    }
    const newListing = {
      id: `pp${listings.length + 1}`,
      name: form.name,
      latitude: 6.9,
      longitude: 79.855,
      distanceM: 600,
      pricePerHour: form.price,
      available: true,
      availableFrom: form.from,
      availableTo: form.to,
      ownerName: "You",
      verified: true,
    };
    setListings((prev) => [newListing, ...prev]);
    setShowForm(false);
    setForm({ name: "", price: 70, from: "09:00", to: "18:00" });
    showToast("Your parking space is now live!", "success");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <DoorOpen className="h-6 w-6 text-blue-600" /> Private Parking
            Market
          </h1>
          <p className="text-sm text-zinc-500">
            Earn from unused spaces — or find a cheaper spot near you
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoModeBadge />
          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add your space
          </button>
        </div>
      </div>

      {/* Private owner earnings preview */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Host a parking space</h2>
            <p className="text-sm text-emerald-100">
              List your unused driveway or parking bay and earn while it&apos;s idle.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Wallet className="h-6 w-6" /> Rs. 12,400
            </div>
            <p className="text-xs text-emerald-200">avg. monthly earnings</p>
          </div>
        </div>
      </div>

      {/* Add space form */}
      {showForm && (
        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-zinc-900">List your parking space</h2>
            <button onClick={() => setShowForm(false)} aria-label="Close">
              <X className="h-5 w-5 text-zinc-500" />
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              placeholder="Space name (e.g. My home driveway)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 sm:col-span-2"
            />
            <input
              type="number"
              placeholder="Price per hour (Rs.)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800"
            />
            <button
              onClick={addListing}
              className="rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Publish listing
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Available from
              </label>
              <input
                type="time"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600">
                Available to
              </label>
              <input
                type="time"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* Medicare note: photo upload for prototype */}
      <p className="mt-3 text-xs text-zinc-400">
        Prototype note: photo upload and payment settlement are simulated for
        this student project.
      </p>

      {/* Listings */}
      <h2 className="mt-8 text-lg font-bold text-zinc-900">
        Available private parking ({listings.length})
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {listings.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              p.available ? "border-zinc-200" : "border-zinc-100 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-zinc-900">{p.name}</h3>
              {p.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <div className="mt-2 space-y-1.5 text-sm text-zinc-600">
              <p className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-zinc-400" /> {p.distanceM} m away
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-400" /> Available {p.availableFrom} – {p.availableTo}
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-zinc-400" /> Owner: {p.ownerName}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
              <div>
                <span className="text-lg font-extrabold text-zinc-900">
                  {formatLKR(p.pricePerHour)}
                </span>
                <span className="text-sm text-zinc-500">/hour</span>
              </div>
              {p.available ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  ● Available
                </span>
              ) : (
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-500">
                  Unavailable
                </span>
              )}
            </div>

            <div className="mt-3">
              {p.available ? (
                <button
                  onClick={() =>
                    showToast(`Reservation requested at ${p.name}!`, "success")
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
                >
                  <CalendarCheck className="h-4 w-4" /> Reserve
                </button>
              ) : (
                <Link
                  href="/map"
                  className="block rounded-xl bg-zinc-100 px-4 py-2.5 text-center font-semibold text-zinc-600 hover:bg-zinc-200"
                >
                  Find alternative
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}