import React, { useState, useEffect, useRef } from 'react';
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

  const newArrivals = products.slice(0, 6);
  const bestsellers = products.length >= 6 ? products.slice(0, 6) : products;

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

            <Link
              to="/collections"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1 border-b border-lumiere-text hover:border-lumiere-gold transition-all duration-300 group"
            >
              <span>ALL REALMS</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {shopCategories.map((cat) => (
              <CategoryCard
                key={cat.name}
                title={cat.name}
                count={cat.count}
                image={cat.image}
                link={cat.link}
              />
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-16"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-16"
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
