import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { fetchArtifactsServer } from "@/lib/serverArtifacts";
import { getSourceImgUrl, PROXY_WIDTHS } from "@/lib/imgProcessor";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 15000;
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

// Successful images are cached on the CDN for a long time; failures are never cached
const CACHE_OK = "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800";

let allowedHostsCache: { hosts: Set<string>; timestamp: number } | null = null;

/** Only proxy hosts that artifact images in the spreadsheet actually use. */
async function getAllowedHosts(): Promise<Set<string>> {
  if (allowedHostsCache && Date.now() - allowedHostsCache.timestamp < 3600 * 1000) {
    return allowedHostsCache.hosts;
  }
  const hosts = new Set<string>(["lh3.googleusercontent.com"]);
  const artifacts = await fetchArtifactsServer();
  for (const a of artifacts) {
    try {
      hosts.add(new URL(getSourceImgUrl(a.main_image)).hostname);
    } catch {
      // not an absolute URL
    }
  }
  if (artifacts.length > 0) {
    allowedHostsCache = { hosts, timestamp: Date.now() };
  }
  return hosts;
}

/** Fetch the source image, retrying on network errors, non-image or empty bodies. */
async function fetchImageWithRetry(
  url: string,
): Promise<{ buf: Buffer; type: string } | null> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
        headers: { Accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
        cache: "no-store",
      });
      const type = res.headers.get("content-type") || "";
      if (res.ok && type.startsWith("image/")) {
        const buf = Buffer.from(await res.arrayBuffer());
        // Some sources (e.g. Paris Musées) sometimes answer 200 with an empty body
        if (buf.length > 0 && buf.length <= MAX_SOURCE_BYTES) return { buf, type };
      }
      // A 4xx other than 408/429 will not get better by retrying
      if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429) {
        return null;
      }
    } catch {
      // network error or timeout: retry
    }
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }
  return null;
}

function fail(status: number, message: string) {
  return new NextResponse(message, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const rawUrl = searchParams.get("url") || "";
  const width = Number(searchParams.get("w"));

  if (!(PROXY_WIDTHS as readonly number[]).includes(width)) {
    return fail(400, "Invalid width");
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return fail(400, "Invalid url");
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return fail(400, "Invalid protocol");
  }

  const allowedHosts = await getAllowedHosts();
  if (!allowedHosts.has(target.hostname)) {
    return fail(403, "Host not allowed");
  }

  const source = await fetchImageWithRetry(target.toString());
  if (!source) return fail(502, "Upstream image unavailable");

  try {
    const output = await sharp(source.buf, { failOn: "none" })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();

    return new NextResponse(new Uint8Array(output), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": CACHE_OK,
      },
    });
  } catch {
    // Could not decode/resize (e.g. unusual format): serve the original bytes
    return new NextResponse(new Uint8Array(source.buf), {
      headers: {
        "Content-Type": source.type,
        "Cache-Control": CACHE_OK,
      },
    });
  }
}
