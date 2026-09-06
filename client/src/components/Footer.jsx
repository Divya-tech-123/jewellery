import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

const Footer = ({ onOpenStoreLocator }) => {
  return (
    <footer className="bg-lumiere-deep text-lumiere-cream/90 pt-12 pb-8 sm:pt-14 sm:pb-10 border-t border-lumiere-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Brand Info (Col 4 on LG) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-block mb-3">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-bold uppercase text-white">
                  LUMIÈRE
                </span>
                <span className="block text-[9px] tracking-[0.24em] text-lumiere-gold font-semibold uppercase -mt-0.5">
                  MODERN SOUTH INDIAN JEWELLERY
                </span>
              </Link>
              <p className="text-xs text-lumiere-cream/70 leading-relaxed max-w-sm mb-4">
                Handcrafted 22K gold & certified diamond heirlooms designed for weddings, festive milestones, and graceful everyday wear.
              </p>

              {/* BIS Hallmark Badge */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-lumiere-gold/30 px-3 py-1.5 rounded-none mb-4">
                <ShieldCheck size={16} className="text-lumiere-gold" />
                <span className="text-[11px] font-medium text-white">100% BIS 916 Hallmarked Gold</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 text-lumiere-cream/75 pt-2">
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

          {/* Column 1: SHOP (Col 3 on LG) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-lumiere-gold rounded-full" />
              SHOP
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-lumiere-cream/75">
              <li><Link to="/shop?category=Necklaces" className="hover:text-lumiere-gold transition-colors">Necklaces & Harams</Link></li>
              <li><Link to="/shop?category=Earrings" className="hover:text-lumiere-gold transition-colors">Jhumkas & Chandbalis</Link></li>
              <li><Link to="/shop?category=Bangles" className="hover:text-lumiere-gold transition-colors">Gold Bangles & Kadas</Link></li>
              <li><Link to="/shop?category=Rings" className="hover:text-lumiere-gold transition-colors">Solitaires & Gold Rings</Link></li>
              <li><Link to="/shop?category=Chains" className="hover:text-lumiere-gold transition-colors">Mugappu & Daily Chains</Link></li>
              <li><Link to="/shop?category=Pendants" className="hover:text-lumiere-gold transition-colors">Temple Pendants</Link></li>
              <li><Link to="/category/bridal" className="hover:text-lumiere-gold transition-colors font-medium text-lumiere-gold">Bridal Collection</Link></li>
            </ul>
          </div>

          {/* Column 2: CUSTOMER CARE (Col 3 on LG) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-lumiere-gold rounded-full" />
              CUSTOMER CARE
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-lumiere-cream/75">
              <li><Link to="/contact" className="hover:text-lumiere-gold transition-colors">Contact Us</Link></li>
              <li><button type="button" onClick={onOpenStoreLocator} className="hover:text-lumiere-gold transition-colors text-left">Find a Boutique</button></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Shipping & Insured Transit</Link></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">15-Day Exchange & Returns</Link></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Jewellery Care Guide</Link></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Gold Purity & Hallmarking</Link></li>
            </ul>
          </div>

          {/* Column 3: ABOUT & CONTACT (Col 2 on LG) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-lumiere-gold rounded-full" />
              OUR ATELIER
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-lumiere-cream/75 mb-5">
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Our Story & Heritage</Link></li>
              <li><Link to="/about" className="hover:text-lumiere-gold transition-colors">Master Karigars</Link></li>
              <li><Link to="/journal" className="hover:text-lumiere-gold transition-colors">The Jewellery Journal</Link></li>
            </ul>

            <div className="p-3 bg-white/5 border border-white/10 text-[11px] text-lumiere-cream/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-lumiere-gold shrink-0" />
                <span>+91 98490 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-lumiere-gold shrink-0" />
                <span>care@lumierejewels.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-lumiere-gold shrink-0" />
                <span>Hyderabad • Bengaluru • Chennai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Legal Strip */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-lumiere-cream/60 gap-4">
          <div>
            © 2026 LUMIÈRE FINE JEWELLERY. 100% BIS 916 Hallmarked. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px]">
            <span>UPI</span>
            <span>•</span>
            <span>RuPay</span>
            <span>•</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>NetBanking</span>
            <span>•</span>
            <span>0% Interest EMI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
