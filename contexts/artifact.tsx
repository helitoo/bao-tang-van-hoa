/**
 * Shared data types. The full artifact list never reaches the browser:
 * server components page / aggregate it (lib/serverArtifacts.ts) and pass
 * only the slices each page needs.
 */

export type Artifact = {
  id: string;
  name: string;
  short_description: string;
  description: string;
  /** Numeric category ids (see lib/consts/categories.ts) */
  categories: number[];
  main_image: string;
  supporting_images?: string[];
  sources?: string[];
  source_url?: string;
  author: string;
  contributor: string;
  artifact_date: string;
  /** ISO timestamp from Supabase (artifacts.created_at) */
  created_at?: string;
  public_date: string; // dd/mm/yyyy, derived from created_at
  location: string;
  coordinates?: string; // "lat, lng"
  colors?: string; // space separated hex colors
  collections?: string[];
};

/** The fields an ArtifactCard needs; what list pages send to the browser. */
export type ArtifactSummary = Pick<
  Artifact,
  "id" | "name" | "short_description" | "categories" | "main_image" | "artifact_date"
>;

/** One marker on /map. */
export type MapArtifact = Pick<
  Artifact,
  "id" | "name" | "short_description" | "main_image" | "artifact_date" | "location"
> & { coords: [number, number] };

export type Collection = {
  id: string;
  name: string;
  description: string;
};

/** Collection card: no artifact list, just the count and the cover. */
export type CollectionSummary = Collection & {
  count: number;
  coverImage?: string;
};

export type CollectionWithArtifacts = Collection & {
  artifacts: ArtifactSummary[];
  coverImage?: string;
};

/** Aggregates for the home page dashboard, computed on the server. */
export type HomeStats = {
  total: number;
  /** category id -> number of artifacts */
  categoryCounts: Record<number, number>;
};

/** "Same collection" / "similar" blocks of the artifact page. */
export type RelatedArtifacts = {
  /** id -> name of every collection the artifact belongs to */
  collectionNames: Record<string, string>;
  /** First 12, A-Z */
  sameCollection: ArtifactSummary[];
  sameCollectionTotal: number;
  similar: ArtifactSummary[];
};

export type SearchPage = {
  items: ArtifactSummary[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
};
