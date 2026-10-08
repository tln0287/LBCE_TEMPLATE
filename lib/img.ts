/**
 * Image URL builder. Content stores a base URL; this adds size/format parameters
 * for hosts that support them (Unsplash/imgix today, the college CDN later).
 */
const RESIZABLE = ["images.unsplash.com"];

export function imgUrl(src: string, width: number, quality = 70) {
  try {
    const url = new URL(src);
    if (!RESIZABLE.includes(url.hostname)) return src;
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  } catch {
    return src;
  }
}

export function srcSet(src: string, widths: number[] = [480, 768, 1200, 1600, 2000]) {
  return widths.map((w) => `${imgUrl(src, w)} ${w}w`).join(", ");
}
