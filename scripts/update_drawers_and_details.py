import os

product_details_content = r"""import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Heart, ChevronDown, Check, ArrowRight, Sparkles, Truck, RefreshCw, Award, ShoppingBag, ShieldCheck, Maximize2, X } from 'lucide-react';
import { getProductBySlug } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import OptimizedImage from '../components/OptimizedImage';

const ProductDetails = () => {
  const { productId, slug, id } = useParams();
  const productIdentifier = productId || slug || id;
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const onQuickView = outletContext.onQuickView;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImg, setSelectedImg] = useState('');
  const [selectedPurity, setSelectedPurity] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('details');

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductBySlug(productIdentifier);
        if (isMounted) {
          if (res && res.success && res.product) {
            setProduct(res.product);
            setRelated(res.related || []);
            setSelectedImg(res.product.images?.[0] || '/assets/category_necklace.webp');
            setSelectedPurity(res.product.purities?.[0] || res.product.purity || '22K Gold');
            setSelectedSize(res.product.sizes?.[0] || 'Standard');
            setQuantity(1);
          } else {
            setProduct(null);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
        if (isMounted) setProduct(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [productIdentifier]);

  if (loading) return <Loading text="Curating High Jewellery Creation..." />;

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-24 px-6 text-center bg-[#FDFBF7]">
        <div className="w-16 h-16 rounded-full bg-white border border-lumiere-border/60 flex items-center justify-center mb-5 text-lumiere-gold shadow-subtle">
          <Sparkles size={24} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] uppercase font-semibold tracking-[0.28em] text-lumiere-gold block mb-2 font-sans">
          LUMIÈRE ATELIER
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-lumiere-text mb-3">
          Creation Not Found
        </h2>
        <p className="text-xs sm:text-sm text-lumiere-muted max-w-md mb-8 leading-relaxed font-light font-sans">
          The fine jewellery piece you are seeking may have been retired to our private archives.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-lumiere-text pb-1 border-b border-lumiere-text hover:text-lumiere-gold hover:border-lumiere-gold transition-colors"
        >
          <span>Return to Catalogue</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const prodId = String(product._id || product.id || product.slug);
  const isWishlisted = isInWishlist(prodId);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedPurity, selectedSize, true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedPurity, selectedSize, false);
    navigate('/checkout');
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-6 pb-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* EDITORIAL BREADCRUMB */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-lumiere-muted/70 mb-10 pb-4 border-b border-lumiere-border/40 font-sans">
          <Link to="/" className="hover:text-lumiere-text transition-colors">LUMIÈRE</Link>
          <span className="text-lumiere-border">/</span>
          <Link to="/shop" className="hover:text-lumiere-text transition-colors">CATALOGUE</Link>
          <span className="text-lumiere-border">/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-lumiere-text transition-colors">
            {product.category}
          </Link>
          <span className="text-lumiere-border">/</span>
          <span className="text-lumiere-text font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* SHOWCASE SPLIT: LEFT PORTRAIT 4:5 GALLERY | RIGHT STICKY DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-24 border-b border-lumiere-border/50">
          
          {/* LEFT: GALLERY (col 7) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-6">
            
            {/* Vertical Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3.5 overflow-x-auto sm:overflow-y-auto max-h-[640px] flex-shrink-0 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={`w-20 h-24 sm:w-24 sm:h-28 overflow-hidden transition-all flex-shrink-0 bg-[#FAF7F2] p-1 border ${
                      selectedImg === img ? 'border-lumiere-gold shadow-subtle' : 'border-lumiere-border/60 hover:border-lumiere-gold/50'
                    }`}
                  >
                    <OptimizedImage
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      sizes="thumbnail"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Portrait 4:5 Canvas */}
            <div className="flex-1 relative aspect-[4/5] bg-[#FAF7F2] overflow-hidden group">
              <OptimizedImage
                key={selectedImg}
                src={selectedImg || product.images?.[0] || '/assets/category_necklace.webp'}
                alt={product.name}
                priority={true}
                sizes="product-detail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                containerClassName="w-full h-full"
                onClick={() => setIsZoomModalOpen(true)}
              />

              {/* Floating Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(prodId)}
                className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted ? 'bg-white text-lumiere-accent shadow-sm scale-105' : 'bg-white/85 text-lumiere-text hover:bg-white hover:text-lumiere-accent shadow-subtle backdrop-blur-sm'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.5} />
              </button>

              {/* Expand to Fullscreen Icon */}
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(true)}
                className="absolute bottom-5 right-5 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-lumiere-text hover:text-lumiere-gold flex items-center justify-center shadow-subtle backdrop-blur-sm transition-all"
                title="View Fullscreen"
              >
                <Maximize2 size={15} strokeWidth={1.5} />
              </button>

              {/* Corner Tag */}
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] font-semibold text-lumiere-text shadow-subtle">
                  {product.diamondDetails?.certification || 'BIS 916 HALLMARKED'}
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT: STICKY PRODUCT INFORMATION (col 5) */}
          <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-28 h-fit">
            
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-lumiere-gold mb-3 font-sans">
              <span>{product.category}</span>
              <span>·</span>
              <span>{product.material || '22K Gold'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-text font-normal leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-lumiere-border/50">
              <span className="text-2xl sm:text-3xl font-normal text-lumiere-text font-sans">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-lumiere-muted line-through font-sans font-light">
                  ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent && (
                <span className="text-[10px] uppercase tracking-wider font-semibold text-lumiere-accent ml-2">
                  ({discountPercent}% OFF)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed mb-8 font-sans">
              {product.description}
            </p>

            {/* Purity & Size Selectors */}
            {product.purities && product.purities.length > 1 && (
              <div className="mb-6">
                <label className="block text-[11px] uppercase tracking-wider text-lumiere-muted font-medium mb-2.5">
                  Gold Purity / Finish: <span className="text-lumiere-text font-semibold">{selectedPurity}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.purities.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPurity(p)}
                      className={`text-xs px-4 py-2 uppercase tracking-wider transition-all ${
                        selectedPurity === p
                          ? 'border-2 border-lumiere-gold text-lumiere-text bg-white font-medium'
                          : 'border border-lumiere-border/70 text-lumiere-muted hover:border-lumiere-gold'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <label className="block text-[11px] uppercase tracking-wider text-lumiere-muted font-medium mb-2.5">
                  Select Dimension / Size: <span className="text-lumiere-text font-semibold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`text-xs px-4 py-2 uppercase tracking-wider transition-all ${
                        selectedSize === s
                          ? 'border-2 border-lumiere-gold text-lumiere-text bg-white font-medium'
                          : 'border border-lumiere-border/70 text-lumiere-muted hover:border-lumiere-gold'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="flex flex-col gap-3 mb-8">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-lumiere-deep hover:bg-lumiere-gold text-white text-xs font-semibold tracking-[0.18em] uppercase py-4 flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Bag
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full border border-lumiere-text text-lumiere-text hover:bg-lumiere-text hover:text-white text-xs font-semibold tracking-[0.18em] uppercase py-4 flex items-center justify-center gap-2 transition-all duration-300"
              >
                <span>Buy Now</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Accordion Specs */}
            <div className="border-t border-lumiere-border/50 divide-y divide-lumiere-border/50 text-xs font-sans">
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  className="w-full py-4 flex items-center justify-between text-left font-medium uppercase tracking-wider text-lumiere-text"
                >
                  <span>Creation Specifications</span>
                  <ChevronDown size={15} className={`transition-transform ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'details' && (
                  <div className="pb-5 space-y-2 text-lumiere-muted font-light">
                    <div className="flex justify-between py-1 border-b border-lumiere-border/30">
                      <span>Gold Purity</span>
                      <strong className="text-lumiere-text font-normal">{product.purity || '22K Gold (916 Hallmarked)'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-lumiere-border/30">
                      <span>Approx Weight</span>
                      <strong className="text-lumiere-text font-normal">{product.weight || '24.5 grams'}</strong>
                    </div>
                    {product.diamondDetails && product.diamondDetails.carat !== 'N/A' && (
                      <div className="flex justify-between py-1 border-b border-lumiere-border/30">
                        <span>Diamond Quality</span>
                        <strong className="text-lumiere-text font-normal">{product.diamondDetails.carat} · {product.diamondDetails.clarity}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full py-4 flex items-center justify-between text-left font-medium uppercase tracking-wider text-lumiere-text"
                >
                  <span>Complimentary Insured Delivery</span>
                  <ChevronDown size={15} className={`transition-transform ${openAccordion === 'delivery' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'delivery' && (
                  <div className="pb-5 text-lumiere-muted font-light leading-relaxed">
                    Every order is shipped in discrete tamper-proof packaging via specialized insured courier. Real-time GPS tracking and OTP verification at delivery.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RELATED PIECES */}
        {related && related.length > 0 && (
          <div className="pt-24">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-lumiere-text text-center mb-12">
              Complementary Creations
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-10">
              {related.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id || rel._id} product={rel} onQuickView={onQuickView} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FULLSCREEN IMMERSIVE ZOOM MODAL */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-lumiere-gold p-2"
          >
            <X size={28} />
          </button>
          <div className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={selectedImg}
              alt={product.name}
              className="max-h-[85vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
"""

