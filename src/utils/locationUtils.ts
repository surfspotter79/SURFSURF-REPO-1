// Location utilities for mapping user locations to coordinates and nearby surf spots

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface SurfSpotDistance {
  name: string;
  distance: number;
  coordinates: LocationCoordinates;
}

// Major cities and regions with coordinates
export const locationCoordinates: Record<string, LocationCoordinates> = {
  // North America
  'California': { lat: 36.7783, lng: -119.4179 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  'Hawaii': { lat: 21.3099, lng: -157.8581 },
  'Florida': { lat: 27.7663, lng: -82.6404 },
  'New York': { lat: 40.7128, lng: -74.0060 },
  
  // Europe
  'Portugal': { lat: 39.3999, lng: -8.2245 },
  'Lisbon': { lat: 38.7223, lng: -9.1393 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Madrid': { lat: 40.4168, lng: -3.7038 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Bordeaux': { lat: 44.8378, lng: -0.5792 },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Cornwall': { lat: 50.2660, lng: -5.0527 },
  
  // Australia & Oceania
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'Melbourne': { lat: -37.8136, lng: 144.9631 },
  'Gold Coast': { lat: -28.0167, lng: 153.4000 },
  'Byron Bay': { lat: -28.6474, lng: 153.6020 },
  'New Zealand': { lat: -40.9006, lng: 174.8860 },
  'Auckland': { lat: -36.8485, lng: 174.7633 },
  
  // Asia
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'Bali': { lat: -8.3405, lng: 115.0920 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Philippines': { lat: 12.8797, lng: 121.7740 },
  'Thailand': { lat: 15.8700, lng: 100.9925 },
  
  // South America
  'Brazil': { lat: -14.2350, lng: -51.9253 },
  'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
  'Peru': { lat: -9.1900, lng: -75.0152 },
  'Chile': { lat: -35.6751, lng: -71.5430 },
  
  // Africa
  'South Africa': { lat: -30.5595, lng: 22.9375 },
  'Cape Town': { lat: -33.9249, lng: 18.4241 },
  'Morocco': { lat: 31.7917, lng: -7.0926 }
};

// Surf spots with their coordinates
export const surfSpots = [
  { name: 'Pipeline, Hawaii', coordinates: { lat: 21.6619, lng: -158.0500 } },
  { name: 'Mavericks, California', coordinates: { lat: 37.4919, lng: -122.5019 } },
  { name: 'Ericeira, Portugal', coordinates: { lat: 38.9638, lng: -9.4158 } },
  { name: 'Uluwatu, Bali', coordinates: { lat: -8.8290, lng: 115.0840 } },
  { name: 'Gold Coast, Australia', coordinates: { lat: -28.0167, lng: 153.4000 } },
  { name: 'Jeffreys Bay, South Africa', coordinates: { lat: -34.0481, lng: 24.9090 } },
  { name: 'Tavarua, Fiji', coordinates: { lat: -17.8219, lng: 177.1219 } }
];

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get user coordinates from location string
export function getUserCoordinates(location: string): LocationCoordinates | null {
  if (!location) return null;
  
  // Try exact match first
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }
  
  // Try partial matches
  const locationLower = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (key.toLowerCase().includes(locationLower) || locationLower.includes(key.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
}

// Find nearest surf spots to user location
export function getNearestSurfSpots(userCoords: LocationCoordinates, limit: number = 3): SurfSpotDistance[] {
  return surfSpots
    .map(spot => ({
      name: spot.name,
      distance: calculateDistance(userCoords, spot.coordinates),
      coordinates: spot.coordinates
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

// Get recommended map center and zoom based on user location
export function getMapViewForLocation(location: string): { center: LocationCoordinates; zoom: number } {
  const userCoords = getUserCoordinates(location);
  
  if (!userCoords) {
    // Default world view
    return { center: { lat: 20, lng: 0 }, zoom: 2 };
  }
  
  // Regional zoom levels based on location specificity
  const locationLower = location.toLowerCase();
  let zoom = 6; // Default regional zoom
  
  if (locationLower.includes('city') || locationLower.includes('beach') || locationLower.includes('bay')) {
    zoom = 8; // City level
  } else if (locationLower.includes('state') || locationLower.includes('province')) {
    zoom = 5; // State/province level
  } else if (locationLower.includes('country')) {
    zoom = 4; // Country level
  }
  
  return { center: userCoords, zoom };
}