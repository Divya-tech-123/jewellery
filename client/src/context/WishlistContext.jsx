import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_wishlist');
      return saved ? JSON.parse(saved) : ['2', '7']; // Celeste ring & Sitara chandbali default saved
    } catch (e) {
      return ['2'];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumiere_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync wishlist from user profile if logged in
  useEffect(() => {
    if (user && user.wishlist && Array.isArray(user.wishlist)) {
      const ids = user.wishlist.map(item => (typeof item === 'object' ? item._id : item));
      if (ids.length > 0) {
        setWishlist(ids);
      }
    }
  }, [user]);

  const toggleWishlist = async (productId) => {
    const prodId = String(productId);
    const exists = wishlist.includes(prodId);

    const updated = exists
      ? wishlist.filter(id => id !== prodId)
      : [...wishlist, prodId];

    setWishlist(updated);

    if (user) {
      try {
        await api.post('/users/wishlist', { productId: prodId });
      } catch (err) {
        console.error('Failed to sync wishlist with backend', err);
      }
    }

    return !exists;
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(String(productId));
  };

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
