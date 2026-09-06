import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Heart, ShieldCheck, ChevronDown, Check, ArrowRight, Sparkles, Truck, RefreshCw, Award, ShoppingBag, Zap } from 'lucide-react';
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
  const onOpenConsultation = outletContext.onOpenConsultation;

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
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Accordion active state
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

  if (loading) return <Loading text="Curating High Jewellery Piece..." />;

  // Clean, branded Product Not Found page
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-24 px-6 text-center bg-lumiere-bg">
        <div className="w-16 h-16 rounded-full bg-white border border-lumiere-border flex items-center justify-center mb-5 text-lumiere-gold shadow-sm">
          <Sparkles size={28} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-lumiere-gold block mb-2">
          LUMIÈRE ATELIER
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-lumiere-text mb-3">
          Product Not Found
        </h2>
        <p className="text-xs sm:text-sm text-lumiere-light max-w-md mb-8 leading-relaxed font-light">
          The fine jewellery creation you are looking for may have been retired to our private archives or the reference is invalid.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-lumiere-text text-white text-xs uppercase tracking-widest font-semibold hover:bg-lumiere-gold transition-colors shadow-sm"
        >
          Continue Shopping
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
    // Add configured product to cart without opening drawer, then immediately navigate to checkout
    addToCart(product, quantity, selectedPurity, selectedSize, false);
    navigate('/checkout');
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-lumiere-bg pt-6 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Editorial Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-lumiere-light mb-8 pb-4 border-b border-lumiere-border/60">
          <Link to="/" className="hover:text-lumiere-text transition-colors">Lumière</Link>
          <span className="text-lumiere-border">/</span>
          <Link to="/shop" className="hover:text-lumiere-text transition-colors">Catalogue</Link>
          <span className="text-lumiere-border">/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-lumiere-text transition-colors">
            {product.category}
          </Link>
          <span className="text-lumiere-border">/</span>
          <span className="text-lumiere-text font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Showcase Split: Asymmetric Gallery & Sticky Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-lumiere-border">
          {/* Left: Asymmetric Editorial Gallery (col 7) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-6">
            {/* Vertical Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[620px] flex-shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={`w-20 h-24 sm:w-24 sm:h-28 border p-1 transition-all flex-shrink-0 bg-[#FAF7F2] ${
                      selectedImg === img ? 'border-lumiere-gold shadow-sm' : 'border-lumiere-border hover:border-lumiere-light'
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

            {/* Main Editorial Canvas */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="relative aspect-[1/1.08] bg-[#FAF7F2] border border-lumiere-border/60 overflow-hidden flex items-center justify-center p-6 group">
                <OptimizedImage
                  key={selectedImg}
                  src={selectedImg || product.images?.[0] || '/assets/category_necklace.webp'}
                  alt={product.name}
                  priority={true}
                  sizes="product-detail"
                  objectFit="contain"
                  className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                  containerClassName="w-full h-full flex items-center justify-center"
                />

                {/* Wishlist Floating Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(prodId)}
                  className={`absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    isWishlisted ? 'bg-white text-red-600' : 'bg-white/85 text-lumiere-text hover:bg-white hover:scale-105'
                  }`}
                  aria-label="Wishlist"
                  title="Save Creation to Wishlist"
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.6} />
                </button>

                {/* Editorial Trust Badges Floating Tag */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[9px] uppercase tracking-widest font-semibold text-lumiere-charcoal">
                    {product.diamondDetails?.certification || 'BIS Hallmarked 916'}
                  </span>
                  {product.newArrival && (
                    <span className="px-3 py-1 bg-lumiere-text text-white text-[9px] uppercase tracking-widest font-semibold">
                      New Release
                    </span>
                  )}
                  {discountPercent && (
                    <span className="px-3 py-1 bg-lumiere-accent text-white text-[9px] uppercase tracking-widest font-bold">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Close-up Craftsmanship Story Snapshot */}
              <div className="p-6 bg-lumiere-secondary/50 border border-lumiere-border/60 flex items-center gap-4">
                <Sparkles className="w-6 h-6 text-lumiere-gold flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-lumiere-light leading-relaxed font-light">
                  Every prong is mirror-polished by hand under high magnification to maximize natural light refraction through the gemstone pavilion.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Sticky Purchasing & Atelier Information Panel (col 5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start space-y-7">
            {/* Header & Category */}
            <div>
              <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-lumiere-bronze block mb-2">
                ATELIER CREATION · {product.category} · {product.collectionName || 'Heritage'}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-4xl text-lumiere-text font-normal leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating & Certification */}
              <div className="flex items-center gap-3 text-xs mb-4">
                <div className="text-lumiere-gold tracking-widest text-sm">
                  ★ ★ ★ ★ ★
                </div>
                <span className="text-xs text-lumiere-light font-medium">({product.rating || 5.0} Atelier Rating)</span>
                <span className="text-lumiere-border">|</span>
                <span className="text-lumiere-bronze uppercase tracking-wider font-semibold text-[10px]">
                  Certified Authentic
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pb-6 border-b border-lumiere-border/80">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-lumiere-text">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-base text-lumiere-light line-through font-light">
                    ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-bold text-lumiere-accent uppercase tracking-wider">
                    ({discountPercent}% savings)
                  </span>
                )}
                <span className="text-[11px] text-lumiere-light font-light ml-auto">
                  Taxes Included
                </span>
              </div>
            </div>

            {/* Narrative Description */}
            <p className="text-xs sm:text-sm text-lumiere-light font-light leading-relaxed">
              {product.description}
            </p>

            {/* Purity & Metal Selector */}
            {product.purities && product.purities.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                  <span className="font-semibold text-lumiere-text">Select Precious Metal:</span>
                  <span className="text-lumiere-gold font-medium">{selectedPurity}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.purities.map((pur) => (
                    <button
                      key={pur}
                      type="button"
                      onClick={() => setSelectedPurity(pur)}
                      className={`px-4 py-2.5 text-xs uppercase tracking-wider border transition-all ${
                        selectedPurity === pur
                          ? 'bg-lumiere-text text-white border-lumiere-text font-semibold'
                          : 'bg-white text-lumiere-text border-lumiere-border hover:border-lumiere-gold'
                      }`}
                    >
                      {pur}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size & Dimensions Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                  <span className="font-semibold text-lumiere-text">Atelier Dimension / Size:</span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-lumiere-bronze hover:text-lumiere-text underline underline-offset-4"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2.5 text-xs uppercase tracking-wider border transition-all ${
                        selectedSize === sz
                          ? 'bg-lumiere-text text-white border-lumiere-text font-semibold'
                          : 'bg-white text-lumiere-text border-lumiere-border hover:border-lumiere-gold'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Size Guide Drawer / Inline Note */}
                {showSizeGuide && (
                  <div className="p-4 bg-[#FAF7F2] border border-lumiere-border text-xs text-lumiere-light leading-relaxed mt-2">
                    <p className="font-semibold text-lumiere-text mb-1">Complimentary Resizing Guarantee</p>
                    <p>
                      All Lumière rings and bracelets include one complimentary bespoke sizing adjustment within 90 days of delivery. For custom measurements, our gemologists are available via private consultation.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-text">
                Quantity:
              </span>
              <div className="flex items-center border border-lumiere-border bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center text-xs hover:bg-lumiere-secondary text-lumiere-text font-bold"
                  aria-label="Decrease quantity"
                >
                  –
                </button>
                <span className="px-4 text-xs font-semibold text-lumiere-text min-w-[32px] text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center text-xs hover:bg-lumiere-secondary text-lumiere-text font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs: Add to Bag, Buy Now, and Consultation */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added}
                  className="w-full bg-lumiere-text text-white py-4 text-xs font-semibold tracking-[0.2em] uppercase text-center hover:bg-lumiere-gold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  {added ? (
                    <>
                      <Check size={16} />
                      <span>Added To Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add To Cart</span>
                    </>
                  )}
                </button>

                {/* 2. Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full bg-lumiere-deep hover:bg-lumiere-gold-dark text-white py-4 text-xs font-bold tracking-[0.2em] uppercase text-center transition-all duration-300 flex items-center justify-center gap-2 shadow-sm border border-lumiere-deep"
                >
                  <Zap size={16} className="fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* 3. Book Consultation */}
              {onOpenConsultation && (
                <button
                  type="button"
                  onClick={() => onOpenConsultation(product.name)}
                  className="w-full border border-lumiere-text text-lumiere-text py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-center hover:bg-lumiere-secondary transition-colors"
                >
                  Book Private Atelier Consultation
                </button>
              )}
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-lumiere-border/60 text-[11px] text-lumiere-light">
              <div className="flex items-start gap-2.5">
                <Truck size={16} className="text-lumiere-gold flex-shrink-0 mt-0.5" />
                <span>Complimentary Fully-Insured Courier</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-lumiere-gold flex-shrink-0 mt-0.5" />
                <span>BIS Hallmarked & Certified Diamonds</span>
              </div>
              <div className="flex items-start gap-2.5">
                <RefreshCw size={16} className="text-lumiere-gold flex-shrink-0 mt-0.5" />
                <span>Lifetime Buyback & Atelier Polish</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Award size={16} className="text-lumiere-gold flex-shrink-0 mt-0.5" />
                <span>Signature Wax-Sealed Presentation Box</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Provenance Accordions */}
        <div className="max-w-4xl mx-auto py-16">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-lumiere-bronze block mb-1">
              SPECIFICATIONS & PROVENANCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-lumiere-text font-normal">
              Atelier Engineering Details
            </h2>
          </div>

          <div className="divide-y divide-lumiere-border border-y border-lumiere-border">
            {/* 1. Technical Specs */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('details')}
                className="w-full py-5 flex justify-between items-center text-left font-serif text-xl text-lumiere-text"
              >
                <span>Material & Gemstone Specifications</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'details' && (
                <div className="pb-6 text-xs text-lumiere-light font-light leading-relaxed space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex justify-between py-1.5 border-b border-lumiere-border/40">
                      <span className="font-medium text-lumiere-text">Estimated Gross Weight:</span>
                      <span>{product.weight || '24.5 grams'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-lumiere-border/40">
                      <span className="font-medium text-lumiere-text">Precious Metal:</span>
                      <span>{product.purity || product.material || '22K Gold'}</span>
                    </div>
                    {product.diamondDetails?.carat && product.diamondDetails.carat !== 'N/A' && (
                      <div className="flex justify-between py-1.5 border-b border-lumiere-border/40">
                        <span className="font-medium text-lumiere-text">Diamond Carat & Color:</span>
                        <span>{product.diamondDetails.carat} | {product.diamondDetails.color}</span>
                      </div>
                    )}
                    {product.diamondDetails?.clarity && product.diamondDetails.clarity !== 'N/A' && (
                      <div className="flex justify-between py-1.5 border-b border-lumiere-border/40">
                        <span className="font-medium text-lumiere-text">Clarity Grade:</span>
                        <span>{product.diamondDetails.clarity}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1.5 border-b border-lumiere-border/40">
                      <span className="font-medium text-lumiere-text">Atelier Reference:</span>
                      <span className="uppercase">{product.slug || product.id}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-lumiere-border/40">
                      <span className="font-medium text-lumiere-text">Origin:</span>
                      <span>Handcrafted in India</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Hallmarking & Certification */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('purity')}
                className="w-full py-5 flex justify-between items-center text-left font-serif text-xl text-lumiere-text"
              >
                <span>Hallmarking & Gemological Authentication</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${openAccordion === 'purity' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'purity' && (
                <div className="pb-6 text-xs text-lumiere-light font-light leading-relaxed space-y-2">
                  <p>
                    Every piece of Lumière jewellery is officially stamped with the Bureau of Indian Standards (BIS) hallmark and laser-engraved with a unique 6-digit HUID code, ensuring absolute transparency of gold fineness.
                  </p>
                  <p>
                    All solitaire and accent diamonds are graded by internationally accredited gemological laboratories (IGI / GIA) and arrive with a QR-verifiable authenticity card.
                  </p>
                </div>
              )}
            </div>

            {/* 3. White Glove Delivery */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full py-5 flex justify-between items-center text-left font-serif text-xl text-lumiere-text"
              >
                <span>Complimentary Insured Courier Delivery</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'shipping' && (
                <div className="pb-6 text-xs text-lumiere-light font-light leading-relaxed space-y-2">
                  <p>
                    We provide complimentary express courier delivery across India, fully insured by our underwriting partners until the moment of handover.
                  </p>
                  <p>
                    Each creation is encased in a discreet, tamper-evident security vault box with mandatory OTP verification upon delivery.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Lifetime Care */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="w-full py-5 flex justify-between items-center text-left font-serif text-xl text-lumiere-text"
              >
                <span>Lifetime Atelier Care & Buyback Guarantee</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${openAccordion === 'care' ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === 'care' && (
                <div className="pb-6 text-xs text-lumiere-light font-light leading-relaxed space-y-2">
                  <p>
                    Enjoy complimentary annual ultrasonic cleaning, prong inspections, and professional repolishing at any Lumière flagship boutique.
                  </p>
                  <p>
                    We offer a 100% lifetime exchange and transparent buyback guarantee based on real-time gold and certified diamond market indices.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complete the Look: Curated Harmonious Ensemble */}
        {related.length > 0 && (
          <div className="pt-16 border-t border-lumiere-border">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-lumiere-bronze block mb-1">
                  CURATED HARMONY
                </span>
                <h2 className="font-serif text-3xl text-lumiere-text font-normal">
                  Complete The Atelier Look
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-semibold uppercase tracking-wider text-lumiere-text hover:text-lumiere-gold inline-flex items-center gap-1"
              >
                <span>View Full Catalogue</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {related.map((item) => (
                <ProductCard key={item._id || item.id} product={item} onQuickView={onQuickView} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add-to-Cart / Buy Now Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-lumiere-border p-3 z-30 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-lumiere-light block truncate font-medium">{product.name}</span>
          <span className="text-sm font-serif font-semibold text-lumiere-text">₹{Number(product.price).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-white border border-lumiere-text text-lumiere-text px-3 py-2 text-[10px] font-bold tracking-wider uppercase flex-shrink-0 hover:bg-lumiere-secondary transition-colors"
          >
            {added ? 'Added' : 'Add To Bag'}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="bg-lumiere-deep text-white px-4 py-2 text-[10px] font-bold tracking-wider uppercase flex-shrink-0 hover:bg-lumiere-gold transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
