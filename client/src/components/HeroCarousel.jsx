import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveBanners, getCarouselSettings } from '../services/bannerService';
import OptimizedImage from './OptimizedImage';
import { getVariant } from '../utils/imageHelpers';

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
    setTimeout(() => setIsAnimating(false), 700);
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
    }, settings.resumeDelay || 7000);
  }, [settings.resumeDelay]);

  // Autoplay
  useEffect(() => {
    if (totalBanners <= 1 || isPaused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    const intervalTime = Math.max(4000, settings.autoplayInterval || 5500);
    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalBanners);
    }, intervalTime);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [totalBanners, isPaused, settings.autoplayInterval]);

  // Preload immediate next slide in background
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
      className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex items-center bg-[#F9F6F0] overflow-hidden select-none focus:outline-none"
      onMouseEnter={() => settings.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => settings.pauseOnHover && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* IMMERSIVE BACKGROUND PHOTOGRAPHY (Extends Edge-to-Edge) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {banners.map((b, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={b.id || idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <OptimizedImage
                src={b.desktopImage}
                alt={b.eyebrow + ' - ' + b.title}
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
                sizes="hero-desktop"
                className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                containerClassName="w-full h-full"
                style={{ objectPosition: b.imagePosition || 'center 20%' }}
              />
              {/* Refined editorial vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/65 to-black/20 lg:from-[#FDFBF7]/90 lg:via-[#FDFBF7]/40 lg:to-transparent" />
            </div>
          );
        })}
      </div>

      {/* EDITORIAL CONTENT OVERLAY (Spacious, Large Serif Typography) */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full py-16 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          
          {/* Eyebrow */}
          <div 
            key={`eyebrow-${currentIndex}`}
            className="inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-lumiere-gold uppercase mb-5 animate-fadeIn font-sans"
          >
            <span className="w-2 h-[1px] bg-lumiere-gold" />
            <span>{currentBanner.eyebrow || 'THE ROYAL HERITAGE EDIT'}</span>
          </div>

          {/* Large Serif Headline */}
          <h1 
            key={`title-${currentIndex}`}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-lumiere-text leading-[1.06] tracking-tight mb-6 whitespace-pre-line animate-slideUp"
          >
            {currentBanner.title}
          </h1>

          {/* Description */}
          <p 
            key={`desc-${currentIndex}`}
            className="text-sm sm:text-base text-lumiere-muted/90 font-light leading-relaxed max-w-md mb-9 animate-fadeIn font-sans"
          >
            {currentBanner.description}
          </p>

          {/* Editorial CTAs */}
          <div 
            key={`cta-${currentIndex}`}
            className="flex flex-wrap items-center gap-6 animate-fadeIn"
          >
            <Link 
              to={currentBanner.primaryBtnLink || '/shop'} 
              className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1.5 border-b-2 border-lumiere-text hover:border-lumiere-gold transition-all duration-300 group"
            >
              <span>{currentBanner.primaryBtnText || 'SHOP COLLECTION'}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            {currentBanner.secondaryBtnText && (
              <Link 
                to={currentBanner.secondaryBtnLink || '/collections'} 
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-lumiere-muted hover:text-lumiere-text pb-1.5 border-b border-transparent hover:border-lumiere-text transition-all duration-300"
              >
                <span>{currentBanner.secondaryBtnText}</span>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* MINIMALIST CONTROLS & PROGRESS INDICATORS */}
      {totalBanners > 1 && (
        <div className="absolute bottom-8 right-6 lg:right-16 z-30 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              prevSlide();
              triggerManualInteraction();
            }}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-lumiere-text/30 hover:border-lumiere-gold text-lumiere-text hover:text-lumiere-gold flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  goToSlide(idx);
                  triggerManualInteraction();
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-[2px] transition-all duration-500 ${
                  idx === currentIndex ? 'w-8 bg-lumiere-gold' : 'w-2 bg-lumiere-text/30 hover:bg-lumiere-gold/60'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              nextSlide();
              triggerManualInteraction();
            }}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full border border-lumiere-text/30 hover:border-lumiere-gold text-lumiere-text hover:text-lumiere-gold flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
