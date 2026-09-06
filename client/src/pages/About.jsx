import React from 'react';
import SectionHeading from '../components/SectionHeading';
import OptimizedImage from '../components/OptimizedImage';

const About = () => {
  return (
    <div className="py-16 sm:py-24 bg-lumiere-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-eyebrow block mb-3">OUR HERITAGE</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-lumiere-charcoal font-normal mb-6">
            Timeless By Design
          </h1>
          <p className="text-sm sm:text-base text-lumiere-muted font-light leading-relaxed">
            Founded on the revered traditions of Indian royal goldsmithing and modern haute horlogerie aesthetics, Lumière sculpts rare jewellery pieces meant to be passed down through generations.
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="aspect-[16/9] max-h-[560px] overflow-hidden mb-20 bg-lumiere-secondary">
          <OptimizedImage
            src="/assets/hero_campaign.webp"
            alt="Lumière Atelier Heritage"
            sizes="full"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-12 border-y border-lumiere-border mb-20">
          <div>
            <span className="font-eyebrow block mb-2">01. PURITY WITHOUT COMPROMISE</span>
            <h3 className="font-serif text-2xl text-lumiere-charcoal font-normal mb-3">
              Certified BIS Hallmarking
            </h3>
            <p className="text-xs text-lumiere-muted font-light leading-relaxed">
              Every ounce of gold at Lumière is cast from certified 916 and 750 gold alloys. Verified with laser HUID stamping for complete transparency.
            </p>
          </div>

          <div>
            <span className="font-eyebrow block mb-2">02. MASTER CRAFTSMANSHIP</span>
            <h3 className="font-serif text-2xl text-lumiere-charcoal font-normal mb-3">
              Generations of Artisanship
            </h3>
            <p className="text-xs text-lumiere-muted font-light leading-relaxed">
              Our atelier houses master karigars whose lineage traces back over half a century in filigree, polki setting, and precision micro-pavé work.
            </p>
          </div>

          <div>
            <span className="font-eyebrow block mb-2">03. ETHICAL CONSCIOUSNESS</span>
            <h3 className="font-serif text-2xl text-lumiere-charcoal font-normal mb-3">
              Conflict-Free Solitaires
            </h3>
            <p className="text-xs text-lumiere-muted font-light leading-relaxed">
              We exclusively select natural diamonds conforming to the Kimberley Process, each accompanied by internationally accredited GIA and IGI dossiers.
            </p>
          </div>
        </div>

        {/* Split Quote */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#F4EFE6] p-8 sm:p-14">
          <div className="md:col-span-4 aspect-square overflow-hidden bg-lumiere-secondary">
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
          <div className="md:col-span-8 flex flex-col justify-center">
            <p className="font-editorial italic text-2xl sm:text-3xl text-lumiere-charcoal leading-snug mb-4">
              "We do not merely craft ornaments; we weave memories, devotion, and lasting bonds into precious metals."
            </p>
            <span className="font-eyebrow text-lumiere-gold tracking-widest">
              LUMIÈRE ATELIER DIRECTORS — MUMBAI & DELHI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
