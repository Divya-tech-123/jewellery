import React, { useState } from 'react';
import { toWebp, generateSrcSet, getSizes, getVariant } from '../utils/imageHelpers';

/**
 * Reusable Optimized Image Component
 * Features:
 * - Automatic WebP format conversion
 * - Responsive srcSet (400w, 800w, 1200w) & intelligent sizes
 * - Native lazy loading & async decoding
 * - High-priority LCP loading support (fetchpriority="high")
 * - Layout-shift prevention with shimmer placeholder
 * - Graceful error fallback
 */
const OptimizedImage = ({
  src,
  srcSet,
  sizes,
  alt = 'Lumière Fine Jewellery',
  width,
  height,
  priority = false,
  loading,
  decoding = 'async',
  className = '',
  containerClassName = '',
  aspectRatio,
  objectFit = 'cover',
  style = {},
  fallbackSrc = '/assets/category_necklace.webp',
  showPlaceholder = true,
  onLoad,
  ...restProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Normalize image source to WebP
  const rawSrc = hasError ? fallbackSrc : (src || fallbackSrc);
  const normalizedSrc = toWebp(rawSrc);

  // Auto-generate responsive srcSet if not provided and not in error state
  const computedSrcSet = srcSet !== undefined 
    ? srcSet 
    : (hasError ? '' : generateSrcSet(normalizedSrc));

  // Determine sizes
  const computedSizes = sizes ? getSizes(sizes) : (computedSrcSet ? getSizes('product-card') : undefined);

  // Determine loading strategy
  const computedLoading = loading || (priority ? 'eager' : 'lazy');

  const handleImageLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const imgStyle = {
    objectFit,
    ...style,
  };

  const containerStyle = aspectRatio ? { aspectRatio } : {};

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={containerStyle}
    >
      {/* Subtle Shimmer / Warm Luxury Placeholder while loading */}
      {showPlaceholder && !isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#F7F4EE] animate-pulse pointer-events-none transition-opacity duration-300"
        />
      )}

      {/* Optimized HTML5 Image Element */}
      <img
        src={normalizedSrc}
        srcSet={computedSrcSet || undefined}
        sizes={computedSizes}
        alt={alt}
        width={width}
        height={height}
        loading={computedLoading}
        decoding={decoding}
        fetchPriority={priority ? 'high' : undefined}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full transition-opacity duration-500 ease-out ${
          isLoaded || priority ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={imgStyle}
        {...restProps}
      />
    </div>
  );
};

export default OptimizedImage;
