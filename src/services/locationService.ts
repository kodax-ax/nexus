import { NEXUS_HUBS, DEFAULT_HUB } from '../constants';

export interface UserLocation {
  lat: number;
  lng: number;
  nearestHub: typeof NEXUS_HUBS[0];
  isManual: boolean;
  status: 'requesting' | 'allowed' | 'denied' | 'error';
}

/**
 * Calculates the Haversine distance between two points in KM.
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the closest Nexus Hub based on user coordinates.
 */
export function findNearestHub(lat: number, lng: number) {
  let nearest = NEXUS_HUBS[0];
  let minDistance = Infinity;

  for (const hub of NEXUS_HUBS) {
    const dist = getDistance(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = hub;
    }
  }

  return nearest;
}

/**
 * Triggers the browser's geolocation popup with graceful degradation.
 */
export function initializeUserLocation(
  onUpdate: (location: UserLocation) => void,
  onMessage: (msg: string) => void
) {
  // Purpose: We request location to automatically connect users to the 
  // nearest physical logistics hub for accurate distance/rate calculations.
  
  if (!navigator.geolocation) {
    onMessage('Geolocation is not supported by your browser.');
    onUpdate({ ...DEFAULT_HUB, nearestHub: DEFAULT_HUB, isManual: true, status: 'error' });
    return;
  }

  onUpdate({ ...DEFAULT_HUB, nearestHub: DEFAULT_HUB, isManual: true, status: 'requesting' });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const nearestHub = findNearestHub(latitude, longitude);
      
      onUpdate({
        lat: latitude,
        lng: longitude,
        nearestHub: nearestHub,
        isManual: false,
        status: 'allowed'
      });
      onMessage(`Successfully synchronized with ${nearestHub.name}`);
    },
    (error) => {
      // Graceful Degradation: If user disallows or times out, 
      // we default to a major international shipping hub (Lagos).
      console.warn('Geolocation failed:', error.message);
      
      onUpdate({
        ...DEFAULT_HUB,
        nearestHub: DEFAULT_HUB,
        isManual: true,
        status: 'denied'
      });
      onMessage('Using default shipping hub. Enter your city manually for precise local rates.');
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}
