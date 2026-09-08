import {
  ParkingLocation,
  PrivateParking,
  Notification,
  SensorSpace,
  VehicleEntry,
  DestinationOption,
  ParkingSlot,
  SlotStatus,
} from "./types";
import { addHours, minutesToTime12 } from "./utils";

function mulberry32(seed: number) {
  let a = seed | 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SLOT_ROWS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateSlotsForParking(p: ParkingLocation): ParkingSlot[] {
  const { id, totalSpaces, availableSpaces } = p;
  const reserved = Math.min(
    Math.max(1, Math.round(totalSpaces * 0.1)),
    Math.max(0, totalSpaces - 1)
  );
  const occupied = Math.max(0, totalSpaces - availableSpaces - reserved);

  const rand = mulberry32(hashString(id + "|slots"));
  const statuses: SlotStatus[] = [];
  for (let i = 0; i < occupied; i++) statuses.push("occupied");
  for (let i = 0; i < reserved; i++) statuses.push("reserved");
  for (let i = 0; i < totalSpaces - occupied - reserved; i++)
    statuses.push("available");

  for (let i = statuses.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [statuses[i], statuses[j]] = [statuses[j], statuses[i]];
  }

  const perLevel = 8;
  return statuses.map((status, i) => {
    const row = SLOT_ROWS[Math.floor(i / perLevel)];
    const number = `${i + 1}`.padStart(2, "0");
    let reservedFrom: string | undefined;
    let reservedTo: string | undefined;
    if (status === "reserved") {
      const startMin = 9 * 60 + Math.floor(rand() * 8 * 60);
      reservedFrom = minutesToTime12(startMin);
      reservedTo = addHours(reservedFrom, 1 + Math.floor(rand() * 2));
    }
    return {
      id: `${id}-s${i + 1}`,
      number,
      row,
      status,
      reservedFrom,
      reservedTo,
      updatedAt: "just now",
    };
  });
}

export function generateAllSlots(
  parkings: ParkingLocation[]
): Record<string, ParkingSlot[]> {
  const out: Record<string, ParkingSlot[]> = {};
  parkings.forEach((p) => {
    out[p.id] = generateSlotsForParking(p);
  });
  return out;
}

export const DESTINATIONS: DestinationOption[] = [
  { name: "Colombo Fort", latitude: 6.9344, longitude: 79.8428 },
  { name: "Pettah", latitude: 6.937, longitude: 79.853 },
  { name: "Galle Face", latitude: 6.923, longitude: 79.846 },
  { name: "Kollupitiya", latitude: 6.905, longitude: 79.855 },
  { name: "Bambalapitiya", latitude: 6.89, longitude: 79.855 },
  { name: "Maradana", latitude: 6.934, longitude: 79.86 },
  { name: "University of Colombo", latitude: 6.9012, longitude: 79.861 },
  { name: "Liberty Plaza", latitude: 6.902, longitude: 79.859 },
  { name: "World Trade Center", latitude: 6.9344, longitude: 79.8428 },
  { name: "Nugegoda", latitude: 6.868, longitude: 79.889 },
];

export const PARKING_LOCATIONS: ParkingLocation[] = [
  {
    id: "p1",
    name: "Fort City Parking",
    latitude: 6.9328,
    longitude: 79.844,
    address: "No. 12, Chatham Street, Colombo 01",
    area: "Colombo Fort",
    totalSpaces: 80,
    availableSpaces: 42,
    pricePerHour: 100,
    dailyMax: 800,
    securityLevel: "High",
    rating: 4.6,
    walkingDistance: 350,
    drivingDistanceKm: 1.2,
    drivingMinutes: 3,
    trafficLevel: "Low",
    openingTime: "06:00",
    closingTime: "23:00",
    evCharging: true,
    covered: true,
    accessibleParking: true,
    motorcycleParking: true,
    cctv: true,
    reservationAvailable: true,
    description:
      "Central multi-level car park in the heart of Colombo Fort with CCTV, EV charging and lifts to street level.",
  },
  {
    id: "p2",
    name: "City Centre Parking",
    latitude: 6.9025,
    longitude: 79.856,
    address: "No. 88, Galle Road, Kollupitiya",
    area: "Kollupitiya",
    totalSpaces: 120,
    availableSpaces: 12,
    pricePerHour: 150,
    dailyMax: 1200,
    securityLevel: "High",
    rating: 4.4,
    walkingDistance: 500,
    drivingDistanceKm: 2.1,
    drivingMinutes: 6,
    trafficLevel: "Moderate",
    openingTime: "08:00",
    closingTime: "22:00",
    evCharging: true,
    covered: true,
    accessibleParking: true,
    motorcycleParking: false,
    cctv: true,
    reservationAvailable: true,
    description:
      "Premium car park attached to a major shopping complex offering valet and EV charging.",
  },
  {
    id: "p3",
    name: "Station Parking Plaza",
    latitude: 6.933,
    longitude: 79.857,
    address: "Near Maradana Station, Colombo 10",
    area: "Maradana",
    totalSpaces: 100,
    availableSpaces: 65,
    pricePerHour: 80,
    dailyMax: 600,
    securityLevel: "Medium",
    rating: 4.1,
    walkingDistance: 700,
    drivingDistanceKm: 1.8,
    drivingMinutes: 5,
    trafficLevel: "Moderate",
    openingTime: "05:00",
    closingTime: "23:30",
    evCharging: false,
    covered: false,
    accessibleParking: true,
    motorcycleParking: true,
    cctv: true,
    reservationAvailable: true,
    description:
      "Affordable open-air car park next to Maradana railway station, ideal for commuters.",
  },
  {
    id: "p4",
    name: "Galle Face Terrace Parking",
    latitude: 6.9225,
    longitude: 79.845,
    address: "Galle Face Promenade, Colombo 03",
    area: "Galle Face",
    totalSpaces: 60,
    availableSpaces: 5,
    pricePerHour: 120,
    dailyMax: 900,
    securityLevel: "Medium",
    rating: 4.3,
    walkingDistance: 200,
    drivingDistanceKm: 1.0,
    drivingMinutes: 4,
    trafficLevel: "Heavy",
    openingTime: "07:00",
    closingTime: "22:00",
    evCharging: false,
    covered: false,
    accessibleParking: false,
    motorcycleParking: true,
    cctv: true,
    reservationAvailable: false,
    description:
      "Scenic open-air parking along Galle Face Green. Popular on weekends, fills quickly.",
  },
  {
    id: "p5",
    name: "Liberty Plaza Secure Park",
    latitude: 6.901,
    longitude: 79.859,
    address: "No. 250, R.A. De Mel Mawatha, Colombo 03",
    area: "Kollupitiya",
    totalSpaces: 90,
    availableSpaces: 38,
    pricePerHour: 110,
    dailyMax: 850,
    securityLevel: "High",
    rating: 4.5,
    walkingDistance: 150,
    drivingDistanceKm: 2.4,
    drivingMinutes: 8,
    trafficLevel: "Moderate",
    openingTime: "08:00",
    closingTime: "21:00",
    evCharging: false,
    covered: true,
    accessibleParking: true,
    motorcycleParking: true,
    cctv: true,
    reservationAvailable: true,
    description:
      "Secure, covered parking beside Liberty Plaza with 24/7 attendant supervision.",
  },
  {
    id: "p6",
    name: "Pettah Wholesale Park",
    latitude: 6.936,
    longitude: 79.851,
    address: "No. 45, Second Cross Street, Pettah",
    area: "Pettah",
    totalSpaces: 70,
    availableSpaces: 18,
    pricePerHour: 90,
    dailyMax: 700,
    securityLevel: "Medium",
    rating: 3.9,
    walkingDistance: 600,
    drivingDistanceKm: 2.0,
    drivingMinutes: 7,
    trafficLevel: "Heavy",
    openingTime: "06:00",
    closingTime: "20:00",
    evCharging: false,
    covered: false,
    accessibleParking: false,
    motorcycleParking: true,
    cctv: false,
    reservationAvailable: true,
    description:
      "Convenient parking for shoppers in the bustling Pettah market district.",
  },
  {
    id: "p7",
    name: "Bambalapitiya Promenade Park",
    latitude: 6.8915,
    longitude: 79.853,
    address: "No. 320, Galle Road, Bambalapitiya",
    area: "Bambalapitiya",
    totalSpaces: 55,
    availableSpaces: 28,
    pricePerHour: 100,
    dailyMax: 800,
    securityLevel: "High",
    rating: 4.2,
    walkingDistance: 400,
    drivingDistanceKm: 3.0,
    drivingMinutes: 10,
    trafficLevel: "Low",
    openingTime: "07:00",
    closingTime: "22:00",
    evCharging: true,
    covered: true,
    accessibleParking: true,
    motorcycleParking: false,
    cctv: true,
    reservationAvailable: true,
    description:
      "Modern covered car park near Majestic City with EV fast-charging bays.",
  },
  {
    id: "p8",
    name: "World Trade Centre Park",
    latitude: 6.9336,
    longitude: 79.843,
    address: "West Tower, WTC, Echelon Square, Colombo 01",
    area: "Colombo Fort",
    totalSpaces: 150,
    availableSpaces: 85,
    pricePerHour: 130,
    dailyMax: 1000,
    securityLevel: "High",
    rating: 4.7,
    walkingDistance: 250,
    drivingDistanceKm: 1.4,
    drivingMinutes: 4,
    trafficLevel: "Low",
    openingTime: "05:00",
    closingTime: "23:00",
    evCharging: true,
    covered: true,
    accessibleParking: true,
    motorcycleParking: true,
    cctv: true,
    reservationAvailable: true,
    description:
      "Large basement parking below the iconic World Trade Center twin towers.",
  },
  {
    id: "p9",
    name: "Nugegoda Town Hall Park",
    latitude: 6.869,
    longitude: 79.888,
    address: "No. 10, High Level Road, Nugegoda",
    area: "Nugegoda",
    totalSpaces: 75,
    availableSpaces: 3,
    pricePerHour: 85,
    dailyMax: 650,
    securityLevel: "Medium",
    rating: 4.0,
    walkingDistance: 800,
    drivingDistanceKm: 5.5,
    drivingMinutes: 18,
    trafficLevel: "Heavy",
    openingTime: "08:00",
    closingTime: "21:00",
    evCharging: false,
    covered: false,
    accessibleParking: true,
    motorcycleParking: true,
    cctv: true,
    reservationAvailable: true,
    description:
      "Busy car park serving the Nugegoda commercial area, near town hall.",
  },
  {
    id: "p10",
    name: "University Park & Ride",
    latitude: 6.9005,
    longitude: 79.862,
    address: "College House, University of Colombo",
    area: "University of Colombo",
    totalSpaces: 110,
    availableSpaces: 64,
    pricePerHour: 95,
    dailyMax: 750,
    securityLevel: "High",
    rating: 4.4,
    walkingDistance: 120,
    drivingDistanceKm: 2.6,
    drivingMinutes: 9,
    trafficLevel: "Moderate",
    openingTime: "06:30",
    closingTime: "20:30",
    evCharging: true,
    covered: true,
    accessibleParking: true,
    motorcycleParking: true,
    cctv: true,
    reservationAvailable: true,
    description:
      "Secure, covered parking near the University of Colombo with staff supervision.",
  },
];

export const PRIVATE_PARKINGS: PrivateParking[] = [
  {
    id: "pp1",
    name: "Residential Parking – Fort",
    latitude: 6.933,
    longitude: 79.842,
    distanceM: 500,
    pricePerHour: 80,
    available: true,
    availableFrom: "09:00",
    availableTo: "18:00",
    ownerName: "Mr. Fernando",
    verified: true,
  },
  {
    id: "pp2",
    name: "Office Parking Share – Kollupitiya",
    latitude: 6.904,
    longitude: 79.854,
    distanceM: 700,
    pricePerHour: 70,
    available: true,
    availableFrom: "07:00",
    availableTo: "20:00",
    ownerName: "Ceylon Business Centre",
    verified: true,
  },
  {
    id: "pp3",
    name: "Driveway Space – Bambalapitiya",
    latitude: 6.893,
    longitude: 79.856,
    distanceM: 450,
    pricePerHour: 60,
    available: false,
    availableFrom: "08:00",
    availableTo: "17:00",
    ownerName: "Mrs. Perera",
    verified: false,
  },
  {
    id: "pp4",
    name: "Apartment Parking – Maradana",
    latitude: 6.931,
    longitude: 79.858,
    distanceM: 850,
    pricePerHour: 90,
    available: true,
    availableFrom: "10:00",
    availableTo: "16:00",
    ownerName: "Skyline Residences",
    verified: true,
  },
];

function timeAgo(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 minute ago";
  return `${minutes} minutes ago`;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Reservation approaching",
    message: "Your reservation at Fort City Parking starts in 30 minutes.",
    time: timeAgo(4),
    type: "warning",
    read: false,
  },
  {
    id: "n2",
    title: "Availability update",
    message: "Fort City Parking now has 42 available spaces.",
    time: timeAgo(12),
    type: "info",
    read: false,
  },
  {
    id: "n3",
    title: "Low availability alert",
    message: "Parking availability near your destination is low — only 5 spaces remain at Nugegoda Town Hall Park.",
    time: timeAgo(35),
    type: "warning",
    read: true,
  },
  {
    id: "n4",
    title: "Payment received",
    message: "Your parking session at City Centre Parking was completed. Rs. 150 charged.",
    time: timeAgo(300),
    type: "success",
    read: true,
  },
];

