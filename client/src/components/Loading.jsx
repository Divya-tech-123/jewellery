import React from 'react';

const Loading = ({ text = 'Loading Atelier Creations...' }) => {
  return (
    <div className="min-h-[320px] flex flex-col items-center justify-center py-16">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-[1.5px] border-lumiere-border" />
        <div className="absolute inset-0 rounded-full border-[1.5px] border-lumiere-gold border-t-transparent animate-spin" />
      </div>
      <p className="font-serif text-base tracking-widest text-lumiere-bronze uppercase">
        {text}
      </p>
    </div>
  );
};

export default Loading;
