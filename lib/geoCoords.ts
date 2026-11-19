// Dynamic Geocoding Service (100% Free, NO API KEY, NO HARDCODED COORDS, NO LOCALSTORAGE CACHE)

export interface GeoLocation {
  lat: number;
  lng: number;
}

/**
 * Parse coordinates directly if available in the spreadsheet (e.g., "10.7598, 106.6823")
 */
export function parseExplicitCoords(
  coordinates?: string
): [number, number] | null {
  if (!coordinates || typeof coordinates !== "string") return null;
  const parts = coordinates.split(/[,;\s]+/).map((v) => parseFloat(v));
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return null;
}

/**
 * Dynamically geocode artifact location by querying OpenStreetMap Photon / Nominatim API
 * No hardcoded coordinates, no localStorage cache.
 */
export async function geocodeArtifactDynamic(
  name: string,
  location?: string
): Promise<[number, number] | null> {
  const cleanName = (name || "").trim();
  const cleanLoc = (location || "").trim();

  if (!cleanName && !cleanLoc) return null;

  // Build search candidate queries
  const queries: string[] = [];
  if (cleanName && cleanLoc) {
    queries.push(`${cleanName}, ${cleanLoc}`);
    queries.push(`${cleanName} ${cleanLoc}`);
  }
  if (cleanName) queries.push(cleanName);
  if (cleanLoc) queries.push(cleanLoc);

  for (const q of queries) {
    // 1. Try Photon API (Fast, Free, OpenStreetMap powered, no API key required)
    try {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        q + " Việt Nam"
      )}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.features?.length > 0) {
          const [lon, lat] = data.features[0].geometry.coordinates;
          // Verify bounding box inside Vietnam: lat [8, 24], lon [102, 110]
          if (lat >= 8 && lat <= 24 && lon >= 102 && lon <= 110) {
            return [lat, lon];
          }
        }
      }
    } catch {
      // Ignore network errors and continue
    }

    // 2. Fallback to OpenStreetMap Nominatim
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        q
      )}&countrycodes=vn&format=json&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (
            !isNaN(lat) &&
            !isNaN(lon) &&
            lat >= 8 &&
            lat <= 24 &&
            lon >= 102 &&
            lon <= 110
          ) {
            return [lat, lon];
          }
        }
      }
    } catch {
      // Ignore network errors
    }
  }

  return null;
}
