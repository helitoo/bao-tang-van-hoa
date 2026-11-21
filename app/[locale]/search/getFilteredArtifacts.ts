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
  selectedColor?: string,
) {
  if (!artifacts || !Array.isArray(artifacts)) return [];

  let results: (Artifact & { searchScore?: number; colorDistance?: number })[] = [
    ...artifacts,
  ];

  // 1. Lọc theo danh mục / tag (Logic AND: Hiện vật phải chứa TẤT CẢ các danh mục được chọn)
  const validCats = cats.filter(Boolean);
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

  // 2. Lọc theo màu sắc được chọn (nếu có)
  const activeColor = (selectedColor || "").trim();
  if (activeColor) {
    results = results
      .map((artifact) => {
        const hexMatches = (artifact.colors || "").match(/#[0-9a-fA-F]{6}/g) || [];
        if (hexMatches.length === 0) return null;

        const distances = hexMatches.map((hex) => getColorDistance(activeColor, hex));
        const minDist = Math.min(...distances);

        if (minDist <= COLOR_SIMILARITY_THRESHOLD) {
          return { ...artifact, colorDistance: minDist };
        }
        return null;
      })
      .filter((a): a is Artifact & { colorDistance: number } => a !== null);
  }

  // 3. Lọc và xếp hạng theo từ khóa tìm kiếm (query)
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

  // 4. Sắp xếp kết quả tối ưu
  if (cleanedQuery && activeColor) {
    // Cả từ khóa và màu sắc: ưu tiên điểm từ khóa, kế tiếp là độ gần màu
    results.sort((a, b) => {
      const scoreDiff = (b.searchScore ?? 0) - (a.searchScore ?? 0);
      if (Math.abs(scoreDiff) > 0.1) return scoreDiff;
      return (a.colorDistance ?? 9999) - (b.colorDistance ?? 9999);
    });
  } else if (activeColor) {
    // Chỉ chọn màu: hiện vật có màu gần nhất đứng đầu tiên
    results.sort((a, b) => (a.colorDistance ?? 9999) - (b.colorDistance ?? 9999));
  } else if (cleanedQuery) {
    // Chỉ tìm kiếm theo từ khóa
    results.sort((a, b) => (b.searchScore ?? 0) - (a.searchScore ?? 0));
  }

  return results;
}
