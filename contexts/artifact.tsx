"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchArtifacts, fetchCollections } from "@/lib/fetchArtifacts";

export type Artifact = {
  id: string;
  name: string;
  short_description: string;
  description: string;
  categories: string[];
  main_image: string;
  supporting_images?: string[];
  sources?: string[];
  source_url?: string;
  author: string;
  contributor: string;
  artifact_date: string;
  public_date: string; // dd-mm-yyyy
  location: string;
  coordinates?: string;
  colors?: string;
  collections?: string[];
};

export type Collection = {
  id: string;
  name: string;
  description: string;
};

export type CollectionWithArtifacts = Collection & {
  artifacts: Artifact[];
  coverImage?: string;
};

interface ArtifactContextType {
  artifacts: Artifact[] | undefined;
  collections?: CollectionWithArtifacts[];
}

const ArtifactContext = createContext<ArtifactContextType | undefined>(
  undefined,
);

function hasRequiredFields(item: Artifact) {
  return (
    Boolean(item.id && String(item.id).trim()) &&
    Boolean(item.name && String(item.name).trim()) &&
    Boolean(
      (item.main_image && String(item.main_image).trim()) ||
        ((item as any)["main image"] &&
          String((item as any)["main image"]).trim()),
    )
  );
}

function buildCollections(
  rawCols: Collection[],
  artifacts: Artifact[],
): CollectionWithArtifacts[] {
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

  const validCollections: CollectionWithArtifacts[] = [];
  for (const col of rawCols) {
    const colArtifacts = artifactsByColId.get(col.id) || [];
    if (colArtifacts.length === 0) continue;

    const sortedArtifacts = [...colArtifacts].sort((a, b) =>
      a.name.localeCompare(b.name, "vi"),
    );

    validCollections.push({
      ...col,
      artifacts: sortedArtifacts,
      coverImage: sortedArtifacts[0]?.main_image,
    });
  }

  validCollections.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  return validCollections;
}

export function ArtifactProvider({
  children,
  initialArtifacts,
  initialCollections,
}: {
  children: React.ReactNode;
  // Prefetched on the server (cached) so pages render with data immediately
  initialArtifacts?: Artifact[];
  initialCollections?: Collection[];
}) {
  const hasInitial = Boolean(initialArtifacts && initialArtifacts.length > 0);

  const [artifacts, setArtifacts] = useState<Artifact[] | undefined>(() =>
    hasInitial ? initialArtifacts!.filter(hasRequiredFields) : undefined,
  );
  const [rawCollections, setRawCollections] = useState<
    Collection[] | undefined
  >(() => (hasInitial ? initialCollections : undefined));

  // Fallback: only fetch from the browser when the server could not provide data
  useEffect(() => {
    if (hasInitial) return;
    (async () => {
      const [data, rawCols] = await Promise.all([
        fetchArtifacts(),
        fetchCollections(),
      ]);
      setArtifacts(data?.filter(hasRequiredFields));
      setRawCollections(rawCols);
    })();
  }, [hasInitial]);

  const collections = useMemo(
    () =>
      rawCollections && artifacts
        ? buildCollections(rawCollections, artifacts)
        : undefined,
    [rawCollections, artifacts],
  );

  return (
    <ArtifactContext.Provider value={{ artifacts, collections }}>
      {children}
    </ArtifactContext.Provider>
  );
}

export function useArtifact() {
  const context = useContext(ArtifactContext);
  if (!context)
    throw new Error("useArtifact must be used within ArtifactProvider");
  return context;
}
