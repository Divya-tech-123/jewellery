import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const CategoryCard = ({ title, count, image, link }) => {
  return (
    <Link
      to={link}
      className="group flex flex-col items-center text-center flex-shrink-0 cursor-pointer p-2 transition-all duration-300"
    >
      {/* Circular Jewellery Photography with gentle gold ring on hover */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-b from-[#F9F6F0] to-[#EFEAE1] p-[3px] border border-lumiere-border/60 group-hover:border-lumiere-gold/70 transition-all duration-500 shadow-subtle group-hover:shadow-[0_8px_20px_rgba(181,138,69,0.12)] mb-3 sm:mb-4">
        <div className="w-full h-full rounded-full overflow-hidden">
          <OptimizedImage
            src={image}
            alt={title}
            sizes="category-avatar"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            containerClassName="w-full h-full rounded-full"
          />
        </div>
      </div>

      {/* Category Name & Count with Hover Motion */}
      <div className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <h3 className="font-serif text-sm sm:text-base font-medium text-lumiere-text tracking-wide group-hover:text-lumiere-gold transition-colors duration-300">
          {title}
        </h3>

        {/* Subtle expanding gold underline on hover */}
        <div className="w-0 h-[1.5px] bg-lumiere-gold mt-1.5 transition-all duration-400 ease-out group-hover:w-8" />

        {count && (
          <span className="text-[10px] sm:text-[11px] text-lumiere-muted font-light tracking-wider mt-1 block">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
