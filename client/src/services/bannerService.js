// Banner Data Service for Lumière Hero Carousel
// Provides dynamic persistence in localStorage, scheduling filters, and full admin CRUD.

const STORAGE_KEY = 'lumiere_hero_banners';
const SETTINGS_KEY = 'lumiere_carousel_settings';

export const DEFAULT_BANNERS = [
  {
    id: 'banner-new-collection',
    order: 1,
    isActive: true,
    badgeText: '22K BIS 916 GOLD',
    eyebrow: 'NEW COLLECTION',
    title: 'TIMELESS JEWELLERY\nFOR EVERY MOMENT',
    description: 'Handcrafted gold jewellery for celebrations, traditions and everyday elegance.',
    desktopImage: '/assets/hero_campaign.webp',
    mobileImage: '/assets/hero_campaign.webp',
    imagePosition: 'center 15%',
    primaryBtnText: 'SHOP COLLECTION',
    primaryBtnLink: '/shop',
    secondaryBtnText: 'EXPLORE ALL',
    secondaryBtnLink: '/collections',
    theme: 'cream-gold', // Warm cream + gold + brown
    startDate: '',
    endDate: '',
  },
  {
    id: 'banner-bridal-collection',
    order: 2,
    isActive: true,
    badgeText: 'KALYANAM · BRIDAL EDIT',
    eyebrow: 'BRIDAL COLLECTION',
    title: 'MAKE YOUR SPECIAL DAY\nSHINE BRIGHTER',
    description: 'Discover timeless bridal jewellery inspired by tradition.',
    desktopImage: '/assets/bridal_campaign.webp',
    mobileImage: '/assets/bridal_campaign.webp',
    imagePosition: 'center 20%',
    primaryBtnText: 'EXPLORE BRIDAL',
    primaryBtnLink: '/category/bridal',
    secondaryBtnText: 'BOOK CONSULTATION',
    secondaryBtnLink: '/contact',
    theme: 'bridal-crimson', // Warm festive Indian colors with cream brand identity
    startDate: '',
    endDate: '',
  },
  {
    id: 'banner-festive-edit',
    order: 3,
    isActive: true,
    badgeText: 'UTSAV · AUSPICIOUS GOLD',
    eyebrow: 'FESTIVE EDIT',
    title: 'CELEBRATE\nIN GOLD',
    description: 'Elegant jewellery for every celebration.',
    desktopImage: '/assets/festival_campaign.webp',
    mobileImage: '/assets/occasion_festival.webp',
    imagePosition: 'center center',
    primaryBtnText: 'SHOP FESTIVE',
    primaryBtnLink: '/shop?collection=Festival',
    secondaryBtnText: 'DISCOVER UTSAV',
    secondaryBtnLink: '/collections',
    theme: 'festive-maroon', // Subtle maroon and gold accents
    startDate: '',
    endDate: '',
  },
  {
    id: 'banner-special-offer',
    order: 4,
    isActive: true,
    badgeText: 'EXCLUSIVE ATELIER REWARD',
    eyebrow: 'SPECIAL OFFER',
    title: 'A LITTLE MORE GOLD,\nA LITTLE MORE JOY',
    description: 'Exclusive offers on selected jewellery.',
    desktopImage: '/assets/category_necklace.webp',
    mobileImage: '/assets/category_gold.webp',
    imagePosition: 'center center',
    primaryBtnText: 'SHOP OFFERS',
    primaryBtnLink: '/shop?collection=Offers',
    secondaryBtnText: 'MEMBERSHIP REWARDS',
    secondaryBtnLink: '/account',
    theme: 'luxury-offer', // Premium warm gold + brown, strictly avoiding cheap discount look
    startDate: '',
    endDate: '',
  },
];

export const DEFAULT_SETTINGS = {
  autoplayInterval: 4500, // 4.5 seconds (within 4-5s interval requirement)
  transitionEffect: 'smooth-fade-slide', // 'smooth-fade-slide' | 'fade' | 'slide'
  pauseOnHover: true,
  resumeDelay: 5000, // 5 seconds after user manual interaction
  swipeEnabled: true,
};

// Check whether a banner is active according to its active flag and optional schedule dates
export const isBannerCurrentlyActive = (banner) => {
  if (!banner.isActive) return false;

  const now = new Date();

  if (banner.startDate) {
    const start = new Date(banner.startDate);
    if (!isNaN(start.getTime()) && now < start) {
      return false;
    }
  }

  if (banner.endDate) {
    const end = new Date(banner.endDate);
    // Include the entire end date until 23:59:59
    end.setHours(23, 59, 59, 999);
    if (!isNaN(end.getTime()) && now > end) {
      return false;
    }
  }

  return true;
};

const normalizeBannerImages = (banner) => ({
  ...banner,
  desktopImage: banner.desktopImage ? banner.desktopImage.replace(/\.(jpg|jpeg|png)$/i, '.webp') : banner.desktopImage,
  mobileImage: banner.mobileImage ? banner.mobileImage.replace(/\.(jpg|jpeg|png)$/i, '.webp') : banner.mobileImage,
});

// Get active & scheduled banners for the storefront customer hero
export const getActiveBanners = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const banners = stored ? JSON.parse(stored) : DEFAULT_BANNERS;
    const active = banners
      .map(normalizeBannerImages)
      .filter(isBannerCurrentlyActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // If all banners happen to be disabled or scheduled out, fallback to default banners
    return active.length > 0 ? active : DEFAULT_BANNERS;
  } catch (err) {
    console.error('Error reading hero banners:', err);
    return DEFAULT_BANNERS;
  }
};

// Get all banners for Admin panel management (including inactive & scheduled)
export const getAllBannersAdmin = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
    // Initialize default banners in storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BANNERS));
    return DEFAULT_BANNERS;
  } catch (err) {
    console.error('Error reading admin banners:', err);
    return DEFAULT_BANNERS;
  }
};

// Save banners array to localStorage and notify listeners
export const saveBanners = (banners) => {
  try {
    const sorted = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new CustomEvent('lumiere_banners_updated', { detail: sorted }));
    return { success: true, banners: sorted };
  } catch (err) {
    console.error('Error saving banners:', err);
    return { success: false, error: err.message };
  }
};

// Carousel settings getter and setter
export const getCarouselSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch (err) {
    console.error('Error reading carousel settings:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveCarouselSettings = (settings) => {
  try {
    const updated = { ...DEFAULT_SETTINGS, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('lumiere_carousel_settings_updated', { detail: updated }));
    return { success: true, settings: updated };
  } catch (err) {
    console.error('Error saving carousel settings:', err);
    return { success: false, error: err.message };
  }
};

// Reset to initial factory defaults
export const resetBannersToDefault = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BANNERS));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  window.dispatchEvent(new CustomEvent('lumiere_banners_updated', { detail: DEFAULT_BANNERS }));
  window.dispatchEvent(new CustomEvent('lumiere_carousel_settings_updated', { detail: DEFAULT_SETTINGS }));
  return { banners: DEFAULT_BANNERS, settings: DEFAULT_SETTINGS };
};
