import os

optimized_image_content = """import React, { useState } from 'react';
import { toWebp, generateSrcSet, getSizes } from '../utils/imageHelpers';

/**
 * Reusable Optimized Image Component
 * Features:
 * - High-fidelity WebP format delivery
 * - 4-tier responsive srcSet (320w, 640w, 960w, 1200w) & accurate sizes
 * - Native lazy loading & async decoding
 * - High-priority LCP loading support (fetchpriority='high' and loading='eager')
 * - Layout-shift prevention with shimmer / low-res placeholder & explicit aspect-ratio
 * - Graceful fallback
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

  // Determine sizes descriptor
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
      {/* Warm Luxury Shimmer Placeholder while loading */}
      {showPlaceholder && !isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#F6F2EB] animate-pulse pointer-events-none transition-opacity duration-300 z-0"
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
        className={`w-full h-full relative z-[1] transition-all duration-500 ease-out ${
          isLoaded || priority ? 'opacity-100 filter-none' : 'opacity-0 blur-sm scale-[1.02]'
        } ${className}`}
        style={imgStyle}
        {...restProps}
      />
    </div>
  );
};

export default OptimizedImage;
"""

product_card_content = """import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import OptimizedImage from './OptimizedImage';

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const prodId = String(product._id || product.id || product.slug);
  const isWishlisted = isInWishlist(prodId);
  const productIdentifier = product.slug || product.id || product._id;
  const productUrl = `/product/${productIdentifier}`;

  const primaryImg = product.images && product.images.length > 0 ? product.images[0] : '/assets/category_necklace.webp';
  const secondaryImg = product.images && product.images.length > 1 ? product.images[1] : null;

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(productUrl);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(prodId);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes ? product.sizes[0] : 'Standard', product.purity || '22K Gold');
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1600);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      navigate(productUrl);
    }
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-transparent cursor-pointer transition-all duration-300"
    >
      {/* 1. Image Canvas (Dominant, Borderless, Soft Warm Backdrop) */}
      <div className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden transition-all duration-500">
        
        {/* Subtle Discount / Purity Tag */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
          {discountPercent && (
            <span className="text-[9px] font-semibold tracking-[0.14em] uppercase bg-white/95 text-lumiere-accent px-2 py-0.5 shadow-subtle border border-lumiere-border/40">
              {discountPercent}% OFF
            </span>
          )}
          {product.bestseller && !discountPercent && (
            <span className="text-[9px] font-semibold tracking-[0.14em] uppercase bg-lumiere-gold text-white px-2 py-0.5 shadow-subtle">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Minimalist Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-white text-lumiere-accent shadow-sm scale-105'
              : 'bg-white/80 text-lumiere-text hover:bg-white hover:text-lumiere-accent hover:scale-105 shadow-subtle backdrop-blur-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Wishlist"
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>

        {/* Product Imagery: Primary & Smooth Secondary Cross-fade */}
        <Link to={productUrl} className="block w-full h-full relative overflow-hidden">
          <OptimizedImage
            src={primaryImg}
            alt={product.name}
            sizes="product-card"
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered && secondaryImg ? 'opacity-0 scale-105' : 'opacity-100 group-hover:scale-105'
            }`}
            containerClassName="w-full h-full"
          />

          {secondaryImg && (
            <OptimizedImage
              src={secondaryImg}
              alt={`${product.name} alternate view`}
              sizes="product-card"
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0'
              }`}
              containerClassName="absolute inset-0 w-full h-full"
            />
          )}
        </Link>

        {/* Desktop Quick Actions (Hover Overlay) */}
        <div className="hidden sm:flex absolute bottom-3 left-3 right-3 gap-2 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex-1 bg-lumiere-deep hover:bg-lumiere-gold text-white text-[10.5px] font-semibold tracking-[0.14em] uppercase py-2.5 flex items-center justify-center gap-1.5 transition-colors duration-300 shadow-sm"
          >
            {addedAnimation ? (
              <>
                <Check size={13} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={13} /> Quick Add
              </>
            )}
          </button>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="w-10 bg-white/95 hover:bg-white text-lumiere-text hover:text-lumiere-gold text-[10.5px] py-2.5 flex items-center justify-center transition-colors duration-300 shadow-sm border border-lumiere-border/50"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye size={14} strokeWidth={1.6} />
            </button>
          )}
        </div>

      </div>

      {/* 2. Editorial Product Details (Generous Spacing, Clean Typography) */}
      <div className="pt-3.5 pb-1 flex flex-col flex-1">
        
        {/* Category / Metal Label */}
        <span className="text-[10px] font-medium tracking-[0.18em] text-lumiere-gold uppercase mb-1 block">
          {product.category || product.material || '22K GOLD'}
        </span>

        {/* Refined Serif Product Title */}
        <Link to={productUrl} className="block mb-1.5">
          <h3 className="font-serif text-sm sm:text-[15px] font-normal text-lumiere-text leading-snug line-clamp-2 group-hover:text-lumiere-gold transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Price & Mobile Add to Cart */}
        <div className="mt-auto pt-1 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-lumiere-text font-sans">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-lumiere-muted/70 line-through font-sans font-light">
                ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile Tap-friendly Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="sm:hidden w-8 h-8 rounded-full bg-lumiere-deep text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            aria-label="Add to Bag"
          >
            {addedAnimation ? <Check size={14} /> : <ShoppingBag size={14} />}
          </button>
        </div>

      </div>
    </article>
  );
};

export default ProductCard;
"""

