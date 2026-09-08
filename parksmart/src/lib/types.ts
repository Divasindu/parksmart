export type SecurityLevel = "High" | "Medium" | "Low";
export type TrafficLevel = "Low" | "Moderate" | "Heavy";
export type AvailabilityStatus = "available" | "limited" | "full";
export type SlotStatus = "available" | "occupied" | "reserved";

export interface ParkingSlot {
  id: string;
  number: string;
  row: string;
  status: SlotStatus;
  reservedFrom?: string;
  reservedTo?: string;
  updatedAt: string;
}

export interface ParkingLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  totalSpaces: number;
  availableSpaces: number;
  pricePerHour: number;
  dailyMax: number;
  securityLevel: SecurityLevel;
  rating: number;
  walkingDistance: number; // meters to destination
  drivingDistanceKm: number;
  drivingMinutes: number;
  trafficLevel: TrafficLevel;
  openingTime: string;
  closingTime: string;
  evCharging: boolean;
  covered: boolean;
  accessibleParking: boolean;
  motorcycleParking: boolean;
  cctv: boolean;
  reservationAvailable: boolean;
  description: string;
}

export interface Reservation {
  id: string;
  parkingId: string;
  parkingName: string;
  date: string;
  arrivalTime: string;
  durationHours: number;
  vehicleType: string;
  cost: number;
  space: string;
  slotId?: string;
  status: "active" | "upcoming" | "completed" | "cancelled";
  createdAt: string;
}

export interface PrivateParking {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distanceM: number;
  pricePerHour: number;
  available: boolean;
  availableFrom: string;
  availableTo: string;
  ownerName: string;
  verified: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success";
  read: boolean;
}

export interface UserPreferences {
  cheapest: boolean;
  closest: boolean;
  highestAvailability: boolean;
  highestSecurity: boolean;
  covered: boolean;
  evCharging: boolean;
  accessible: boolean;
}

export interface SensorSpace {
  id: string;
  status: "occupied" | "available";
  updatedAt: string;
}

export interface VehicleEntry {
  plate: string;
  entryTime: string;
  parkingName: string;
  space: string;
  status: "parked" | "exited";
  exitTime?: string;
}

export interface SmartScore {
  total: number;
  availability: number;
  distance: number;
  price: number;
  security: number;
  traffic: number;
  reasons: string[];
}

export interface DestinationOption {
  name: string;
  latitude: number;
  longitude: number;
}
