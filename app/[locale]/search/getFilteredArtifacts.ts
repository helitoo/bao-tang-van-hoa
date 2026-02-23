"use client";

import type { Artifact } from "@/contexts/artifact";
import type { Locale } from "@/lib/lang";
import { CATEGORY_GROUPS, getCategoryNames } from "@/lib/consts/categories";
import similarityScore from "@/lib/fuzzySearching";

export function getFilteredArtifacts(
  query: string,
  cats: string[],
  artifacts: Artifact[],
  locale: Locale,
) {
  if (!artifacts || !Array.isArray(artifacts)) return [];

  let results = [...artifacts];

  // 1. Filter by hard category selections (from sidebar)
  if (cats.length > 0) {
    const selectedByGroup: Record<string, string[]> = {};
    cats.forEach((catId) => {
      for (const group of CATEGORY_GROUPS) {
        if (!group || !group.options) continue;
        if (group.options.find((o) => o && o.id === catId)) {
          if (!selectedByGroup[group.id]) selectedByGroup[group.id] = [];
          selectedByGroup[group.id].push(catId);
          break;
        }
      }
    });

    results = results.filter((artifact) => {
      if (
        !artifact ||
        !artifact.categories ||
        !Array.isArray(artifact.categories)
      )
        return false;
      return Object.values(selectedByGroup).every((groupSelections) => {
        return groupSelections.some((selectedId) =>
          artifact.categories.includes(selectedId),
        );
      });
    });
  }

  // 2. Filter and rank by query similarity
  const cleanedQuery = query.trim().toLowerCase();

  if (!cleanedQuery) return results;

  results = results
    .map((artifact) => {
      // Get categories' name
      const catNames = getCategoryNames(artifact.categories, locale);
      // name + short_description
      const text = [
        artifact.name,
        artifact.short_description,
        catNames,
        artifact.description,
        artifact.location,
        artifact.author,
        artifact.artifact_date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      // const query2 = [

      // ]
      //   .filter(Boolean)
      //   .join(" ")
      //   .toLowerCase();

      const searchScore = similarityScore(cleanedQuery, text);

      return { ...artifact, searchScore };
    })
    .filter((a) => a.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);

  return results;
}
