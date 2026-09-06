import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/productService';
import SectionHeading from '../components/SectionHeading';
import Loading from '../components/Loading';

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
    <div className="py-12 sm:py-20 bg-lumiere-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="CLIENT PRIVATE CURATION"
          title="Saved Heirlooms"
          subtitle="Contemplate your most cherished gold and certified diamond selections."
        />

        {wishlistProducts.length === 0 ? (
          <div className="py-20 text-center max-w-sm mx-auto">
            <Heart size={44} className="text-lumiere-border mx-auto mb-4" strokeWidth={1} />
            <h3 className="font-serif text-2xl text-lumiere-charcoal mb-2">Your wishlist is empty</h3>
            <p className="text-xs text-lumiere-muted font-light mb-6">
              Save your favorite jewels as you browse our collections.
            </p>
            <Link to="/shop" className="btn-luxury-primary text-xs py-3.5 px-8">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {wishlistProducts.map((product) => {
              const prodId = product._id || product.id;
              return (
                <div key={prodId} className="group relative flex flex-col bg-white p-4 border border-lumiere-border">
                  <div className="relative aspect-[1/1.1] overflow-hidden bg-lumiere-secondary mb-3">
                    <Link to={`/product/${product.slug || product.id || product._id}`} className="block w-full h-full">
                      <img
                        src={product.images?.[0] || '/assets/product_elan_1.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prodId)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center shadow-sm z-10"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <Link to={`/product/${product.slug || product.id || product._id}`} className="hover:text-lumiere-gold">
                    <h4 className="font-serif text-base text-lumiere-charcoal font-medium line-clamp-1 mb-1">
                      {product.name}
                    </h4>
                  </Link>
                  <span className="text-[10px] text-lumiere-bronze tracking-wider block mb-1">
                    {product.purity || product.material}
                  </span>
                  <span className="text-sm font-semibold text-lumiere-charcoal mb-4">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product);
                      toggleWishlist(prodId);
                    }}
                    className="w-full bg-lumiere-deep text-white py-2.5 text-[10px] font-semibold tracking-widest uppercase hover:bg-lumiere-gold-hover transition-colors"
                  >
                    MOVE TO BAG →
                  </button>
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
