import type { Artifact, Collection, CollectionWithArtifacts } from "@/contexts/artifact";

const SPREADSHEET_ID =
  process.env.NEXT_PUBLIC_SPREADSHEET_ID ||
  "1Rp7NRTGNRG69WDXLonCEiAEppqJcHg3WkmE2xd3nFVQ";
const SHEET_NAME = process.env.NEXT_PUBLIC_SHEET_NAME || "storage";
const rawRange = process.env.NEXT_PUBLIC_SHEET_RANGE || "A1:Z";
const SHEET_RANGE = rawRange.endsWith(":M")
  ? rawRange.replace(/:M$/i, ":Z")
  : rawRange;

function parseRawCSVRows(text: string): string[][] {
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
  return rows;
}

export function parseCSV(text: string): Artifact[] {
  const rows = parseRawCSVRows(text);
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
      } else if (header === "collections") {
        artifact[header] = value
          .split(/\s+/)
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

    const id = (artifact.id || "").toString().trim();
    const name = (artifact.name || "").toString().trim();
    const mainImage = (
      artifact.main_image ||
      artifact["main image"] ||
      ""
    )
      .toString()
      .trim();

    if (!id || !name || !mainImage || !artifact.categories?.length)
      continue;

    artifact.id = id;
    artifact.name = name;
    artifact.main_image = mainImage;

    const sourcesList = [
      ...(artifact.sources || []),
      ...(artifact.supporting_images || []),
    ].filter((s) => s.startsWith("http://") || s.startsWith("https://"));
    if (sourcesList.length > 0) {
      artifact.sources = Array.from(new Set(sourcesList));
      artifact.source_url = artifact.sources[0];
    }

    results.push(artifact as Artifact);
  }
  return results;
}

export function parseCollectionsCSV(text: string): Collection[] {
  const rows = parseRawCSVRows(text);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const idIdx = headers.indexOf("id") !== -1 ? headers.indexOf("id") : 0;
  const nameIdx = headers.indexOf("name") !== -1 ? headers.indexOf("name") : 1;
  const descIdx = headers.indexOf("description") !== -1 ? headers.indexOf("description") : 2;

  const results: Collection[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const id = (row[idIdx] || "").trim();
    const name = (row[nameIdx] || "").trim();
    const description = (row[descIdx] || "").trim();
    if (!id || !name) continue;

    results.push({
      id,
      name,
      description,
    });
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

let collectionsCache: {
  collections: Collection[];
  timestamp: number;
} | null = null;
let pendingCollectionsPromise: Promise<Collection[]> | null = null;

export async function fetchCollectionsServer(): Promise<Collection[]> {
  const now = Date.now();
  if (collectionsCache && now - collectionsCache.timestamp < CACHE_TTL) {
    return collectionsCache.collections;
  }

  if (pendingCollectionsPromise) {
    return pendingCollectionsPromise;
  }

  pendingCollectionsPromise = (async () => {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=collections&range=A1:C&headers=1`;
      const response = await fetch(url, {
        next: { revalidate: 3600 },
      });
      if (!response.ok) return collectionsCache?.collections || [];
      const text = await response.text();
      if (text.includes("<!DOCTYPE html>")) return collectionsCache?.collections || [];
      const collections = parseCollectionsCSV(text);

      collectionsCache = {
        collections,
        timestamp: Date.now(),
      };

      return collections;
    } catch (err) {
      console.error("Error fetching collections on server:", err);
      return collectionsCache?.collections || [];
    } finally {
      pendingCollectionsPromise = null;
    }
  })();

  return pendingCollectionsPromise;
}

export async function getCollectionsWithArtifactsServer(): Promise<CollectionWithArtifacts[]> {
  const [rawCollections, artifacts] = await Promise.all([
    fetchCollectionsServer(),
    fetchArtifactsServer(),
  ]);

  // Group artifacts by collection id
  const artifactsByColId = new Map<string, Artifact[]>();
  for (const a of artifacts) {
    if (a.collections && Array.isArray(a.collections)) {
      for (const colId of a.collections) {
        const cleanColId = String(colId).trim();
        if (!cleanColId) continue;
        const list = artifactsByColId.get(cleanColId) || [];
        list.push(a);
        artifactsByColId.set(cleanColId, list);
      }
    }
  }

  const result: CollectionWithArtifacts[] = [];
  for (const col of rawCollections) {
    const colArtifacts = artifactsByColId.get(col.id) || [];
    // Rule: Do not display collections without artifacts
    if (colArtifacts.length === 0) continue;

    // Rule: Sort artifacts in collection alphabetically
    const sortedArtifacts = [...colArtifacts].sort((a, b) =>
      a.name.localeCompare(b.name, "vi"),
    );

    result.push({
      ...col,
      artifacts: sortedArtifacts,
      coverImage: sortedArtifacts[0]?.main_image,
    });
  }

  // Rule: Sort collections alphabetically
  result.sort((a, b) => a.name.localeCompare(b.name, "vi"));

  return result;
}

export async function getCollectionByIdServer(
  id: string,
): Promise<CollectionWithArtifacts | undefined> {
  const collections = await getCollectionsWithArtifactsServer();
  const cleanId = String(id).trim();
  return collections.find((c) => c.id === cleanId);
}
