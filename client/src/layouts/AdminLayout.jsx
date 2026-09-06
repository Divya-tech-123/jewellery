import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Layers, Image as ImageIcon, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-lumiere-bg flex flex-col items-center justify-center p-6 text-center">
        <span className="font-serif text-3xl mb-2 text-lumiere-charcoal">LUMIÈRE</span>
        <h2 className="font-serif text-xl text-lumiere-charcoal mb-4">
          Atelier Director Access Required
        </h2>
        <p className="text-xs text-lumiere-muted max-w-sm mb-6">
          You must be signed in with an administrator account to view the Lumière executive atelier portal.
        </p>
        <Link to="/login" className="btn-luxury-primary text-xs py-3 px-6">
          Sign In As Administrator
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', to: '/admin', icon: <LayoutDashboard size={17} /> },
    { label: 'Hero Banners', to: '/admin/banners', icon: <ImageIcon size={17} /> },
    { label: 'Products', to: '/admin/products', icon: <Package size={17} /> },
    { label: 'Orders', to: '/admin/orders', icon: <ShoppingCart size={17} /> },
    { label: 'Customers', to: '/admin/users', icon: <Users size={17} /> },
    { label: 'Categories', to: '/admin/categories', icon: <Layers size={17} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-lumiere-charcoal flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-lumiere-deep text-white flex flex-col justify-between p-6">
        <div>
          <div className="pb-6 border-b border-white/10 mb-6">
            <Link to="/" className="block">
              <span className="font-serif text-2xl tracking-[0.25em] font-normal uppercase text-white">
                LUMIÈRE
              </span>
              <span className="block text-[8px] tracking-[0.3em] text-lumiere-gold uppercase mt-0.5">
                EXECUTIVE ATELIER
              </span>
            </Link>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wider uppercase transition-colors ${
                    active
                      ? 'bg-white/10 text-lumiere-gold font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
            <span>Return to Boutique</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-xs text-white/60 hover:text-red-400 transition-colors text-left"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
