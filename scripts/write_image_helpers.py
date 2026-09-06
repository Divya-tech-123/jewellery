import os

image_helpers_content = """/**
 * Image URL and Responsive SrcSet Utilities for Lumière Luxury Jewellery
 */

// Format or normalize an image path to WebP
export const toWebp = (url) => {
  if (!url || typeof url !== 'string') return '/assets/category_necklace.webp';
  // If already an external URL or data URI, return as is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Replace .jpg, .jpeg, .png with .webp
  return url.replace(/\\.(jpg|jpeg|png)$/i, '.webp');
};

// Generate specific width variant path (e.g. /assets/hero_campaign-320.webp)
export const getVariant = (url, width) => {
  if (!url || typeof url !== 'string') return `/assets/category_necklace-${width}.webp`;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const clean = toWebp(url);
  // Match -320.webp, -400.webp, -640.webp, -800.webp, -960.webp, -1200.webp if already present
  const base = clean.replace(/-(320|400|640|800|960|1200)\\.webp$/i, '.webp');
  return base.replace(/\\.webp$/i, `-${width}.webp`);
};

// Generate standard 4-tier responsive srcSet string for an image (320w, 640w, 960w, 1200w)
export const generateSrcSet = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return '';
  }
  const w320 = getVariant(url, 320);
  const w640 = getVariant(url, 640);
  const w960 = getVariant(url, 960);
  const w1200 = getVariant(url, 1200);

  return `${w320} 320w, ${w640} 640w, ${w960} 960w, ${w1200} 1200w`;
};

// Pre-defined responsive layout size descriptors
export const SIZES_PRESETS = {
  'product-card': '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  'category-card': '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  'category-avatar': '(max-width: 640px) 80px, 96px',
  'occasion-large': '(max-width: 1024px) 100vw, 55vw',
  'occasion-small': '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw',
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
"""

target = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'client', 'src', 'utils', 'imageHelpers.js'))
with open(target, 'w', encoding='utf-8') as f:
    f.write(image_helpers_content)

print(f"Successfully written {target}")
