import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Calendar, ArrowUpRight, X, Share2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ARTICLES = [
  {
    id: 'architecture-of-light',
    title: 'The Architecture of Light: Behind the Making of the Celeste Solitaire',
    slug: 'architecture-of-light',
    category: 'Craftsmanship',
    date: 'September 2026',
    readTime: '5 min read',
    author: 'Hélène Moreau, Master Gemologist',
    image: '/assets/hero_campaign.jpg',
    excerpt:
      'How master diamond cutters unlock fire, brilliance, and scintillation through mathematical proportions developed over centuries in Antwerp and Jaipur.',
    content: [
      'In high jewellery, light is not merely an external condition; it is the raw sculpting material. When our master gemologists first inspect a rough diamond, they calculate how light entering through the crown facet will refract through the internal pavilion facets before returning to the eye as pure chromatic fire.',
      'The Celeste Solitaire represents over three hundred hours of mathematical study. Cut to ideal proportions with symmetrical facet angles of precisely 34.5 degrees on the crown and 40.8 degrees on the pavilion, the stone achieves total internal reflection.',
      '“A diamond should feel as though it is floating on skin,” explains Hélène Moreau. “Our four-prong setting is tapered to razor-sharp points, polished under 40x magnification, minimizing any metal interference with the diamond’s natural brilliance.”',
      'Sculpted exclusively in 18-karat recycled white gold and hand-engraved with the Lumière atelier insignia, the Celeste is designed to be passed down through generations without ever losing its modern relevance.',
    ],
  },
  {
    id: 'revival-of-22k-gold',
    title: 'The 22K Gold Revival: Why Heirlooms Never Lose Their Lustre',
    slug: 'revival-of-22k-gold',
    category: 'Atelier Chronicles',
    date: 'August 2026',
    readTime: '6 min read',
    author: 'Devendra Rao, Senior Goldsmith',
    image: '/assets/category_gold.jpg',
    excerpt:
      'Exploring the timeless tactile warmth of 91.6% pure gold, ancient chasing techniques, and why modern collectors are returning to high-karat treasures.',
    content: [
      'For centuries, 22-karat gold has held an emotional and cultural sacredness that surpasses ordinary adornment. With a fineness of 916 parts per thousand, its rich, buttery amber luminescence cannot be replicated by synthetic alloys or lower carats.',
      'In our Mumbai atelier, every ingot of 22K gold is hand-drawn through steel dies and forged using traditional cold-hammering techniques. This preserves the internal crystalline structure of the metal, granting our cuffs and chokers exceptional resilience while remaining sensually soft against the skin.',
      'Unlike seasonal fashion trends, high-karat gold carries intrinsic permanence. It does not tarnish, oxidise, or decay. An heirloom created today will retain its profound golden radiance when worn by your great-granddaughters a century from now.',
    ],
  },
  {
    id: 'modern-bridal-minimalism',
    title: 'Bridal Styling in 2026: The New Era of Architectural Minimalism',
    slug: 'modern-bridal-minimalism',
    category: 'Bridal & Styling',
    date: 'July 2026',
    readTime: '4 min read',
    author: 'Aria Chen, Creative Director',
    image: '/assets/bridal_campaign.jpg',
    excerpt:
      'Moving away from heavy, cumbersome bridal sets towards singular, impactful statement creations that can be worn for a lifetime beyond the wedding day.',
    content: [
      'The modern bride is redefining bridal elegance. Where previous generations favored overwhelming sets worn only for a single evening, today’s celebrations demand pieces of architectural clarity that integrate effortlessly into everyday life.',
      'Our Royal Heritage Bridal suite embodies this philosophy. By designing modular elements — chokers that convert into sleek tennis collars, detachable chandelier droplets that become subtle diamond studs — we ensure that bridal jewellery remains an active companion throughout life’s journey.',
      '“Pairing a clean solitaire pendant with a tailored silk gown creates a visual tension far more memorable than excessive ornamentation,” notes Aria Chen. “Luxury today is about intentionality and breathability.”',
    ],
  },
  {
    id: 'anatomy-of-a-gem',
    title: 'The Gemologist’s Notebook: Evaluating Diamond Clarity Beyond the 4Cs',
    slug: 'anatomy-of-a-gem',
    category: 'Gemology',
    date: 'June 2026',
    readTime: '7 min read',
    author: 'Vikram Mehta, Head of Procurement',
    image: '/assets/category_diamond.jpg',
    excerpt:
      'Why two diamonds with identical grading reports can look entirely different in daylight, and how our gemologists curate only the top 1% of stones.',
    content: [
      'A gemological certificate provides essential baseline metrics — Carat, Color, Clarity, and Cut. However, two diamonds sharing identical VVS1 certificates can demonstrate wildly different optical personalities when observed under natural sunlight.',
      'Our procurement team scrutinises over ten thousand stones annually. Beyond standard clarity plots, we examine crystal strain, twinning wisps, and internal graining that can subtly milk the transparency of a diamond.',
      'We reject stones displaying brown or milky undertones, selecting only diamonds with crystalline water-like purity. When you invest in a Lumière solitaire, you are securing a specimen evaluated not just by machines, but by human eyes trained over decades.',
    ],
  },
  {
    id: 'the-lost-wax-art',
    title: 'Echoes of Antiquity: The Lost-Wax Casting Method Reimagined',
    slug: 'the-lost-wax-art',
    category: 'Craftsmanship',
    date: 'May 2026',
    readTime: '5 min read',
    author: 'Devendra Rao, Senior Goldsmith',
    image: '/assets/craftsmanship.jpg',
    excerpt:
      'Bridging 5,000 years of metallurgical history with precision aerospace micro-milling to achieve fluid organic jewellery forms.',
    content: [
      'The lost-wax casting technique (cire perdue) dates back to ancient Mesopotamia and the Indus Valley civilization. Even in an era of 3D printing and digital rendering, the fundamental communion between warm beeswax and molten gold remains unchanged.',
      'Each prototype begins as a hand-carved wax matrix. Sculpted with dental tools and heated styluses, the artisan carves microscopic relief patterns into the wax before encasing it in plaster investment.',
      'When molten 18K gold is vacuum-cast into the hollow cavity, it captures every microscopic fingerprint and human nuance of the original wax sculpture. This balance of ancient touch and modern metallurgical metallurgy is the signature of Lumière.',
    ],
  },
];

