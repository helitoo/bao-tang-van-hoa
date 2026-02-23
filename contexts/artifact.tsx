"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchArtifacts } from "@/lib/fetchArtifacts";

export type Artifact = {
  id: string;
  name: string;
  short_description: string;
  description: string;
  categories: string[];
  main_image: string;
  supporting_images?: string[];
  author: string;
  contributor: string;
  artifact_date: string;
  public_date: string; // dd-mm-yyyy
  location: string;
};

interface ArtifactContextType {
  artifacts: Artifact[] | undefined;
}

const ArtifactContext = createContext<ArtifactContextType | undefined>(
  undefined,
);

export function ArtifactProvider({ children }: { children: React.ReactNode }) {
  const [artifacts, setArtifacts] = useState<Artifact[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const data = await fetchArtifacts();
      setArtifacts(data);
    })();
  }, []);

  return (
    <ArtifactContext.Provider value={{ artifacts }}>
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
