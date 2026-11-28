import { NextResponse } from "next/server";
import { getRandomArtifactIdServer } from "@/lib/serverArtifacts";

// A new pick on every call; the artifact list itself still comes from the Data Cache.
export const dynamic = "force-dynamic";

export async function GET() {
  const id = await getRandomArtifactIdServer();
  if (!id) {
    return NextResponse.json(
      { status: "error", message: "No artifacts" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json({ id }, { headers: { "Cache-Control": "no-store" } });
}
