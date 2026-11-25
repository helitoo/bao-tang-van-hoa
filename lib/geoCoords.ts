// Coordinate helpers: coordinates come only from the spreadsheet's `coordinates` column

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
