import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jewellery', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'New Arrivals', path: '/shop?collection=New+Arrivals' },
    { name: 'Bridal', path: '/category/bridal' },
    { name: 'Occasions', path: '/shop?collection=Festival' },
    { name: 'Offers', path: '/shop?collection=Offers' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(45,40,35,0.04)] border-b border-lumiere-border/50 py-3 sm:py-3.5'
            : 'bg-[#FDFBF7]/90 backdrop-blur-sm border-b border-lumiere-border/30 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* MOBILE HEADER */}
          <div className="flex lg:hidden items-center justify-between h-11">
            <button
              type="button"
              className="p-2 -ml-2 text-lumiere-text hover:text-lumiere-gold transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation"
            >
              <Menu size={22} strokeWidth={1.6} />
            </button>

            <div className="flex-1 text-center">
              <Link to="/" className="inline-block">
                <span className="font-serif text-xl sm:text-2xl font-normal tracking-[0.2em] text-lumiere-text uppercase">
                  LUMIÈRE
                </span>
                <span className="block text-[8px] tracking-[0.28em] text-lumiere-gold font-medium -mt-1 uppercase">
                  FINE JEWELLERY
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-1 -mr-1">
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-lumiere-text hover:text-lumiere-gold transition-colors"
                aria-label="Search"
              >
                <Search size={19} strokeWidth={1.6} />
              </button>

              <Link
                to="/wishlist"
                className="p-2 text-lumiere-text hover:text-lumiere-gold transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.6} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-lumiere-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="p-2 text-lumiere-text hover:text-lumiere-gold transition-colors relative"
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={19} strokeWidth={1.6} />
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 bg-lumiere-deep text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER: LEFT LOGO | CENTER NAV | RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center justify-between h-12">
            
            {/* LEFT: Logo */}
            <div className="flex items-center min-w-[200px]">
              <Link to="/" className="inline-block group">
                <span className="font-serif text-2xl xl:text-3xl font-normal tracking-[0.18em] text-lumiere-text uppercase group-hover:text-lumiere-gold transition-colors duration-300">
                  LUMIÈRE
                </span>
                <span className="block text-[8.5px] tracking-[0.3em] text-lumiere-gold font-medium uppercase -mt-0.5">
                  HAUTE JOAILLERIE
                </span>
              </Link>
            </div>

            {/* CENTER: Navigation Links with Growing Gold Underline */}
            <nav className="flex items-center gap-7 xl:gap-9 text-[12px] font-medium tracking-[0.14em] uppercase font-sans">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `group relative py-1.5 transition-colors duration-300 ${
                      isActive ? 'text-lumiere-gold font-semibold' : 'text-lumiere-text/90 hover:text-lumiere-gold'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {/* Growing Gold Underline */}
                      <span
                        className={`absolute bottom-0 left-0 h-[1.5px] bg-lumiere-gold transition-all duration-300 ease-out ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Search, Account, Wishlist, Cart */}
            <div className="flex items-center gap-5 xl:gap-6 min-w-[200px] justify-end">
              
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-lumiere-text hover:text-lumiere-gold transition-colors duration-300 group"
                aria-label="Search Collection"
              >
                <Search size={17} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
                <span className="hidden xl:inline text-[11px] font-medium tracking-widest">SEARCH</span>
              </button>

              <Link
                to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
                className="text-lumiere-text hover:text-lumiere-gold transition-colors p-1"
                aria-label="Account"
                title={user ? `Signed in as ${user.name || 'Patron'}` : 'Sign In'}
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              <Link
                to="/wishlist"
                className="text-lumiere-text hover:text-lumiere-gold transition-colors relative p-1"
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-lumiere-accent text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="text-lumiere-text hover:text-lumiere-gold transition-colors relative p-1 flex items-center gap-1.5"
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span className="text-[11px] font-semibold tracking-wider font-sans">
                  ({totalCount})
                </span>
              </button>

            </div>

          </div>

        </div>
      </header>

      {/* MOBILE FULL-SCREEN SLIDE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm h-full bg-[#FDFBF7] shadow-drawer z-10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-lumiere-border/50 mb-6">
                <div>
                  <span className="font-serif text-xl font-normal tracking-[0.18em] text-lumiere-text uppercase block">
                    LUMIÈRE
                  </span>
                  <span className="text-[8px] tracking-[0.25em] text-lumiere-gold font-medium uppercase">
                    FINE JEWELLERY
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-lumiere-text hover:text-lumiere-gold"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-sm tracking-[0.16em] uppercase py-1.5 flex items-center justify-between transition-colors ${
                        isActive ? 'text-lumiere-gold font-semibold' : 'text-lumiere-text hover:text-lumiere-gold'
                      }`
                    }
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={14} className="text-lumiere-muted/60" />
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-lumiere-border/50 flex flex-col gap-3 text-xs tracking-wider uppercase text-lumiere-muted font-medium">
              <Link
                to={user ? '/account' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lumiere-text hover:text-lumiere-gold py-1"
              >
                <User size={15} />
                <span>{user ? 'My Account' : 'Sign In / Register'}</span>
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lumiere-text hover:text-lumiere-gold py-1"
              >
                <Heart size={15} />
                <span>Saved Wishlist ({wishlistCount})</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
