import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2, ShieldCheck, Tag, Sparkles, Truck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SectionHeading from '../components/SectionHeading';
import OptimizedImage from '../components/OptimizedImage';

const Cart = () => {
  const {
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
  const diff = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

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

  if (cartItems.length === 0) {
    return (
      <div className="py-24 sm:py-32 bg-lumiere-bg text-center px-4">
        <div className="w-20 h-20 rounded-full bg-white border border-lumiere-border flex items-center justify-center mx-auto mb-6 text-lumiere-gold shadow-sm">
          <ShieldCheck size={36} strokeWidth={1.5} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-lumiere-gold block mb-2">
          ATELIER BAG
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-text font-normal mb-4">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-lumiere-muted font-light max-w-md mx-auto mb-8 leading-relaxed">
          Explore our certified 22K gold heirlooms, diamond solitaires, and master karigar temple jewellery.
        </p>
        <Link to="/shop" className="btn-primary-indian text-xs py-3.5 px-8">
          EXPLORE CATALOGUE →
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-lumiere-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-lumiere-gold block mb-1">
            BAG REVIEW
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-text font-normal">
            Your Selected Heirlooms ({totalCount})
          </h1>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-white p-4 border border-lumiere-border mb-8 max-w-4xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
            <span className="font-medium text-lumiere-text flex items-center gap-1.5">
              <Sparkles size={14} className="text-lumiere-gold" />
              {subtotal >= freeThreshold ? (
                <strong className="text-emerald-800">You qualify for Complimentary Fully-Insured Courier!</strong>
              ) : (
                <span>
                  Add <strong className="text-lumiere-text font-bold">₹{diff.toLocaleString('en-IN')}</strong> more for Complimentary Insured Courier.
                </span>
              )}
            </span>
            <span className="text-[11px] text-lumiere-muted">Threshold: ₹{freeThreshold.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-full h-1.5 bg-lumiere-border/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lumiere-gold to-lumiere-gold-dark transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Items List (col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.map((item, idx) => (
              <div
                key={`${item.productId}-${item.purity}-${item.size}-${idx}`}
                className="bg-white p-4 sm:p-6 border border-lumiere-border flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="w-24 h-28 sm:w-28 sm:h-32 bg-[#FAF7F2] border border-lumiere-border/60 overflow-hidden flex-shrink-0">
                  <OptimizedImage
                    src={item.image || '/assets/category_necklace.webp'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    sizes="thumbnail"
                    aspectRatio="24/28"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <Link to={item.slug || item.productId ? `/product/${item.slug || item.productId}` : '/shop'} className="hover:text-lumiere-gold transition-colors">
                    <h3 className="font-serif text-lg sm:text-xl text-lumiere-text font-medium mb-1">
                      {item.name}
                    </h3>
                  </Link>

                  <div className="text-xs text-lumiere-bronze tracking-wider uppercase mb-3 flex flex-wrap justify-center sm:justify-start gap-2">
                    {item.purity && <span>{item.purity}</span>}
                    {item.size && <span>• Dimension: {item.size}</span>}
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <span className="text-sm sm:text-base font-bold text-lumiere-text">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-lumiere-muted">
                        (₹{(item.price * item.quantity).toLocaleString('en-IN')} subtotal)
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Stepper & Remove */}
                <div className="flex items-center gap-4 sm:flex-col sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-lumiere-border/60">
                  <div className="flex items-center border border-lumiere-border bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(idx, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-xs hover:bg-lumiere-cream text-lumiere-text font-bold transition-colors"
                      aria-label="Decrease quantity"
                    >
                      –
                    </button>
                    <span className="px-3 text-xs font-bold text-lumiere-text min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(idx, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-xs hover:bg-lumiere-cream text-lumiere-text font-bold transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(idx)}
                    className="p-1.5 text-lumiere-muted hover:text-red-600 transition-colors flex items-center gap-1 text-xs"
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                    <span className="text-[11px] uppercase tracking-wider">Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Assurance Strip */}
            <div className="bg-white p-4 border border-lumiere-border text-xs text-lumiere-muted flex flex-wrap items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <Truck size={16} className="text-lumiere-gold" />
                <span>Complimentary Fully Insured Transit</span>
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-lumiere-gold" />
                <span>100% BIS 916 Hallmarked & Certified</span>
              </span>
              <span className="flex items-center gap-2">
                <Lock size={16} className="text-lumiere-gold" />
                <span>256-Bit Encrypted Secure Checkout</span>
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary Card (col 4) */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 border border-lumiere-border shadow-sm sticky top-24">
            <h3 className="font-serif text-2xl text-lumiere-text font-normal pb-4 border-b border-lumiere-border mb-5">
              Order Summary
            </h3>

            {/* Voucher Coupon Section */}
            <div className="mb-6">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-3 text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-emerald-700" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <span className="text-[11px] block text-emerald-700">{appliedCoupon.label}</span>
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
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. LUMIERE10)"
                      value={promoCodeInput}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value);
                        if (promoMsg.text) setPromoMsg({ text: '', isError: false });
                      }}
                      className="flex-1 bg-[#FAF7F2] border border-lumiere-border px-3 py-2.5 text-xs uppercase outline-none focus:border-lumiere-gold"
                    />
                    <button
                      type="submit"
                      className="bg-lumiere-deep text-white px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold hover:bg-lumiere-gold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMsg.text && (
                    <p className={`text-xs font-medium ${promoMsg.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                      {promoMsg.text}
                    </p>
                  )}
                  <span className="text-[10px] text-lumiere-muted block">
                    Use code <strong>LUMIERE10</strong> for 10% privilege discount.
                  </span>
                </form>
              )}
            </div>

            {/* Financial Details */}
            <div className="space-y-3 text-xs text-lumiere-muted border-t border-lumiere-border/80 pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({totalCount} items)</span>
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

              <div className="flex justify-between text-lg font-bold text-lumiere-text pt-4 border-t border-lumiere-border">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] text-lumiere-muted block text-right">
                All applicable taxes and hallmarking fees included
              </span>
            </div>

            {/* Checkout Action */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full bg-lumiere-deep text-white py-4 text-xs font-bold tracking-[0.2em] uppercase text-center hover:bg-lumiere-gold-dark transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
