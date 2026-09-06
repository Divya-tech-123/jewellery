import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(redirect);
    } else {
      setErr(res.message || 'Invalid credentials');
    }
  };

  const handleQuickDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@lumiere.com');
      setPassword('Admin@123');
    } else {
      setEmail('client@lumiere.com');
      setPassword('Client@123');
    }
  };

  return (
    <div className="py-20 sm:py-28 bg-lumiere-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-12 border border-lumiere-border shadow-luxury">
        <div className="text-center mb-8">
          <span className="font-eyebrow block mb-2">PRIVILEGED CLIENT PORTAL</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-charcoal font-normal">
            Sign In to Atelier
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
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="client@lumiere.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
            />
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-lumiere-charcoal block mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-lumiere-border p-3 text-xs outline-none focus:border-lumiere-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lumiere-deep text-white py-3.5 text-xs font-semibold tracking-widest uppercase text-center hover:bg-lumiere-gold-hover transition-colors mt-3"
          >
            {loading ? 'Authenticating...' : 'SIGN IN →'}
          </button>
        </form>

        {/* Quick Demo Credentials helper */}
        <div className="mt-8 pt-6 border-t border-lumiere-border text-center">
          <span className="text-[10px] uppercase tracking-wider text-lumiere-light block mb-2">
            Quick Fill Demo Credentials
          </span>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-3 py-1.5 border border-lumiere-border text-[10px] uppercase font-semibold text-lumiere-bronze hover:bg-lumiere-secondary"
            >
              Atelier Director (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('client')}
              className="px-3 py-1.5 border border-lumiere-border text-[10px] uppercase font-semibold text-lumiere-bronze hover:bg-lumiere-secondary"
            >
              Demo Client
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-lumiere-muted">
          New to Lumière?{' '}
          <Link to="/register" className="font-semibold text-lumiere-charcoal underline hover:text-lumiere-gold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
