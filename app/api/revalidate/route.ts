import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { ARTIFACTS_TAG, COLLECTIONS_TAG } from "@/lib/serverArtifacts";

export const runtime = "nodejs";

/**
 * On-demand cache refresh after editing data in Supabase.
 *
 *   curl -X POST https://<site>/api/revalidate \
 *     -H "Authorization: Bearer $REVALIDATE_SECRET"
 *
 * Optional ?tag=artifacts|collections refreshes only one dataset.
 * Can be wired to a Supabase Database Webhook (HTTP Request, POST) on the
 * artifacts / collections / junction tables with that header.
 */
const TAGS = [ARTIFACTS_TAG, COLLECTIONS_TAG];

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const requested = request.nextUrl.searchParams.get("tag");
  const tags = requested ? TAGS.filter((t) => t === requested) : TAGS;
  if (tags.length === 0) {
    return NextResponse.json(
      { status: "error", message: `Unknown tag. Use one of: ${TAGS.join(", ")}` },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  // expire: 0 -> the next request fetches fresh data from Supabase
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json(
    { status: "success", revalidated: tags, at: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
