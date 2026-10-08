import { imgUrl, srcSet } from "@/lib/img";

/**
 * Responsive, lazy image. Uses srcset against the image host so the browser picks
 * the right size; `priority` is for the first hero image only.
 */
export function Img({
  src,
  alt,
  sizes = "100vw",
  width = 1600,
  height,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgUrl(src, width)}
      srcSet={srcSet(src)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height ?? Math.round(width * 0.66)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
    />
  );
}
