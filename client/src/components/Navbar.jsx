import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jewellery', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'New Arrivals', path: '/shop?collection=New+Arrivals' },
    { name: 'Bridal', path: '/category/bridal' },
    { name: 'Offers', path: '/shop?collection=Offers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate('/shop?search=' + encodeURIComponent(mobileSearchQuery.trim()));
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ease-smooth ${
          isScrolled
            ? 'bg-lumiere-bg shadow-[0_2px_12px_rgba(45,40,35,0.06)] border-b border-lumiere-border/80 py-2 sm:py-3'
            : 'bg-lumiere-bg/95 backdrop-blur-sm border-b border-lumiere-border/50 py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* =========================================================
              MOBILE HEADER (Layout: ☰   LUMIERE   ♡   🛍)
              ========================================================= */}
          <div className="flex lg:hidden items-center justify-between h-12">
            {/* Left: Clean Hamburger Menu Button */}
            <button
              type="button"
              className="p-2 -ml-2 text-lumiere-text hover:text-lumiere-gold transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} strokeWidth={1.8} />
            </button>

            {/* Center: Centered Brand Logo */}
            <div className="flex-1 text-center">
              <Link to="/" className="inline-block">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.18em] text-lumiere-text uppercase">
                  LUMIÈRE
                </span>
                <span className="block text-[8px] tracking-[0.24em] text-lumiere-gold font-medium -mt-1 uppercase">
                  FINE JEWELLERY
                </span>
              </Link>
            </div>

            {/* Right: Wishlist ♡ & Shopping Bag 🛍 */}
            <div className="flex items-center gap-1.5 -mr-1">
              <Link
                to="/wishlist"
                className="p-2 text-lumiere-text hover:text-lumiere-gold transition-colors relative"
                aria-label="Saved Wishlist"
              >
                <Heart size={20} strokeWidth={1.8} />
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
                <ShoppingBag size={20} strokeWidth={1.8} />
                {totalCount > 0 && (
                  <span className="absolute top-1 right-1 bg-lumiere-deep text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* =========================================================
              DESKTOP HEADER (Layout: LOGO | NAV LINKS | ACTIONS)
              ========================================================= */}
          <div className="hidden lg:flex items-center justify-between h-14">
            {/* Left: Brand Logo */}
            <div className="flex items-center">
              <Link to="/" className="inline-block group">
                <span className="font-serif text-2xl xl:text-3xl font-bold tracking-[0.16em] text-lumiere-text uppercase group-hover:text-lumiere-gold transition-colors">
                  LUMIÈRE
                </span>
                <span className="block text-[9px] tracking-[0.22em] text-lumiere-gold font-medium uppercase -mt-1">
                  FINE JEWELLERY
                </span>
              </Link>
            </div>

            {/* Center: Modern Indian Jewellery Navigation */}
            <nav className="flex items-center gap-7 xl:gap-9 text-xs font-semibold tracking-wider uppercase">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `transition-colors py-1 relative hover:text-lumiere-gold ${
                      isActive ? 'text-lumiere-gold font-bold' : 'text-lumiere-text/90'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right: Search, Account, Wishlist, Cart */}
            <div className="flex items-center gap-5">
              {/* Search */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 p-1.5 text-lumiere-text/80 hover:text-lumiere-gold transition-colors text-xs font-medium"
                aria-label="Search Jewellery"
                title="Search"
              >
                <Search size={18} strokeWidth={1.8} />
                <span className="hidden xl:inline tracking-normal text-[11px] text-lumiere-muted">Search</span>
              </button>

              {/* Account / Admin */}
              <Link
                to={user ? (isAdmin ? '/admin' : '/account') : '/login'}
                className="p-1.5 text-lumiere-text/80 hover:text-lumiere-gold transition-colors relative"
                aria-label="Account"
                title={user ? (isAdmin ? 'Admin Portal' : user.name) : 'Sign In'}
              >
                <User size={18} strokeWidth={1.8} />
                {isAdmin && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-lumiere-gold rounded-full ring-2 ring-white" />
                )}
              </Link>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-1.5 text-lumiere-text/80 hover:text-lumiere-gold transition-colors relative"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={18} strokeWidth={1.8} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-lumiere-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart */}
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2 bg-lumiere-deep text-white px-3.5 py-2 text-xs font-medium tracking-wide hover:bg-lumiere-gold transition-all duration-200"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={15} strokeWidth={1.8} />
                <span>Cart</span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {totalCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          DEDICATED MOBILE DRAWER (Full navigation & quick search)
          ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-lumiere-bg h-full shadow-drawer flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-lumiere-border bg-lumiere-cream/40">
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-lumiere-text">
                  LUMIÈRE
                </span>
                <span className="block text-[8px] tracking-[0.2em] text-lumiere-gold font-semibold uppercase">
                  SOUTH INDIAN JEWELLERY
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-lumiere-text/80 hover:text-lumiere-gold"
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Prominent Search Bar */}
            <div className="p-4 border-b border-lumiere-border bg-white/70">
              <form onSubmit={handleMobileSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search Jewellery (e.g. 22K Gold, Jhumkas)..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  className="w-full bg-lumiere-bg border border-lumiere-border text-xs py-2.5 pl-9 pr-3 rounded-none focus:outline-none focus:border-lumiere-gold"
                />
                <Search size={16} className="absolute left-3 top-3 text-lumiere-muted" />
              </form>
            </div>

            {/* Quick Category Chips */}
            <div className="px-4 py-3 border-b border-lumiere-border/60 bg-lumiere-cream/30">
              <span className="text-[10px] uppercase tracking-wider text-lumiere-muted font-bold block mb-2">
                Popular Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Rings', 'Earrings', 'Necklaces', 'Chains', 'Bangles', 'Pendants'].map((cat) => (
                  <Link
                    key={cat}
                    to={'/shop?category=' + encodeURIComponent(cat)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] bg-white border border-lumiere-border px-2.5 py-1 text-lumiere-text hover:border-lumiere-gold hover:text-lumiere-gold transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Menu Links */}
            <nav className="flex flex-col py-3 text-xs font-semibold tracking-wide uppercase">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-5 py-3 text-lumiere-text hover:bg-lumiere-cream/50 hover:text-lumiere-gold transition-colors border-b border-lumiere-border/40 min-h-[44px]"
                >
                  <span>{link.name}</span>
                  <ChevronRight size={15} className="text-lumiere-muted" />
                </Link>
              ))}
            </nav>

            {/* South Indian Hallmark & Trust Strip */}
            <div className="mx-4 my-4 p-3 bg-white border border-lumiere-border/80 flex items-center gap-3">
              <ShieldCheck size={26} className="text-lumiere-gold shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-lumiere-text block">100% BIS 916 Hallmarked</span>
                <span className="text-[10px] text-lumiere-muted block leading-tight">Govt. of India certified purity on every gold piece</span>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-4 mt-auto border-t border-lumiere-border bg-lumiere-cream/20">
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-primary-indian text-xs py-3 text-center block"
              >
                EXPLORE ALL JEWELLERY →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
