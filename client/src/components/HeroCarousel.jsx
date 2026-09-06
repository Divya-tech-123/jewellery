import React, { useState, useEffect, useRef, useCallback } from 'react';
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
