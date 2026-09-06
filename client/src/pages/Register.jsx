import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/account');
    } else {
      setErr(res.message || 'Registration failed');
    }
  };

  return (
    <div className="py-20 sm:py-28 bg-lumiere-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-12 border border-lumiere-border shadow-luxury">
        <div className="text-center mb-8">
          <span className="font-eyebrow block mb-2">JOIN THE ATELIER</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-charcoal font-normal">
            Create an Account
          </h1>
        </div>

        {err && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-xs text-red-700 text-center">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Radhika Sen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              placeholder="client@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
              Mobile Number (WhatsApp)
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
              Password * (min 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lumiere-deep text-white py-3.5 text-xs font-semibold tracking-widest uppercase text-center hover:bg-lumiere-gold-hover transition-colors mt-3"
          >
            {loading ? 'Creating Account...' : 'REGISTER →'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-lumiere-muted">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-lumiere-charcoal underline hover:text-lumiere-gold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
