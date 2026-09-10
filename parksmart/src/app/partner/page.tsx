"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Banknote,
  ShieldCheck,
  Star,
  DoorOpen,
  Plus,
  Settings2,
  Check,
  Building2,
  Zap,
  Eye,
  Accessibility,
  Bike,
} from "lucide-react";
import { useApp } from "@/lib/context";
import { DESTINATIONS } from "@/lib/data";
import { ParkingLocation, ParkingSlot } from "@/lib/types";
import { formatLKR } from "@/lib/utils";
import ParkingMap from "@/components/ParkingMapDynamic";
import SlotMap from "@/components/SlotMap";
import SimulationControl from "@/components/SimulationControl";
import { DemoModeBadge, SimulationBadge } from "@/components/LiveDataIndicator";

const SECURITY_LEVELS: ParkingLocation["securityLevel"][] = [
  "High",
  "Medium",
  "Low",
];
const TRAFFIC_LEVELS: ParkingLocation["trafficLevel"][] = [
  "Low",
  "Moderate",
  "Heavy",
];

// Partners cannot set or edit the parking rating — a neutral default is
// applied on registration. The rating is displayed and managed from the
// customer/driver side.
const DEFAULT_PARTNER_RATING = 4.0;

const INPUT_CLS =
  "w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-800 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100";
const LABEL_CLS = "mb-1 block text-sm font-semibold text-zinc-600";

