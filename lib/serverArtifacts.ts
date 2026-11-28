import { cache } from "react";
import { unstable_cache } from "next/cache";

import type {
  Artifact,
  ArtifactSummary,
  Collection,
  CollectionSummary,
  CollectionWithArtifacts,
  HomeStats,
  MapArtifact,
  RelatedArtifacts,
  SearchPage,
} from "@/contexts/artifact";
import { getSupabase } from "@/lib/supabase";
import type { Locale } from "@/lib/lang";
import { CATEGORY_ID } from "@/lib/consts/categories";
import { parseExplicitCoords } from "@/lib/geoCoords";
import similarityScore from "@/lib/fuzzySearching";
import { getFilteredArtifacts } from "@/app/[locale]/search/getFilteredArtifacts";

/**
 * Data access for artifacts & collections (Supabase).
 *
 * Caching layers:
 * 1. Next.js Data Cache (`unstable_cache`), shared by every request and every
 *    server instance, revalidated every hour or on demand through
 *    `POST /api/revalidate` (tags "artifacts" / "collections").
 *    Artifacts are cached in pages of ARTIFACT_PAGE_SIZE rows because a single
 *    Data Cache entry is limited to 2MB.
 * 2. React `cache()`, which dedupes calls within one render (layout + page +
 *    generateMetadata all ask for the same data).
 * 3. A last-known-good copy in memory, served if Supabase is unreachable.
 *
 * The full list stays on the server. Pages receive only what they render:
 * one search page, aggregated home stats, card summaries, map markers...
 */

export const DATA_REVALIDATE_SECONDS = 3600;
export const ARTIFACTS_TAG = "artifacts";
export const COLLECTIONS_TAG = "collections";

// Below PostgREST's default max-rows (1000) and well under the 2MB cache limit
const ARTIFACT_PAGE_SIZE = 400;
// Safety net against an endless loop if something goes wrong with paging
const MAX_ARTIFACT_PAGES = 100;

const ARTIFACT_SELECT = `
  id,
  created_at,
  main_image_url,
  name,
  short_description,
  description,
  supporting_image_urls,
  author,
  contributor,
  artifact_date,
  location,
  coordinates,
  colors,
  artifact_category!inner ( category_id ),
  artifact_collection ( collection_id )
`;

type ArtifactRow = {
  id: number;
  created_at: string;
  main_image_url: string | null;
  name: string | null;
  short_description: string | null;
  description: string | null;
  supporting_image_urls: string[] | null;
  author: string | null;
  contributor: string | null;
  artifact_date: string | null;
  location: string | null;
  coordinates: (number | string)[] | null;
  colors: string[] | null;
  artifact_category: { category_id: number }[] | null;
  artifact_collection: { collection_id: number }[] | null;
};

