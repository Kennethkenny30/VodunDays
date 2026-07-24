// Logique de routage et de calcul de temps de trajet, partagée entre la carte et la fiche.
//
// Contrainte : le serveur de démo `router.project-osrm.org` ne route qu'en voiture.
// On récupère donc une seule route voiture (distance + durée réelles) et on dérive
// les temps des autres modes depuis la distance, avec des vitesses fixes.

export type TravelMode = "car" | "foot" | "bike";

export interface ModeMetric {
  duration: number; // secondes
  distance: number; // mètres
}

export type ModeMetrics = Record<TravelMode, ModeMetric>;

export interface RoutePreview {
  loading: boolean;
  metrics: ModeMetrics | null;
  // true si les métriques viennent d'une estimation à vol d'oiseau (échec OSRM)
  estimated: boolean;
}

// Vitesses (m/s) pour estimer marche et vélo depuis la distance de route.
export const FOOT_MS = 1.389; // ~5 km/h
export const BIKE_MS = 4.167; // ~15 km/h
export const CAR_MS  = 8.333; // ~30 km/h - uniquement pour le repli hors ligne

interface LatLng {
  longitude: number;
  latitude: number;
}

// Distance haversine en mètres entre deux points
export function haversineMeters(from: LatLng, to: LatLng): number {
  const R  = 6_371_000;
  const φ1 = (from.latitude * Math.PI) / 180;
  const φ2 = (to.latitude   * Math.PI) / 180;
  const Δφ = ((to.latitude  - from.latitude)  * Math.PI) / 180;
  const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;
  const a  =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Dérive les métriques par mode depuis une distance de route (m) et la durée voiture réelle (s).
export function deriveModeMetrics(distanceMeters: number, carDurationSec: number): ModeMetrics {
  return {
    car:  { duration: carDurationSec,           distance: distanceMeters },
    foot: { duration: distanceMeters / FOOT_MS, distance: distanceMeters },
    bike: { duration: distanceMeters / BIKE_MS, distance: distanceMeters },
  };
}

// Repli à vol d'oiseau quand OSRM est indisponible : on estime aussi la voiture depuis la distance.
export function estimateModeMetrics(distanceMeters: number): ModeMetrics {
  return deriveModeMetrics(distanceMeters, distanceMeters / CAR_MS);
}

export function formatDuration(seconds: number): string {
  const m = Math.max(1, Math.round(seconds / 60));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r === 0 ? `${h} h` : `${h} h ${r} min`;
}

export function formatDistanceMeters(m: number): string {
  return m < 1_000 ? `${Math.round(m)} m` : `${(m / 1_000).toFixed(1)} km`;
}

export interface OsrmRoute {
  coordinates: [number, number][];
  distance:    number; // mètres
  carDuration: number; // secondes (durée voiture réelle OSRM)
}

// Récupère la/les route(s) OSRM voiture entre deux points [lng, lat].
// Lève une erreur si la requête échoue ou ne renvoie aucune route.
export async function fetchOsrmRoute(
  fromCoords: [number, number],
  toCoords: [number, number],
  signal?: AbortSignal,
): Promise<OsrmRoute[]> {
  const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?overview=full&geometries=geojson&alternatives=true`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`OSRM HTTP ${res.status}`);
  const data = await res.json();
  if (!data.routes?.length) throw new Error("OSRM: aucune route");
  return (data.routes as { geometry: { coordinates: [number, number][] }; duration: number; distance: number }[]).map(r => ({
    coordinates: r.geometry.coordinates,
    distance:    r.distance,
    carDuration: r.duration,
  }));
}
