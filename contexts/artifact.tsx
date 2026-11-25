"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

export function ArtifactProvider({ children }: { children: React.ReactNode }) {
  const [artifacts, setArtifacts] = useState<Artifact[] | undefined>(undefined);
  const [collections, setCollections] = useState<CollectionWithArtifacts[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const [data, rawCols] = await Promise.all([
        fetchArtifacts(),
        fetchCollections(),
      ]);

      const validArtifacts = data?.filter(
        (item) =>
          Boolean(item.id && String(item.id).trim()) &&
          Boolean(item.name && String(item.name).trim()) &&
          Boolean(
            (item.main_image && String(item.main_image).trim()) ||
              ((item as any)["main image"] &&
                String((item as any)["main image"]).trim()),
          ),
      );
      setArtifacts(validArtifacts);

      if (rawCols && validArtifacts) {
        const artifactsByColId = new Map<string, Artifact[]>();
        for (const a of validArtifacts) {
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
        setCollections(validCollections);
      }
    })();
  }, []);

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
