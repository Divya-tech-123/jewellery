import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveBanners, getCarouselSettings } from '../services/bannerService';
import OptimizedImage from './OptimizedImage';
import { getVariant } from '../utils/imageHelpers';

const HeroCarousel = () => {
  const [banners, setBanners] = useState(() => getActiveBanners().slice(0, 3));
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
      const active = getActiveBanners().slice(0, 3);
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
    }, settings.resumeDelay || 6000);
  }, [settings.resumeDelay]);

  // Autoplay
  useEffect(() => {
    if (totalBanners <= 1 || isPaused) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    const intervalTime = Math.max(4000, settings.autoplayInterval || 5000);
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
      className="relative w-full h-[calc(100dvh-158px)] min-h-[500px] max-h-[720px] lg:h-[calc(100vh-104px)] lg:min-h-[600px] lg:max-h-[780px] bg-[#FAF7F2] overflow-hidden select-none focus:outline-none flex flex-col lg:flex-row border-b border-[#EADBCE]/80"
      onMouseEnter={() => settings.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => settings.pauseOnHover && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* =========================================================================
          DESKTOP & MOBILE TEXT CONTENT PANEL
          Dedicated clean ivory/champagne luxury canvas with zero model obstruction
          ========================================================================= */}
      <div className="order-2 lg:order-1 w-full lg:w-[48%] xl:w-[45%] h-[48%] sm:h-[46%] lg:h-full bg-gradient-to-b lg:bg-gradient-to-r from-[#FAF7F2] via-[#F7F2EA] to-[#FAF7F2] flex flex-col justify-between px-6 py-5 sm:px-8 sm:py-6 lg:px-14 xl:px-20 lg:py-16 relative z-20">
        
        {/* TOP / MAIN EDITORIAL CONTENT */}
        <div className="my-auto">
          {/* Eyebrow / Small label */}
          <div 
            key={`eyebrow-${currentIndex}`}
            className="inline-flex items-center gap-2.5 text-[10.5px] sm:text-[11px] font-semibold tracking-[0.26em] text-[#A88438] uppercase mb-2 sm:mb-3 lg:mb-4 animate-fadeIn"
          >
            <span className="w-4 sm:w-6 h-[1px] bg-[#C5A059]" />
            <span>{currentBanner.eyebrow || 'NEW COLLECTION'}</span>
          </div>

          {/* Heading in Elegant Serif Typography */}
          <h1 
            key={`title-${currentIndex}`}
            className="font-serif text-2xl sm:text-3xl lg:text-[50px] xl:text-[58px] font-normal text-[#231F1C] leading-[1.1] lg:leading-[1.08] tracking-tight mb-2.5 sm:mb-3 lg:mb-5 animate-slideUp uppercase"
          >
            {currentBanner.title}
          </h1>

          {/* Description */}
          <p 
            key={`desc-${currentIndex}`}
            className="text-xs sm:text-sm lg:text-[15px] text-[#635B52] font-light leading-relaxed max-w-xs sm:max-w-md mb-4 sm:mb-5 lg:mb-8 animate-fadeIn line-clamp-2 sm:line-clamp-none"
          >
            {currentBanner.description}
          </p>

          {/* CTA Button */}
          <div 
            key={`cta-${currentIndex}`}
            className="flex items-center gap-4 animate-fadeIn"
          >
            <Link 
              to={currentBanner.primaryBtnLink || '/shop'} 
              className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 sm:px-7 sm:py-3.5 text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#231F1C] hover:text-[#FAF8F5] bg-transparent hover:bg-[#231F1C] border border-[#C5A059] transition-all duration-300 group"
            >
              <span>{currentBanner.primaryBtnText || 'EXPLORE COLLECTION →'}</span>
            </Link>
          </div>
        </div>

        {/* BOTTOM CONTROLS & MINIMAL 01 / 02 / 03 INDICATORS */}
        <div className="pt-3 sm:pt-4 lg:pt-6 border-t border-[#EADBCE]/80 flex items-center justify-between">
          
          {/* Minimal 01 / 02 / 03 Indicators */}
          <div className="flex items-center gap-4 sm:gap-6">
            {banners.map((_, idx) => {
              const num = `0${idx + 1}`;
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    goToSlide(idx);
                    triggerManualInteraction();
                  }}
                  aria-label={`Go to slide ${num}`}
                  className="group flex items-center gap-2 py-1 text-left transition-colors duration-300"
                >
                  <span 
                    className={`font-serif text-xs sm:text-sm tracking-widest transition-colors duration-300 ${
                      isActive ? 'text-[#231F1C] font-semibold' : 'text-[#A09587] group-hover:text-[#635B52]'
                    }`}
                  >
                    {num}
                  </span>
                  <span 
                    className={`block h-[1.5px] transition-all duration-500 ${
                      isActive 
                        ? 'w-6 sm:w-10 bg-[#C5A059]' 
                        : 'w-2.5 sm:w-4 bg-[#DCD2C3] group-hover:bg-[#C5A059]/60'
                    }`} 
                  />
                </button>
              );
            })}
          </div>

          {/* Minimal Side Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                prevSlide();
                triggerManualInteraction();
              }}
              aria-label="Previous slide"
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-[#DCD2C3] hover:border-[#C5A059] text-[#4A4238] hover:text-[#C5A059] flex items-center justify-center transition-all duration-300"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => {
                nextSlide();
                triggerManualInteraction();
              }}
              aria-label="Next slide"
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-[#DCD2C3] hover:border-[#C5A059] text-[#4A4238] hover:text-[#C5A059] flex items-center justify-center transition-all duration-300"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          LARGE HIGH-QUALITY JEWELLERY / MODEL IMAGE VISUAL
          Unobstructed model face and jewellery with subtle zoom & fade transition
          ========================================================================= */}
      <div className="order-1 lg:order-2 w-full lg:w-[52%] xl:w-[55%] h-[52%] sm:h-[54%] lg:h-full relative overflow-hidden bg-[#F5EFE6] border-b lg:border-b-0 lg:border-l border-[#EADBCE]/80">
        {banners.map((b, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={b.id || idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <OptimizedImage
                src={b.desktopImage}
                alt={b.eyebrow + ' - ' + b.title}
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
                sizes="hero-desktop"
                className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                containerClassName="w-full h-full"
                style={{ objectPosition: b.imagePosition || 'center 15%' }}
              />
              {/* Subtle luxury edge vignette */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#231F1C]/15 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#FAF7F2]/40 lg:via-transparent lg:to-transparent" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HeroCarousel;
