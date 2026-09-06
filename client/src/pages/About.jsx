import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Sparkles } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import OptimizedImage from '../components/OptimizedImage';

const About = () => {
  return (
    <div className="py-20 sm:py-28 bg-[#FDFBF7] text-lumiere-text">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-lumiere-gold block mb-3 font-sans">
            OUR SACRED HERITAGE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-lumiere-text font-normal mb-6">
            Timeless By Design
          </h1>
          <p className="text-sm sm:text-base text-lumiere-muted font-light leading-relaxed font-sans">
            Founded on the revered traditions of South Indian temple goldsmithing and modern haute joaillerie aesthetics, Lumière sculpts rare jewellery pieces meant to be passed down through generations.
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="aspect-[16/9] max-h-[560px] overflow-hidden mb-24 bg-[#FAF7F2] shadow-elevated">
          <OptimizedImage
            src="/assets/hero_campaign.webp"
            alt="Lumière Atelier Heritage"
            sizes="full"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
            style={{ objectPosition: 'center 20%' }}
          />
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-y border-lumiere-border/50 mb-24">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-lumiere-gold font-semibold block mb-3 font-sans">
              01 · PURITY WITHOUT COMPROMISE
            </span>
            <h3 className="font-serif text-2xl text-lumiere-text font-normal mb-3">
              Certified BIS Hallmarking
            </h3>
            <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed font-sans">
              Every ounce of gold at Lumière is cast from certified 916 and 750 gold alloys. Verified with laser HUID stamping for complete transparency.
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-lumiere-gold font-semibold block mb-3 font-sans">
              02 · MASTER CRAFTSMANSHIP
            </span>
            <h3 className="font-serif text-2xl text-lumiere-text font-normal mb-3">
              Generations of Artisanship
            </h3>
            <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed font-sans">
              Our atelier houses master karigars whose lineage traces back over generations in filigree, nakshi chasing, polki setting, and precision pavé work.
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-lumiere-gold font-semibold block mb-3 font-sans">
              03 · ETHICAL CONSCIOUSNESS
            </span>
            <h3 className="font-serif text-2xl text-lumiere-text font-normal mb-3">
              Certified Solitaires
            </h3>
            <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed font-sans">
              We exclusively select natural diamonds conforming to international standards, each accompanied by accredited IGI and GIA certification dossiers.
            </p>
          </div>
        </div>

        {/* Split Story Section (No Box Card) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 aspect-[4/5] overflow-hidden bg-[#FAF7F2] shadow-elevated">
            <OptimizedImage
              src="/assets/craftsmanship.webp"
              alt="Artisan crafting jewellery"
              sizes="half"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
          <div className="md:col-span-7 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.28em] text-lumiere-gold font-semibold block mb-3 font-sans">
              THE ATELIER PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-lumiere-text font-normal leading-tight mb-6">
              "We do not create jewellery for a single season. We craft heirlooms to anchor family legacies."
            </h2>
            <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed mb-8 font-sans">
              From our flagship workshops in Hyderabad to patrons worldwide, Lumière stands as a sanctuary where sacred Indian craft meets contemporary luxury.
            </p>
            <div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.18em] uppercase text-lumiere-text hover:text-lumiere-gold pb-1 border-b border-lumiere-text hover:border-lumiere-gold transition-colors"
              >
                <span>Explore The Atelier Collections</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
