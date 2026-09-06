import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${maxWidth} bg-lumiere-bg shadow-elevated z-10 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200`}
      >
        <div className="flex justify-between items-center p-6 border-b border-lumiere-border">
          <h3 className="font-serif text-2xl text-lumiere-charcoal font-normal tracking-wide">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-lumiere-charcoal hover:text-lumiere-gold transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
