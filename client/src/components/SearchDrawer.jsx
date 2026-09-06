import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { getProducts } from '../services/productService';

const SearchDrawer = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getProducts({ search: query.trim(), limit: 6 });
        if (res.success) {
          setResults(res.products);
        }
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-lumiere-bg h-full shadow-drawer z-10 flex flex-col p-6 sm:p-8 overflow-y-auto">
        <div className="flex justify-between items-center pb-5 border-b border-lumiere-border">
          <h3 className="font-serif text-2xl text-lumiere-charcoal font-normal">
            Search Atelier
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-lumiere-charcoal hover:text-lumiere-gold"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative my-6">
          <input
            type="search"
            autoFocus
            placeholder="Search by name, diamond, purity..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b border-lumiere-charcoal py-3 pr-8 text-base font-serif text-lumiere-charcoal outline-none placeholder:text-lumiere-light placeholder:font-sans placeholder:text-xs"
          />
          <Search size={18} className="absolute right-0 top-3 text-lumiere-charcoal/60" />
        </div>

        {/* Popular Tags */}
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-widest text-lumiere-light font-semibold block mb-2">
            Popular Searches
          </span>
          <div className="flex flex-wrap gap-2">
            {['Gold', 'Solitaire', 'Necklaces', 'Bridal', 'Kada', 'Jhumkas'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-3 py-1 text-[10px] tracking-wider uppercase border border-lumiere-border hover:bg-lumiere-deep hover:text-white transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <p className="text-xs text-lumiere-muted italic py-4">
              Searching handcrafted archives...
            </p>
          )}

          {!loading && results.length > 0 && (
            <div className="flex flex-col gap-4">
              <span className="text-[10px] tracking-widest uppercase text-lumiere-bronze font-semibold">
                Found {results.length} creations
              </span>
              {results.map((product) => (
                <Link
                  key={product._id || product.id}
                  to={`/product/${product.slug || product.id || product._id}`}
                  onClick={onClose}
                  className="flex gap-4 items-center group py-2 border-b border-lumiere-border/60 hover:bg-white/40 px-2 transition-colors"
                >
                  <img
                    src={product.images && product.images[0] ? product.images[0] : '/assets/product_elan_1.jpg'}
                    alt={product.name}
                    className="w-14 h-14 object-cover bg-lumiere-secondary"
                  />
                  <div className="flex-1">
                    <h4 className="font-serif text-base text-lumiere-charcoal group-hover:text-lumiere-gold transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <span className="text-[10px] text-lumiere-light tracking-wider block">
                      {product.purity || product.material}
                    </span>
                    <span className="text-xs font-semibold text-lumiere-charcoal">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-xs text-lumiere-muted">
              No creations found for "{query}".<br />Try searching for <em>Gold</em>, <em>Bridal</em>, or <em>Ring</em>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDrawer;