export default function PartnerDashboardPage() {
  const {
    parkings,
    slotsByParking,
    partnerFacilities,
    addParking,
    updateParking,
    getSlotCounts,
    showToast,
  } = useApp();

  const facilities = useMemo(
    () =>
      partnerFacilities
        .map((id) => parkings.find((p) => p.id === id))
        .filter((p): p is ParkingLocation => Boolean(p)),
    [partnerFacilities, parkings]
  );

  const totalSpacesOwned = facilities.reduce(
    (s, p) => s + p.totalSpaces,
    0
  );
  const availableOwned = facilities.reduce(
    (s, p) => s + p.availableSpaces,
    0
  );

  // Registration form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [areaIndex, setAreaIndex] = useState(0);
  const [totalSpaces, setTotalSpaces] = useState(50);
  const [pricePerHour, setPricePerHour] = useState(200);
  const [dailyMax, setDailyMax] = useState(0);
  const [securityLevel, setSecurityLevel] =
    useState<ParkingLocation["securityLevel"]>("High");
  const [walkingDistance, setWalkingDistance] = useState(150);
  const [trafficLevel, setTrafficLevel] =
    useState<ParkingLocation["trafficLevel"]>("Low");
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [flags, setFlags] = useState({
    evCharging: false,
    covered: true,
    accessibleParking: true,
    motorcycleParking: true,
    cctv: true,
    reservationAvailable: true,
  });
  const [description, setDescription] = useState("");
  const [registering, setRegistering] = useState(false);

  const anchor = DESTINATIONS[areaIndex];

  const register = () => {
    if (!name.trim()) {
      showToast("Please enter the facility name", "error");
      return;
    }
    if (!totalSpaces || totalSpaces < 1) {
      showToast("Please enter the total number of parking spaces", "error");
      return;
    }
    if (!pricePerHour || pricePerHour < 1) {
      showToast("Please enter the price per hour", "error");
      return;
    }
    setRegistering(true);
    setTimeout(() => {
      const drivingMinutes = Math.max(2, Math.round(walkingDistance / 100));
      const parking: Omit<ParkingLocation, "id"> = {
        name: name.trim(),
        latitude: anchor.latitude,
        longitude: anchor.longitude,
        address: address.trim() || `${anchor.name}, Colombo`,
        area: anchor.name,
        totalSpaces,
        availableSpaces: totalSpaces,
        pricePerHour,
        dailyMax: dailyMax > 0 ? dailyMax : pricePerHour * 8,
        securityLevel,
        rating: DEFAULT_PARTNER_RATING,
        walkingDistance,
        drivingDistanceKm: Math.max(
          0.5,
          Number((walkingDistance / 1000 + 0.3).toFixed(1))
        ),
        drivingMinutes,
        trafficLevel,
        openingTime,
        closingTime,
        evCharging: flags.evCharging,
        covered: flags.covered,
        accessibleParking: flags.accessibleParking,
        motorcycleParking: flags.motorcycleParking,
        cctv: flags.cctv,
        reservationAvailable: flags.reservationAvailable,
        description:
          description.trim() ||
          `Recently registered parking facility near ${anchor.name}.`,
      };
      addParking(parking);
      setRegistering(false);
      showToast(
        `${parking.name} registered with ${totalSpaces} slots!`,
        "success"
      );
      setName("");
      setAddress("");
      setDescription("");
    }, 700);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-zinc-900">
            <Store className="h-6 w-6 text-blue-600" /> Partner Dashboard
          </h1>
          <p className="text-sm text-zinc-500">
            Register your own parking facility in ParkSmart and manage it,
            all at once.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoModeBadge />
          <SimulationBadge />
        </div>
      </div>

      {/* Overview stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-zinc-900">
            {facilities.length}
          </p>
          <p className="text-xs text-zinc-500">Registered facilities</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-zinc-900">
            {totalSpacesOwned}
          </p>
          <p className="text-xs text-zinc-500">Total parking spaces</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-2xl font-extrabold text-emerald-700">
            {availableOwned}
          </p>
          <p className="text-xs text-emerald-600">Available now</p>
        </div>
      </div>

      {/* Register a facility */}
      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
            <Plus className="h-5 w-5 text-blue-600" /> Register a new parking
            facility
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Create the entire facility at once — the full slot layout
            (1–{totalSpaces || "N"}) is generated automatically and the
            facility appears in the map, cards and reservation system
            immediately.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={LABEL_CLS}>Parking facility name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Colombo Fort Parking"
                className={INPUT_CLS}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL_CLS}>Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="No. 5, Chatham Street, Colombo 01"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Location on map</label>
              <select
                value={areaIndex}
                onChange={(e) => setAreaIndex(Number(e.target.value))}
                className={INPUT_CLS}
              >
                {DESTINATIONS.map((d, i) => (
                  <option key={d.name} value={i}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Total parking spaces</label>
              <input
                type="number"
                min={1}
                value={totalSpaces}
                onChange={(e) => setTotalSpaces(Number(e.target.value))}
                className={INPUT_CLS}
              />
              <p className="mt-1 text-xs text-zinc-400">
                Slots 1–{totalSpaces || "N"} will be created automatically.
              </p>
            </div>
            <div>
              <label className={LABEL_CLS}>Price per hour (Rs.)</label>
              <input
                type="number"
                min={1}
                value={pricePerHour}
                onChange={(e) => setPricePerHour(Number(e.target.value))}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Daily max (Rs.) — 0 = auto</label>
              <input
                type="number"
                min={0}
                value={dailyMax}
                onChange={(e) => setDailyMax(Number(e.target.value))}
                placeholder={`auto (${pricePerHour * 8})`}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Security level</label>
              <select
                value={securityLevel}
                onChange={(e) =>
                  setSecurityLevel(
                    e.target.value as ParkingLocation["securityLevel"]
                  )
                }
                className={INPUT_CLS}
              >
                {SECURITY_LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Walking distance to destination (m)</label>
              <input
                type="number"
                min={0}
                value={walkingDistance}
                onChange={(e) => setWalkingDistance(Number(e.target.value))}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Traffic on the way</label>
              <select
                value={trafficLevel}
                onChange={(e) =>
                  setTrafficLevel(
                    e.target.value as ParkingLocation["trafficLevel"]
                  )
                }
                className={INPUT_CLS}
              >
                {TRAFFIC_LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLS}>Opening hours</label>
              <input
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                placeholder="06:00"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Closing hours</label>
              <input
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                placeholder="22:00"
                className={INPUT_CLS}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL_CLS}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description shown on the parking details page…"
                rows={3}
                className={`${INPUT_CLS} resize-none`}
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-x-5 gap-y-2">
              {(
                [
                  { key: "covered", label: "Covered parking", icon: Building2 },
                  { key: "evCharging", label: "EV charging", icon: Zap },
                  { key: "cctv", label: "CCTV", icon: Eye },
                  {
                    key: "accessibleParking",
                    label: "Accessible spaces",
                    icon: Accessibility,
                  },
                  {
                    key: "motorcycleParking",
                    label: "Motorcycle parking",
                    icon: Bike,
                  },
                  {
                    key: "reservationAvailable",
                    label: "Reservations allowed",
                    icon: DoorOpen,
                  },
                ] as const
              ).map((f) => (
                <label
                  key={f.key}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-700"
                >
                  <input
                    type="checkbox"
                    checked={flags[f.key]}
                    onChange={() =>
                      setFlags((prev) => ({
                        ...prev,
                        [f.key]: !prev[f.key],
                      }))
                    }
                    className="h-4 w-4 rounded border-zinc-300 accent-blue-600"
                  />
                  <f.icon className="h-4 w-4 text-zinc-400" /> {f.label}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={register}
            disabled={registering}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            <Plus className="h-5 w-5" />
            {registering
              ? "Registering facility…"
              : "Register facility with all slots"}
          </button>
        </div>

        {/* Live preview */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-zinc-900">Facility preview</h3>
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-extrabold text-zinc-900">
                  {name.trim() || "Colombo Fort Parking"}
                </p>
                <p className="flex items-center gap-1 text-xs text-zinc-500">
                  <MapPin className="h-3 w-3" />
                  {anchor.name} ({anchor.latitude}, {anchor.longitude})
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                <Star className="h-3 w-3" /> {DEFAULT_PARTNER_RATING}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-zinc-100 p-3">
                <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <DoorOpen className="h-3.5 w-3.5" /> Spaces
                </p>
                <p className="mt-1 font-bold text-zinc-800">
                  {totalSpaces || 0} (slots 1–
                  {totalSpaces || 0})
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 p-3">
                <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Banknote className="h-3.5 w-3.5" /> Price
                </p>
                <p className="mt-1 font-bold text-zinc-800">
                  {formatLKR(pricePerHour)}/hr
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 p-3">
                <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <ShieldCheck className="h-3.5 w-3.5" /> Security
                </p>
                <p className="mt-1 font-bold text-zinc-800">{securityLevel}</p>
              </div>
              <div className="rounded-xl border border-zinc-100 p-3">
                <p className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <DoorOpen className="h-3.5 w-3.5" /> Hours
                </p>
                <p className="mt-1 font-bold text-zinc-800">
                  {openingTime} – {closingTime}
                </p>
              </div>
            </div>
            <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
              After registration this facility is shown on the ParkSmart map,
              in parking cards, the details page and the slot reservation
              system — no extra setup needed.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">Location on map</h3>
              <span className="text-xs text-zinc-400">{anchor.name}</span>
            </div>
            <div className="mt-3 h-52 overflow-hidden rounded-xl">
              <ParkingMap
                parkings={parkings}
                destination={anchor}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Manage registered facilities */}
      <h2 className="mt-10 text-lg font-bold text-zinc-900">
        Manage your registered facilities
      </h2>
      {facilities.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
          You have not registered any facilities yet. Use the form above to add
          your first one.
        </div>
      ) : (
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          {facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              slots={slotsByParking[facility.id] ?? []}
              counts={getSlotCounts(facility.id)}
              parkings={parkings}
              onUpdate={(changes) =>
                updateParking(facility.id, changes)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FacilityCard({
  facility,
  slots,
  counts,
  parkings,
  onUpdate,
}: {
  facility: ParkingLocation;
  slots: ParkingSlot[];
  counts: { total: number; occupied: number; reserved: number; available: number };
  parkings: ParkingLocation[];
  onUpdate: (
    changes: Partial<
      Pick<
        ParkingLocation,
        "name" | "pricePerHour" | "dailyMax" | "description" | "reservationAvailable"
      >
    >
  ) => void;
}) {
  const [manageOpen, setManageOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(facility.name);
  const [price, setPrice] = useState(facility.pricePerHour);
  const [dailyMax, setDailyMax] = useState(facility.dailyMax);
  const [desc, setDesc] = useState(facility.description);
  const [reservationAvailable, setReservationAvailable] = useState(
    facility.reservationAvailable
  );
  const { showToast } = useApp();

  const save = () => {
    onUpdate({
      name: name.trim() || facility.name,
      pricePerHour: price,
      dailyMax,
      description: desc,
      reservationAvailable,
    });
    setEditOpen(false);
    showToast(`${name.trim() || facility.name} updated`, "success");
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`/parking/${facility.id}`}
            className="text-lg font-extrabold text-zinc-900 hover:underline"
          >
            {facility.name}
          </Link>
          <p className="flex items-center gap-1 text-xs text-zinc-500">
            <MapPin className="h-3 w-3" /> {facility.address}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
              <Banknote className="h-3 w-3" /> {formatLKR(facility.pricePerHour)}/hr
            </span>
            <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 font-semibold text-zinc-600">
              <DoorOpen className="h-3 w-3" /> {counts.available}/{counts.total} free
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">
              <ShieldCheck className="h-3 w-3" /> {facility.securityLevel}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/parking/${facility.id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            View details
          </Link>
          <button
            onClick={() => setManageOpen((o) => !o)}
            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            <DoorOpen className="h-3.5 w-3.5" /> {manageOpen ? "Hide slots" : "Manage slots"}
          </button>
          <button
            onClick={() => setEditOpen((o) => !o)}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <Settings2 className="h-3.5 w-3.5" /> Edit
          </button>
        </div>
      </div>

      {editOpen && (
        <div className="mt-4 grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600">
              Facility name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600">
              Price per hour (Rs.)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600">
              Daily max (Rs.)
            </label>
            <input
              type="number"
              value={dailyMax}
              onChange={(e) => setDailyMax(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-600">
              Reservations allowed
            </label>
            <label className="flex items-center gap-2 pt-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={reservationAvailable}
                onChange={(e) => setReservationAvailable(e.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
              Allow drivers to reserve slots
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-zinc-600">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="sm:col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={() => setEditOpen(false)}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              <Check className="h-3.5 w-3.5" /> Save changes
            </button>
          </div>
        </div>
      )}

      {/* Mini map showing the facility on the live map */}
      <div className="mt-4 h-40 overflow-hidden rounded-xl">
        <ParkingMap
          parkings={parkings}
          destination={DESTINATIONS[0]}
          selectedId={facility.id}
          height="100%"
        />
      </div>

      {/* Slot management (reuses the existing attendant slot manager UI minus Mark Reserved) */}
      {manageOpen && (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-700">
              Slot management
            </p>
            <SimulationControl />
          </div>
          <SlotMap parking={facility} slots={slots} mode="manage" />
        </div>
      )}
    </div>
  );
}