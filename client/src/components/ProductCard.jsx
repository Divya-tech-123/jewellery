import React, { useState } from 'react';
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
