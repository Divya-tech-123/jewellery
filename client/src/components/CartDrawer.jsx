import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import OptimizedImage from './OptimizedImage';

const CartDrawer = () => {
  const { cartItems, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalCount } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-drawer z-10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
        
        {/* Header */}
        <div>
          <div className="flex justify-between items-center pb-5 border-b border-lumiere-border/50 mb-6">
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-lumiere-gold block font-sans">
                YOUR ATELIER BAG
              </span>
              <h3 className="font-serif text-2xl text-lumiere-text font-normal">
                Shopping Bag ({totalCount})
              </h3>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-lumiere-text hover:text-lumiere-gold transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white border border-lumiere-border/60 flex items-center justify-center text-lumiere-gold mb-4 shadow-subtle">
                <ShoppingBag size={22} strokeWidth={1.5} />
              </div>
              <h4 className="font-serif text-xl text-lumiere-text mb-2">Your Bag is Empty</h4>
              <p className="text-xs text-lumiere-muted font-light max-w-xs mb-6 font-sans">
                Explore our fine jewellery creations and curate your private collection.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="text-xs uppercase tracking-[0.18em] font-semibold text-lumiere-text pb-1 border-b border-lumiere-text hover:text-lumiere-gold hover:border-lumiere-gold transition-colors"
              >
                Discover Collections →
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-lumiere-border/40 max-h-[55vh] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedPurity}-${item.selectedSize}`} className="py-4 flex gap-4">
                  
                  {/* Portrait Thumbnail */}
                  <div className="w-20 h-24 bg-[#FAF7F2] overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={item.image || item.images?.[0] || '/assets/category_necklace.webp'}
                      alt={item.name}
                      sizes="thumbnail"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm text-lumiere-text font-normal leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.selectedPurity, item.selectedSize)}
                          className="text-lumiere-muted/60 hover:text-red-600 transition-colors p-1 -mr-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <span className="text-[10px] text-lumiere-gold uppercase tracking-wider block mt-0.5 font-sans">
                        {item.selectedPurity || '22K Gold'} · {item.selectedSize || 'Standard'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Toggles */}
                      <div className="flex items-center border border-lumiere-border/80 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.selectedPurity, item.selectedSize, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-lumiere-text hover:bg-lumiere-cream/40"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold font-sans">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.selectedPurity, item.selectedSize, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-lumiere-text hover:bg-lumiere-cream/40"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-lumiere-text font-sans">
                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-6 border-t border-lumiere-border/50">
            <div className="flex justify-between items-baseline mb-4 font-sans">
              <span className="text-xs uppercase tracking-wider text-lumiere-muted">
                Subtotal (Inc. of Taxes)
              </span>
              <span className="text-xl font-normal text-lumiere-text font-serif">
                ₹{Number(subtotal).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-lumiere-deep hover:bg-lumiere-gold text-white text-xs font-semibold tracking-[0.18em] uppercase py-4 flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