export function generateSensorSpaces(total = 24): SensorSpace[] {
  return Array.from({ length: total }, (_, i) => {
    const id = `A${String(i + 1).padStart(2, "0")}`;
    return {
      id,
      status: i % 3 === 0 ? "occupied" : "available",
      updatedAt: timeAgo(Math.floor(Math.random() * 5) + 1),
    };
  });
}

export const VEHICLE_ENTRIES: VehicleEntry[] = [
  {
    plate: "WP CAB-1234",
    entryTime: "2:32 PM",
    parkingName: "Fort City Parking",
    space: "A-24",
    status: "parked",
  },
  {
    plate: "WP GBA-8842",
    entryTime: "12:05 PM",
    parkingName: "World Trade Centre Park",
    space: "B-07",
    status: "parked",
  },
  {
    plate: "WP ACH-9921",
    entryTime: "9:48 AM",
    parkingName: "Station Parking Plaza",
    space: "C-11",
    status: "exited",
    exitTime: "1:22 PM",
  },
  {
    plate: "WP CDF-5310",
    entryTime: "11:15 AM",
    parkingName: "Liberty Plaza Secure Park",
    space: "A-31",
    status: "parked",
  },
];

export const COLOMBO_CENTER = { lat: 6.906, lng: 79.855 };
