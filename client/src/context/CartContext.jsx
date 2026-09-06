import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

const CART_STORAGE_KEY = 'lumiere_cart';
const COUPON_STORAGE_KEY = 'lumiere_applied_coupon';

export const CartProvider = ({ children }) => {
  const { showToast } = useToast() || {};

  // 1. Cart Items with localStorage Persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          productId: 'prod-1',
          name: 'Lakshmi Kasu Mala Gold Necklace',
          price: 84500,
          quantity: 1,
          purity: '22K Gold',
          size: '18 inch',
          image: '/assets/category_necklace.jpg',
          slug: 'lakshmi-kasu-mala-gold-necklace',
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // 2. Applied Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
  
  // Calculate discount amount
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round(subtotal * appliedCoupon.value);
    } else if (appliedCoupon.type === 'fixed') {
      discountAmount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  // Insured Shipping: Complimentary above ₹50,000, ₹2,500 otherwise, ₹0 if cart is empty
  const FREE_SHIPPING_THRESHOLD = 50000;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 2500;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalCount = cartItems.reduce((acc, item) => acc + Number(item.quantity), 0);

  // Add to cart with duplicate merging
  const addToCart = (product, quantity = 1, purity = '', size = '', openDrawer = true) => {
    const selectedPurity = purity || (product.purities ? product.purities[0] : product.purity || '22K Gold');
    const selectedSize = size || (product.sizes ? product.sizes[0] : 'Standard');
    const prodId = String(product._id || product.id || product.slug);

    let addedItemData = null;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === prodId && item.purity === selectedPurity && item.size === selectedSize
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + Number(quantity),
        };
        addedItemData = updated[existingIdx];
        return updated;
      } else {
        const newItem = {
          productId: prodId,
          name: product.name,
          price: Number(product.price),
          quantity: Number(quantity),
          purity: selectedPurity,
          size: selectedSize,
          image: product.images && product.images.length > 0 ? product.images[0] : '/assets/category_necklace.jpg',
          slug: product.slug,
        };
        addedItemData = newItem;
        return [...prev, newItem];
      }
    });

    // Toast Notification
    if (showToast && addedItemData) {
      showToast({
        type: 'cart',
        title: 'Added to Shopping Bag',
        item: addedItemData || {
          name: product.name,
          purity: selectedPurity,
          size: selectedSize,
          price: product.price,
          image: product.images?.[0] || '/assets/category_necklace.jpg',
        },
        onViewCart: () => setIsCartOpen(true),
      });
    }

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => {
      const removedItem = prev[index];
      const next = prev.filter((_, i) => i !== index);
      if (showToast && removedItem) {
        showToast({
          type: 'info',
          title: 'Removed from Bag',
          message: `${removedItem.name} has been removed from your shopping bag.`,
        });
      }
      return next;
    });
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: Math.min(99, Number(newQuantity)),
      };
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Voucher Promo Code Support
  const applyPromoCode = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();

    if (!cleanCode) {
      return { success: false, message: 'Please enter a valid coupon code.' };
    }

    if (cleanCode === 'LUMIERE10') {
      const coupon = { code: 'LUMIERE10', label: 'Privilege Atelier 10% Off', type: 'percentage', value: 0.10 };
      setAppliedCoupon(coupon);
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Privilege Code Applied',
          message: '10% discount has been applied to your acquisition total.',
        });
      }
      return { success: true, message: 'Privilege Atelier 10% Discount Applied' };
    }

    if (cleanCode === 'GOLD5') {
      const coupon = { code: 'GOLD5', label: 'Fine Gold 5% Benefit', type: 'percentage', value: 0.05 };
      setAppliedCoupon(coupon);
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Benefit Code Applied',
          message: '5% fine gold benefit applied to your total.',
        });
      }
      return { success: true, message: 'Fine Gold 5% Discount Applied' };
    }

    if (cleanCode === 'FESTIVE5000') {
      if (subtotal < 50000) {
        return { success: false, message: 'Code FESTIVE5000 requires a minimum order value of ₹50,000' };
      }
      const coupon = { code: 'FESTIVE5000', label: 'Festive Tier ₹5,000 Benefit', type: 'fixed', value: 5000 };
      setAppliedCoupon(coupon);
      if (showToast) {
        showToast({
          type: 'success',
          title: 'Festive Tier Applied',
          message: 'Flat ₹5,000 festive benefit applied to your order.',
        });
      }
      return { success: true, message: 'Festive Flat ₹5,000 Discount Applied' };
    }

    return {
      success: false,
      message: 'Invalid promo code. Try LUMIERE10 for 10% off or GOLD5 for 5% off.',
    };
  };

  const removePromoCode = () => {
    setAppliedCoupon(null);
    if (showToast) {
      showToast({
        type: 'info',
        title: 'Coupon Removed',
        message: 'Coupon code has been removed.',
      });
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        subtotal,
        shippingFee,
        discountAmount,
        total,
        appliedCoupon,
        promoDiscount: appliedCoupon ? (appliedCoupon.type === 'percentage' ? appliedCoupon.value : appliedCoupon.value / (subtotal || 1)) : 0,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
