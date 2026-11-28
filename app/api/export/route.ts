import { NextRequest, NextResponse } from "next/server";

import { fetchArtifactsServer } from "@/lib/serverArtifacts";
import { FULL_HEADERS } from "@/lib/exportData/dataMetadata";
import { getCsvContent } from "@/lib/exportData/getCsvContent";
import { getTxtContent } from "@/lib/exportData/getTxtContent";

/**
 * File export for /download, generated on the server so the browser never has
 * to hold the whole dataset.
 *
 *   GET /api/export?format=csv|txt&fields=id,name,...&filename=ham-anh-cac.csv
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const format = sp.get("format") === "txt" ? "txt" : "csv";

  const requested = new Set(
    (sp.get("fields") || "")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
  );
  const headers = FULL_HEADERS.filter(({ key }) => requested.has(key));
  if (headers.length === 0) {
    return NextResponse.json(
      { status: "error", message: "No valid fields selected" },
      { status: 400 },
    );
  }

  const rawName = sp.get("filename") || `ham-anh-cac.${format}`;
  // Keep the file name header-safe
  const filename = rawName.replace(/[^\w.\-]/g, "_").slice(0, 100);

  const artifacts = await fetchArtifactsServer();
  const content =
    format === "csv"
      ? getCsvContent(artifacts, headers)
      : getTxtContent(artifacts, headers);

  return new NextResponse("﻿" + content, {
    headers: {
      "Content-Type":
        format === "csv" ? "text/csv; charset=utf-8" : "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
