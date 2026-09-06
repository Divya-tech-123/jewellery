import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const prodId = String(product._id || product.id || product.slug);
  const isWishlisted = isInWishlist(prodId);
  const productIdentifier = product.slug || product.id || product._id;
  const productUrl = `/product/${productIdentifier}`;

  const primaryImg = product.images && product.images.length > 0 ? product.images[0] : '/assets/category_necklace.jpg';

  const handleCardClick = (e) => {
    // If click was triggered on an interactive element or link, let native behavior take place
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

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white border border-lumiere-border/80 transition-all duration-300 hover:border-lumiere-gold hover:shadow-[0_4px_16px_rgba(45,40,35,0.08)] cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square sm:aspect-[1/1.05] bg-[#F9F7F2] overflow-hidden">
        {/* Badges (Discount or Bestseller) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {discountPercent && (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-lumiere-accent text-white px-2 py-0.5 rounded-none shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
          {product.bestseller && (
            <span className="text-[9px] font-bold tracking-wider uppercase bg-lumiere-gold text-white px-1.5 py-0.5">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isWishlisted
              ? 'bg-white text-lumiere-accent shadow-sm scale-105'
              : 'bg-white/90 text-lumiere-text hover:bg-white hover:text-lumiere-accent hover:scale-105 shadow-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.8} />
        </button>

        {/* Product Image with Hover Zoom */}
        <Link to={productUrl} className="block w-full h-full">
          <img
            src={primaryImg}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Quick Add to Cart Button (Desktop hover overlay) */}
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full bg-lumiere-deep hover:bg-lumiere-gold text-white text-[11px] font-semibold tracking-wider uppercase py-2 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            {addedAnimation ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Material & Purity */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-lumiere-gold-dark font-medium uppercase tracking-wide mb-1">
            <span>{product.material || '22K Gold'}</span>
            {product.rating && (
              <span className="flex items-center gap-0.5 text-lumiere-text text-[10px] font-semibold bg-lumiere-cream/60 px-1.5 py-0.5">
                <Star size={10} className="fill-lumiere-gold text-lumiere-gold" />
                {product.rating}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={productUrl} className="block">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-lumiere-text leading-snug line-clamp-2 hover:text-lumiere-gold transition-colors mb-1.5">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Mobile Add to Cart */}
        <div className="pt-2 border-t border-lumiere-border/60 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-lumiere-text font-sans">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-[11px] sm:text-xs text-lumiere-muted line-through font-sans">
                  ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] text-lumiere-muted block font-sans">Inc. of all taxes</span>
          </div>

          {/* Mobile Tap-friendly Add Button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="sm:hidden w-8 h-8 rounded bg-lumiere-deep text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            aria-label="Add to Cart"
          >
            {addedAnimation ? <Check size={15} /> : <ShoppingBag size={15} />}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
