import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    totalCount,
    removeFromCart,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    appliedCoupon,
    freeShippingThreshold,
  } = useCart();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMsg, setPromoMsg] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  const freeThreshold = freeShippingThreshold || 50000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const diff = Math.max(0, freeThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyPromoCode(promoCodeInput);
    setPromoMsg({
      text: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setPromoCodeInput('');
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm cursor-pointer"
            onClick={closeCart}
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full max-w-md bg-lumiere-bg h-full shadow-[0_0_50px_rgba(0,0,0,0.3)] z-10 flex flex-col justify-between"
            aria-label="Shopping Bag Drawer"
          >
            {/* 1. Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-lumiere-border bg-white/80 backdrop-blur-md">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-lumiere-gold block">
                  ATELIER ACQUISITIONS
                </span>
                <h3 className="font-serif text-2xl text-lumiere-text font-normal">
                  Shopping Bag ({totalCount})
                </h3>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="w-8 h-8 rounded-full flex items-center justify-center text-lumiere-text hover:text-lumiere-gold hover:bg-lumiere-cream transition-all"
                aria-label="Close Shopping Bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* 2. Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Complimentary Insured Courier Progress Indicator */}
              <div className="bg-white p-3.5 border border-lumiere-border/80 shadow-sm rounded-none">
                <div className="text-[11px] font-medium tracking-wide text-lumiere-text text-center mb-2">
                  {subtotal >= freeThreshold ? (
                    <span className="text-emerald-800 font-semibold flex items-center justify-center gap-1">
                      <Sparkles size={13} className="text-lumiere-gold" />
                      <span>Complimentary Insured Courier Unlocked!</span>
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-lumiere-text font-bold">₹{diff.toLocaleString('en-IN')}</strong> more for Complimentary Courier.
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-lumiere-border/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-lumiere-gold via-lumiere-gold-light to-lumiere-gold transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              {cartItems.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-lumiere-cream/80 border border-lumiere-border flex items-center justify-center mx-auto mb-4 text-lumiere-gold">
                    <ShieldCheck size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="font-serif text-2xl text-lumiere-text mb-2">
                    Your bag is currently empty
                  </h4>
                  <p className="text-xs text-lumiere-muted font-light mb-6 max-w-xs mx-auto leading-relaxed">
                    Discover hallmark gold necklaces, diamond earrings, and signature temple jewels.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="btn-primary-indian text-xs py-3 px-6 block text-center"
                  >
                    EXPLORE ATELIER CREATIONS →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-lumiere-border/60">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.productId}-${item.purity}-${item.size}-${idx}`} className="py-4 first:pt-0 flex gap-4 items-center">
                      <div className="w-20 h-24 bg-[#FAF7F2] border border-lumiere-border/60 overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.image || '/assets/category_necklace.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={item.slug || item.productId ? `/product/${item.slug || item.productId}` : '/shop'}
                          onClick={closeCart}
                          className="hover:text-lumiere-gold transition-colors"
                        >
                          <h4 className="font-serif text-sm font-semibold text-lumiere-text truncate mb-0.5">
                            {item.name}
                          </h4>
                        </Link>

                        <div className="text-[10px] text-lumiere-bronze tracking-wider uppercase mb-1.5 flex flex-wrap gap-1">
                          {item.purity && <span>{item.purity}</span>}
                          {item.size && <span>• {item.size}</span>}
                        </div>

                        <div className="text-xs font-bold text-lumiere-text mb-2.5">
                          ₹{Number(item.price).toLocaleString('en-IN')}
                        </div>

                        {/* Quantity Stepper & Remove */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-lumiere-border bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(idx, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-xs hover:bg-lumiere-cream text-lumiere-text transition-colors font-bold"
                              aria-label="Decrease quantity"
                            >
                              –
                            </button>
                            <span className="px-2.5 text-xs font-bold text-lumiere-text min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(idx, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-xs hover:bg-lumiere-cream text-lumiere-text transition-colors font-bold"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(idx)}
                            className="text-[10px] uppercase tracking-wider text-lumiere-muted hover:text-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Footer Summary & Checkout Action */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-[#FAF7F2] border-t border-lumiere-border space-y-4">
                {/* Promo Code Voucher Form */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-emerald-700" />
                      <div>
                        <span className="font-bold">{appliedCoupon.code}</span>
                        <span className="text-[10px] block text-emerald-700">{appliedCoupon.label}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[10px] uppercase font-bold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Voucher (e.g. LUMIERE10)"
                        value={promoCodeInput}
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value);
                          if (promoMsg.text) setPromoMsg({ text: '', isError: false });
                        }}
                        className="flex-1 bg-white border border-lumiere-border px-3 py-2 text-xs uppercase outline-none focus:border-lumiere-gold rounded-none"
                      />
                      <button
                        type="submit"
                        className="bg-lumiere-deep text-white px-4 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-lumiere-gold transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                    {promoMsg.text && (
                      <p className={`text-[11px] mt-1.5 font-medium ${promoMsg.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                        {promoMsg.text}
                      </p>
                    )}
                  </div>
                )}

                {/* Financial Summary */}
                <div className="space-y-1.5 text-xs text-lumiere-muted pt-2 border-t border-lumiere-border/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-lumiere-text font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-medium">
                      <span>Privilege Discount</span>
                      <span>–₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Insured Courier Delivery</span>
                    <span className={shippingFee === 0 ? 'text-lumiere-gold font-bold' : 'text-lumiere-text font-medium'}>
                      {shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-lumiere-text pt-2.5 border-t border-lumiere-border">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCheckoutClick}
                    className="w-full bg-lumiere-deep text-white py-3.5 text-xs font-bold tracking-[0.18em] uppercase hover:bg-lumiere-gold-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={handleViewCartClick}
                    className="w-full bg-white border border-lumiere-border text-lumiere-text py-2.5 text-[11px] font-semibold tracking-wider uppercase hover:border-lumiere-gold hover:text-lumiere-gold transition-colors text-center"
                  >
                    View Full Bag Details
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
