import type { MetadataRoute } from "next";
import { locales } from "@/lib/lang";
import { fetchArtifactsServer } from "@/lib/serverArtifacts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://btvh.vercel.app";
  const staticRoutes = [
    "",
    "/search",
    "/map",
    "/timeline",
    "/references",
    "/badge",
    "/download",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static routes across all 6 locales
  for (const route of staticRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic artifacts
  try {
    const artifacts = await fetchArtifactsServer();
    for (const artifact of artifacts) {
      let lastMod = new Date();
      if (artifact.public_date) {
        const parts = artifact.public_date.split(/[-/]/);
        if (parts.length === 3) {
          const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          if (!isNaN(d.getTime())) lastMod = d;
        }
      }

      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/artifact/${artifact.id}`,
          lastModified: lastMod,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  } catch (err) {
    console.error("Failed to generate artifacts sitemap:", err);
  }

  return entries;
}
