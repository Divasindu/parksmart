"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Map,
  ShieldCheck as ShieldCheckIcon,
  LayoutDashboard,
  History,
  Heart,
  DoorOpen,
  Settings,
  Bell,
  Menu,
  X,
  Car,
  LogIn,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { useState } from "react";

const USER_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Map", icon: Map },
  { href: "/safe-parking", label: "Safe Parking", icon: ShieldCheckIcon },
  { href: "/history", label: "History", icon: History },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/private-parking", label: "Private Parking", icon: DoorOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount, notifications, markAllNotificationsRead } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const isOperatorPath = pathname.startsWith("/operator");

  return (
    <header className="sticky top-0 z-[100] border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Car className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            Park<span className="text-blue-600">Smart</span>
          </span>
        </Link>

        {isOperatorPath ? (
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/operator"
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === "/operator"
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/operator/slots"
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === "/operator/slots"
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              Parking Slots
            </Link>
            <Link
              href="/operator/sensors"
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === "/operator/sensors"
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              IoT Sensors
            </Link>
            <Link
              href="/operator/vehicles"
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === "/operator/vehicles"
                  ? "bg-blue-50 text-blue-700"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              Vehicle Entry
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-1">
            {USER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {!isOperatorPath && (
            <>
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen((o) => !o);
                    if (!notifOpen) markAllNotificationsRead();
                  }}
                  className="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-sm font-semibold text-zinc-800">
                        Notifications
                      </span>
                      <button
                        className="text-xs text-blue-600 hover:underline"
                        onClick={markAllNotificationsRead}
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 && (
                        <p className="px-2 py-4 text-center text-sm text-zinc-500">
                          No notifications yet.
                        </p>
                      )}
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-lg px-2 py-2 hover:bg-zinc-50"
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                n.type === "warning"
                                  ? "bg-amber-500"
                                  : n.type === "success"
                                  ? "bg-emerald-500"
                                  : "bg-blue-500"
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-zinc-800">
                                {n.title}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {n.message}
                              </p>
                              <p className="mt-0.5 text-[11px] text-zinc-400">
                                {n.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/settings"
                className={`rounded-lg p-2 ${
                  pathname === "/settings"
                    ? "text-blue-700"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>

              <Link
                href="/operator"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Operator
              </Link>
            </>
          )}

          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <LogIn className="h-4 w-4" /> Login
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-xs font-bold text-white"
              aria-label="Profile"
            >
              AK
            </button>
          </div>

          <button
            className="md:hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-zinc-200 bg-white px-4 py-2">
          {(isOperatorPath
            ? [
                { href: "/operator", label: "Dashboard" },
                { href: "/operator/slots", label: "Parking Slots" },
                { href: "/operator/sensors", label: "IoT Sensors" },
                { href: "/operator/vehicles", label: "Vehicle Entry" },
              ]
            : [
                { href: "/dashboard", label: "Dashboard" },
                { href: "/map", label: "Map" },
                { href: "/safe-parking", label: "Safe Parking" },
                { href: "/history", label: "History" },
                { href: "/favorites", label: "Favorites" },
                { href: "/private-parking", label: "Private Parking" },
                { href: "/operator", label: "Operator" },
                { href: "/login", label: "Login / Sign up" },
                { href: "/settings", label: "Settings" },
              ]
          ).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
