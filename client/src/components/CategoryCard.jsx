import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const CategoryCard = ({ title, count, image, link }) => {
  return (
    <Link
      to={link}
      className="group relative flex flex-col bg-white rounded-[30px] border border-[#EAE3D6] shadow-[0_8px_30px_rgba(45,40,35,0.04)] hover:shadow-[0_20px_45px_rgba(45,40,35,0.08)] hover:-translate-y-2 transition-all duration-350 ease-out p-3.5 sm:p-4 cursor-pointer select-none h-full"
    >
      {/* 1. LARGE ROUNDED TOP IMAGE (24px radius, soft ivory bg, gentle 1.03 scale) */}
      <div className="relative aspect-[4/3.2] w-full rounded-[24px] overflow-hidden bg-[#FAF7F2] transition-all duration-500">
        <OptimizedImage
          src={image}
          alt={title}
          sizes="category-card"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          containerClassName="w-full h-full rounded-[24px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]" />
      </div>

      {/* 2. LOWER CONTENT AREA WITH SUBTLE CURVED TRANSITION */}
      <div className="px-2 sm:px-2.5 pt-4 pb-1.5 flex flex-col items-center text-center flex-1 justify-between bg-white">
        <div>
          <span className="text-[10px] font-medium tracking-[0.2em] text-lumiere-gold uppercase font-sans mb-1 block">
            ATELIER REALM
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-normal text-lumiere-text tracking-wide group-hover:text-lumiere-gold transition-colors duration-300">
            {title}
          </h3>
          {count && (
            <span className="text-[11px] sm:text-xs text-lumiere-muted font-light tracking-wider mt-1 block font-sans">
              {count}
            </span>
          )}
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-[#F2ECE3] w-full flex items-center justify-center gap-1.5 text-[10.5px] font-semibold tracking-[0.18em] uppercase text-lumiere-gold opacity-90 group-hover:opacity-100 transition-all">
          <span>Explore Realm</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