category_card_content = """import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const CategoryCard = ({ title, count, image, link }) => {
  return (
    <Link
      to={link}
      className="group flex flex-col items-center text-center flex-shrink-0 cursor-pointer p-2 transition-all duration-300"
    >
      {/* Circular Jewellery Photography with gentle gold ring on hover */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-b from-[#F9F6F0] to-[#EFEAE1] p-[3px] border border-lumiere-border/60 group-hover:border-lumiere-gold/70 transition-all duration-500 shadow-subtle group-hover:shadow-[0_8px_20px_rgba(181,138,69,0.12)] mb-3 sm:mb-4">
        <div className="w-full h-full rounded-full overflow-hidden">
          <OptimizedImage
            src={image}
            alt={title}
            sizes="category-avatar"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            containerClassName="w-full h-full rounded-full"
          />
        </div>
      </div>

      {/* Category Name & Count with Hover Motion */}
      <div className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <h3 className="font-serif text-sm sm:text-base font-medium text-lumiere-text tracking-wide group-hover:text-lumiere-gold transition-colors duration-300">
          {title}
        </h3>

        {/* Subtle expanding gold underline on hover */}
        <div className="w-0 h-[1.5px] bg-lumiere-gold mt-1.5 transition-all duration-400 ease-out group-hover:w-8" />

        {count && (
          <span className="text-[10px] sm:text-[11px] text-lumiere-muted font-light tracking-wider mt-1 block">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
"""

section_heading_content = """import React from 'react';

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isLeft = align === 'left';

  return (
    <div className={`mb-10 sm:mb-14 ${isLeft ? 'text-left' : 'text-center max-w-2xl mx-auto'} ${className}`}>
      {eyebrow && (
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-lumiere-gold block mb-2">
          {eyebrow}
        </span>
      )}
      
      {title && (
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-lumiere-text tracking-tight leading-tight uppercase">
          {title}
        </h2>
      )}

      {/* Thin elegant gold accent */}
      <div className={`w-10 h-[1.5px] bg-lumiere-gold/70 mt-3 mb-3.5 ${isLeft ? '' : 'mx-auto'}`} />

      {subtitle && (
        <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed max-w-lg mx-auto font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
"""

