import os

# 1. Navbar.jsx
navbar_content = r"""import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jewellery', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'New Arrivals', path: '/shop?collection=New+Arrivals' },
    { name: 'Bridal', path: '/category/bridal' },
    { name: 'Occasions', path: '/shop?collection=Festival' },
    { name: 'Offers', path: '/shop?collection=Offers' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(45,40,35,0.04)] border-b border-lumiere-border/50 py-3 sm:py-3.5'
            : 'bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-lumiere-border/30 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* MOBILE HEADER */}
          <div className="flex lg:hidden items-center justify-between h-11">
            <button
              type="button"
              className="p-2 -ml-2 text-lumiere-text hover:text-lumiere-gold transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation"
            >
              <Menu size={22} strokeWidth={1.6} />
            </button>

            <div className="flex-1 text-center">
              <Link to="/" className="inline-block">
                <span className="font-serif text-xl sm:text-2xl font-normal tracking-[0.2em] text-lumiere-text uppercase">
                  LUMIÈRE
                </span>
                <span className="block text-[8px] tracking-[0.28em] text-lumiere-gold font-medium -mt-1 uppercase">
                  FINE JEWELLERY
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-1 -mr-1">
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-lumiere-text hover:text-lumiere-gold transition-colors"
                aria-label="Search"
              >
                <Search size={19} strokeWidth={1.6} />
              </button>

              <Link
                to="/wishlist"
                className="p-2 text-lumiere-text hover:text-lumiere-gold transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.6} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-lumiere-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="p-2 text-lumiere-text hover:text-lumiere-gold transition-colors relative"
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={19} strokeWidth={1.6} />
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 bg-lumiere-deep text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER: LEFT LOGO | CENTER NAV | RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center justify-between h-12">
            
            {/* LEFT: Logo */}
            <div className="flex items-center min-w-[200px]">
              <Link to="/" className="inline-block group">
                <span className="font-serif text-2xl xl:text-3xl font-normal tracking-[0.18em] text-lumiere-text uppercase group-hover:text-lumiere-gold transition-colors duration-300">
                  LUMIÈRE
                </span>
                <span className="block text-[8.5px] tracking-[0.3em] text-lumiere-gold font-medium uppercase -mt-0.5">
                  HAUTE JOAILLERIE
                </span>
              </Link>
            </div>

            {/* CENTER: Navigation Links with Growing Gold Underline */}
            <nav className="flex items-center gap-7 xl:gap-9 text-[12px] font-medium tracking-[0.14em] uppercase font-sans">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `group relative py-1.5 transition-colors duration-300 ${
                      isActive ? 'text-lumiere-gold font-semibold' : 'text-lumiere-text/90 hover:text-lumiere-gold'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {/* Growing Gold Underline */}
                      <span
                        className={`absolute bottom-0 left-0 h-[1.5px] bg-lumiere-gold transition-all duration-300 ease-out ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Search, Account, Wishlist, Cart */}
            <div className="flex items-center gap-5 xl:gap-6 min-w-[200px] justify-end">
              
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-lumiere-text hover:text-lumiere-gold transition-colors duration-300 group"
                aria-label="Search Collection"
              >
                <Search size={17} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
                <span className="hidden xl:inline text-[11px] font-medium tracking-widest">SEARCH</span>
              </button>

              <Link
                to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
                className="text-lumiere-text hover:text-lumiere-gold transition-colors p-1"
                aria-label="Account"
                title={user ? `Signed in as ${user.name || 'Patron'}` : 'Sign In'}
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              <Link
                to="/wishlist"
                className="text-lumiere-text hover:text-lumiere-gold transition-colors relative p-1"
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-lumiere-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="text-lumiere-text hover:text-lumiere-gold transition-colors relative p-1 flex items-center gap-1.5"
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span className="text-[11px] font-semibold tracking-wider font-sans">
                  ({totalCount})
                </span>
              </button>

            </div>

          </div>

        </div>
      </header>

      {/* MOBILE FULL-SCREEN SLIDE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm h-full bg-[#FDFBF7] shadow-drawer z-10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-lumiere-border/50 mb-6">
                <div>
                  <span className="font-serif text-xl font-normal tracking-[0.18em] text-lumiere-text uppercase block">
                    LUMIÈRE
                  </span>
                  <span className="text-[8px] tracking-[0.25em] text-lumiere-gold font-medium uppercase">
                    FINE JEWELLERY
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-lumiere-text hover:text-lumiere-gold"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-sm tracking-[0.16em] uppercase py-1.5 flex items-center justify-between transition-colors ${
                        isActive ? 'text-lumiere-gold font-semibold' : 'text-lumiere-text hover:text-lumiere-gold'
                      }`
                    }
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={14} className="text-lumiere-muted/60" />
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-lumiere-border/50 flex flex-col gap-3 text-xs tracking-wider uppercase text-lumiere-muted font-medium">
              <Link
                to={user ? '/account' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lumiere-text hover:text-lumiere-gold py-1"
              >
                <User size={15} />
                <span>{user ? 'My Account' : 'Sign In / Register'}</span>
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lumiere-text hover:text-lumiere-gold py-1"
              >
                <Heart size={15} />
                <span>Saved Wishlist ({wishlistCount})</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
"""