search_drawer_content = r"""import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ArrowRight } from 'lucide-react';
import { getProducts } from '../services/productService';
import OptimizedImage from './OptimizedImage';

const SearchDrawer = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getProducts({ search: query.trim(), limit: 6 });
        if (res.success) {
          setResults(res.products);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#FDFBF7] h-full shadow-drawer z-10 flex flex-col p-6 sm:p-10 overflow-y-auto">
        <div className="flex justify-between items-center pb-6 border-b border-lumiere-border/50">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-lumiere-gold block">
              ATELIER ARCHIVES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-lumiere-text font-normal">
              Search Lumière
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-lumiere-text hover:text-lumiere-gold transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Input */}
        <div className="relative my-8">
          <input
            type="search"
            autoFocus
            placeholder="Search necklaces, solitaires, bridal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-lumiere-text py-3.5 pr-10 text-lg font-serif text-lumiere-text outline-none placeholder:text-lumiere-muted/60 placeholder:font-sans placeholder:text-xs"
          />
          <Search size={20} className="absolute right-0 top-3.5 text-lumiere-text/60" />
        </div>

        {/* Popular Tags */}
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-lumiere-muted font-semibold block mb-3 font-sans">
            Popular Searches
          </span>
          <div className="flex flex-wrap gap-2">
            {['Necklaces', 'Solitaire', 'Jhumkas', 'Bridal', 'Kasu Mala', 'Bangles'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3.5 py-1.5 bg-white border border-lumiere-border/60 hover:border-lumiere-gold text-lumiere-text hover:text-lumiere-gold text-xs uppercase tracking-wider transition-colors font-sans"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-8 text-xs text-lumiere-muted uppercase tracking-widest font-sans">
            Searching curated pieces...
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-lumiere-muted font-semibold font-sans">
              Suggested Creations ({results.length})
            </span>
            <div className="flex flex-col divide-y divide-lumiere-border/40">
              {results.map((p) => (
                <Link
                  key={p.id || p._id}
                  to={`/product/${p.slug || p.id}`}
                  onClick={onClose}
                  className="py-3 flex items-center gap-4 hover:bg-white/60 p-2 transition-colors group"
                >
                  <div className="w-14 h-16 bg-[#FAF7F2] overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={p.images?.[0] || '/assets/category_necklace.webp'}
                      alt={p.name}
                      sizes="thumbnail"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-lumiere-text truncate group-hover:text-lumiere-gold transition-colors">
                      {p.name}
                    </h4>
                    <span className="text-xs font-semibold text-lumiere-text font-sans block mt-0.5">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={handleViewAll}
              className="mt-4 w-full py-3 bg-lumiere-deep hover:bg-lumiere-gold text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2"
            >
              <span>View All Results</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchDrawer;
"""

