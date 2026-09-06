import React from 'react';

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = '',
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center max-w-2xl mx-auto' : ''} ${className}`}>
      {eyebrow && (
        <span className="font-eyebrow block mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl text-lumiere-charcoal mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-lumiere-muted font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
