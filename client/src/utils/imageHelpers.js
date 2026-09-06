/**
 * Image URL and Responsive SrcSet Utilities for Lumière Luxury Jewellery
 */

// Format or normalize an image path to WebP
export const toWebp = (url) => {
  if (!url || typeof url !== 'string') return '/assets/category_necklace.webp';
  // If already an external URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Replace .jpg, .jpeg, .png with .webp
  return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
};

// Generate specific width variant path (e.g. /assets/hero_campaign-400.webp)
export const getVariant = (url, width) => {
  if (!url || typeof url !== 'string') return '/assets/category_necklace-400.webp';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const clean = toWebp(url);
  // Match -400.webp, -800.webp, -1200.webp if already present
  const base = clean.replace(/-(400|800|1200)\.webp$/i, '.webp');
  return base.replace(/\.webp$/i, `-${width}.webp`);
};

// Generate standard responsive srcSet string for an image
export const generateSrcSet = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return '';
  }
  const w400 = getVariant(url, 400);
  const w800 = getVariant(url, 800);
  const w1200 = getVariant(url, 1200);

  return `${w400} 400w, ${w800} 800w, ${w1200} 1200w`;
};

// Pre-defined responsive layout size descriptors
export const SIZES_PRESETS = {
  'product-card': '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  'category-card': '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  'category-avatar': '(max-width: 640px) 80px, 96px',
  'occasion-card': '(max-width: 640px) 50vw, 25vw',
  'hero-desktop': '(max-width: 1024px) 100vw, 55vw',
  'hero-mobile': '100vw',
  'product-detail': '(max-width: 768px) 100vw, 55vw',
  'thumbnail': '96px',
  'full': '100vw',
  'half': '(max-width: 768px) 100vw, 50vw',
  'journal-card': '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
};

export const getSizes = (presetNameOrCustom) => {
  return SIZES_PRESETS[presetNameOrCustom] || presetNameOrCustom || SIZES_PRESETS['product-card'];
};
