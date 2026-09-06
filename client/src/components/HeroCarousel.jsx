import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Pause,
  Play
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

  // Subscribe to banner & settings changes dynamically (from Admin panel updates)
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
    setTimeout(() => setIsAnimating(false), 600);
  }, [totalBanners, isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [goToSlide, currentIndex]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [goToSlide, currentIndex]);

  // Pause and temporary resume delay on manual interaction
  const triggerManualInteraction = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, settings.resumeDelay || 5000);
  }, [settings.resumeDelay]);

  // Handle automatic rotation
  useEffect(() => {
    if (totalBanners <= 1 || isPaused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    const intervalTime = Math.max(3000, settings.autoplayInterval || 4500);
    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalBanners);
    }, intervalTime);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [totalBanners, isPaused, settings.autoplayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (containerRef.current && containerRef.current.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
          triggerManualInteraction();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
          triggerManualInteraction();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, triggerManualInteraction]);

  // Preload next carousel slide image in background for instant seamless transitions
  useEffect(() => {
    if (totalBanners <= 1) return;
    const nextIndex = (currentIndex + 1) % totalBanners;
    const nextBanner = banners[nextIndex];
    if (nextBanner) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const nextImgSrc = isMobile
        ? (nextBanner.mobileImage || nextBanner.desktopImage)
        : nextBanner.desktopImage;
      const normalized = toWebp(nextImgSrc);
      const preloader = new Image();
      preloader.src = normalized;
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
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    triggerManualInteraction();
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex] || banners[0];

  // Theme styling helpers
  const getThemePillClass = (theme) => {
    switch (theme) {
      case 'bridal-crimson':
        return 'text-rose-900 border-rose-200/80 bg-rose-50/70';
      case 'festive-maroon':
        return 'text-amber-950 border-amber-300/80 bg-amber-50/80';
      case 'luxury-offer':
        return 'text-amber-900 border-amber-300/90 bg-amber-50/90';
      default:
        return 'text-lumiere-gold border-lumiere-border bg-lumiere-cream/40';
    }
  };

  const getThemeGradient = (theme) => {
    switch (theme) {
      case 'bridal-crimson':
        return 'from-[#FCF7F3] via-[#FAF4ED] to-[#F8F2E8]';
      case 'festive-maroon':
        return 'from-[#FAF4EB] via-[#F8F2E6] to-[#F5EEDF]';
      case 'luxury-offer':
        return 'from-[#FDFBF7] via-[#F8F4EC] to-[#F3EDE2]';
      default:
        return 'from-[#F9F5EE] via-[#F8F4EC] to-[#F4EFE6]';
    }
  };

  return (
    <section 
      ref={containerRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Promotional Jewellery Campaigns"
      className="relative w-full bg-lumiere-bg border-b border-lumiere-border/70 overflow-hidden select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-lumiere-gold"
      onMouseEnter={() => settings.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => settings.pauseOnHover && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Accent Ambient Glow */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getThemeGradient(currentBanner.theme)} transition-colors duration-700 ease-smooth`} />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            DESKTOP CAROUSEL VIEW (Height: 650–720px, Split 45% Text / 55% Image)
            ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 items-center min-h-[650px] max-h-[720px] py-10">
          
          {/* Left Column: Text Content & Actions (~45-50% width) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center pr-4 xl:pr-6 z-10">
            
            {/* 1. Eyebrow / Collection Tag with Gold Dot */}
            <div 
              key={`eyebrow-${currentIndex}`}
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-lumiere-gold uppercase mb-3 animate-fadeIn"
            >
              <span className="w-2 h-2 rounded-full bg-lumiere-gold animate-pulse" />
              <span>{currentBanner.eyebrow || '22K BIS 916 GOLD'}</span>
            </div>

            {/* 2. Main Title */}
            <h1 
              key={`title-${currentIndex}`}
              className="font-serif text-[42px] xl:text-[52px] font-bold text-lumiere-text leading-[1.08] tracking-tight mb-4 uppercase whitespace-pre-line animate-slideUp"
            >
              {currentBanner.title}
            </h1>

            {/* 3. Description */}
            <p 
              key={`desc-${currentIndex}`}
              className="text-[15px] xl:text-base text-lumiere-muted font-normal leading-relaxed max-w-lg mb-8 animate-fadeIn"
            >
              {currentBanner.description}
            </p>

            {/* 4. Action Buttons */}
            <div 
              key={`cta-${currentIndex}`}
              className="flex items-center gap-4 mb-8 animate-fadeIn"
            >
              <Link 
                to={currentBanner.primaryBtnLink || '/shop'} 
                className="btn-primary-indian shadow-sm min-h-[48px] px-7 rounded-md group"
              >
                <span>{currentBanner.primaryBtnText || 'SHOP COLLECTION'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {currentBanner.secondaryBtnText && (
                <Link 
                  to={currentBanner.secondaryBtnLink || '/collections'} 
                  className="btn-secondary-indian min-h-[48px] px-6 rounded-md group"
                >
                  <span>{currentBanner.secondaryBtnText}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* 5. Trust Badges Checkline */}
            <div className="flex items-center gap-6 pt-6 border-t border-lumiere-border/80 text-xs text-lumiere-muted font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-lumiere-gold" />
                <span>100% BIS 916 Hallmarked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-lumiere-gold" />
                <span>Free Insured Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-lumiere-gold" />
                <span>Lifetime Exchange</span>
              </div>
            </div>

          </div>

          {/* Right Column: Large Jewellery Image Focus (~50–55% width) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center">
            
            {/* Visual Frame & Shadow */}
            <div className="relative w-full h-[540px] xl:h-[580px] rounded-lg overflow-hidden bg-lumiere-cream border border-lumiere-border shadow-elevated group">
              
              {/* Animated Banner Image */}
              <OptimizedImage
                key={`img-desktop-${currentIndex}`}
                src={currentBanner.desktopImage}
                alt={currentBanner.eyebrow + ' - ' + currentBanner.title.replace('\n', ' ')}
                priority={currentIndex === 0}
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
                sizes="hero-desktop"
                className="w-full h-full object-cover transition-all duration-700 ease-out animate-kenburns"
                containerClassName="w-full h-full"
                style={{ objectPosition: currentBanner.imagePosition || 'center 15%' }}
              />

              {/* Top/Bottom Subtle Gradient Shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />

              {/* Floating 22K Gold Authenticity Badge */}
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3.5 py-2 border border-lumiere-border shadow-sm text-center rounded">
                <span className="text-[10px] font-bold text-lumiere-gold tracking-[0.16em] block uppercase">
                  {currentBanner.badgeText ? currentBanner.badgeText.split('·')[0].trim() : '22K GOLD'}
                </span>
                <span className="text-[9px] text-lumiere-text font-semibold uppercase tracking-wider block mt-0.5">
                  {currentBanner.badgeText && currentBanner.badgeText.includes('·') 
                    ? currentBanner.badgeText.split('·')[1].trim() 
                    : 'BIS 916 CERTIFIED'}
                </span>
              </div>

              {/* Slide Counter Overlay */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono tracking-widest px-2.5 py-1 rounded">
                0{currentIndex + 1} / 0{totalBanners}
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            MOBILE CAROUSEL VIEW (Stacked Banner Layout: Dominant Image Top, Content Below)
            Max Height ~600–700px
            ========================================================================= */}
        <div className="lg:hidden flex flex-col pt-3 pb-6">
          
          {/* 1. Mobile Jewellery Image Dominant Section (~310–340px) */}
          <div className="relative w-full h-[310px] sm:h-[350px] overflow-hidden bg-lumiere-cream border border-lumiere-border rounded-lg shadow-sm mb-4">
            
            <OptimizedImage
              key={`img-mobile-${currentIndex}`}
              src={currentBanner.mobileImage || currentBanner.desktopImage}
              alt={currentBanner.eyebrow + ' - ' + currentBanner.title.replace('\n', ' ')}
              priority={currentIndex === 0}
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
              sizes="hero-mobile"
              className="w-full h-full object-cover transition-all duration-500 ease-out"
              containerClassName="w-full h-full"
              style={{ objectPosition: currentBanner.imagePosition || 'center 15%' }}
            />

            {/* Mobile Image Badge */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 border border-lumiere-border rounded shadow-sm text-left leading-tight">
              <span className="text-[10px] font-bold text-lumiere-gold tracking-wider uppercase block">
                {currentBanner.badgeText || '22K GOLD · BIS 916'}
              </span>
              <span className="text-[8.5px] font-medium text-lumiere-muted uppercase block">
                AUTHENTIC SOUTH INDIAN CRAFT
              </span>
            </div>

            {/* Mobile Slide Badge */}
            <div className="absolute top-3 right-3 bg-black/55 backdrop-blur-sm text-white text-[9px] font-mono tracking-wider px-2 py-0.5 rounded">
              0{currentIndex + 1} / 0{totalBanners}
            </div>

          </div>

          {/* 2. Collection Eyebrow Label */}
          <div 
            key={`mob-eyebrow-${currentIndex}`}
            className="inline-flex items-center gap-1.5 mb-1.5 animate-fadeIn"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lumiere-gold" />
            <span className="text-xs font-bold tracking-wider text-lumiere-gold uppercase">
              {currentBanner.eyebrow || '22K BIS 916 GOLD'}
            </span>
          </div>

          {/* 3. Mobile Heading */}
          <h1 
            key={`mob-title-${currentIndex}`}
            className="font-serif text-[28px] xs:text-[32px] sm:text-[36px] font-bold text-lumiere-text leading-tight tracking-tight mb-2 uppercase whitespace-pre-line animate-slideUp"
          >
            {currentBanner.title}
          </h1>

          {/* 4. Mobile Description */}
          <p 
            key={`mob-desc-${currentIndex}`}
            className="text-[14px] text-lumiere-muted font-normal leading-relaxed mb-4 line-clamp-2 animate-fadeIn"
          >
            {currentBanner.description}
          </p>

          {/* 5. Mobile Primary CTA (Strictly 48px height, touch-friendly) */}
          <div className="w-full">
            <Link 
              to={currentBanner.primaryBtnLink || '/shop'} 
              className="w-full h-[48px] bg-lumiere-deep hover:bg-lumiere-gold-dark text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 rounded-md transition-colors shadow-sm active:scale-[0.99]"
            >
              <span>{currentBanner.primaryBtnText || 'SHOP COLLECTION'}</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* 6. Mobile Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-3.5 text-xs text-lumiere-muted font-medium">
            <div className="flex items-center gap-1">
              <span className="text-lumiere-gold font-bold">✓</span>
              <span>BIS 916 Hallmarked</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lumiere-gold font-bold">✓</span>
              <span>Insured Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lumiere-gold font-bold">✓</span>
              <span>Lifetime Exchange</span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            CAROUSEL CONTROLS: Desktop Arrows, Pagination Dots & Autoplay Indicator
            ========================================================================= */}
        
        {/* Desktop Side Arrows (Subtle overlay, min 44px touch targets) */}
        {totalBanners > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                prevSlide();
                triggerManualInteraction();
              }}
              aria-label="Previous promotional banner"
              className="hidden lg:flex absolute left-2 xl:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center bg-white/80 hover:bg-white text-lumiere-text hover:text-lumiere-gold border border-lumiere-border shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              <ChevronLeft size={22} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={() => {
                nextSlide();
                triggerManualInteraction();
              }}
              aria-label="Next promotional banner"
              className="hidden lg:flex absolute right-2 xl:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center bg-white/80 hover:bg-white text-lumiere-text hover:text-lumiere-gold border border-lumiere-border shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              <ChevronRight size={22} strokeWidth={1.8} />
            </button>
          </>
        )}

        {/* Pagination Dots (● ○ ○ ○) */}
        {totalBanners > 1 && (
          <div className="flex items-center justify-center gap-2.5 pb-4 pt-1 sm:pb-5">
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
                  aria-label={`Go to slide ${idx + 1}: ${b.eyebrow || b.title}`}
                  aria-current={active ? 'true' : 'false'}
                  className={`h-2.5 rounded-full transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-lumiere-gold ${
                    active 
                      ? 'w-8 bg-lumiere-gold' 
                      : 'w-2.5 bg-lumiere-border hover:bg-lumiere-gold/50'
                  }`}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default HeroCarousel;
