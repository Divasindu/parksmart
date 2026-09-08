import Link from "next/link";
import {
  Clock,
  Eye,
  ShieldCheck,
  CalendarCheck,
  Car,
  MapPin,
  ArrowRight,
  TrendingDown,
  Bell,
  Sparkles,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { DemoModeBadge } from "@/components/LiveDataIndicator";
import RecommendationCard from "@/components/RecommendationCard";
import { PARKING_LOCATIONS } from "@/lib/data";
import { calculateScore } from "@/lib/utils";

export default function HomePage() {
  const recommended = [...PARKING_LOCATIONS].sort(
    (a, b) => calculateScore(b, null).total - calculateScore(a, null).total
  )[0];
  const top = PARKING_LOCATIONS.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="animate-fade-in">
              <div className="mb-4 flex items-center gap-2">
                <DemoModeBadge />
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Find parking{" "}
                <span className="text-blue-600">before you arrive.</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg text-zinc-600">
                Real-time parking availability, smart recommendations, and easy
                reservations — all in one place.
              </p>

              <div className="mt-8">
                <SearchBar size="lg" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-bold text-zinc-900">10–15 min</p>
                  <p className="text-xs text-zinc-500">Avg. search time</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-bold text-zinc-900">85+</p>
                  <p className="text-xs text-zinc-500">Parking spaces</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-bold text-zinc-900">24/7</p>
                  <p className="text-xs text-zinc-500">Monitoring</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-bold text-zinc-900">30%</p>
                  <p className="text-xs text-zinc-500">Less search traffic</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-zinc-400">
                Prototype statistics for demonstration purposes.
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-sm">
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
                  <div className="h-40 bg-gradient-to-br from-blue-600 to-blue-700 p-4">
                    <div className="rounded-lg bg-white/10 p-2 text-white">
                      <p className="text-xs text-blue-100">Destination</p>
                      <div className="flex items-center gap-1.5 font-semibold">
                        <MapPin className="h-4 w-4" /> Colombo Fort
                      </div>
                    </div>
                  </div>
                  <div className="-mt-6 p-4">
                    <div className="rounded-xl border border-zinc-100 bg-white p-3 shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-zinc-900">Fort City Parking</p>
                          <p className="text-xs text-emerald-600 font-semibold">
                            ● 42 spaces available
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                          Rs. 100/hr
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                        <MapPin className="h-3 w-3" /> 350 m · 3 min drive · 5 min walk
                      </div>
                      <div className="mt-2 flex gap-1.5">
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          🛡 Secure
                        </span>
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                          ⚡ EV
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                      <Sparkles className="h-4 w-4" />
                      Featured recommendation
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ParkSmart */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold text-zinc-900">
          Why ParkSmart?
        </h2>
        <p className="mt-2 text-center text-zinc-500">
          Built to solve the urban parking problem in congested cities like Colombo.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Clock,
              title: "Save Time",
              desc: "Reduce the 10–15 minute parking search with live availability.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Eye,
              title: "Know Before You Go",
              desc: "See parking availability before reaching your destination.",
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              icon: ShieldCheck,
              title: "Park Safely",
              desc: "Find legal, secure parking spaces every time.",
              color: "bg-orange-50 text-orange-600",
            },
            {
              icon: CalendarCheck,
              title: "Reserve in Advance",
              desc: "Secure a parking space before you even arrive.",
              color: "bg-purple-50 text-purple-600",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}
              >
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-zinc-900">{f.title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold text-zinc-900">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Search",
                desc: "Enter your destination and instantly see all nearby parking with live availability.",
              },
              {
                step: "2",
                title: "Reserve",
                desc: "Compare price, security and distance, then reserve your spot with a digital pass.",
              },
              {
                step: "3",
                title: "Park",
                desc: "Navigate straight to your reserved space. Sensors and number-plate systems confirm entry.",
              },
            ].map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-900">{s.title}</h3>
                <p className="mx-auto mt-1 max-w-xs text-sm text-zinc-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured parking */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-zinc-900">
            Popular parking in Colombo
          </h2>
          <Link
            href="/map"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {top.map((p) => (
            <Link
              key={p.id}
              href={`/parking/${p.id}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-zinc-900 group-hover:text-blue-700">
                  {p.name}
                </h3>
                {p.id === "p1" && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                    Best
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">{p.area}</p>
              <p className="mt-2 text-sm font-semibold text-emerald-600">
                ● {p.availableSpaces}/{p.totalSpaces} available
              </p>
              <div className="mt-2 flex justify-between text-sm">
                <span className="font-semibold text-zinc-800">
                  Rs. {p.pricePerHour}/hr
                </span>
                <span className="text-zinc-400">★ {p.rating}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold">
            Solving real parking problems
          </h2>
          <p className="mt-2 text-center text-zinc-400">
            Designed from a Design Thinking process to reduce search time and
            prevent unsafe roadside parking.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Clock,
                title: "Search time",
                sol: "Real-time map + smart recommendations",
              },
              {
                icon: Eye,
                title: "Unknown availability",
                sol: "Live availability simulation",
              },
              {
                icon: CalendarCheck,
                title: "No reservations",
                sol: "Advance parking reservation",
              },
              {
                icon: TrendingDown,
                title: "Price uncertainty",
                sol: "Transparent price comparison",
              },
              {
                icon: ShieldCheck,
                title: "Unsafe parking",
                sol: "Safe & legal parking info",
              },
              {
                icon: Car,
                title: "Roadside parking",
                sol: "Legal parking recommendations",
              },
              {
                icon: Bell,
                title: "Manual entry",
                sol: "ANPR & smart sensor simulation",
              },
              {
                icon: MapPin,
                title: "Distance hassle",
                sol: "Navigation + walking distance",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <f.icon className="h-6 w-6 text-blue-400" />
                <h3 className="mt-3 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-zinc-300">{f.sol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-12 text-center text-white shadow-lg">
          <h2 className="text-3xl font-extrabold">
            Find it. Reserve it. Park it.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-blue-100">
            Stop circling the block. Find and reserve the perfect parking spot in
            Colombo in seconds.
          </p>
          <div className="mx-auto mt-8 max-w-lg">
            <SearchBar size="lg" />
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-700 hover:bg-blue-50"
            >
              Open Dashboard
            </Link>
            <Link
              href="/private-parking"
              className="rounded-xl border border-white/40 px-6 py-3 font-bold text-white hover:bg-white/10"
            >
              Share Parking
            </Link>
          </div>
        </div>
      </section>

      {/* Recommendation preview */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-zinc-900">
              Smart recommendations
            </h2>
            <p className="mt-2 text-zinc-600">
              Our engine scores every parking option on availability, distance,
              price, security and traffic so you get the best choice instantly.
            </p>
            <Link
              href="/search"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              Try it now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <RecommendationCard parking={recommended} />
        </div>
      </section>
    </div>
  );
}
