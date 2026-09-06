import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Bespoke Design Inquiry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', phone: '', subject: 'Bespoke Design Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className="py-16 sm:py-24 bg-lumiere-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="CLIENT SERVICES & CONCIERGE"
          title="Contact the Atelier"
          subtitle="Our Private Client Advisors are at your service for bespoke commissions, bridal appointments, and authentication inquiries."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          {/* Contact Details (col 5) */}
          <div className="lg:col-span-5 bg-white p-8 border border-lumiere-border flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-2xl text-lumiere-charcoal font-normal mb-6">
                Direct Atelier Contact
              </h3>

              <div className="flex flex-col gap-6 text-xs text-lumiere-muted">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-lumiere-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-lumiere-charcoal block mb-0.5">Telephone Concierge</span>
                    <span>+91 22 4910 8800 / +91 98200 11223</span>
                    <span className="block text-[11px] text-lumiere-light">Daily 10:00 AM – 8:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-lumiere-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-lumiere-charcoal block mb-0.5">Private Client Mail</span>
                    <span>concierge@lumiere.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-lumiere-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-lumiere-charcoal block mb-0.5">Executive Salons</span>
                    <p className="leading-relaxed">
                      Mumbai: Apollo Bunder, Colaba 400001<br />
                      New Delhi: Malcha Marg, Chanakyapuri 110021<br />
                      Bengaluru: UB City, Vittal Mallya Rd 560001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-lumiere-border mt-8">
              <span className="font-serif italic text-lg text-lumiere-charcoal block mb-1">
                "Every inquiry is handled with the utmost discretion and care."
              </span>
              <span className="text-[10px] uppercase tracking-widest text-lumiere-gold font-semibold">
                LUMIÈRE PRIVILEGED CONCIERGE
              </span>
            </div>
          </div>

          {/* Form (col 7) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-lumiere-border">
            {sent ? (
              <div className="py-16 text-center flex flex-col items-center">
                <CheckCircle className="text-lumiere-gold mb-3" size={48} />
                <h3 className="font-serif text-3xl text-lumiere-charcoal mb-2">Inquiry Received</h3>
                <p className="text-xs text-lumiere-muted font-light max-w-xs leading-relaxed">
                  Thank you. Your dedicated Private Client Advisor will respond within two business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-serif text-2xl text-lumiere-charcoal font-normal mb-2">
                  Send A Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
                    >
                      <option value="Bespoke Design Inquiry">Bespoke Design Inquiry</option>
                      <option value="Bridal Suite Consultation">Bridal Suite Consultation</option>
                      <option value="Solitaire Diamond Sourcing">Solitaire Diamond Sourcing</option>
                      <option value="Order Assistance">Existing Order Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-lumiere-deep text-white py-3.5 text-xs font-semibold tracking-widest uppercase text-center hover:bg-lumiere-gold-hover transition-colors mt-2"
                >
                  DISPATCH INQUIRY →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
