import os

home_jsx_content = """import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Truck, 
  Send,
  Heart,
  ShoppingBag
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import CategoryCard from '../components/CategoryCard';
import SectionHeading from '../components/SectionHeading';
import OptimizedImage from '../components/OptimizedImage';
import { getProducts } from '../services/productService';

// Default authentic fallback catalog to guarantee immediate instant render
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

// Refined Categories with Circular Avatars
const shopCategories = [
  { name: 'Rings', image: '/assets/product_celeste_1.webp', count: '48 Designs', link: '/shop?category=Rings' },
  { name: 'Earrings', image: '/assets/category_earrings.webp', count: '86 Designs', link: '/shop?category=Earrings' },
  { name: 'Necklaces', image: '/assets/category_necklace.webp', count: '64 Designs', link: '/shop?category=Necklaces' },
  { name: 'Bangles', image: '/assets/category_bangles.webp', count: '54 Designs', link: '/shop?category=Bangles' },
  { name: 'Chains', image: '/assets/category_chains.webp', count: '32 Designs', link: '/shop?category=Chains' },
  { name: 'Pendants', image: '/assets/category_pendants.webp', count: '40 Designs', link: '/shop?category=Pendants' },
];

// Customer Reviews
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

// Motion animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
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
        // Fallback already present in state
      }
    };
    loadApiProducts();
  }, []);

  const handleCategoryScroll = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
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
      
      {/* 1. HERO CAMPAIGN CAROUSEL */}
      <HeroCarousel />

      {/* 2. SHOP BY CATEGORY (Refined Horizontal Circular Showcase) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="py-20 sm:py-24 bg-white border-b border-lumiere-border/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="flex items-end justify-between mb-10 sm:mb-12">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-lumiere-gold block mb-1.5">
                CURATED ATELIER
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-lumiere-text uppercase">
                Shop by Category
              </h2>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCategoryScroll('left')}
                className="w-9 h-9 flex items-center justify-center border border-lumiere-border/80 hover:border-lumiere-gold hover:text-lumiere-gold transition-colors duration-300"
                aria-label="Scroll categories left"
              >
                <ChevronLeft size={17} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => handleCategoryScroll('right')}
                className="w-9 h-9 flex items-center justify-center border border-lumiere-border/80 hover:border-lumiere-gold hover:text-lumiere-gold transition-colors duration-300"
                aria-label="Scroll categories right"
              >
                <ChevronRight size={17} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div
            ref={categoryScrollRef}
            className="flex sm:grid sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {shopCategories.map((cat) => (
              <div key={cat.name} className="flex-shrink-0 w-[120px] sm:w-auto snap-start">
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

      {/* 3. NEW ARRIVALS (Luxury Editorial Grid, No Box Containers) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="py-24 sm:py-28 bg-[#FDFBF7]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <SectionHeading
            eyebrow="AUTUMN / WINTER 2026"
            title="New Arrivals"
            subtitle="Intricately sculpted in certified 22K gold, reflecting centuries of South Indian artistry infused with timeless silhouettes."
          />

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-14"
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
              className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1 border-b border-lumiere-text hover:border-lumiere-gold transition-all duration-300 group"
            >
              <span>DISCOVER ALL NEW ARRIVALS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </motion.section>

      {/* 4. SHOP BY OCCASION (Editorial Asymmetric Layout) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="py-24 sm:py-28 bg-white border-y border-lumiere-border/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <SectionHeading
            eyebrow="TIMELESS CELEBRATIONS"
            title="Shop by Occasion"
            subtitle="Curated jewellery suites tailored for the sacred rituals, festive gatherings, and treasured milestones of life."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* Dominant Large Feature: WEDDING (col 7) */}
            <Link
              to="/category/bridal"
              className="group lg:col-span-7 relative h-[440px] sm:h-[520px] lg:h-[600px] overflow-hidden bg-lumiere-cream/40 flex flex-col justify-end p-6 sm:p-10 block shadow-subtle"
            >
              <OptimizedImage
                src="/assets/category_bridal.webp"
                alt="Royal Wedding Collection"
                sizes="occasion-large"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                containerClassName="absolute inset-0 w-full h-full"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              <div className="relative z-10 text-white">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-lumiere-gold-light uppercase block mb-2">
                  SACRED HEIRLOOMS
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-2 leading-tight">
                  The Wedding Edit
                </h3>
                <p className="text-xs sm:text-sm text-white/80 font-light max-w-md mb-4 line-clamp-2 font-sans">
                  Opulent Kasu Malas, temple harams, and handcrafted vaddanams designed for the quintessential South Indian bride.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-white group-hover:text-lumiere-gold-light transition-colors duration-300">
                  <span>Explore Bridal Edit</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            {/* Asymmetric Right Stack: FESTIVAL, PARTY, EVERYDAY (col 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 justify-between">
              
              {/* FESTIVAL */}
              <Link
                to="/shop?collection=Festival"
                className="group relative h-[210px] sm:h-[250px] lg:h-[285px] overflow-hidden bg-lumiere-cream/40 flex flex-col justify-end p-6 sm:p-8 block shadow-subtle"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

                <div className="relative z-10 text-white">
                  <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] text-lumiere-gold-light uppercase block mb-1">
                    AUSPICIOUS GOLD
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-white mb-1.5">
                    Festive Celebrations
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-white/90 group-hover:text-lumiere-gold-light transition-colors duration-300">
                    <span>Discover Festive</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>

              {/* 2-Column Split: PARTY & EVERYDAY */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 h-[210px] sm:h-[250px] lg:h-[285px]">
                
                {/* PARTY */}
                <Link
                  to="/shop?collection=Party"
                  className="group relative h-full overflow-hidden bg-lumiere-cream/40 flex flex-col justify-end p-4 sm:p-5 block shadow-subtle"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  
                  <div className="relative z-10 text-white">
                    <span className="text-[9px] font-medium tracking-widest text-lumiere-gold-light uppercase block mb-0.5">
                      SOLITAIRES
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-white mb-1">
                      Party Edit
                    </h3>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/80 group-hover:text-white">
                      Explore →
                    </span>
                  </div>
                </Link>

                {/* EVERYDAY */}
                <Link
                  to="/shop?collection=Everyday"
                  className="group relative h-full overflow-hidden bg-lumiere-cream/40 flex flex-col justify-end p-4 sm:p-5 block shadow-subtle"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  
                  <div className="relative z-10 text-white">
                    <span className="text-[9px] font-medium tracking-widest text-lumiere-gold-light uppercase block mb-0.5">
                      MINIMALIST
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-white mb-1">
                      Daily Wear
                    </h3>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/80 group-hover:text-white">
                      Explore →
                    </span>
                  </div>
                </Link>

              </div>

            </div>

          </div>

        </div>
      </motion.section>

      {/* 5. KARIGAR HERITAGE & CRAFTSMANSHIP */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="py-24 sm:py-28 bg-[#F8F4EC]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden shadow-[0_12px_36px_rgba(45,40,35,0.08)] bg-white">
                <OptimizedImage
                  src="/assets/craftsmanship.webp"
                  alt="Master Karigar crafting Nakshi gold"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>

              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 border border-lumiere-border/60 shadow-elevated max-w-[200px]">
                <span className="text-[10px] font-semibold text-lumiere-gold uppercase tracking-[0.2em] block mb-1">
                  HALLMARK OF PURITY
                </span>
                <p className="text-xs text-lumiere-text font-serif leading-snug">
                  100% BIS 916 Laser-Hallmarked Gold
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-lumiere-gold block mb-2">
                THE KARIGAR JOURNEY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-lumiere-text uppercase leading-tight mb-6">
                Tradition, Devotion & Sacred Gold
              </h2>
              <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed mb-8 max-w-xl font-sans">
                Each Lumière creation is born in our private atelier through the hands of generational master karigars. Preserving ancient South Indian temple jewellery sculpting, Nakshi chasing, and openwork filigree techniques passed down across dynasties.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-lumiere-border/60">
                <div>
                  <span className="font-serif text-2xl font-light text-lumiere-gold block mb-1">01</span>
                  <h4 className="font-serif text-sm font-medium text-lumiere-text uppercase mb-1">Sacred Form</h4>
                  <p className="text-xs text-lumiere-muted font-light leading-relaxed">
                    Iconography inspired by temple sanctums and heritage motifs.
                  </p>
                </div>

                <div>
                  <span className="font-serif text-2xl font-light text-lumiere-gold block mb-1">02</span>
                  <h4 className="font-serif text-sm font-medium text-lumiere-text uppercase mb-1">Nakshi Handcraft</h4>
                  <p className="text-xs text-lumiere-muted font-light leading-relaxed">
                    Chased entirely by hand using certified 22K hallmarked gold.
                  </p>
                </div>

                <div>
                  <span className="font-serif text-2xl font-light text-lumiere-gold block mb-1">03</span>
                  <h4 className="font-serif text-sm font-medium text-lumiere-text uppercase mb-1">Laser Hallmark</h4>
                  <p className="text-xs text-lumiere-muted font-light leading-relaxed">
                    Laser stamped with BIS 916 hallmark and lifetime buyback.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1 border-b border-lumiere-text hover:border-lumiere-gold transition-all duration-300 group"
                >
                  <span>Explore The Atelier Story</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </motion.section>

      {/* 6. SIGNATURE BESTSELLERS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeInUp}
        className="py-24 sm:py-28 bg-[#FDFBF7]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <SectionHeading
            eyebrow="SIGNATURE CREATIONS"
            title="Patron Favourites"
            subtitle="Our most coveted 22K gold harams, nakshi jhumkas, and certified solitaire diamond rings celebrated across generations."
          />

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-14"
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
              className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1 border-b border-lumiere-text hover:border-lumiere-gold transition-all duration-300 group"
            >
              <span>Explore All Bestsellers</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

        </div>
      </motion.section>

      {/* 7. PATRON REVIEWS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="py-20 sm:py-24 bg-white border-t border-lumiere-border/40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <SectionHeading
            eyebrow="HEIRLOOMS CHERISHED"
            title="Patron Testimonials"
            subtitle="Reflections from patrons who have entrusted Lumière with their most auspicious milestones."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between p-6 sm:p-8 bg-[#FAF8F5] border border-lumiere-border/40"
              >
                <div>
                  <div className="flex items-center gap-1 text-lumiere-gold mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-lumiere-gold" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-lumiere-text font-serif italic leading-relaxed mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-lumiere-border/50 flex items-center justify-between text-[11px]">
                  <div>
                    <strong className="font-serif text-xs font-medium text-lumiere-text block">
                      {rev.name}
                    </strong>
                    <span className="text-lumiere-muted text-[10px]">{rev.city} · Verified Patron</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-lumiere-gold font-medium">
                    {rev.item}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* 8. NEWSLETTER */}
      <section className="py-20 bg-lumiere-deep text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-lumiere-gold block mb-2">
            THE PRIVILEGED CIRCLE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal uppercase mb-3 text-white">
            Stay in the Loop
          </h2>
          <p className="text-xs sm:text-sm text-lumiere-cream/70 font-light max-w-md mx-auto mb-8 leading-relaxed font-sans">
            Receive private salon previews, festival heritage updates, and invitations to bespoke jewellery unveilings.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full sm:flex-1 bg-white/5 border border-white/20 text-white text-xs px-4 py-3 min-h-[48px] placeholder:text-white/40 focus:outline-none focus:border-lumiere-gold transition-colors font-sans"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-lumiere-gold hover:bg-lumiere-gold-dark text-white text-xs font-medium px-7 py-3 min-h-[48px] uppercase tracking-[0.14em] transition-colors shrink-0 flex items-center justify-center gap-2"
            >
              <span>SUBSCRIBE</span>
              <Send size={13} />
            </button>
          </form>

          {newsletterSuccess && (
            <div className="mt-4 text-xs font-medium text-lumiere-gold animate-fadeIn">
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

dest = os.path.join(os.path.dirname(__file__), '..', 'client', 'src', 'pages', 'Home.jsx')
with open(dest, 'w', encoding='utf-8') as f:
    f.write(home_jsx_content)

print(f"Successfully written {dest}")
