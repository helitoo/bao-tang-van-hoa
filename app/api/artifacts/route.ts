import { NextRequest, NextResponse } from "next/server";
import { fetchArtifactsServer } from "@/lib/serverArtifacts";
import { getFilteredArtifacts } from "@/app/[locale]/search/getFilteredArtifacts";
import type { Locale } from "@/lib/lang";
import { getCategoryNames, parseCategoryParams } from "@/lib/consts/categories";

const MAX_IDS = 500;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("query") || searchParams.get("q") || "";
    const rawCats =
      searchParams.get("category") ||
      searchParams.get("categories") ||
      searchParams.get("cats") ||
      "";
    // Numeric category ids ("14,36"); legacy codes ("kt,nguyen") are accepted too
    const cats = rawCats ? parseCategoryParams([rawCats]) : [];

    // ?ids=12,5,40 returns exactly those artifacts, in that order (used by /saved)
    const ids = (searchParams.get("ids") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_IDS);

    const locale = (searchParams.get("locale") || "vi") as Locale;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(
      ids.length > 0 ? MAX_IDS : 100,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20),
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://btvh.vercel.app";
    const allArtifacts = await fetchArtifactsServer();
    let filtered;
    if (ids.length > 0) {
      const byId = new Map(allArtifacts.map((a) => [a.id, a]));
      filtered = ids.flatMap((id) => byId.get(id) ?? []);
    } else {
      filtered = getFilteredArtifacts(query, cats, allArtifacts, locale);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit).map((item) => {
      const sources = (item.sources || item.supporting_images || []).filter(
        (s) => s.startsWith("http://") || s.startsWith("https://"),
      );
      const sourceUrl = item.source_url || sources[0] || null;

      return {
        id: item.id,
        name: item.name,
        short_description: item.short_description || "",
        description: item.description || "",
        categories: item.categories || [],
        category_names: getCategoryNames(item.categories || [], locale),
        artifact_date: item.artifact_date || "",
        location: item.location || "",
        author: item.author || "",
        main_image: item.main_image || "",
        url: `${baseUrl}/${locale}/artifact/${item.id}`,
        source_url: sourceUrl,
        sources: sources.length > 0 ? sources : undefined,
      };
    });

    return NextResponse.json(
      {
        status: "success",
        total,
        page,
        limit,
        totalPages,
        data: items,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (error) {
    console.error("API /api/artifacts error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch artifacts" },
      { status: 500 },
    );
  }
}