hero_carousel_content = r"""import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2
} from 'lucide-react';
import { 
  getActiveBanners, 
  getCarouselSettings 
} from '../services/bannerService';
import OptimizedImage from './OptimizedImage';
import { toWebp, getVariant } from '../utils/imageHelpers';

const HeroCarousel = () => {
  const [banners, setBanners] = useState(getActiveBanners());
  const [settings, setSettings] = useState(getCarouselSettings());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const autoplayTimerRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const containerRef = useRef(null);

  // Subscribe to dynamic banner & settings changes
  useEffect(() => {
    const handleBannersUpdate = () => {
      const active = getActiveBanners();
      setBanners(active);
      setCurrentIndex((prev) => (prev >= active.length ? 0 : prev));
    };

    const handleSettingsUpdate = () => {
      setSettings(getCarouselSettings());
    };

    window.addEventListener('lumiere_banners_updated', handleBannersUpdate);
    window.addEventListener('lumiere_carousel_settings_updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('lumiere_banners_updated', handleBannersUpdate);
      window.removeEventListener('lumiere_carousel_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const totalBanners = banners.length;

  const goToSlide = useCallback((index) => {
    if (totalBanners === 0 || isAnimating) return;
    setIsAnimating(true);
    let target = index;
    if (target < 0) target = totalBanners - 1;
    if (target >= totalBanners) target = 0;
    setCurrentIndex(target);
    setTimeout(() => setIsAnimating(false), 500);
  }, [totalBanners, isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [goToSlide, currentIndex]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [goToSlide, currentIndex]);

  const triggerManualInteraction = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, settings.resumeDelay || 6000);
  }, [settings.resumeDelay]);

  // Autoplay management
  useEffect(() => {
    if (totalBanners <= 1 || isPaused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    const intervalTime = Math.max(3500, settings.autoplayInterval || 5000);
    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalBanners);
    }, intervalTime);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [totalBanners, isPaused, settings.autoplayInterval]);

  // Intelligent background preloading of ONLY the immediate next slide
  useEffect(() => {
    if (totalBanners <= 1) return;
    const nextIndex = (currentIndex + 1) % totalBanners;
    const nextBanner = banners[nextIndex];
    if (nextBanner) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const nextImgSrc = isMobile
        ? (nextBanner.mobileImage || nextBanner.desktopImage)
        : nextBanner.desktopImage;
      const targetSrc = getVariant(nextImgSrc, isMobile ? 640 : 1200);
      const preloader = new Image();
      preloader.src = targetSrc;
    }
  }, [currentIndex, banners, totalBanners]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      triggerManualInteraction();
      return;
    }
    const distance = touchStart - touchEnd;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
    triggerManualInteraction();
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex] || banners[0];

  return (
    <section 
      ref={containerRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Lumière High Jewellery Showcase"
      className="relative w-full bg-gradient-to-b from-[#FBF9F4] via-[#F8F4EC] to-[#F5EFE4] overflow-hidden select-none focus:outline-none"
      onMouseEnter={() => settings.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => settings.pauseOnHover && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* DESKTOP EDITORIAL HERO */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 xl:gap-16 items-center min-h-[640px] max-h-[720px] py-12">
          
          <div className="lg:col-span-6 flex flex-col justify-center pr-2 z-10">
            
            <div 
              key={`eyebrow-${currentIndex}`}
              className="inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.25em] text-lumiere-gold uppercase mb-4 animate-fadeIn"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-lumiere-gold" />
              <span>{currentBanner.eyebrow || '22K BIS 916 GOLD'}</span>
            </div>

            <h1 
              key={`title-${currentIndex}`}
              className="font-serif text-[44px] xl:text-[54px] font-normal text-lumiere-text leading-[1.08] tracking-normal mb-5 whitespace-pre-line animate-slideUp"
            >
              {currentBanner.title}
            </h1>

            <p 
              key={`desc-${currentIndex}`}
              className="text-[15px] xl:text-[16px] text-lumiere-muted font-light leading-relaxed max-w-md mb-8 animate-fadeIn font-sans"
            >
              {currentBanner.description}
            </p>

            <div 
              key={`cta-${currentIndex}`}
              className="flex items-center gap-4 mb-10 animate-fadeIn"
            >
              <Link 
                to={currentBanner.primaryBtnLink || '/shop'} 
                className="btn-primary-indian rounded-none min-h-[48px] px-8 text-xs tracking-[0.14em] group shadow-sm"
              >
                <span>{currentBanner.primaryBtnText || 'SHOP COLLECTION'}</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              {currentBanner.secondaryBtnText && (
                <Link 
                  to={currentBanner.secondaryBtnLink || '/collections'} 
                  className="btn-secondary-indian rounded-none min-h-[48px] px-7 text-xs tracking-[0.14em] group"
                >
                  <span>{currentBanner.secondaryBtnText}</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-lumiere-border/60 text-xs text-lumiere-muted font-light">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-lumiere-gold" />
                <span>100% BIS 916 Hallmarked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-lumiere-gold" />
                <span>Insured Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-lumiere-gold" />
                <span>Lifetime Exchange</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full h-[520px] xl:h-[560px] overflow-hidden bg-lumiere-cream/40 border border-lumiere-border/60 shadow-[0_8px_30px_rgba(45,40,35,0.06)] group">
              
              <OptimizedImage
                key={`img-desktop-${currentIndex}`}
                src={currentBanner.desktopImage}
                alt={currentBanner.eyebrow + ' - ' + currentBanner.title}
                priority={currentIndex === 0}
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
                sizes="hero-desktop"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out animate-kenburns"
                containerClassName="w-full h-full"
                style={{ objectPosition: currentBanner.imagePosition || 'center 15%' }}
              />

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 border border-lumiere-border/50 text-center shadow-subtle">
                <span className="text-[9px] font-semibold text-lumiere-gold tracking-[0.2em] block uppercase">
                  {currentBanner.badgeText ? currentBanner.badgeText.split('·')[0].trim() : '22K GOLD'}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-2.5 py-1">
                0{currentIndex + 1} / 0{totalBanners}
              </div>

            </div>
          </div>

        </div>

        {/* MOBILE HERO */}
        <div className="lg:hidden flex flex-col pt-4 pb-8">
          
          <div className="relative w-full h-[320px] sm:h-[380px] overflow-hidden bg-lumiere-cream/40 border border-lumiere-border/60 mb-5 shadow-subtle">
            <OptimizedImage
              key={`img-mobile-${currentIndex}`}
              src={currentBanner.mobileImage || currentBanner.desktopImage}
              alt={currentBanner.eyebrow + ' - ' + currentBanner.title}
              priority={currentIndex === 0}
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
              sizes="hero-mobile"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
              style={{ objectPosition: currentBanner.imagePosition || 'center 15%' }}
            />

            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 border border-lumiere-border/50 text-left shadow-subtle">
              <span className="text-[9px] font-semibold text-lumiere-gold tracking-widest uppercase block">
                {currentBanner.badgeText || '22K BIS 916 GOLD'}
              </span>
            </div>
          </div>

          <div 
            key={`mob-eyebrow-${currentIndex}`}
            className="inline-flex items-center gap-1.5 mb-2 animate-fadeIn"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lumiere-gold" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-lumiere-gold uppercase">
              {currentBanner.eyebrow || '22K BIS 916 GOLD'}
            </span>
          </div>

          <h1 
            key={`mob-title-${currentIndex}`}
            className="font-serif text-[30px] sm:text-[36px] font-normal text-lumiere-text leading-tight mb-2.5 whitespace-pre-line animate-slideUp"
          >
            {currentBanner.title}
          </h1>

          <p 
            key={`mob-desc-${currentIndex}`}
            className="text-[14px] text-lumiere-muted font-light leading-relaxed mb-5 line-clamp-2 animate-fadeIn font-sans"
          >
            {currentBanner.description}
          </p>

          <div className="w-full mb-4">
            <Link 
              to={currentBanner.primaryBtnLink || '/shop'} 
              className="w-full h-[48px] bg-lumiere-deep hover:bg-lumiere-gold text-white font-medium text-xs tracking-[0.14em] uppercase flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
            >
              <span>{currentBanner.primaryBtnText || 'SHOP COLLECTION'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-lumiere-muted font-light">
            <span>✓ BIS 916 Hallmarked</span>
            <span>·</span>
            <span>✓ Insured Delivery</span>
            <span>·</span>
            <span>✓ Lifetime Exchange</span>
          </div>

        </div>

        {/* DESKTOP ARROWS & PAGINATION */}
        {totalBanners > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                prevSlide();
                triggerManualInteraction();
              }}
              aria-label="Previous banner"
              className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/70 hover:bg-white text-lumiere-text hover:text-lumiere-gold border border-lumiere-border/60 shadow-subtle backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => {
                nextSlide();
                triggerManualInteraction();
              }}
              aria-label="Next banner"
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center bg-white/70 hover:bg-white text-lumiere-text hover:text-lumiere-gold border border-lumiere-border/60 shadow-subtle backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>

            <div className="flex items-center justify-center gap-2 pb-5 pt-1">
              {banners.map((b, idx) => {
                const active = idx === currentIndex;
                return (
                  <button
                    key={b.id || idx}
                    type="button"
                    onClick={() => {
                      goToSlide(idx);
                      triggerManualInteraction();
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-[2px] transition-all duration-500 focus:outline-none ${
                      active ? 'w-8 bg-lumiere-gold' : 'w-3 bg-lumiere-border hover:bg-lumiere-gold/60'
                    }`}
                  />
                );
              })}
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default HeroCarousel;
"""

files = {
    'client/src/components/OptimizedImage.jsx': optimized_image_content,
    'client/src/components/ProductCard.jsx': product_card_content,
    'client/src/components/CategoryCard.jsx': category_card_content,
    'client/src/components/SectionHeading.jsx': section_heading_content,
    'client/src/components/HeroCarousel.jsx': hero_carousel_content,
}

for path, content in files.items():
    full_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', path))
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written {path}")

print("All components written successfully!")
