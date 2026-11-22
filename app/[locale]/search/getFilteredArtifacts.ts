"use client";

import type { Artifact } from "@/contexts/artifact";
import type { Locale } from "@/lib/lang";
import { CATEGORY_GROUPS, getCategoryNames } from "@/lib/consts/categories";
import similarityScore from "@/lib/fuzzySearching";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Redmean formula: tính khoảng cách màu theo cảm nhận thị giác của mắt người
export function getColorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 9999;

  const rMean = (rgb1.r + rgb2.r) / 2;
  const deltaR = rgb1.r - rgb2.r;
  const deltaG = rgb1.g - rgb2.g;
  const deltaB = rgb1.b - rgb2.b;
  return Math.sqrt(
    (2 + rMean / 256) * deltaR * deltaR +
      4 * deltaG * deltaG +
      (2 + (255 - rMean) / 256) * deltaB * deltaB
  );
}

// Ngưỡng khoảng cách tối đa để coi là màu tương đồng (đã nới rộng để bao quát các sắc độ đậm/nhạt cùng tông màu)
const COLOR_SIMILARITY_THRESHOLD = 100;

export function getFilteredArtifacts(
  query: string,
  cats: string[],
  artifacts: Artifact[],
  locale: Locale,
  colors?: string[] | string,
  excludeCats: string[] = [],
  excludeColors: string[] = [],
) {
  if (!artifacts || !Array.isArray(artifacts)) return [];

  let results: (Artifact & { searchScore?: number; colorDistance?: number })[] = [
    ...artifacts,
  ];

  // 1. Lọc theo danh mục / tag (Logic AND: Hiện vật phải chứa TẤT CẢ các danh mục "Bao gồm")
  const validCats = (cats || []).filter(Boolean);
  if (validCats.length > 0) {
    results = results.filter((artifact) => {
      if (
        !artifact ||
        !artifact.categories ||
        !Array.isArray(artifact.categories)
      )
        return false;
      return validCats.every((selectedId) =>
        artifact.categories.includes(selectedId),
      );
    });
  }

  // 2. Lọc loại trừ danh mục (Logic NOT: Hiện vật KHÔNG ĐƯỢC chứa BẤT KỲ danh mục "Loại trừ" nào)
  const validExcludeCats = (excludeCats || []).filter(Boolean);
  if (validExcludeCats.length > 0) {
    results = results.filter((artifact) => {
      if (
        !artifact ||
        !artifact.categories ||
        !Array.isArray(artifact.categories)
      )
        return true;
      return !validExcludeCats.some((excludedId) =>
        artifact.categories.includes(excludedId),
      );
    });
  }

  // 3. Lọc loại trừ màu sắc (Logic NOT: Hiện vật KHÔNG ĐƯỢC chứa BẤT KỲ màu nào tương đồng với màu "Loại trừ")
  const rawExcludeColors = (excludeColors || []).map((c) => c.trim()).filter(Boolean);
  if (rawExcludeColors.length > 0) {
    results = results.filter((artifact) => {
      const hexMatches = (artifact.colors || "").match(/#[0-9a-fA-F]{6}/gi) || [];
      if (hexMatches.length === 0) return true;
      const hasExcludedColor = rawExcludeColors.some((excColor) =>
        hexMatches.some((hex) => getColorDistance(excColor, hex) <= COLOR_SIMILARITY_THRESHOLD)
      );
      return !hasExcludedColor;
    });
  }

  // 4. Lọc bao gồm màu sắc (Logic AND: Hiện vật phải có sắc độ tương đồng với TẤT CẢ các màu "Bao gồm")
  const rawIncludeColors = Array.isArray(colors)
    ? colors
    : typeof colors === "string" && colors.trim()
    ? [colors]
    : [];
  const validIncludeColors = rawIncludeColors.map((c) => c.trim()).filter(Boolean);

  if (validIncludeColors.length > 0) {
    results = results
      .map((artifact) => {
        const hexMatches = (artifact.colors || "").match(/#[0-9a-fA-F]{6}/gi) || [];
        if (hexMatches.length === 0) return null;

        const matchesAll = validIncludeColors.every((incColor) =>
          hexMatches.some((hex) => getColorDistance(incColor, hex) <= COLOR_SIMILARITY_THRESHOLD)
        );

        if (!matchesAll) return null;

        const allDistances = validIncludeColors.map((incColor) => {
          const dists = hexMatches.map((hex) => getColorDistance(incColor, hex));
          return Math.min(...dists);
        });
        const avgDist = allDistances.reduce((a, b) => a + b, 0) / allDistances.length;

        return { ...artifact, colorDistance: avgDist };
      })
      .filter((a): a is Artifact & { colorDistance: number } => a !== null);
  }

  // 5. Lọc và xếp hạng theo từ khóa tìm kiếm (query)
  const cleanedQuery = query.trim().toLowerCase();

  if (cleanedQuery) {
    results = results
      .map((artifact) => {
        const text = [
          artifact.name,
          artifact.short_description,
          getCategoryNames(artifact.categories, locale),
          artifact.description,
          artifact.location,
          artifact.author,
          artifact.artifact_date,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const searchScore = similarityScore(cleanedQuery, text);
        return { ...artifact, searchScore };
      })
      .filter((a) => (a.searchScore ?? 0) > 0);
  }

  // 6. Sắp xếp kết quả tối ưu
  if (cleanedQuery && validIncludeColors.length > 0) {
    results.sort((a, b) => {
      const scoreDiff = (b.searchScore ?? 0) - (a.searchScore ?? 0);
      if (Math.abs(scoreDiff) > 0.1) return scoreDiff;
      return (a.colorDistance ?? 9999) - (b.colorDistance ?? 9999);
    });
  } else if (validIncludeColors.length > 0) {
    results.sort((a, b) => (a.colorDistance ?? 9999) - (b.colorDistance ?? 9999));
  } else if (cleanedQuery) {
    results.sort((a, b) => (b.searchScore ?? 0) - (a.searchScore ?? 0));
  }

  return results;
}
