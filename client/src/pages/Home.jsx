import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  CreditCard, 
  Truck, 
  Star, 
  Sparkles, 
  Heart, 
  ShoppingBag,
  CheckCircle2,
  Send
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Default authentic South Indian fallback products to guarantee immediate instant render
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
    images: ['/assets/category_necklace.jpg', '/assets/product_elan_1.jpg'],
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
    images: ['/assets/category_earrings.jpg', '/assets/bridal_campaign.jpg'],
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
    images: ['/assets/product_celeste_1.jpg', '/assets/product_celeste_2.jpg'],
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
    images: ['/assets/category_pendants.jpg', '/assets/category_necklace.jpg'],
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
    images: ['/assets/category_bangles.jpg', '/assets/craftsmanship.jpg'],
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
    images: ['/assets/category_chains.jpg', '/assets/category_gold.jpg'],
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
    images: ['/assets/product_elan_1.jpg', '/assets/product_elan_2.jpg'],
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
    images: ['/assets/category_bridal.jpg', '/assets/hero_campaign.jpg'],
    sizes: ['Standard Drop (50mm)']
  }
];

// 6 Categories with real jewellery images
const shopCategories = [
  { name: 'Rings', image: '/assets/product_celeste_1.jpg', count: '48 Designs', link: '/shop?category=Rings' },
  { name: 'Earrings', image: '/assets/category_earrings.jpg', count: '86 Designs', link: '/shop?category=Earrings' },
  { name: 'Necklaces', image: '/assets/category_necklace.jpg', count: '64 Designs', link: '/shop?category=Necklaces' },
  { name: 'Chains', image: '/assets/category_chains.jpg', count: '32 Designs', link: '/shop?category=Chains' },
  { name: 'Bangles', image: '/assets/category_bangles.jpg', count: '54 Designs', link: '/shop?category=Bangles' },
  { name: 'Pendants', image: '/assets/category_pendants.jpg', count: '40 Designs', link: '/shop?category=Pendants' },
];

// 4 Occasions (2-Column Grid)
const occasions = [
  {
    title: 'WEDDING',
    subtitle: 'Bridal Sets & Harams',
    image: '/assets/category_bridal.jpg',
    link: '/category/bridal',
    button: 'EXPLORE BRIDAL →',
  },
  {
    title: 'FESTIVAL',
    subtitle: 'Auspicious 22K Gold',
    image: '/assets/occasion_festival.jpg',
    link: '/shop?collection=Festival',
    button: 'EXPLORE FESTIVE →',
  },
  {
    title: 'EVERYDAY',
    subtitle: 'Lightweight Daily Wear',
    image: '/assets/category_everyday.jpg',
    link: '/shop?collection=Everyday',
    button: 'EXPLORE EVERYDAY →',
  },
  {
    title: 'PARTY',
    subtitle: 'Diamonds & Cocktails',
    image: '/assets/hero_campaign.jpg',
    link: '/shop?collection=Party',
    button: 'EXPLORE PARTY →',
  },
];

// Customer Reviews with South Indian context
const customerReviews = [
  {
    id: 1,
    name: 'Priya R.',
    city: 'Hyderabad',
    rating: 5,
    date: 'August 2026',
    comment: 'The Lakshmi Kasu Haram we bought for my daughter\'s wedding was the centerpiece of the ceremony. Flawless finishing and 100% BIS hallmarked.',
    item: 'Purchased: Lakshmi Kasu Mala'
  },
  {
    id: 2,
    name: 'Lakshmi K.',
    city: 'Vijayawada',
    rating: 5,
    date: 'July 2026',
    comment: 'The Nakshi peacock jhumkas look even better in real life than online. Prompt WhatsApp support and beautiful velvet packaging box.',
    item: 'Purchased: Temple Nakshi Jhumkas'
  },
  {
    id: 3,
    name: 'Sravani M.',
    city: 'Bengaluru',
    rating: 5,
    date: 'August 2026',
    comment: 'Accurate gold weight certificate provided with clear breakdown of making charges. Safe 2-day insured courier to Bengaluru.',
    item: 'Purchased: Suvarna Mugappu Chain'
  }
];

