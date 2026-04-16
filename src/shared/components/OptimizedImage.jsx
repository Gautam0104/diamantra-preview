/**
 * OptimizedImage — drop-in replacement for <img> with:
 * - AVIF → WebP → original fallback via <picture>
 * - Native lazy loading (loading="lazy" by default)
 * - fetchPriority for above-the-fold images
 * - sizes prop for responsive width hints
 *
 * Usage:
 *   <OptimizedImage src={product.imageUrl} alt="Ring" sizes="(max-width: 640px) 50vw, 25vw" />
 *   <OptimizedImage src={hero.imageUrl} alt="Hero" loading="eager" fetchpriority="high" />
 */
export default function OptimizedImage({
  src,
  alt,
  sizes = "100vw",
  className,
  width,
  height,
  loading = "lazy",
  fetchpriority,
  draggable,
  style,
  onError,
}) {
  if (!src) return null;

  // Preview mode: skip the AVIF/WebP <picture> fallback chain. In dev, Vite's
  // SPA fallback returns 200 OK with text/html for any missing .avif/.webp
  // sibling — which fools the browser into rendering broken HTML as an image.
  // None of the preview's local assets ship those variants, so render the
  // src directly. Production swap-in of OptimizedImage would re-enable picture.
  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      className={className}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchpriority}
      draggable={draggable}
      style={style}
      onError={onError}
    />
  );
}
