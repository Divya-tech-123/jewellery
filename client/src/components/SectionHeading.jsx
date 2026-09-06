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
    <div className={`mb-12 sm:mb-16 ${isLeft ? 'text-left' : 'text-center max-w-2xl mx-auto'} ${className}`}>
      {eyebrow && (
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] text-lumiere-gold block mb-2 font-sans">
          {eyebrow}
        </span>
      )}
      
      {title && (
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-lumiere-text tracking-tight leading-tight">
          {title}
        </h2>
      )}

      {/* Subtle gold divider */}
      <div className={`w-12 h-[1.5px] bg-lumiere-gold/60 mt-3.5 mb-4 ${isLeft ? '' : 'mx-auto'}`} />

      {subtitle && (
        <p className="text-xs sm:text-sm text-lumiere-muted font-light leading-relaxed max-w-lg mx-auto font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
