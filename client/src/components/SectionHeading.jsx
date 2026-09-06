import React from 'react';

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const isLeft = align === 'left';

  return (
    <div className={`mb-10 sm:mb-14 ${isLeft ? 'text-left' : 'text-center max-w-2xl mx-auto'} ${className}`}>
      {eyebrow && (
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-lumiere-gold block mb-2">
          {eyebrow}
        </span>
      )}
      
      {title && (
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-lumiere-text tracking-tight leading-tight uppercase">
          {title}
        </h2>
      )}

      {/* Thin elegant gold accent */}
      <div className={`w-10 h-[1.5px] bg-lumiere-gold/70 mt-3 mb-3.5 ${isLeft ? '' : 'mx-auto'}`} />

      {subtitle && (
        <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed max-w-lg mx-auto font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