cart_drawer_content = r"""import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import OptimizedImage from './OptimizedImage';

const CartDrawer = () => {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalCount } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-drawer z-10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
        
        {/* Header */}
        <div>
          <div className="flex justify-between items-center pb-5 border-b border-lumiere-border/50 mb-6">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-lumiere-gold block font-sans">
                YOUR ATELIER BAG
              </span>
              <h3 className="font-serif text-2xl text-lumiere-text font-normal">
                Shopping Bag ({totalCount})
              </h3>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-lumiere-text hover:text-lumiere-gold transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white border border-lumiere-border/60 flex items-center justify-center text-lumiere-gold mb-4 shadow-subtle">
                <ShoppingBag size={22} strokeWidth={1.5} />
              </div>
              <h4 className="font-serif text-xl text-lumiere-text mb-2">Your Bag is Empty</h4>
              <p className="text-xs text-lumiere-muted font-light max-w-xs mb-6 font-sans">
                Explore our fine jewellery creations and curate your private collection.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="text-xs uppercase tracking-[0.18em] font-semibold text-lumiere-text pb-1 border-b border-lumiere-text hover:text-lumiere-gold hover:border-lumiere-gold transition-colors"
              >
                Discover Collections →
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-lumiere-border/40 max-h-[55vh] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedPurity}-${item.selectedSize}`} className="py-4 flex gap-4">
                  
                  {/* Portrait Thumbnail */}
                  <div className="w-20 h-24 bg-[#FAF7F2] overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={item.image || item.images?.[0] || '/assets/category_necklace.webp'}
                      alt={item.name}
                      sizes="thumbnail"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm text-lumiere-text font-normal leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.selectedPurity, item.selectedSize)}
                          className="text-lumiere-muted/60 hover:text-red-600 transition-colors p-1 -mr-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <span className="text-[10px] text-lumiere-gold uppercase tracking-wider block mt-0.5 font-sans">
                        {item.selectedPurity || '22K Gold'} · {item.selectedSize || 'Standard'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Toggles */}
                      <div className="flex items-center border border-lumiere-border/80 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.selectedPurity, item.selectedSize, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-lumiere-text hover:bg-lumiere-cream/40"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold font-sans">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.selectedPurity, item.selectedSize, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-lumiere-text hover:bg-lumiere-cream/40"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-lumiere-text font-sans">
                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-6 border-t border-lumiere-border/50">
            <div className="flex justify-between items-baseline mb-4 font-sans">
              <span className="text-xs uppercase tracking-wider text-lumiere-muted">
                Subtotal (Inc. of Taxes)
              </span>
              <span className="text-xl font-normal text-lumiere-text font-serif">
                ₹{Number(subtotal).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-lumiere-deep hover:bg-lumiere-gold text-white text-xs font-semibold tracking-[0.18em] uppercase py-4 flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
"""

files = {
    'client/src/pages/ProductDetails.jsx': product_details_content,
    'client/src/components/SearchDrawer.jsx': search_drawer_content,
    'client/src/components/CartDrawer.jsx': cart_drawer_content,
}

for rel_path, code in files.items():
    full_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', rel_path))
    with open(full_path, 'w', encoding='utf-8') as fh:
        fh.write(code)
    print(f"Updated {rel_path}")

print("All drawers and product details updated successfully!")
