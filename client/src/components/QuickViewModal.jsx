import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import OptimizedImage from './OptimizedImage';

const QuickViewModal = ({ product, isOpen, onClose, onOpenConsultation }) => {
  if (!isOpen || !product) return null;

  const { addToCart } = useCart();
  const [selectedImg, setSelectedImg] = useState(
    product.images && product.images.length ? product.images[0] : '/assets/product_elan_1.webp'
  );
  const [selectedPurity, setSelectedPurity] = useState(
    product.purities && product.purities.length ? product.purities[0] : product.purity || '22K Gold'
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length ? product.sizes[0] : 'Standard'
  );
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedPurity, selectedSize);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-lumiere-bg shadow-elevated z-10 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-lumiere-charcoal hover:text-lumiere-gold"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="bg-[#F7F4EE] p-6 sm:p-10 flex flex-col justify-center items-center">
            <div className="w-full aspect-square max-h-[380px] overflow-hidden mb-4 flex items-center justify-center">
              <OptimizedImage
                key={selectedImg}
                src={selectedImg}
                alt={product.name}
                priority={true}
                sizes="product-card"
                objectFit="contain"
                className="max-h-full object-contain transition-all duration-300"
                containerClassName="w-full h-full flex items-center justify-center"
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={`w-14 h-14 border p-1 transition-all ${
                      selectedImg === img ? 'border-lumiere-gold' : 'border-lumiere-border'
                    }`}
                  >
                    <OptimizedImage
                      src={img}
                      alt="thumb"
                      sizes="thumbnail"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="font-eyebrow block mb-2">
                {product.category} | {product.collectionName || 'Timeless'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-lumiere-charcoal font-normal leading-tight mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-semibold text-lumiere-charcoal">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-sm text-lumiere-light line-through">
                    ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <p className="text-xs text-lumiere-muted font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Purity Pills */}
              {product.purities && product.purities.length > 0 && (
                <div className="mb-5">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-lumiere-charcoal block mb-2">
                    Metal Purity
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.purities.map((pur) => (
                      <button
                        key={pur}
                        type="button"
                        onClick={() => setSelectedPurity(pur)}
                        className={`px-3 py-1.5 text-xs tracking-wider uppercase border transition-all ${
                          selectedPurity === pur
                            ? 'bg-lumiere-deep text-white border-lumiere-deep'
                            : 'bg-white text-lumiere-charcoal border-lumiere-border hover:border-lumiere-gold'
                        }`}
                      >
                        {pur}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Pills */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-lumiere-charcoal block mb-2">
                    Size / Dimensions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs tracking-wider border transition-all ${
                          selectedSize === sz
                            ? 'bg-lumiere-deep text-white border-lumiere-deep'
                            : 'bg-white text-lumiere-charcoal border-lumiere-border hover:border-lumiere-gold'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-4 border-t border-lumiere-border">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added}
                className="w-full bg-lumiere-deep text-white py-3.5 text-xs font-semibold tracking-widest uppercase text-center hover:bg-lumiere-gold-hover transition-colors flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added To Bag</span>
                  </>
                ) : (
                  <span>Add To Shopping Bag</span>
                )}
              </button>

              {onOpenConsultation && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConsultation(product.name);
                  }}
                  className="w-full border border-lumiere-charcoal text-lumiere-charcoal py-3 text-xs font-semibold tracking-widest uppercase text-center hover:bg-lumiere-secondary transition-colors"
                >
                  Book A Private Consultation
                </button>
              )}

              <Link
                to={`/product/${product.slug || product.id || product._id}`}
                onClick={onClose}
                className="w-full text-center text-xs text-lumiere-bronze hover:text-lumiere-text font-semibold uppercase tracking-wider underline underline-offset-4 py-1"
              >
                View Full Piece Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
