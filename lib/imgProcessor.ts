export const FALLBACK_IMAGE = "/icon.png";

// Widths the image proxy is allowed to produce (keeps the CDN cache small)
export const PROXY_WIDTHS = [160, 400, 500, 800, 1200, 2400] as const;
const DEFAULT_PROXY_WIDTH = 2400;

export function getDriveId(url: string) {
  if (!url) return null;
  const str = String(url).trim();
  const match =
    str.match(/\/file\/d\/(.+?)\/(view|preview|edit|copy)/) ||
    str.match(/id=(.+?)(&|$)/);
  return match ? match[1] : null;
}

export function pickProxyWidth(width?: number) {
  if (!width || !Number.isFinite(width)) return DEFAULT_PROXY_WIDTH;
  return PROXY_WIDTHS.find((w) => w >= width) ?? DEFAULT_PROXY_WIDTH;
}

/**
 * Direct URL of the image at its source (Drive -> lh3, iframe -> its src).
 * Use for SEO metadata (Open Graph, JSON-LD) that needs an absolute URL.
 */
export function getSourceImgUrl(content: string, width?: number) {
  if (!content) return FALLBACK_IMAGE;
  let url = String(content).trim();
  if (url.toLowerCase().startsWith("<iframe")) {
    const srcMatch = url.match(/src=["'](.+?)["']/i);
    if (srcMatch) url = srcMatch[1];
    else return FALLBACK_IMAGE;
  }
  const driveId = getDriveId(url);
  if (driveId) {
    const base = `https://lh3.googleusercontent.com/d/${driveId}`;
    return width ? `${base}=w${width}` : base;
  }
  if (url.includes("googleusercontent.com") && width) {
    return `${url}=w${width}`;
  }
  return url;
}

/**
 * URL to display an artifact image. Remote images go through the /api/img
 * proxy, which retries flaky sources, resizes to `width` and caches on the CDN.
 */
export function getImgUrl(content: string, width?: number) {
  const proxyWidth = pickProxyWidth(width);
  const source = getSourceImgUrl(content, proxyWidth);
  if (!/^https?:\/\//i.test(source)) return source; // local files / fallback
  return `/api/img?url=${encodeURIComponent(source)}&w=${proxyWidth}`;
}
