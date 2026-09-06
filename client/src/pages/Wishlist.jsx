import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/productService';
import SectionHeading from '../components/SectionHeading';
import Loading from '../components/Loading';
import OptimizedImage from '../components/OptimizedImage';

const Wishlist = () => {
  const { onQuickView } = useOutletContext();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ limit: 50 });
        if (res.success) {
          const matched = res.products.filter(p =>
            wishlist.includes(String(p._id)) || wishlist.includes(String(p.id))
          );
          setWishlistProducts(matched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [wishlist]);

  if (loading) return <Loading text="Retrieving Saved Pieces..." />;

  return (
    <div className="py-16 sm:py-24 bg-lumiere-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="CLIENT PRIVATE CURATION"
          title="Saved Heirlooms"
          subtitle="Contemplate your most cherished gold and certified diamond selections."
        />

        {wishlistProducts.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto">
            <Heart size={44} className="text-lumiere-border mx-auto mb-4" strokeWidth={1} />
            <h3 className="font-serif text-2xl text-lumiere-charcoal mb-2">Your wishlist is empty</h3>
            <p className="text-xs text-lumiere-muted font-light mb-8">
              Save your favorite jewels as you browse our collections.
            </p>
            <Link to="/shop" className="btn-luxury-primary text-xs py-3.5 px-8">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {wishlistProducts.map((product) => {
              const prodId = product._id || product.id;
              const productUrl = `/product/${product.slug || prodId}`;
              return (
                <div
                  key={prodId}
                  className="group relative flex flex-col bg-white rounded-[30px] border border-[#EAE3D6] shadow-[0_8px_30px_rgba(45,40,35,0.04)] hover:shadow-[0_20px_45px_rgba(45,40,35,0.08)] hover:-translate-y-2 transition-all duration-350 ease-out p-3.5 sm:p-4 select-none"
                >
                  {/* Organic Rounded Top Image */}
                  <div className="relative aspect-[4/4.8] w-full rounded-[24px] overflow-hidden bg-[#FAF7F2] transition-all duration-500">
                    <Link to={productUrl} className="block w-full h-full rounded-[24px] overflow-hidden">
                      <OptimizedImage
                        src={product.images?.[0] || '/assets/category_necklace.webp'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="product-card"
                        containerClassName="w-full h-full"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prodId)}
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-lumiere-text hover:text-red-600 hover:scale-105 flex items-center justify-center shadow-subtle transition-all z-10"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Lower Content Area with Subtle Curved Transition */}
                  <div className="px-2 sm:px-2.5 pt-4 pb-1.5 flex flex-col flex-1 bg-white justify-between">
                    <div>
                      <span className="text-[10px] font-medium tracking-[0.2em] text-lumiere-gold uppercase font-sans block mb-1">
                        {product.category || product.material || '22K GOLD'}
                      </span>
                      <Link to={productUrl} className="hover:text-lumiere-gold">
                        <h4 className="font-serif text-[16px] sm:text-[17px] text-lumiere-text font-normal line-clamp-1 mb-1.5 transition-colors">
                          {product.name}
                        </h4>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-base sm:text-lg font-semibold text-lumiere-text font-sans">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-xs text-lumiere-muted/70 line-through font-sans font-light">
                            ₹{Number(product.compareAtPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, 1, product.sizes ? product.sizes[0] : 'Standard', product.purity || '22K Gold');
                        toggleWishlist(prodId);
                      }}
                      className="w-full bg-lumiere-deep hover:bg-lumiere-gold text-white py-3 rounded-full text-[10.5px] font-semibold tracking-[0.16em] uppercase transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={13} />
                      <span>MOVE TO BAG</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