# 2. HeroCarousel.jsx
hero_carousel_content = r"""import React, { useState, useEffect, useRef, useCallback } from 'react';
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
"""

# 3. CategoryCard.jsx
category_card_content = r"""import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const CategoryCard = ({ title, count, image, link }) => {
  return (
    <Link
      to={link}
      className="group flex flex-col items-center text-center flex-shrink-0 cursor-pointer p-2 transition-all duration-300 select-none"
    >
      {/* Floating Circular Imagery with Gentle Hover Lift */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#FAF7F2] p-[2px] border border-lumiere-border/50 group-hover:border-lumiere-gold transition-all duration-500 group-hover:shadow-[0_12px_24px_rgba(181,138,69,0.14)] mb-3.5 sm:mb-4">
        <div className="w-full h-full rounded-full overflow-hidden">
          <OptimizedImage
            src={image}
            alt={title}
            sizes="category-avatar"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            containerClassName="w-full h-full rounded-full"
          />
        </div>
      </div>

      {/* Category Typography */}
      <div className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <h3 className="font-serif text-sm sm:text-base font-normal text-lumiere-text tracking-wide group-hover:text-lumiere-gold transition-colors duration-300">
          {title}
        </h3>

        {/* Expanding Gold Underline */}
        <div className="w-0 h-[1.5px] bg-lumiere-gold mt-1.5 transition-all duration-300 ease-out group-hover:w-8" />

        {count && (
          <span className="text-[10px] sm:text-[11px] text-lumiere-muted font-light tracking-wider mt-1 block font-sans">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
"""

