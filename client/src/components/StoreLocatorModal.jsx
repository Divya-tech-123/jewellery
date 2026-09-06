import React from 'react';
import { X, MapPin, Phone, Clock } from 'lucide-react';

const StoreLocatorModal = ({ isOpen, onClose, onBookConsultation }) => {
  if (!isOpen) return null;

  const boutiques = [
    {
      city: 'Mumbai Flagship',
      area: 'Colaba Causeway',
      address: 'Apollo Bunder, Colaba, Mumbai 400001',
      phone: '+91 22 4910 8800',
      hours: 'Mon – Sun: 11:00 AM – 8:00 PM',
    },
    {
      city: 'New Delhi Atelier',
      area: 'Chanakyapuri',
      address: 'Malcha Marg, Diplomatic Enclave, New Delhi 110021',
      phone: '+91 11 4120 7700',
      hours: 'Mon – Sun: 11:00 AM – 8:00 PM',
    },
    {
      city: 'Bengaluru Salon',
      area: 'UB City',
      address: 'The Collection, UB City, Vittal Mallya Road, Bengaluru 560001',
      phone: '+91 80 4390 1200',
      hours: 'Mon – Sun: 11:00 AM – 8:00 PM',
    },
    {
      city: 'Hyderabad Suite',
      area: 'Jubilee Hills',
      address: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
      phone: '+91 40 4580 9900',
      hours: 'Mon – Sun: 11:00 AM – 8:00 PM',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-lumiere-bg shadow-elevated z-10 p-6 sm:p-10 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-lumiere-charcoal hover:text-lumiere-gold"
        >
          <X size={20} />
        </button>

        <span className="font-eyebrow block mb-2">FLAGSHIP SALONS</span>
        <h3 className="font-serif text-3xl text-lumiere-charcoal font-normal mb-3">
          Our Boutiques
        </h3>
        <p className="text-xs text-lumiere-muted font-light leading-relaxed mb-6">
          Experience our high-jewellery collections in private salons tailored for discerning connoisseurs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {boutiques.map((b, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] p-5 border border-lumiere-border flex flex-col justify-between"
            >
              <div>
                <h4 className="font-serif text-lg text-lumiere-charcoal font-medium mb-1">
                  {b.city}
                </h4>
                <div className="flex items-start gap-2 text-xs text-lumiere-muted mb-2">
                  <MapPin size={14} className="mt-0.5 text-lumiere-bronze flex-shrink-0" />
                  <span>{b.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-lumiere-muted mb-1">
                  <Phone size={13} className="text-lumiere-bronze flex-shrink-0" />
                  <span>{b.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-lumiere-light">
                  <Clock size={13} className="text-lumiere-bronze flex-shrink-0" />
                  <span>{b.hours}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookConsultation();
                }}
                className="mt-4 text-[10px] font-semibold tracking-widest uppercase text-lumiere-gold hover:text-lumiere-charcoal text-left"
              >
                Reserve Chamber →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreLocatorModal;
