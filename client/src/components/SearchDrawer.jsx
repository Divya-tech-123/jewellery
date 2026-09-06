import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ArrowRight } from 'lucide-react';
import { getProducts } from '../services/productService';
import OptimizedImage from './OptimizedImage';

const SearchDrawer = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#FDFBF7] h-full shadow-drawer z-10 flex flex-col p-6 sm:p-10 overflow-y-auto">
        <div className="flex justify-between items-center pb-6 border-b border-lumiere-border/50">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-lumiere-gold block">
              ATELIER ARCHIVES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-lumiere-text font-normal">
              Search Lumière
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-lumiere-text hover:text-lumiere-gold transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Input */}
        <div className="relative my-8">
          <input
            type="search"
            autoFocus
            placeholder="Search necklaces, solitaires, bridal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b-2 border-lumiere-text py-3.5 pr-10 text-lg font-serif text-lumiere-text outline-none placeholder:text-lumiere-muted/60 placeholder:font-sans placeholder:text-xs"
          />
          <Search size={20} className="absolute right-0 top-3.5 text-lumiere-text/60" />
        </div>

        {/* Popular Tags */}
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-lumiere-muted font-semibold block mb-3 font-sans">
            Popular Searches
          </span>
          <div className="flex flex-wrap gap-2">
            {['Necklaces', 'Solitaire', 'Jhumkas', 'Bridal', 'Kasu Mala', 'Bangles'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3.5 py-1.5 bg-white border border-lumiere-border/60 hover:border-lumiere-gold text-lumiere-text hover:text-lumiere-gold text-xs uppercase tracking-wider transition-colors font-sans"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-8 text-xs text-lumiere-muted uppercase tracking-widest font-sans">
            Searching curated pieces...
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-lumiere-muted font-semibold font-sans">
              Suggested Creations ({results.length})
            </span>
            <div className="flex flex-col divide-y divide-lumiere-border/40">
              {results.map((p) => (
                <Link
                  key={p.id || p._id}
                  to={`/product/${p.slug || p.id}`}
                  onClick={onClose}
                  className="py-3 flex items-center gap-4 hover:bg-white/60 p-2 transition-colors group"
                >
                  <div className="w-14 h-16 bg-[#FAF7F2] overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={p.images?.[0] || '/assets/category_necklace.webp'}
                      alt={p.name}
                      sizes="thumbnail"
                      loading="lazy"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-lumiere-text truncate group-hover:text-lumiere-gold transition-colors">
                      {p.name}
                    </h4>
                    <span className="text-xs font-semibold text-lumiere-text font-sans block mt-0.5">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={handleViewAll}
              className="mt-4 w-full py-3 bg-lumiere-deep hover:bg-lumiere-gold text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2"
            >
              <span>View All Results</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchDrawer;
