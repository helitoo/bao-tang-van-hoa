import type { Artifact } from "@/contexts/artifact";

const SPREADSHEET_ID =
  process.env.NEXT_PUBLIC_SPREADSHEET_ID ||
  "1Rp7NRTGNRG69WDXLonCEiAEppqJcHg3WkmE2xd3nFVQ";
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME || "storage";
const rawRange = process.env.NEXT_PUBLIC_SHEET_RANGE || "A1:Z";
const SHEET_RANGE = rawRange.endsWith(":M")
  ? rawRange.replace(/:M$/i, ":Z")
  : rawRange;

export function parseCSV(text: string): Artifact[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  const cleanText = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentField);
      if (currentRow.length > 0) rows.push(currentRow);
      currentRow = [];
      currentField = "";
    } else currentField += char;
  }
  if (currentField !== "" || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const rawHeaders = rows[0].map((h) => h.trim());
  const isMerged = rawHeaders.length > 0 && rawHeaders[0].startsWith("id ");
  let headers: string[];
  let dataRows: string[][];

  if (isMerged) {
    headers = rawHeaders.map((h) => h.split(/\s+/)[0]);
    const extractedRow = rawHeaders.map((h) => {
      const spaceIdx = h.indexOf(" ");
      return spaceIdx !== -1 ? h.slice(spaceIdx + 1).trim() : "";
    });
    dataRows = [extractedRow, ...rows.slice(1)];
  } else {
    headers = rawHeaders;
    dataRows = rows.slice(1);
  }

  const results: Artifact[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const data = dataRows[i];
    if (data.length < headers.length) continue;
    const artifact: any = {};
    headers.forEach((header, index) => {
      const value = (data[index] || "").trim();
      if (header === "categories") {
        artifact[header] = value
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((v) => v.trim());
      } else if (header === "supporting_images" || header === "sources") {
        if (value.includes("<iframe")) artifact[header] = [value];
        else
          artifact[header] = value
            .split(/[ \n;,]+/)
            .map((v) => v.trim())
            .filter(Boolean);
      } else artifact[header] = value;
    });

    if (!artifact.id || !artifact.main_image || !artifact.categories?.length)
      continue;
    results.push(artifact as Artifact);
  }
  return results;
}

let memoryCache: {
  artifacts: Artifact[];
  map: Map<string, Artifact>;
  timestamp: number;
} | null = null;

let pendingPromise: Promise<Artifact[]> | null = null;
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function fetchArtifactsServer(): Promise<Artifact[]> {
  const now = Date.now();
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL) {
    return memoryCache.artifacts;
  }

  if (pendingPromise) {
    return pendingPromise;
  }

  pendingPromise = (async () => {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}&range=${SHEET_RANGE}&headers=1`;
      const response = await fetch(url, {
        next: { revalidate: 3600 },
      });
      if (!response.ok) return memoryCache?.artifacts || [];
      const text = await response.text();
      if (text.includes("<!DOCTYPE html>")) return memoryCache?.artifacts || [];
      const artifacts = parseCSV(text);

      const map = new Map<string, Artifact>();
      for (const a of artifacts) {
        if (a.id) {
          map.set(String(a.id).trim(), a);
        }
      }

      memoryCache = {
        artifacts,
        map,
        timestamp: Date.now(),
      };

      return artifacts;
    } catch (err) {
      console.error("Error fetching artifacts on server:", err);
      return memoryCache?.artifacts || [];
    } finally {
      pendingPromise = null;
    }
  })();

  return pendingPromise;
}

export async function getArtifactByIdServer(
  id: string,
): Promise<Artifact | undefined> {
  const cleanId = String(id).trim();
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL) {
    return memoryCache.map.get(cleanId);
  }
  await fetchArtifactsServer();
  return memoryCache?.map.get(cleanId);
}
