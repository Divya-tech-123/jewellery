import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CategoryCard = ({ title, image, link }) => {
  return (
    <Link to={link} className="group relative h-[380px] sm:h-[440px] bg-lumiere-secondary overflow-hidden flex flex-col justify-end p-6 sm:p-8 block">
      {/* Background Image with scale animation */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Editorial dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-lumiere-deep/80 via-lumiere-deep/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      </div>

      {/* Content that moves up slightly on hover */}
      <div className="relative z-10 text-white transition-transform duration-500 ease-out group-hover:-translate-y-2">
        <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-white mb-2">
          {title}
        </h3>

        {/* Thin gold line that expands on hover */}
        <div className="w-0 h-[1.5px] bg-lumiere-gold mb-3 transition-all duration-500 ease-out group-hover:w-12" />

        {/* Explore link that fades in */}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-lumiere-bg opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          Explore →
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
