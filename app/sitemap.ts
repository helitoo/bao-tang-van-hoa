import type { MetadataRoute } from "next";
import { locales } from "@/lib/lang";
import {
  fetchArtifactsServer,
  getCollectionSummariesServer,
} from "@/lib/serverArtifacts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";
  const staticRoutes = [
    "",
    "/collection",
    "/search",
    "/map",
    "/timeline",
    "/references",
    "/badge",
    "/download",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static routes across all 6 locales with full x-default and hreflang alternates
  for (const route of staticRoutes) {
    const alternatesLanguages: Record<string, string> = {
      "x-default": `${baseUrl}/vi${route}`,
    };
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}${route}`;
    }

    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/collection" ? 0.9 : 0.8,
        alternates: {
          languages: alternatesLanguages,
        },
      });
    }
  }

  // Dynamic collections
  try {
    const collections = await getCollectionSummariesServer();
    for (const col of collections) {
      const colAlternates: Record<string, string> = {
        "x-default": `${baseUrl}/vi/collection/${col.id}`,
      };
      for (const l of locales) {
        colAlternates[l] = `${baseUrl}/${l}/collection/${col.id}`;
      }

      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/collection/${col.id}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: colAlternates,
          },
        });
      }
    }
  } catch (err) {
    console.error("Failed to generate collections sitemap:", err);
  }

  // Dynamic artifacts
  try {
    const artifacts = await fetchArtifactsServer();
    for (const artifact of artifacts) {
      let lastMod = new Date();
      if (artifact.created_at) {
        const d = new Date(artifact.created_at);
        if (!isNaN(d.getTime())) lastMod = d;
      }

      const artifactAlternates: Record<string, string> = {
        "x-default": `${baseUrl}/vi/artifact/${artifact.id}`,
      };
      for (const l of locales) {
        artifactAlternates[l] = `${baseUrl}/${l}/artifact/${artifact.id}`;
      }

      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/artifact/${artifact.id}`,
          lastModified: lastMod,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: artifactAlternates,
          },
        });
      }
    }
  } catch (err) {
    console.error("Failed to generate artifacts sitemap:", err);
  }

  return entries;
}