# 4. ProductCard.jsx (Portrait 4:5, Zero Box Borders)
product_card_content = r"""import React, { useState } from 'react';
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
      {/* 1. PORTRAIT 4:5 PHOTOGRAPHY CANVAS (NOT SQUARE, ZERO BORDERS) */}
      <div className="relative aspect-[4/5] w-full bg-[#FAF7F2] overflow-hidden transition-all duration-500">
        
        {/* Subtle Tag */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1 pointer-events-none">
          {discountPercent && (
            <span className="text-[9px] font-semibold tracking-[0.14em] uppercase bg-white/95 text-lumiere-accent px-2 py-0.5 shadow-subtle">
              {discountPercent}% OFF
            </span>
          )}
          {product.bestseller && !discountPercent && (
            <span className="text-[9px] font-semibold tracking-[0.14em] uppercase bg-lumiere-gold text-white px-2 py-0.5 shadow-subtle">
              SIGNATURE
            </span>
          )}
        </div>

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-white text-lumiere-accent shadow-sm scale-105'
              : 'bg-white/80 text-lumiere-text hover:bg-white hover:text-lumiere-accent hover:scale-105 shadow-subtle backdrop-blur-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Wishlist"
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>

        {/* Product Imagery: Primary & Secondary Cross-fade */}
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
              alt={`${product.name} alternate`}
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

        {/* Floating Quick Action Overlay */}
        <div className="hidden sm:flex absolute bottom-3.5 left-3.5 right-3.5 gap-2 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex-1 bg-lumiere-deep hover:bg-lumiere-gold text-white text-[10.5px] font-semibold tracking-[0.16em] uppercase py-2.5 flex items-center justify-center gap-1.5 transition-colors duration-300 shadow-sm"
          >
            {addedAnimation ? (
              <>
                <Check size={13} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={13} /> Add to Bag
              </>
            )}
          </button>

          {onQuickView && (
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="w-10 bg-white/95 hover:bg-white text-lumiere-text hover:text-lumiere-gold text-[10.5px] py-2.5 flex items-center justify-center transition-colors duration-300 shadow-sm"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>

      </div>

      {/* 2. MINIMALIST PRODUCT INFORMATION */}
      <div className="pt-4 pb-1 flex flex-col flex-1">
        
        <span className="text-[10px] font-medium tracking-[0.2em] text-lumiere-gold uppercase mb-1 block font-sans">
          {product.category || product.material || '22K GOLD'}
        </span>

        <Link to={productUrl} className="block mb-1.5">
          <h3 className="font-serif text-[15px] sm:text-base font-normal text-lumiere-text leading-snug line-clamp-2 group-hover:text-lumiere-gold transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

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

# 5. SectionHeading.jsx
section_heading_content = r"""import React from 'react';

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isLeft = align === 'left';

  return (
    <div className={`mb-12 sm:mb-16 ${isLeft ? 'text-left' : 'text-center max-w-2xl mx-auto'} ${className}`}>
      {eyebrow && (
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-lumiere-gold block mb-2 font-sans">
          {eyebrow}
        </span>
      )}
      
      {title && (
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-lumiere-text tracking-tight leading-tight">
          {title}
        </h2>
      )}

      {/* Subtle gold divider */}
      <div className={`w-12 h-[1.5px] bg-lumiere-gold/60 mt-3.5 mb-4 ${isLeft ? '' : 'mx-auto'}`} />

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

# 6. Home.jsx (Complete Editorial Luxury Experience)
home_jsx_content = r"""import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Send,
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Award
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import CategoryCard from '../components/CategoryCard';
import SectionHeading from '../components/SectionHeading';
import OptimizedImage from '../components/OptimizedImage';
import { getProducts } from '../services/productService';

const defaultProducts = [
  {
    id: 'prod-1',
    _id: 'prod-1',
    name: 'Lakshmi Kasu Mala Gold Necklace',
    slug: 'lakshmi-kasu-mala-gold-necklace',
    price: 84500,
    compareAtPrice: 95000,
    category: 'Necklaces',
    material: '22K Gold',
    purity: '22K Gold | BIS 916',
    rating: 4.9,
    reviewsCount: 38,
    bestseller: true,
    newArrival: true,
    images: ['/assets/category_necklace.webp', '/assets/product_elan_1.webp'],
    sizes: ['16 inch', '18 inch', '20 inch']
  },
  {
    id: 'prod-2',
    _id: 'prod-2',
    name: 'Temple Nakshi Peacock Jhumkas',
    slug: 'temple-nakshi-peacock-jhumkas',
    price: 48900,
    compareAtPrice: 55000,
    category: 'Earrings',
    material: '22K Gold',
    purity: '22K Gold | BIS 916',
    rating: 5.0,
    reviewsCount: 44,
    bestseller: true,
    newArrival: true,
    images: ['/assets/category_earrings.webp', '/assets/bridal_campaign.webp'],
    sizes: ['Standard Drop (45mm)']
  },
  {
    id: 'prod-3',
    _id: 'prod-3',
    name: 'Padma Lotus Solitaire Diamond Ring',
    slug: 'padma-lotus-solitaire-diamond-ring',
    price: 42500,
    compareAtPrice: 48000,
    category: 'Rings',
    material: '18K Gold',
    purity: '18K Gold | IGI Diamond',
    rating: 4.8,
    reviewsCount: 29,
    bestseller: false,
    newArrival: true,
    images: ['/assets/product_celeste_1.webp', '/assets/product_celeste_2.webp'],
    sizes: ['Size 12', 'Size 14', 'Size 16', 'Size 18']
  },
  {
    id: 'prod-4',
    _id: 'prod-4',
    name: 'Gaja Lakshmi Temple Gold Pendant',
    slug: 'gaja-lakshmi-temple-gold-pendant',
    price: 26800,
    compareAtPrice: 30000,
    category: 'Pendants',
    material: '22K Gold',
    purity: '22K Gold | BIS 916',
    rating: 4.9,
    reviewsCount: 31,
    bestseller: true,
    newArrival: true,
    images: ['/assets/category_pendants.webp', '/assets/category_necklace.webp'],
    sizes: ['Pendant with Loop']
  },
  {
    id: 'prod-5',
    _id: 'prod-5',
    name: 'Heritage Antique Nakshi Gold Bangles',
    slug: 'heritage-antique-nakshi-gold-bangles',
    price: 112000,
    compareAtPrice: 125000,
    category: 'Bangles',
    material: '22K Gold',
    purity: '22K Gold | BIS 916',
    rating: 5.0,
    reviewsCount: 52,
    bestseller: true,
    newArrival: false,
    images: ['/assets/category_bangles.webp', '/assets/craftsmanship.webp'],
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)']
  },
  {
    id: 'prod-6',
    _id: 'prod-6',
    name: 'Suvarna Mugappu Gold Chain',
    slug: 'suvarna-mugappu-gold-chain',
    price: 32400,
    compareAtPrice: 36500,
    category: 'Chains',
    material: '22K Gold',
    purity: '22K Gold | BIS 916',
    rating: 4.8,
    reviewsCount: 23,
    bestseller: false,
    newArrival: true,
    images: ['/assets/category_chains.webp', '/assets/category_gold.webp'],
    sizes: ['20 inch', '22 inch', '24 inch']
  },
  {
    id: 'prod-7',
    _id: 'prod-7',
    name: 'Élan Antique Pearl Choker',
    slug: 'elan-antique-pearl-choker',
    price: 76900,
    compareAtPrice: 85000,
    category: 'Necklaces',
    material: '22K Gold',
    purity: '22K Gold | BIS 916',
    rating: 4.9,
    reviewsCount: 35,
    bestseller: true,
    newArrival: false,
    images: ['/assets/product_elan_1.webp', '/assets/product_elan_2.webp'],
    sizes: ['14 inch (Choker)', '16 inch']
  },
  {
    id: 'prod-8',
    _id: 'prod-8',
    name: 'Sitara Royal Polki Chandbalis',
    slug: 'sitara-royal-polki-chandbalis',
    price: 64000,
    compareAtPrice: 72000,
    category: 'Earrings',
    material: '22K Gold',
    purity: '22K Gold | Polki & Pearl',
    rating: 4.9,
    reviewsCount: 40,
    bestseller: true,
    newArrival: true,
    images: ['/assets/category_bridal.webp', '/assets/hero_campaign.webp'],
    sizes: ['Standard Drop (50mm)']
  }
];

const shopCategories = [
  { name: 'Rings', image: '/assets/product_celeste_1.webp', count: '48 Creations', link: '/shop?category=Rings' },
  { name: 'Earrings', image: '/assets/category_earrings.webp', count: '86 Creations', link: '/shop?category=Earrings' },
  { name: 'Necklaces', image: '/assets/category_necklace.webp', count: '64 Creations', link: '/shop?category=Necklaces' },
  { name: 'Bangles', image: '/assets/category_bangles.webp', count: '54 Creations', link: '/shop?category=Bangles' },
  { name: 'Chains', image: '/assets/category_chains.webp', count: '32 Creations', link: '/shop?category=Chains' },
  { name: 'Pendants', image: '/assets/category_pendants.webp', count: '40 Creations', link: '/shop?category=Pendants' },
];

const customerReviews = [
  {
    id: 1,
    name: 'Priya R.',
    city: 'Hyderabad',
    rating: 5,
    comment: "The Lakshmi Kasu Haram we bought for my daughter's wedding was the centerpiece of the ceremony. Flawless finishing and 100% BIS hallmarked.",
    item: 'Lakshmi Kasu Mala'
  },
  {
    id: 2,
    name: 'Lakshmi K.',
    city: 'Vijayawada',
    rating: 5,
    comment: 'The Nakshi peacock jhumkas look even better in real life than online. Prompt WhatsApp concierge and exquisite velvet packaging.',
    item: 'Temple Nakshi Jhumkas'
  },
  {
    id: 3,
    name: 'Sravani M.',
    city: 'Bengaluru',
    rating: 5,
    comment: 'Accurate gold certificate with clear breakdown of making charges. Safe 2-day insured courier to Bengaluru with tamper-proof seal.',
    item: 'Suvarna Mugappu Chain'
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const Home = () => {
  const { onQuickView } = useOutletContext() || {};
  const [products, setProducts] = useState(defaultProducts);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const categoryScrollRef = useRef(null);

  useEffect(() => {
    const loadApiProducts = async () => {
      try {
        const res = await getProducts({ limit: 12 });
        if (res && res.success && res.products && res.products.length > 0) {
          setProducts(res.products);
        }
      } catch (err) {
        // Fallback already present
      }
    };
    loadApiProducts();
  }, []);

  const handleCategoryScroll = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 4000);
      setNewsletterEmail('');
    }
  };

  const newArrivals = products.slice(0, 4);
  const bestsellers = products.length >= 8 ? products.slice(2, 6) : products.slice(0, 4);

  return (
    <div className="flex flex-col bg-[#FDFBF7] text-lumiere-text overflow-x-hidden">
      
      {/* 1. IMMERSIVE 85VH HERO CAROUSEL */}
      <HeroCarousel />

      {/* 2. MINIMALIST HORIZONTAL TRUST STRIP (NO BOXES) */}
      <section className="py-12 border-b border-lumiere-border/40 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-full bg-lumiere-gold/10 text-lumiere-gold flex items-center justify-center shrink-0">
                <Award size={16} strokeWidth={1.5} />
              </span>
              <div>
                <h4 className="font-serif text-sm font-medium text-lumiere-text uppercase">AUTHENTIC GOLD</h4>
                <p className="text-[11px] text-lumiere-muted font-light">100% BIS 916 Hallmarked</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-full bg-lumiere-gold/10 text-lumiere-gold flex items-center justify-center shrink-0">
                <Truck size={16} strokeWidth={1.5} />
              </span>
              <div>
                <h4 className="font-serif text-sm font-medium text-lumiere-text uppercase">SECURE DELIVERY</h4>
                <p className="text-[11px] text-lumiere-muted font-light">Fully Insured Courier</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-full bg-lumiere-gold/10 text-lumiere-gold flex items-center justify-center shrink-0">
                <RefreshCw size={16} strokeWidth={1.5} />
              </span>
              <div>
                <h4 className="font-serif text-sm font-medium text-lumiere-text uppercase">LIFETIME VALUE</h4>
                <p className="text-[11px] text-lumiere-muted font-light">Transparent Exchange</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <span className="w-8 h-8 rounded-full bg-lumiere-gold/10 text-lumiere-gold flex items-center justify-center shrink-0">
                <ShieldCheck size={16} strokeWidth={1.5} />
              </span>
              <div>
                <h4 className="font-serif text-sm font-medium text-lumiere-text uppercase">EXPERT CRAFT</h4>
                <p className="text-[11px] text-lumiere-muted font-light">Generational Karigars</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FLOATING CATEGORY SHOWCASE (NO CARDS, GENEROUS BREATHING ROOM) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="py-24 sm:py-32 bg-white border-b border-lumiere-border/30"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex items-end justify-between mb-12 sm:mb-16">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-lumiere-gold block mb-2 font-sans">
                CURATED REALMS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-lumiere-text tracking-tight">
                Shop by Category
              </h2>
            </div>

            <div className="hidden sm:flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleCategoryScroll('left')}
                className="w-10 h-10 rounded-full border border-lumiere-border/80 hover:border-lumiere-gold hover:text-lumiere-gold flex items-center justify-center transition-colors duration-300"
                aria-label="Previous categories"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => handleCategoryScroll('right')}
                className="w-10 h-10 rounded-full border border-lumiere-border/80 hover:border-lumiere-gold hover:text-lumiere-gold flex items-center justify-center transition-colors duration-300"
                aria-label="Next categories"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div
            ref={categoryScrollRef}
            className="flex sm:grid sm:grid-cols-3 md:grid-cols-6 gap-8 sm:gap-8 md:gap-10 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-4 -mx-6 px-6 sm:mx-0 sm:px-0"
          >
            {shopCategories.map((cat) => (
              <div key={cat.name} className="flex-shrink-0 w-[125px] sm:w-auto snap-start">
                <CategoryCard
                  title={cat.name}
                  count={cat.count}
                  image={cat.image}
                  link={cat.link}
                />
              </div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* 4. NEW ARRIVALS (PORTRAIT 4:5 RATIO, ZERO CARD BOXES) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="py-28 sm:py-36 bg-[#FDFBF7]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <SectionHeading
            eyebrow="AUTUMN / WINTER 2026"
            title="The New Arrivals"
            subtitle="Sculpted in 22-karat certified gold and solitaire diamonds, reflecting timeless South Indian geometry infused with modern grace."
          />

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-10 lg:gap-12 mb-16"
          >
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </motion.div>

          <div className="text-center">
            <Link
              to="/shop?collection=New+Arrivals"
              className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1.5 border-b-2 border-lumiere-text hover:border-lumiere-gold transition-all duration-300 group"
            >
              <span>DISCOVER ALL NEW ARRIVALS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </motion.section>

      {/* 5. FULL-WIDTH FEATURED COLLECTION (IMMERSIVE PHOTOGRAPHY) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="relative w-full h-[580px] lg:h-[680px] overflow-hidden bg-lumiere-deep flex items-center"
      >
        <OptimizedImage
          src="/assets/bridal_campaign.webp"
          alt="The Art of Timeless Gold"
          sizes="full"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-85 transition-transform duration-[8000ms] hover:scale-105"
          containerClassName="absolute inset-0 w-full h-full"
          style={{ objectPosition: 'center 20%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full">
          <div className="max-w-xl text-white">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-lumiere-gold-light block mb-4 font-sans">
              ATELIER SPOTLIGHT
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-tight mb-6">
              The Art of Timeless Gold
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed mb-8 max-w-md font-sans">
              An ode to eternal Indian bridal magnificence. Handcrafted temple nakshi harams, auspicious kasu malas, and regal jhumkas.
            </p>
            <Link
              to="/category/bridal"
              className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-white hover:text-lumiere-gold-light pb-1.5 border-b-2 border-white hover:border-lumiere-gold-light transition-all duration-300 group"
            >
              <span>DISCOVER THE BRIDAL COLLECTION</span>
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 6. SHOP BY OCCASION (ASYMMETRIC 4-IMAGE COMPOSITION, ZERO CARDS) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="py-28 sm:py-36 bg-white border-b border-lumiere-border/30"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <SectionHeading
            eyebrow="MOMENTS WORTH REMEMBERING"
            title="Shop by Occasion"
            subtitle="Curated suites crafted for sacred nuptials, radiant festival celebrations, and treasured milestones of life."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* 1. LARGE DOMINANT IMAGE: WEDDING (col 7) */}
            <Link
              to="/category/bridal"
              className="group lg:col-span-7 relative min-h-[460px] sm:min-h-[540px] lg:min-h-[640px] overflow-hidden bg-[#FAF7F2] flex flex-col justify-end p-8 sm:p-12 block"
            >
              <OptimizedImage
                src="/assets/category_bridal.webp"
                alt="Royal Wedding Edit"
                sizes="occasion-large"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                containerClassName="absolute inset-0 w-full h-full"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              <div className="relative z-10 text-white">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] text-lumiere-gold-light uppercase block mb-2 font-sans">
                  SACRED HEIRLOOMS
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-3 leading-tight">
                  The Wedding Edit
                </h3>
                <p className="text-xs sm:text-sm text-white/80 font-light max-w-md mb-5 line-clamp-2 font-sans">
                  Opulent Kasu Malas, temple harams, and handcrafted vaddanams designed for the quintessential South Indian bride.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-white group-hover:text-lumiere-gold-light transition-colors duration-300">
                  <span>Explore Bridal Edit</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            {/* 2. ASYMMETRIC RIGHT STACK: 2 MEDIUM + 1 SMALL */}
            <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
              
              {/* MEDIUM 1: FESTIVAL */}
              <Link
                to="/shop?collection=Festival"
                className="group relative min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] overflow-hidden bg-[#FAF7F2] flex flex-col justify-end p-7 sm:p-9 block"
              >
                <OptimizedImage
                  src="/assets/occasion_festival.webp"
                  alt="Auspicious Festive Gold"
                  sizes="occasion-small"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  containerClassName="absolute inset-0 w-full h-full"
                  style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                <div className="relative z-10 text-white">
                  <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.24em] text-lumiere-gold-light uppercase block mb-1 font-sans">
                    AUSPICIOUS FINERY
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-2">
                    Festive Celebrations
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-white/90 group-hover:text-lumiere-gold-light transition-colors duration-300">
                    <span>Discover Festive</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              {/* 2-COLUMN SPLIT: PARTY (Medium) & EVERYDAY (Small) */}
              <div className="grid grid-cols-2 gap-5 sm:gap-6 min-h-[240px] sm:min-h-[280px] lg:min-h-[300px]">
                
                {/* MEDIUM 2: PARTY */}
                <Link
                  to="/shop?collection=Party"
                  className="group relative h-full overflow-hidden bg-[#FAF7F2] flex flex-col justify-end p-5 sm:p-6 block"
                >
                  <OptimizedImage
                    src="/assets/hero_campaign.webp"
                    alt="Cocktail and Party Jewellery"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    containerClassName="absolute inset-0 w-full h-full"
                    style={{ objectPosition: 'center 15%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  
                  <div className="relative z-10 text-white">
                    <span className="text-[9px] font-medium tracking-widest text-lumiere-gold-light uppercase block mb-0.5 font-sans">
                      SOLITAIRES
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-white mb-1">
                      Party Edit
                    </h3>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/80 group-hover:text-white">
                      Explore →
                    </span>
                  </div>
                </Link>

                {/* SMALL 1: EVERYDAY */}
                <Link
                  to="/shop?collection=Everyday"
                  className="group relative h-full overflow-hidden bg-[#FAF7F2] flex flex-col justify-end p-5 sm:p-6 block"
                >
                  <OptimizedImage
                    src="/assets/category_everyday.webp"
                    alt="Everyday Minimal Gold"
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    containerClassName="absolute inset-0 w-full h-full"
                    style={{ objectPosition: 'center 20%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  
                  <div className="relative z-10 text-white">
                    <span className="text-[9px] font-medium tracking-widest text-lumiere-gold-light uppercase block mb-0.5 font-sans">
                      MINIMALIST
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-white mb-1">
                      Daily Wear
                    </h3>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/80 group-hover:text-white">
                      Explore →
                    </span>
                  </div>
                </Link>

              </div>

            </div>

          </div>

        </div>
      </motion.section>

      {/* 7. BRAND STORY — "THE ART OF LUMIÈRE" (SPLIT COMPOSITION) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="py-28 sm:py-36 bg-[#F8F4EC]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left: Oversized Portrait Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden shadow-[0_16px_40px_rgba(45,40,35,0.08)] bg-white">
                <OptimizedImage
                  src="/assets/craftsmanship.webp"
                  alt="The Art of Lumière Karigar Atelier"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>
            </div>

            {/* Right: Story Typography */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-lumiere-gold block mb-3 font-sans">
                ATELIER HERITAGE
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-lumiere-text leading-tight mb-8">
                The Art of Lumière
              </h2>
              <p className="text-sm sm:text-base text-lumiere-muted font-light leading-relaxed mb-6 max-w-lg font-sans">
                Founded on the belief that sacred jewellery should be timeless by design, Lumière harmonizes ancestral temple Nakshi craftsmanship with contemporary ergonomic silhouettes.
              </p>
              <p className="text-sm sm:text-base text-lumiere-muted font-light leading-relaxed mb-10 max-w-lg font-sans">
                Every motif, gemstone pavé, and 22K hallmarked gold link is sculpted by generational master karigars to be treasured for lifetimes.
              </p>

              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1.5 border-b-2 border-lumiere-text hover:border-lumiere-gold transition-all duration-300 group"
                >
                  <span>DISCOVER OUR STORY</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </motion.section>

      {/* 8. SIGNATURE BESTSELLERS (SPACIOUS EDITORIAL GRID) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="py-28 sm:py-36 bg-[#FDFBF7]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <SectionHeading
            eyebrow="SIGNATURE CREATIONS"
            title="Patron Favourites"
            subtitle="Our most coveted 22K gold harams, nakshi jhumkas, and certified solitaire diamond rings celebrated across generations."
          />

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-10 lg:gap-12 mb-16"
          >
            {bestsellers.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </motion.div>

          <div className="text-center">
            <Link
              to="/shop?bestseller=true"
              className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1.5 border-b-2 border-lumiere-text hover:border-lumiere-gold transition-all duration-300 group"
            >
              <span>EXPLORE ALL BESTSELLERS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </motion.section>

      {/* 9. PATRON TESTIMONIALS (EDITORIAL QUOTES) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="py-24 sm:py-32 bg-white border-t border-lumiere-border/30"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <SectionHeading
            eyebrow="HEIRLOOMS CHERISHED"
            title="Patron Testimonials"
            subtitle="Reflections from patrons who have entrusted Lumière with their most auspicious milestones."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between p-8 bg-[#FAF8F5] border border-lumiere-border/30"
              >
                <div>
                  <div className="flex items-center gap-1 text-lumiere-gold mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-lumiere-gold" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-lumiere-text font-serif italic leading-relaxed mb-8">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-5 border-t border-lumiere-border/40 flex items-center justify-between text-xs font-sans">
                  <div>
                    <strong className="font-serif text-sm font-medium text-lumiere-text block">
                      {rev.name}
                    </strong>
                    <span className="text-lumiere-muted text-[11px] font-light">{rev.city} · Verified Patron</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-lumiere-gold font-medium">
                    {rev.item}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* 10. PRIVILEGED PATRONS NEWSLETTER */}
      <section className="py-24 bg-lumiere-deep text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lumiere-gold block mb-3 font-sans">
            THE PRIVILEGED CIRCLE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal uppercase mb-4 text-white">
            Stay in the Loop
          </h2>
          <p className="text-xs sm:text-sm text-lumiere-cream/70 font-light max-w-md mx-auto mb-9 leading-relaxed font-sans">
            Receive private salon previews, festival heritage updates, and invitations to bespoke jewellery unveilings.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full sm:flex-1 bg-white/5 border border-white/20 text-white text-xs px-5 py-3.5 min-h-[48px] placeholder:text-white/40 focus:outline-none focus:border-lumiere-gold transition-colors font-sans"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-lumiere-gold hover:bg-lumiere-gold-dark text-white text-xs font-medium px-8 py-3.5 min-h-[48px] uppercase tracking-[0.16em] transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              <span>SUBSCRIBE</span>
              <Send size={13} />
            </button>
          </form>

          {newsletterSuccess && (
            <div className="mt-4 text-xs font-medium text-lumiere-gold animate-fadeIn font-sans">
              ✓ Thank you for subscribing to Lumière Atelier updates.
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
"""

# Write all files
components_map = {
    'client/src/components/Navbar.jsx': navbar_content,
    'client/src/components/HeroCarousel.jsx': hero_carousel_content,
    'client/src/components/CategoryCard.jsx': category_card_content,
    'client/src/components/ProductCard.jsx': product_card_content,
    'client/src/components/SectionHeading.jsx': section_heading_content,
    'client/src/pages/Home.jsx': home_jsx_content,
}

for rel_path, code in components_map.items():
    full_p = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', rel_path))
    with open(full_p, 'w', encoding='utf-8') as fh:
        fh.write(code)
    print(f"Successfully updated {rel_path}")

print("Master redesign files written successfully!")
