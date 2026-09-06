import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

const ConsultationModal = ({ isOpen, onClose, initialItemName = '' }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    boutique: 'Mumbai Flagship (Colaba)',
    date: '',
    notes: initialItemName ? `Inquiring for: ${initialItemName}` : '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-lumiere-bg shadow-elevated z-10 p-6 sm:p-10 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-lumiere-charcoal hover:text-lumiere-gold"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-10 text-center flex flex-col items-center">
            <CheckCircle className="text-lumiere-gold mb-4" size={44} />
            <h3 className="font-serif text-3xl text-lumiere-charcoal font-normal mb-2">
              Appointment Reserved
            </h3>
            <p className="text-sm text-lumiere-muted font-light max-w-xs leading-relaxed">
              Our Senior Gemologist will contact you at {formData.phone} to coordinate your private VIP salon viewing.
            </p>
          </div>
        ) : (
          <div>
            <span className="font-eyebrow block mb-2">BESPOKE ATELIER SERVICE</span>
            <h3 className="font-serif text-3xl text-lumiere-charcoal font-normal mb-3">
              Book A Private Consultation
            </h3>
            <p className="text-xs text-lumiere-muted font-light leading-relaxed mb-6">
              Experience Lumière fine jewellery in complete privacy. Meet with our Master Jewellers in our flagship salons or via secure virtual high-definition video.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-lumiere-charcoal block mb-1.5">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs text-lumiere-charcoal focus:border-lumiere-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-lumiere-charcoal block mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs text-lumiere-charcoal focus:border-lumiere-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-lumiere-charcoal block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="client@luxury.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs text-lumiere-charcoal focus:border-lumiere-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-lumiere-charcoal block mb-1.5">
                    Preferred Boutique *
                  </label>
                  <select
                    value={formData.boutique}
                    onChange={(e) => setFormData({ ...formData, boutique: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs text-lumiere-charcoal focus:border-lumiere-gold outline-none"
                  >
                    <option value="Mumbai Flagship (Colaba)">Mumbai Flagship — Colaba</option>
                    <option value="New Delhi Boutique (Chanakyapuri)">New Delhi — Chanakyapuri</option>
                    <option value="Bengaluru Salon (UB City)">Bengaluru — UB City</option>
                    <option value="Hyderabad Suite (Jubilee Hills)">Hyderabad — Jubilee Hills</option>
                    <option value="Virtual Concierge (High-Def Video)">Virtual Concierge — Video</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-lumiere-charcoal block mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs text-lumiere-charcoal focus:border-lumiere-gold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold tracking-widest uppercase text-lumiere-charcoal block mb-1.5">
                  Jewellery of Interest / Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Bridal suites, Solitaire rings, Bespoke craftsmanship..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs text-lumiere-charcoal focus:border-lumiere-gold outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-lumiere-deep text-white py-3.5 text-xs font-semibold tracking-widest uppercase text-center hover:bg-lumiere-gold-hover transition-colors mt-2"
              >
                CONFIRM PRIVATE APPOINTMENT →
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationModal;
