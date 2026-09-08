/**
 * Geolocation & Distance Calculation Utilities
 */

export interface UserCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
}

/**
 * Calculates the great-circle distance between two points using the Haversine formula (in kilometers).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Rounded to 1 decimal place
}

/**
 * Format distance in a human-friendly string (meters if < 1km, otherwise km)
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Get friendly text for proximity to Benin cultural sites
 */
export function getProximityBadge(distanceKm: number): { label: string; color: string } {
  if (distanceKm <= 5) {
    return { label: 'À deux pas', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  } else if (distanceKm <= 25) {
    return { label: 'Très proche', color: 'bg-teal-50 text-teal-700 border-teal-200' };
  } else if (distanceKm <= 60) {
    return { label: 'Dans la région', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  } else {
    return { label: 'Excursion', color: 'bg-stone-50 text-stone-700 border-stone-200' };
  }
}