const Home = () => {
  const { onQuickView } = useOutletContext() || {};
  const [products, setProducts] = useState(defaultProducts);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Carousel refs for smooth horizontal scroll
  const categoryScrollRef = useRef(null);
  const bestsellerScrollRef = useRef(null);
  const reviewsScrollRef = useRef(null);

  useEffect(() => {
    const loadApiProducts = async () => {
      try {
        const res = await getProducts({ limit: 12 });
        if (res && res.success && res.products && res.products.length > 0) {
          setProducts(res.products);
        }
      } catch (err) {
        console.warn('Using embedded South Indian catalog products');
      }
    };
    loadApiProducts();
  }, []);

  const handleScroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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

  // Products split for sections
  const newArrivals = products.slice(0, 4);
  const bestsellers = products.length >= 8 ? products.slice(2, 8) : products;

  return (
    <div className="flex flex-col bg-lumiere-bg text-lumiere-text overflow-x-hidden pb-16 lg:pb-0">
      
      {/* ==========================================================================
          1. REDESIGNED HERO SECTION (Automatic Responsive Banner Carousel)
          ========================================================================== */}
      <HeroCarousel />

      {/* ==========================================================================
          2. SHOP BY CATEGORY (Immediately after Hero: ~2.5 cards swipe carousel)
          ========================================================================== */}
      <section className="py-8 sm:py-12 bg-white border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-lumiere-gold block mb-0.5">
                DISCOVER DESIGNS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lumiere-text uppercase">
                SHOP BY CATEGORY
              </h2>
            </div>
            {/* Desktop Arrows */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll(categoryScrollRef, 'left')}
                className="p-2 border border-lumiere-border hover:border-lumiere-gold hover:text-lumiere-gold transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll(categoryScrollRef, 'right')}
                className="p-2 border border-lumiere-border hover:border-lumiere-gold hover:text-lumiere-gold transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Categories: ~2.5 visible on mobile phone swipe */}
          <div
            ref={categoryScrollRef}
            className="flex lg:grid lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {shopCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.link}
                className="flex-shrink-0 w-[122px] xs:w-[130px] sm:w-[150px] lg:w-auto snap-start bg-lumiere-bg border border-lumiere-border rounded p-2.5 flex flex-col items-center text-center hover:border-lumiere-gold hover:shadow-sm transition-all"
              >
                {/* Category Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-lumiere-cream border border-lumiere-border mb-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-108 transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Category Title & Arrow */}
                <span className="font-serif text-xs sm:text-sm font-semibold text-lumiere-text flex items-center gap-1">
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-lumiere-gold">→</span>
                </span>
                <span className="text-[10px] text-lumiere-muted mt-0.5">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          3. NEW ARRIVALS (Strictly 2-col mobile, 4-col desktop)
          ========================================================================== */}
      <section className="py-8 sm:py-12 bg-lumiere-bg border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-lumiere-gold block mb-0.5">
                JUST LAUNCHED
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lumiere-text uppercase">
                NEW ARRIVALS
              </h2>
              <p className="text-xs sm:text-sm text-lumiere-muted font-normal mt-0.5">
                Fresh designs you'll love.
              </p>
            </div>
            <Link
              to="/shop?sort=newest"
              className="text-xs font-bold text-lumiere-gold-dark hover:text-lumiere-text uppercase tracking-wider transition-colors pb-0.5 border-b border-lumiere-gold"
            >
              VIEW ALL →
            </Link>
          </div>

          {/* Product Grid: 2 columns mobile, 4 columns desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          4. SHOP BY OCCASION (2-col grid, ~160–190px tall cards)
          ========================================================================== */}
      <section className="py-8 sm:py-12 bg-white border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-5 sm:mb-8">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-lumiere-gold block mb-0.5">
              CURATED CELEBRATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lumiere-text uppercase">
              SHOP BY OCCASION
            </h2>
            <div className="w-12 h-0.5 bg-lumiere-gold mx-auto mt-2" />
          </div>

          {/* 2-Column Occasion Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {occasions.map((occ) => (
              <Link
                key={occ.title}
                to={occ.link}
                className="group relative h-[175px] sm:h-[220px] lg:h-[260px] rounded overflow-hidden border border-lumiere-border shadow-sm block"
              >
                <img
                  src={occ.image}
                  alt={occ.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-4 text-white">
                  <h3 className="font-serif text-sm sm:text-base font-bold tracking-wider uppercase">
                    {occ.title}
                  </h3>
                  <p className="text-[10px] text-lumiere-gold-light font-medium mt-0.5">
                    {occ.subtitle} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          5. FEATURED COLLECTION BANNER (Compact, 280–360px on mobile)
          ========================================================================== */}
      <section className="py-8 sm:py-12 bg-lumiere-bg border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#241E18] to-[#382F26] text-white rounded-lg border border-lumiere-gold/30 p-5 sm:p-8 lg:p-10 shadow-md min-h-[280px] sm:min-h-[320px] flex flex-col justify-center relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <div className="lg:col-span-7 flex flex-col justify-center">
                <span className="text-[10px] font-bold tracking-widest uppercase text-lumiere-gold-light mb-1 block">
                  ✦ SOUTH INDIAN ARTISTRY
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase leading-tight mb-2">
                  HERITAGE COLLECTION
                </h2>

                <p className="font-serif italic text-sm sm:text-base text-lumiere-cream mb-2">
                  Tradition, crafted for today.
                </p>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg mb-4 font-light">
                  Intricately hand-carved Nakshi temple motifs sculpted in pure 22K certified gold with master karigar artistry.
                </p>

                <div>
                  <Link
                    to="/collections"
                    className="inline-flex items-center gap-2 bg-lumiere-gold hover:bg-lumiere-gold-dark text-white font-bold text-xs px-5 py-2.5 rounded min-h-[44px] uppercase tracking-wider transition-colors"
                  >
                    <span>DISCOVER</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="hidden sm:block lg:col-span-5">
                <div className="relative aspect-[4/3] rounded overflow-hidden border border-white/20 shadow-sm bg-black">
                  <img
                    src="/assets/category_gold.jpg"
                    alt="Heritage Gold Jewellery"
                    className="w-full h-full object-cover opacity-90 hover:scale-104 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
                    BIS 916 CERTIFIED
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          6. BESTSELLERS (Horizontal Swipe Carousel: 1.5–2 Cards on mobile)
          ========================================================================== */}
      <section className="py-8 sm:py-12 bg-white border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-lumiere-gold block mb-0.5">
                PATRON FAVORITES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lumiere-text uppercase">
                BESTSELLERS
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll(bestsellerScrollRef, 'left')}
                className="p-2 border border-lumiere-border hover:border-lumiere-gold hover:text-lumiere-gold transition-colors"
                aria-label="Previous bestsellers"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll(bestsellerScrollRef, 'right')}
                className="p-2 border border-lumiere-border hover:border-lumiere-gold hover:text-lumiere-gold transition-colors"
                aria-label="Next bestsellers"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Bestseller Carousel: ~1.5–2 cards on mobile */}
          <div
            ref={bestsellerScrollRef}
            className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {bestsellers.map((prod) => (
              <div
                key={prod._id || prod.id}
                className="flex-shrink-0 w-[200px] xs:w-[220px] sm:w-[260px] lg:w-[calc(25%-18px)] snap-start"
              >
                <ProductCard product={prod} onQuickView={onQuickView} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          7. TRUST SECTION (Compact 2×2 Grid)
          ========================================================================== */}
      <section className="py-6 sm:py-10 bg-lumiere-bg border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            
            <div className="bg-white border border-lumiere-border p-3 sm:p-4 rounded flex flex-col justify-center">
              <div className="text-xl mb-1">🛡️</div>
              <h4 className="font-sans text-xs sm:text-sm font-bold text-lumiere-text uppercase">
                ✓ BIS Hallmarked
              </h4>
              <p className="text-[11px] text-lumiere-muted leading-tight mt-0.5">
                100% 22K 916 pure gold with Govt. of India laser stamp.
              </p>
            </div>

            <div className="bg-white border border-lumiere-border p-3 sm:p-4 rounded flex flex-col justify-center">
              <div className="text-xl mb-1">💎</div>
              <h4 className="font-sans text-xs sm:text-sm font-bold text-lumiere-text uppercase">
                ✓ Certified Gems
              </h4>
              <p className="text-[11px] text-lumiere-muted leading-tight mt-0.5">
                IGI & GIA laboratory certified diamonds & stones.
              </p>
            </div>

            <div className="bg-white border border-lumiere-border p-3 sm:p-4 rounded flex flex-col justify-center">
              <div className="text-xl mb-1">💳</div>
              <h4 className="font-sans text-xs sm:text-sm font-bold text-lumiere-text uppercase">
                ✓ Secure Payments
              </h4>
              <p className="text-[11px] text-lumiere-muted leading-tight mt-0.5">
                UPI, Netbanking, Cards & 0% EMI options.
              </p>
            </div>

            <div className="bg-white border border-lumiere-border p-3 sm:p-4 rounded flex flex-col justify-center">
              <div className="text-xl mb-1">📦</div>
              <h4 className="font-sans text-xs sm:text-sm font-bold text-lumiere-text uppercase">
                ✓ Safe Delivery
              </h4>
              <p className="text-[11px] text-lumiere-muted leading-tight mt-0.5">
                Tamper-proof insured transit to your doorstep.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================================================
          8. BRIDAL SECTION (Stacked: IMAGE -> TEXT -> BUTTON)
          ========================================================================== */}
      <section className="py-8 sm:py-12 bg-white border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-lumiere-bg border border-lumiere-border rounded-lg overflow-hidden flex flex-col lg:grid lg:grid-cols-12 items-center">
            
            {/* 1. Indian Bridal Image */}
            <div className="w-full lg:col-span-6 relative aspect-[16/11] sm:aspect-[16/9] lg:aspect-square overflow-hidden bg-lumiere-cream">
              <img
                src="/assets/bridal_campaign.jpg"
                alt="South Indian bride wearing regal 22K gold jewellery"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
                KALYANAM · BRIDAL EDIT
              </div>
            </div>

            {/* 2. Text & 3. Button */}
            <div className="w-full lg:col-span-6 p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-[10px] font-bold tracking-widest uppercase text-lumiere-gold block mb-1">
                FOR YOUR SPECIAL DAY
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-lumiere-text uppercase leading-tight mb-2">
                YOUR SPECIAL DAY,<br />
                YOUR TIMELESS JEWELLERY
              </h2>

              <p className="text-xs sm:text-sm text-lumiere-muted leading-relaxed mb-4">
                Discover bridal pieces inspired by tradition and crafted for today's celebrations. From opulent Kasu Malas and temple Vaddanams to handcrafted jhumkas, create memories that last forever.
              </p>

              <div>
                <Link
                  to="/category/bridal"
                  className="inline-flex items-center gap-2 bg-lumiere-deep hover:bg-lumiere-gold-dark text-white font-bold text-xs px-6 py-3 rounded min-h-[48px] uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span>SHOP BRIDAL</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================================================
          9. TRADITION & KARIGAR CRAFT (3-Step Karigar Storytelling)
          ========================================================================== */}
      <section className="py-8 sm:py-12 bg-lumiere-bg border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-lumiere-gold block mb-0.5">
              THE KARIGAR JOURNEY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lumiere-text uppercase">
              TRADITION & CRAFT
            </h2>
            <div className="w-12 h-0.5 bg-lumiere-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
            
            <div className="bg-white border border-lumiere-border p-4 sm:p-5 rounded flex flex-col">
              <span className="font-serif text-2xl font-bold text-lumiere-gold/50 mb-1">01</span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-lumiere-text uppercase mb-1">DESIGN</h3>
              <p className="text-xs text-lumiere-muted leading-relaxed">
                Form inspired by ancient temple carvings and traditional South Indian motifs with modern ergonomics.
              </p>
            </div>

            <div className="bg-white border border-lumiere-border p-4 sm:p-5 rounded flex flex-col">
              <span className="font-serif text-2xl font-bold text-lumiere-gold/50 mb-1">02</span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-lumiere-text uppercase mb-1">CRAFT</h3>
              <p className="text-xs text-lumiere-muted leading-relaxed">
                Generational master karigars sculpt certified 22K gold by hand, chasing intricate Nakshi filigree.
              </p>
            </div>

            <div className="bg-white border border-lumiere-border p-4 sm:p-5 rounded flex flex-col">
              <span className="font-serif text-2xl font-bold text-lumiere-gold/50 mb-1">03</span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-lumiere-text uppercase mb-1">FINISH</h3>
              <p className="text-xs text-lumiere-muted leading-relaxed">
                Multi-stage antique polish, microscopic stone setting, and BIS hallmark laser stamping.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================================================
          10. CUSTOMER REVIEWS
          ========================================================================== */}
      <section className="py-8 sm:py-12 bg-white border-b border-lumiere-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-lumiere-gold block mb-0.5">
              PATRON TESTIMONIALS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-lumiere-text uppercase">
              LOVED BY OUR PATRONS
            </h2>
            <div className="w-12 h-0.5 bg-lumiere-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-lumiere-bg border border-lumiere-border p-4 sm:p-5 rounded flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-lumiere-gold mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-lumiere-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-lumiere-text italic leading-relaxed mb-3">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-2.5 border-t border-lumiere-border/60 flex items-center justify-between text-[11px]">
                  <strong>{rev.name}, {rev.city}</strong>
                  <span className="text-lumiere-muted text-[10px]">Verified Buyer</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================================================
          11. NEWSLETTER
          ========================================================================== */}
      <section className="py-8 sm:py-10 bg-lumiere-deep text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-lumiere-gold block mb-1">
            PRIVILEGED PATRONS
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase mb-1.5">
            STAY IN THE LOOP
          </h2>
          <p className="text-xs text-lumiere-cream/80 max-w-md mx-auto mb-4">
            Get updates on new collections, festival offers and South Indian gold stories.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full sm:flex-1 bg-white/10 border border-white/20 text-white text-xs px-3.5 py-2.5 min-h-[44px] rounded placeholder:text-white/50 focus:outline-none focus:border-lumiere-gold"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-lumiere-gold hover:bg-lumiere-gold-dark text-white text-xs font-bold px-5 py-2.5 min-h-[44px] rounded uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>SUBSCRIBE</span>
              <Send size={13} />
            </button>
          </form>

          {newsletterSuccess && (
            <div className="mt-3 text-xs font-medium text-lumiere-gold">
              ✨ Thank you for subscribing!
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
