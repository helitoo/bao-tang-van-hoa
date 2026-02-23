export const FALLBACK_IMAGE = "/icon.png";

export function getDriveId(url: string) {
  if (!url) return null;
  const str = String(url).trim();
  const match =
    str.match(/\/file\/d\/(.+?)\/(view|preview|edit|copy)/) ||
    str.match(/id=(.+?)(&|$)/);
  return match ? match[1] : null;
}

export function getImgUrl(content: string) {
  if (!content) return FALLBACK_IMAGE;
  let url = String(content).trim();
  if (url.toLowerCase().startsWith("<iframe")) {
    const srcMatch = url.match(/src=["'](.+?)["']/i);
    if (srcMatch) url = srcMatch[1];
    else return FALLBACK_IMAGE;
  }
  const driveId = getDriveId(url);
  if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
  return url;
}
