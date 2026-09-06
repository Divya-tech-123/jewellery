import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const MobileBottomNav = () => {
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-lumiere-bg/95 backdrop-blur-md border-t border-lumiere-border shadow-[0_-4px_16px_rgba(45,40,35,0.06)] px-2 py-1.5"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around">
        {/* 1. Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-md transition-colors ${
              isActive ? 'text-lumiere-gold font-semibold' : 'text-lumiere-text/75 hover:text-lumiere-text'
            }`
          }
        >
          <Home size={19} strokeWidth={1.8} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </NavLink>

        {/* 2. Categories */}
        <NavLink
          to="/collections"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-md transition-colors ${
              isActive ? 'text-lumiere-gold font-semibold' : 'text-lumiere-text/75 hover:text-lumiere-text'
            }`
          }
        >
          <Grid size={19} strokeWidth={1.8} />
          <span className="text-[10px] mt-0.5 tracking-tight">Categories</span>
        </NavLink>

        {/* 3. Wishlist */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-md transition-colors relative ${
              isActive ? 'text-lumiere-gold font-semibold' : 'text-lumiere-text/75 hover:text-lumiere-text'
            }`
          }
        >
          <div className="relative">
            <Heart size={19} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-lumiere-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Wishlist</span>
        </NavLink>

        {/* 4. Cart Button */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-md transition-colors text-lumiere-text/75 hover:text-lumiere-text relative"
        >
          <div className="relative">
            <ShoppingBag size={19} strokeWidth={1.8} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-lumiere-deep text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
        </button>

        {/* 5. Account */}
        <NavLink
          to={user ? '/account' : '/login'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[44px] rounded-md transition-colors ${
              isActive ? 'text-lumiere-gold font-semibold' : 'text-lumiere-text/75 hover:text-lumiere-text'
            }`
          }
        >
          <User size={19} strokeWidth={1.8} />
          <span className="text-[10px] mt-0.5 tracking-tight">{user ? 'Account' : 'Login'}</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