const CATEGORIES = ['All Stories', 'Craftsmanship', 'Gemology', 'Bridal & Styling', 'Atelier Chronicles'];

const Journal = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Stories');
  const [activeArticle, setActiveArticle] = useState(null);

  const filteredArticles =
    selectedCategory === 'All Stories'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === selectedCategory);

  const heroArticle = ARTICLES[0];

  return (
    <div className="min-h-screen bg-lumiere-bg pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Masthead Header */}
        <div className="py-12 border-b border-lumiere-border text-center max-w-3xl mx-auto">
          <span className="text-[10px] uppercase font-semibold tracking-[0.3em] text-lumiere-bronze block mb-2">
            THE DIGITAL CHRONICLES / ISSUE NO. 04
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-lumiere-text font-normal tracking-tight mb-4">
            The Atelier Journal
          </h1>
          <p className="text-xs sm:text-sm text-lumiere-light font-light leading-relaxed">
            Curated essays on high jewellery architecture, gemological heritage, master craftsmanship, and the eternal poetry of adornment.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-6 border-b border-lumiere-border overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-[11px] uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-lumiere-text text-white font-semibold'
                  : 'text-lumiere-light hover:text-lumiere-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hero Feature Article */}
        {selectedCategory === 'All Stories' && (
          <div className="py-12 border-b border-lumiere-border">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 aspect-[16/10] overflow-hidden bg-lumiere-secondary group cursor-pointer" onClick={() => setActiveArticle(heroArticle)}>
                <img
                  src={heroArticle.image}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-lumiere-bronze mb-3 font-semibold">
                  <span>{heroArticle.category}</span>
                  <span>•</span>
                  <span>{heroArticle.readTime}</span>
                </div>

                <h2
                  onClick={() => setActiveArticle(heroArticle)}
                  className="font-serif text-3xl sm:text-4xl text-lumiere-text font-normal leading-tight mb-4 hover:text-lumiere-gold transition-colors cursor-pointer"
                >
                  {heroArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-lumiere-light font-light leading-relaxed mb-6">
                  {heroArticle.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-lumiere-border/60">
                  <span className="text-[11px] text-lumiere-light font-light italic">
                    By {heroArticle.author}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveArticle(heroArticle)}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-lumiere-text hover:text-lumiere-gold transition-colors"
                  >
                    <span>Read Essay</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between border border-lumiere-border/60 bg-white p-6 hover:border-lumiere-gold/60 transition-all duration-300"
              >
                <div>
                  <div
                    className="aspect-[16/11] overflow-hidden mb-5 bg-[#FAF7F2] cursor-pointer"
                    onClick={() => setActiveArticle(article)}
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-lumiere-bronze mb-2 font-semibold">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3
                    onClick={() => setActiveArticle(article)}
                    className="font-serif text-xl text-lumiere-text font-normal leading-snug mb-3 group-hover:text-lumiere-gold transition-colors cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs text-lumiere-light font-light leading-relaxed line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-lumiere-border/60 flex items-center justify-between text-[11px]">
                  <span className="text-lumiere-light">{article.date}</span>
                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    className="font-semibold uppercase tracking-wider text-lumiere-text hover:text-lumiere-gold inline-flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter / Correspondence Inscription */}
        <div className="mt-16 bg-lumiere-secondary p-8 sm:p-14 text-center border border-lumiere-border">
          <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-lumiere-bronze block mb-2">
            ATELIER CORRESPONDENCE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-lumiere-text font-normal mb-3">
            Subscribe to The Lumière Journal
          </h2>
          <p className="text-xs text-lumiere-light font-light max-w-lg mx-auto mb-6 leading-relaxed">
            Receive private exhibition invitations, seasonal jewellery monographs, and early access to archival releases.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to The Lumière Journal.');
            }}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 bg-white border border-lumiere-border px-4 py-3 text-xs outline-none focus:border-lumiere-gold"
            />
            <button
              type="submit"
              className="bg-lumiere-text text-white px-6 py-3 text-xs uppercase font-semibold tracking-widest hover:bg-lumiere-gold transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Full Essay Reading Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="fixed inset-0 bg-lumiere-deep/70 backdrop-blur-sm"
            />

            {/* Reading Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-lumiere-bg shadow-2xl z-10 flex flex-col overflow-hidden border border-lumiere-border"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-lumiere-border bg-white">
                <span className="text-[10px] uppercase font-semibold tracking-widest text-lumiere-bronze">
                  {activeArticle.category} · {activeArticle.readTime}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-1 text-lumiere-text hover:text-lumiere-gold transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Scrollable Article Body */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 space-y-6">
                <div className="aspect-[16/9] overflow-hidden bg-lumiere-secondary mb-6">
                  <img
                    src={activeArticle.image}
                    alt={activeArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-lumiere-light">
                    {activeArticle.date} · By {activeArticle.author}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl text-lumiere-text font-normal leading-tight">
                    {activeArticle.title}
                  </h2>
                </div>

                {/* Article paragraphs */}
                <div className="space-y-4 pt-4 border-t border-lumiere-border/60 text-xs sm:text-sm text-lumiere-text leading-relaxed font-light">
                  {activeArticle.content.map((para, idx) => (
                    <p key={idx} className={idx === 0 ? 'first-letter:text-4xl first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-lumiere-gold' : ''}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Article Footer */}
                <div className="pt-8 border-t border-lumiere-border flex items-center justify-between text-xs">
                  <span className="font-serif italic text-lumiere-light">
                    Lumière Atelier Chronicles
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveArticle(null)}
                    className="px-6 py-2 border border-lumiere-text text-lumiere-text text-[11px] uppercase font-semibold tracking-wider hover:bg-lumiere-text hover:text-white transition-colors"
                  >
                    Close Reading View
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;