type CollectionRow = {
  id: number;
  name: string | null;
  description: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** created_at -> "dd/mm/yyyy" (Vietnam time), the format the UI always used. */
function toPublicDate(createdAt: string): string {
  const d = new Date(createdAt);
  return isNaN(d.getTime()) ? "" : dateFormatter.format(d);
}

function isHttpUrl(s: string) {
  return s.startsWith("http://") || s.startsWith("https://");
}

function mapArtifact(row: ArtifactRow): Artifact {
  const supportingImages = (row.supporting_image_urls || [])
    .map((s) => s.trim())
    .filter(Boolean);
  const sources = Array.from(new Set(supportingImages.filter(isHttpUrl)));

  return {
    id: String(row.id),
    name: (row.name || "").trim(),
    short_description: row.short_description || "",
    description: row.description || "",
    categories: (row.artifact_category || []).map((c) => c.category_id),
    main_image: (row.main_image_url || "").trim(),
    supporting_images: supportingImages,
    sources: sources.length > 0 ? sources : undefined,
    source_url: sources[0],
    author: row.author || "",
    contributor: row.contributor || "",
    artifact_date: row.artifact_date || "",
    created_at: row.created_at,
    public_date: toPublicDate(row.created_at),
    location: row.location || "",
    coordinates:
      row.coordinates && row.coordinates.length === 2
        ? row.coordinates.join(", ")
        : undefined,
    colors: row.colors && row.colors.length > 0 ? row.colors.join(" ") : undefined,
    collections: (row.artifact_collection || []).map((c) =>
      String(c.collection_id),
    ),
  };
}

// --------------------------------------------------------------- artifacts
const fetchArtifactPage = unstable_cache(
  async (page: number): Promise<{ items: Artifact[]; rawCount: number }> => {
    const from = page * ARTIFACT_PAGE_SIZE;
    const { data, error } = await getSupabase()
      .from("artifacts")
      .select(ARTIFACT_SELECT)
      // Same predicate as the partial index artifacts_public_id_desc_idx
      .eq("status", "ACTIVE")
      .not("name", "is", null)
      .not("main_image_url", "is", null)
      .order("id", { ascending: false })
      .range(from, from + ARTIFACT_PAGE_SIZE - 1)
      .returns<ArtifactRow[]>();

    if (error) throw new Error(`Supabase artifacts page ${page}: ${error.message}`);
    const rows = data || [];
    return {
      items: rows
        .map(mapArtifact)
        .filter((a) => a.name && a.main_image && a.categories.length > 0),
      rawCount: rows.length,
    };
  },
  ["supabase-artifacts-page-v1"],
  { revalidate: DATA_REVALIDATE_SECONDS, tags: [ARTIFACTS_TAG] },
);

let lastGoodArtifacts: Artifact[] | null = null;
let lastGoodSignature = "";

/** Cheap content fingerprint (FNV-1a over the serialized list). */
function signatureOf(artifacts: Artifact[]): string {
  const text = JSON.stringify(artifacts);
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${text.length}:${(h >>> 0).toString(36)}`;
}

/** All public artifacts, newest (highest id) first. */
export const fetchArtifactsServer = cache(async (): Promise<Artifact[]> => {
  try {
    const all: Artifact[] = [];
    for (let page = 0; page < MAX_ARTIFACT_PAGES; page++) {
      const { items, rawCount } = await fetchArtifactPage(page);
      all.push(...items);
      if (rawCount < ARTIFACT_PAGE_SIZE) break;
    }
    // The Data Cache hands back fresh copies on every request. Returning the
    // previous array when nothing changed keeps derived structures keyed by
    // it (the search index in lib/search.ts) warm across requests.
    const signature = signatureOf(all);
    if (lastGoodArtifacts && signature === lastGoodSignature) return lastGoodArtifacts;
    lastGoodArtifacts = all;
    lastGoodSignature = signature;
    return all;
  } catch (err) {
    console.error("Error fetching artifacts from Supabase:", err);
    return lastGoodArtifacts || [];
  }
});

export async function getArtifactByIdServer(
  id: string,
): Promise<Artifact | undefined> {
  const cleanId = String(id).trim();
  const artifacts = await fetchArtifactsServer();
  return artifacts.find((a) => a.id === cleanId);
}

/** Latest public date, used e.g. for the /download file names. */
export async function getLatestPublicDateServer(): Promise<string | undefined> {
  const artifacts = await fetchArtifactsServer();
  let latest: Artifact | undefined;
  for (const a of artifacts) {
    if (!latest || (a.created_at || "") > (latest.created_at || "")) latest = a;
  }
  return latest?.public_date || undefined;
}

// ------------------------------------------------------------- collections
const fetchCollectionsCached = unstable_cache(
  async (): Promise<Collection[]> => {
    const { data, error } = await getSupabase()
      .from("collections")
      .select("id, name, description")
      .order("id", { ascending: true })
      .returns<CollectionRow[]>();

    if (error) throw new Error(`Supabase collections: ${error.message}`);
    return (data || [])
      .filter((c) => c.name && c.name.trim())
      .map((c) => ({
        id: String(c.id),
        name: (c.name || "").trim(),
        description: c.description || "",
      }));
  },
  ["supabase-collections-v1"],
  { revalidate: DATA_REVALIDATE_SECONDS, tags: [COLLECTIONS_TAG] },
);

let lastGoodCollections: Collection[] | null = null;

export const fetchCollectionsServer = cache(async (): Promise<Collection[]> => {
  try {
    const collections = await fetchCollectionsCached();
    lastGoodCollections = collections;
    return collections;
  } catch (err) {
    console.error("Error fetching collections from Supabase:", err);
    return lastGoodCollections || [];
  }
});

/** Full collections (with full artifacts), sorted A-Z. Server-only use. */
type FullCollection = Collection & { artifacts: Artifact[]; coverImage?: string };

function buildCollectionsWithArtifacts(
  rawCollections: Collection[],
  artifacts: Artifact[],
): FullCollection[] {
  const artifactsByColId = new Map<string, Artifact[]>();
  for (const a of artifacts) {
    for (const colId of a.collections || []) {
      const list = artifactsByColId.get(colId) || [];
      list.push(a);
      artifactsByColId.set(colId, list);
    }
  }

  const result: FullCollection[] = [];
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

const getFullCollectionsServer = cache(async (): Promise<FullCollection[]> => {
  const [rawCollections, artifacts] = await Promise.all([
    fetchCollectionsServer(),
    fetchArtifactsServer(),
  ]);
  return buildCollectionsWithArtifacts(rawCollections, artifacts);
});

function toCollectionSummary(col: FullCollection): CollectionSummary {
  return {
    id: col.id,
    name: col.name,
    description: col.description,
    count: col.artifacts.length,
    coverImage: col.coverImage,
  };
}

/** Non-empty collections, A-Z, without their artifact lists. */
export const getCollectionSummariesServer = cache(
  async (): Promise<CollectionSummary[]> =>
    (await getFullCollectionsServer()).map(toCollectionSummary),
);

/** Newest collections (highest id first) for the home page. */
export async function getNewestCollectionsServer(
  limit = 6,
): Promise<CollectionSummary[]> {
  const summaries = await getCollectionSummariesServer();
  return [...summaries]
    .sort((a, b) => (parseInt(b.id, 10) || 0) - (parseInt(a.id, 10) || 0))
    .slice(0, limit);
}

export async function getCollectionByIdServer(
  id: string,
): Promise<CollectionWithArtifacts | undefined> {
  const cleanId = String(id).trim();
  const col = (await getFullCollectionsServer()).find((c) => c.id === cleanId);
  if (!col) return undefined;
  return { ...col, artifacts: col.artifacts.map(toArtifactSummary) };
}

// ------------------------------------------- slices sent to the browser
export function toArtifactSummary(a: Artifact): ArtifactSummary {
  return {
    id: a.id,
    name: a.name,
    short_description: a.short_description,
    categories: a.categories,
    main_image: a.main_image,
    artifact_date: a.artifact_date,
  };
}

/** Home page dashboard: total + per-category counts over ALL public artifacts. */
export const getHomeStatsServer = cache(async (): Promise<HomeStats> => {
  const artifacts = await fetchArtifactsServer();
  const categoryCounts: Record<number, number> = {};
  for (const a of artifacts) {
    for (const c of a.categories) categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  }
  return { total: artifacts.length, categoryCounts };
});

/** Newest artifacts (highest id first). */
export async function getNewestArtifactsServer(
  limit = 12,
): Promise<ArtifactSummary[]> {
  const artifacts = await fetchArtifactsServer();
  return artifacts.slice(0, limit).map(toArtifactSummary);
}

export const SEARCH_PAGE_SIZE = 32;

export type SearchFilters = {
  query: string;
  cats: number[];
  excludeCats: number[];
  colors: string[];
  excludeColors: string[];
};

/**
 * Filters + ranks on the server (same fuzzy / color logic as before) and
 * returns a single page, so the browser only ever receives SEARCH_PAGE_SIZE
 * cards.
 */
export async function searchArtifactsServer(
  filters: SearchFilters,
  page: number,
  locale: Locale,
  pageSize = SEARCH_PAGE_SIZE,
): Promise<SearchPage> {
  const artifacts = await fetchArtifactsServer();
  const filtered = getFilteredArtifacts(
    filters.query,
    filters.cats,
    artifacts,
    locale,
    filters.colors,
    filters.excludeCats,
    filters.excludeColors,
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const safePage = totalPages > 0 ? Math.min(Math.max(1, page), totalPages) : 1;
  const start = (safePage - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize).map(toArtifactSummary),
    total,
    page: safePage,
    totalPages,
    pageSize,
  };
}

/** Architecture (kt) artifacts that have explicit coordinates, for /map. */
export const getMapArtifactsServer = cache(async (): Promise<MapArtifact[]> => {
  const artifacts = await fetchArtifactsServer();
  const result: MapArtifact[] = [];
  for (const a of artifacts) {
    if (!a.categories.includes(CATEGORY_ID.kt)) continue;
    const coords = parseExplicitCoords(a.coordinates);
    if (!coords) continue;
    result.push({
      id: a.id,
      name: a.name,
      short_description: a.short_description,
      main_image: a.main_image,
      artifact_date: a.artifact_date,
      location: a.location,
      coords,
    });
  }
  return result;
});

/** Cards for the given ids, in the given order (used by /saved). */
export async function getArtifactSummariesByIdsServer(
  ids: string[],
): Promise<ArtifactSummary[]> {
  const byId = new Map((await fetchArtifactsServer()).map((a) => [a.id, a]));
  const result: ArtifactSummary[] = [];
  for (const id of ids) {
    const a = byId.get(String(id).trim());
    if (a) result.push(toArtifactSummary(a));
  }
  return result;
}

export async function getRandomArtifactIdServer(): Promise<string | undefined> {
  const artifacts = await fetchArtifactsServer();
  if (artifacts.length === 0) return undefined;
  return artifacts[Math.floor(Math.random() * artifacts.length)].id;
}

const RELATED_LIMIT = 12;

/** "Same collection" + "similar artifacts" blocks of the artifact page. */
export async function getRelatedArtifactsServer(
  artifact: Artifact,
): Promise<RelatedArtifacts> {
  const [artifacts, rawCollections] = await Promise.all([
    fetchArtifactsServer(),
    fetchCollectionsServer(),
  ]);

  const myCols = new Set(artifact.collections || []);
  const collectionNames: Record<string, string> = {};
  for (const c of rawCollections) if (myCols.has(c.id)) collectionNames[c.id] = c.name;

  // Rule: artifacts in the same collection(s), A-Z
  const sameCollectionFull = artifacts
    .filter(
      (a) => a.id !== artifact.id && a.collections?.some((cid) => myCols.has(cid)),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  const sameIds = new Set(sameCollectionFull.map((a) => a.id));

  // Similar: shortlist by shared categories / era, then rank by text similarity
  const targetCats = new Set(artifact.categories);
  const shortlist = artifacts
    .filter((a) => a.id !== artifact.id && !sameIds.has(a.id))
    .map((a) => {
      let overlap = 0;
      for (const c of a.categories) if (targetCats.has(c)) overlap++;
      const era =
        artifact.artifact_date && a.artifact_date === artifact.artifact_date ? 1 : 0;
      return { a, score: overlap * 2 + era };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, 30);

  const targetText = `${artifact.name} ${artifact.short_description || ""}`;
  const similar = shortlist
    .map(({ a }) => ({
      a,
      score: similarityScore(targetText, `${a.name} ${a.short_description || ""}`),
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, RELATED_LIMIT)
    .map(({ a }) => toArtifactSummary(a));

  return {
    collectionNames,
    sameCollection: sameCollectionFull.slice(0, RELATED_LIMIT).map(toArtifactSummary),
    sameCollectionTotal: sameCollectionFull.length,
    similar,
  };
}
