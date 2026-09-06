import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, ShoppingBag, ArrowRight } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({
    type = 'success', // 'success', 'error', 'info', 'cart'
    title = '',
    message = '',
    item = null,
    onViewCart = null,
    duration = 4200,
  }) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const newToast = { id, type, title, message, item, onViewCart };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Keep max 4 visible

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Luxury Toasts Container */}
      <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.94 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto bg-[#2D2823] text-white border border-[#B58A45]/40 shadow-[0_12px_36px_rgba(0,0,0,0.35)] p-3.5 sm:p-4 relative overflow-hidden group backdrop-blur-md"
            >
              {/* Subtle Gold Accent Top Strip */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#B58A45] via-[#E2C792] to-[#B58A45]" />

              {/* Toast Type: Cart Item Added */}
              {toast.type === 'cart' && toast.item ? (
                <div className="flex items-start gap-3">
                  <div className="w-12 h-14 bg-white/10 border border-white/20 overflow-hidden flex-shrink-0">
                    <img
                      src={toast.item.image || '/assets/category_necklace.jpg'}
                      alt={toast.item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-lumiere-gold-light text-[10px] font-bold tracking-widest uppercase mb-0.5">
                      <CheckCircle2 size={12} className="text-[#E2C792]" />
                      <span>{toast.title || 'Added to Shopping Bag'}</span>
                    </div>

                    <h4 className="font-serif text-xs sm:text-sm font-medium text-white truncate mb-0.5">
                      {toast.item.name}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-white/70">
                      {toast.item.purity && <span>{toast.item.purity}</span>}
                      {toast.item.size && <span>• {toast.item.size}</span>}
                      <span className="font-bold text-white ml-auto">
                        ₹{Number(toast.item.price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {toast.onViewCart && (
                      <button
                        type="button"
                        onClick={() => {
                          removeToast(toast.id);
                          toast.onViewCart();
                        }}
                        className="mt-2 text-[10px] font-bold tracking-wider uppercase text-[#E2C792] hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <ShoppingBag size={11} />
                        <span>View Bag & Checkout</span>
                        <ArrowRight size={10} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="text-white/50 hover:text-white p-1 -mr-1 -mt-1 transition-colors"
                    aria-label="Close notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                /* Standard Notification Toast */
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-lumiere-gold-light">
                    {toast.type === 'error' ? (
                      <AlertCircle size={16} className="text-red-400" />
                    ) : toast.type === 'info' ? (
                      <Info size={16} className="text-sky-300" />
                    ) : (
                      <CheckCircle2 size={16} className="text-[#E2C792]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {toast.title && (
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-0.5">
                        {toast.title}
                      </h4>
                    )}
                    <p className="text-xs text-white/85 leading-relaxed font-light">
                      {toast.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="text-white/50 hover:text-white p-1 -mr-1 -mt-1 transition-colors"
                    aria-label="Close notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
