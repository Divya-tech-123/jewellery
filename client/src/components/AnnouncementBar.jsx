import React from 'react';

const AnnouncementBar = ({ onOpenStoreLocator }) => {
  return (
    <aside className="bg-lumiere-deep text-white h-[34px] sm:h-[36px] px-3 flex items-center justify-center text-[11px] sm:text-xs font-medium tracking-wide relative z-40 border-b border-white/5">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile / Centered Announcement */}
        <div className="w-full text-center">
          <span className="inline-flex items-center gap-1.5 font-sans tracking-wider">
            <span>COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹50,000</span>
          </span>
        </div>

        {/* Desktop Quick Links */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-white/80 shrink-0 absolute right-6">
          <span className="text-lumiere-gold-light">BIS 916 Hallmarked</span>
          <span className="opacity-30">|</span>
          <button
            type="button"
            onClick={onOpenStoreLocator}
            className="hover:text-lumiere-gold transition-colors underline-offset-2 hover:underline"
          >
            Store Locator
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AnnouncementBar;

