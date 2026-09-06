import os

about_content = r"""import React from 'react';
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
"""

footer_content = r"""import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

const Footer = ({ onOpenStoreLocator }) => {
  return (
    <footer className="bg-lumiere-deep text-lumiere-cream/90 pt-16 pb-12 border-t border-lumiere-gold/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 pb-14 border-b border-white/10">
          
          {/* Brand Info (Col 4 on LG) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-block mb-4">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-normal uppercase text-white">
                  LUMIÈRE
                </span>
                <span className="block text-[8.5px] tracking-[0.28em] text-lumiere-gold font-medium uppercase -mt-0.5">
                  HAUTE JOAILLERIE
                </span>
              </Link>
              <p className="text-xs text-lumiere-cream/70 font-light leading-relaxed max-w-sm mb-6 font-sans">
                Handcrafted 22K gold and certified diamond heirlooms designed for sacred weddings, festive celebrations, and graceful daily living.
              </p>

              <div className="inline-flex items-center gap-2.5 bg-white/5 border border-lumiere-gold/30 px-3.5 py-2 mb-6">
                <ShieldCheck size={16} className="text-lumiere-gold shrink-0" />
                <span className="text-[11px] font-medium text-white font-sans">100% BIS 916 Laser-Hallmarked Gold</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-lumiere-cream/75 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-lumiere-gold hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={15} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-lumiere-gold hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={15} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-lumiere-gold hover:text-white transition-colors" aria-label="YouTube">
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* SHOP */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white mb-5 flex items-center gap-2 font-sans">
              <span className="w-1.5 h-1.5 bg-lumiere-gold rounded-full" />
              SHOP ATELIER
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-lumiere-cream/75 font-light font-sans">
              <li><Link to="/shop?category=Necklaces" className="hover:text-lumiere-gold transition-colors">Necklaces & Harams</Link></li>
              <li><Link to="/shop?category=Earrings" className="hover:text-lumiere-gold transition-colors">Jhumkas & Chandbalis</Link></li>
              <li><Link to="/shop?category=Bangles" className="hover:text-lumiere-gold transition-colors">Gold Bangles & Kadas</Link></li>
              <li><Link to="/shop?category=Rings" className="hover:text-lumiere-gold transition-colors">Solitaires & Rings</Link></li>
              <li><Link to="/shop?category=Chains" className="hover:text-lumiere-gold transition-colors">Mugappu & Daily Chains</Link></li>
              <li><Link to="/shop?category=Pendants" className="hover:text-lumiere-gold transition-colors">Temple Pendants</Link></li>
              <li><Link to="/category/bridal" className="hover:text-lumiere-gold transition-colors font-medium text-lumiere-gold">The Royal Bridal Edit</Link></li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white mb-5 flex items-center gap-2 font-sans">
              <span className="w-1.5 h-1.5 bg-lumiere-gold rounded-full" />
              CONCIERGE
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-lumiere-cream/75 font-light font-sans">
              <li><Link to="/contact" className="hover:text-lumiere-gold transition-colors">Contact Concierge</Link></li>
              <li><button type="button" onClick={onOpenStoreLocator} className="hover:text-lumiere-gold transition-colors text-left">Find a Boutique</button></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Insured Doorstep Transit</Link></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">15-Day Guaranteed Exchange</Link></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Jewellery Care Dossier</Link></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Gold Purity & Hallmarking</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white mb-5 flex items-center gap-2 font-sans">
              <span className="w-1.5 h-1.5 bg-lumiere-gold rounded-full" />
              ATELIER
            </h4>
            <ul className="flex flex-col gap-3 text-xs text-lumiere-cream/75 font-light mb-6 font-sans">
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Our Story & Heritage</Link></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Master Karigars</Link></li>
              <li><Link to="/journal" className="hover:text-lumiere-gold transition-colors">The Jewellery Journal</Link></li>
            </ul>

            <div className="p-4 bg-white/5 border border-white/10 text-[11px] text-lumiere-cream/80 space-y-2 font-sans">
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-lumiere-gold shrink-0" />
                <span>+91 98490 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-lumiere-gold shrink-0" />
                <span>care@lumierejewels.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-lumiere-cream/60 font-light font-sans gap-4">
          <p>© {new Date().getFullYear()} Lumière High Jewellery Atelier. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-white transition-colors">Hallmarking Guarantee</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
"""

files = {
    'client/src/pages/About.jsx': about_content,
    'client/src/components/Footer.jsx': footer_content,
}

for rel_path, code in files.items():
    full_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', rel_path))
    with open(full_path, 'w', encoding='utf-8') as fh:
        fh.write(code)
    print(f"Updated {rel_path}")

print("About and Footer updated successfully!")
