import {
  ParkingLocation,
  SmartScore,
  UserPreferences,
  DestinationOption,
} from "./types";

export function formatLKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-US")}`;
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export function getAvailabilityStatus(
  available: number,
  total: number
): "available" | "limited" | "full" {
  const ratio = available / total;
  if (available === 0) return "full";
  if (ratio < 0.25) return "limited";
  return "available";
}

export function availabilityColor(status: string): string {
  switch (status) {
    case "available":
      return "text-emerald-600";
    case "limited":
      return "text-orange-500";
    case "full":
      return "text-red-500";
    default:
      return "text-zinc-500";
  }
}

export function trafficColor(level: string): string {
  switch (level) {
    case "Low":
      return "text-emerald-600";
    case "Moderate":
      return "text-amber-600";
    case "Heavy":
      return "text-red-500";
    default:
      return "text-zinc-500";
  }
}

export function getRecommendations(
  parkings: ParkingLocation[],
  destination: DestinationOption | null
): ParkingLocation[] {
  if (!destination) return parkings;
  return [...parkings].sort((a, b) => {
    const scoreA = calculateScore(a, destination).total;
    const scoreB = calculateScore(b, destination).total;
    return scoreB - scoreA;
  });
}

export function calculateScore(
  parking: ParkingLocation,
  destination: DestinationOption | null,
  preferences?: UserPreferences
): SmartScore {
  // Availability (0-25)
  const availabilityRatio = parking.availableSpaces / parking.totalSpaces;
  const availability =
    Math.min(availabilityRatio, 1) * 25 +
    (parking.availableSpaces > 0 ? 5 : 0);

  // Distance (0-20) - based on walking distance to destination and drive time
  let distance = 0;
  if (destination) {
    const walkPenalty = Math.max(0, 1 - parking.walkingDistance / 3000);
    const drivePenalty = Math.max(0, 1 - parking.drivingMinutes / 30);
    distance = (walkPenalty * 0.6 + drivePenalty * 0.4) * 20;
  } else {
    distance = 10;
  }

  // Price (0-15)
  const priceScore = Math.max(0, 1 - parking.pricePerHour / 300) * 15;

  // Security (0-10)
  const securityRank =
    parking.securityLevel === "High" ? 10 : parking.securityLevel === "Medium" ? 6 : 3;

  // Traffic (0-10)
  const trafficRank =
    parking.trafficLevel === "Low" ? 10 : parking.trafficLevel === "Moderate" ? 6 : 2;

  // Rating (0-10)
  const rating = (parking.rating / 5) * 10;

  // Preference bonus
  let preferenceBonus = 0;
  if (preferences) {
    if (preferences.cheapest && parking.pricePerHour <= 90) preferenceBonus += 5;
    if (preferences.closest && parking.walkingDistance <= 300) preferenceBonus += 5;
    if (preferences.highestAvailability && availabilityRatio >= 0.5) preferenceBonus += 5;
    if (preferences.highestSecurity && parking.securityLevel === "High") preferenceBonus += 5;
    if (preferences.covered && parking.covered) preferenceBonus += 3;
    if (preferences.evCharging && parking.evCharging) preferenceBonus += 3;
    if (preferences.accessible && parking.accessibleParking) preferenceBonus += 2;
  }

  const total = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        availability +
          distance +
          priceScore +
          securityRank +
          trafficRank +
          rating +
          preferenceBonus
      )
    )
  );

  const reasons: string[] = [];
  if (availabilityRatio >= 0.5 && parking.availableSpaces > 20)
    reasons.push(`high availability (${parking.availableSpaces} spaces)`);
  if (parking.trafficLevel === "Low")
    reasons.push("low traffic on the way");
  if (parking.walkingDistance <= 300 && destination)
    reasons.push("close to your destination");
  if (parking.pricePerHour <= 100)
    reasons.push(`affordable at ${parking.pricePerHour}/hr`);
  if (parking.securityLevel === "High") reasons.push("high security");
  if (parking.evCharging) reasons.push("EV charging available");

  if (reasons.length === 0) reasons.push("good overall match");

  return {
    total,
    availability: Math.round(availability),
    distance: Math.round(distance),
    price: Math.round(priceScore),
    security: securityRank,
    traffic: trafficRank,
    reasons,
  };
}

let searchCounter = 0;

export function generateSearchId(prefix = "PS"): string {
  searchCounter += 1;
  const num = Math.floor(18000 + Math.random() * 1000) + searchCounter;
  return `${prefix}-${num}`;
}

export function generateReservationTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ratingStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let stars = "★".repeat(full);
  if (half) stars += "½";
  return stars;
}

export function timeToMinutes(time12: string): number {
  const m = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const pm = m[3].toUpperCase() === "PM";
  if (pm && h !== 12) h += 12;
  if (!pm && h === 12) h = 0;
  return h * 60 + min;
}

export function minutesToTime12(minutes: number): string {
  const totalMin = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const hh = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  const period = hh >= 12 ? "PM" : "AM";
  let hr = hh % 12;
  if (hr === 0) hr = 12;
  return `${hr}:${String(mm).padStart(2, "0")} ${period}`;
}

export function addHours(time12: string, hours: number): string {
  return minutesToTime12(timeToMinutes(time12) + hours * 60);
}

export function windowsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && bStart < aEnd;
}
