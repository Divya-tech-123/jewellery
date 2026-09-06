import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X, ArrowUpRight, Grid3X3, LayoutGrid, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, getCategories } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import OptimizedImage from '../components/OptimizedImage';

const Shop = () => {
  const { onQuickView } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Layout mode: 'editorial' (alternating 2-col, 3-col, spotlights) or 'matrix' (standard 3/4 col)
  const [layoutMode, setLayoutMode] = useState('editorial');

  // Filter drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // URL Filter Parameters
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedCollection = searchParams.get('collection') || 'all';
  const selectedSort = searchParams.get('sort') || 'bestseller';
  const selectedMaterial = searchParams.get('material') || '';
  const selectedStone = searchParams.get('stone') || '';
  const selectedPriceRange = searchParams.get('priceRange') || '';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Available filter options
  const categoryOptions = ['all', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Bridal'];
  const collectionOptions = ['all', 'Heritage', 'Solitaire', 'Bridal', 'Everyday', 'Diamond Luxury'];
  const metalOptions = ['', '22K Gold', '18K Gold', '18K White Gold', '18K Rose Gold', 'Platinum'];
  const stoneOptions = ['', 'Solitaire Diamond', 'Pavé Diamonds', 'Natural Polki', 'Sapphire & Emerald'];
  const priceOptions = [
    { label: 'All Price Tiers', value: '' },
    { label: 'Under ₹50,000', value: '0-50000' },
    { label: '₹50,000 – ₹1,50,000', value: '50000-150000' },
    { label: '₹1,50,000 – ₹3,00,000', value: '150000-300000' },
    { label: 'Above ₹3,00,000', value: '300000-9999999' },
  ];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 15,
          sort: selectedSort,
        };
        if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
        if (selectedCollection && selectedCollection !== 'all') params.collection = selectedCollection;
        if (selectedMaterial) params.material = selectedMaterial;
        if (searchQuery) params.search = searchQuery;

        const res = await getProducts(params);
        if (res.success) {
          let list = res.products || [];

          // Client-side stone filter if mock / backend doesn't support stone query
          if (selectedStone) {
            list = list.filter((p) =>
              p.description?.toLowerCase().includes(selectedStone.toLowerCase()) ||
              p.name?.toLowerCase().includes(selectedStone.toLowerCase()) ||
              (p.diamondDetails && Object.values(p.diamondDetails).join(' ').toLowerCase().includes(selectedStone.toLowerCase()))
            );
          }

          // Client-side price range filter
          if (selectedPriceRange) {
            const [min, max] = selectedPriceRange.split('-').map(Number);
            list = list.filter((p) => p.price >= min && p.price <= max);
          }

          setProducts(list);
          setTotalPages(res.pages || 1);
          setTotalCount(list.length !== res.products?.length ? list.length : (res.total || list.length));
        }
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, selectedCollection, selectedSort, selectedMaterial, selectedStone, selectedPriceRange, searchQuery, currentPage]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== 'all') {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  // Active filters count
  const activeFiltersCount = [
    selectedCategory !== 'all' ? selectedCategory : null,
    selectedCollection !== 'all' ? selectedCollection : null,
    selectedMaterial,
    selectedStone,
    selectedPriceRange,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-lumiere-bg pt-8 pb-24">
      {/* Editorial Catalog Hero Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-6 pb-12 sm:pb-16 border-b border-lumiere-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-lumiere-gold" />
              <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-lumiere-bronze">
                ARCHIVAL EXHIBIT / FINE JEWELLERY
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-lumiere-text font-normal tracking-tight">
              {selectedCategory !== 'all'
                ? selectedCategory
                : selectedCollection !== 'all'
                ? `${selectedCollection} Collection`
                : 'The Atelier Catalogue'}
            </h1>
            <p className="text-xs sm:text-sm text-lumiere-light font-light leading-relaxed mt-4 max-w-xl">
              Sculpted in 22-karat certified gold and hand-selected solitaires. Each creation embodies mathematical symmetry, heirloom durability, and contemporary grace.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-right">
            <span className="font-serif italic text-2xl text-lumiere-charcoal/80">
              {totalCount} {totalCount === 1 ? 'Creation' : 'Creations'}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-lumiere-light">
              Showing Archival Masterpieces
            </span>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-lumiere-border/60">
            <span className="text-[10px] uppercase tracking-wider text-lumiere-light mr-2 font-medium">
              Applied Criteria:
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lumiere-secondary text-lumiere-text text-[11px] uppercase tracking-wider">
                Category: {selectedCategory}
                <button type="button" onClick={() => updateParam('category', 'all')} className="hover:text-red-600">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedCollection !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lumiere-secondary text-lumiere-text text-[11px] uppercase tracking-wider">
                Collection: {selectedCollection}
                <button type="button" onClick={() => updateParam('collection', 'all')} className="hover:text-red-600">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedMaterial && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lumiere-secondary text-lumiere-text text-[11px] uppercase tracking-wider">
                Metal: {selectedMaterial}
                <button type="button" onClick={() => updateParam('material', '')} className="hover:text-red-600">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedStone && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lumiere-secondary text-lumiere-text text-[11px] uppercase tracking-wider">
                Stone: {selectedStone}
                <button type="button" onClick={() => updateParam('stone', '')} className="hover:text-red-600">
                  <X size={12} />
                </button>
              </span>
            )}

            {selectedPriceRange && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lumiere-secondary text-lumiere-text text-[11px] uppercase tracking-wider">
                Price Tier
                <button type="button" onClick={() => updateParam('priceRange', '')} className="hover:text-red-600">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] uppercase tracking-wider text-lumiere-bronze hover:text-red-600 ml-2 underline underline-offset-4"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Control Bar: Filters Trigger, Layout Switcher, Sort Dropdown */}
      <div className="sticky top-16 z-20 bg-lumiere-bg/95 backdrop-blur-md border-b border-lumiere-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3.5 flex items-center justify-between gap-4">
          {/* Filter Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className="inline-flex items-center gap-2.5 px-4 py-2 border border-lumiere-border bg-white hover:border-lumiere-gold hover:text-lumiere-gold text-lumiere-text text-xs uppercase tracking-widest transition-all"
          >
            <SlidersHorizontal size={14} />
            <span className="font-medium">Filter Atelier</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-lumiere-gold text-white text-[10px] font-semibold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-6">
            {/* Layout Toggle (Desktop) */}
            <div className="hidden sm:flex items-center border border-lumiere-border bg-white p-0.5">
              <button
                type="button"
                onClick={() => setLayoutMode('editorial')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                  layoutMode === 'editorial'
                    ? 'bg-lumiere-secondary text-lumiere-text font-semibold'
                    : 'text-lumiere-light hover:text-lumiere-text'
                }`}
                title="Editorial Flow Layout"
              >
                <LayoutGrid size={13} />
                <span>Editorial Flow</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                  layoutMode === 'matrix'
                    ? 'bg-lumiere-secondary text-lumiere-text font-semibold'
                    : 'text-lumiere-light hover:text-lumiere-text'
                }`}
                title="Archive Matrix Layout"
              >
                <Grid3X3 size={13} />
                <span>Matrix</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden md:inline text-[10px] uppercase tracking-wider text-lumiere-light">
                Sort:
              </span>
              <select
                value={selectedSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-transparent border border-lumiere-border/80 px-3 py-1.5 text-xs text-lumiere-text uppercase tracking-wider cursor-pointer outline-none hover:border-lumiere-gold focus:border-lumiere-gold"
              >
                <option value="bestseller">Curated Bestsellers</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Client Evaluation</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Exhibition Catalog Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12">
        {loading ? (
          <Loading text="Curating Atelier Creations..." />
        ) : products.length === 0 ? (
          <div className="py-28 text-center max-w-md mx-auto">
            <Sparkles className="w-8 h-8 text-lumiere-gold mx-auto mb-4" strokeWidth={1.2} />
            <h2 className="font-serif text-3xl text-lumiere-text mb-3">No creations match this curation</h2>
            <p className="text-xs text-lumiere-light leading-relaxed mb-8">
              We could not find any fine jewellery pieces matching your active criteria. Try broadening your filters or reset to view the entire archival collection.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-8 py-3 bg-lumiere-text text-white text-xs uppercase tracking-widest font-semibold hover:bg-lumiere-gold transition-colors"
            >
              Reset Atelier Filters
            </button>
          </div>
        ) : layoutMode === 'editorial' ? (
          /* Editorial Alternating Exhibition Rhythm */
          <div className="space-y-16">
            {/* Render items in rhythmic groupings */}
            {(() => {
              const nodes = [];
              let i = 0;
              let groupIndex = 0;

              while (i < products.length) {
                // Group A: 2-Column Wide Editorial Pair (items i, i+1)
                const pair = products.slice(i, i + 2);
                i += pair.length;

                nodes.push(
                  <div key={`pair-${groupIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {pair.map((product) => (
                      <article
                        key={product._id || product.id}
                        className="group flex flex-col justify-between bg-lumiere-secondary/40 p-6 sm:p-8 border border-lumiere-border/60 hover:border-lumiere-gold/60 transition-all duration-500"
                      >
                        <div className="relative aspect-[1/1.05] overflow-hidden mb-6 bg-[#FAF7F2]">
                          <Link to={`/product/${product.slug || product.id || product._id}`} className="block w-full h-full">
                            <OptimizedImage
                              src={product.images?.[0] || '/assets/product_elan_1.webp'}
                              alt={product.name}
                              sizes="half"
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              containerClassName="w-full h-full"
                            />
                          </Link>
                          <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest px-3 py-1 bg-white/90 backdrop-blur-sm text-lumiere-charcoal font-semibold z-10">
                            {product.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => onQuickView && onQuickView(product)}
                            className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-[10px] uppercase font-semibold tracking-wider text-lumiere-charcoal hover:bg-lumiere-text hover:text-white transition-colors z-10"
                          >
                            Quick View
                          </button>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-baseline justify-between mb-2">
                            <Link to={`/product/${product.slug || product.id || product._id}`}>
                              <h3 className="font-serif text-2xl text-lumiere-text font-normal group-hover:text-lumiere-gold transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            <span className="font-serif text-lg font-medium text-lumiere-text">
                              ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-xs text-lumiere-light font-light leading-relaxed line-clamp-2 mb-4">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-lumiere-border/60 text-[11px]">
                            <span className="text-lumiere-bronze tracking-wider uppercase font-medium">
                              {product.purity || product.material}
                            </span>
                            <Link
                              to={`/product/${product.slug || product.id || product._id}`}
                              className="inline-flex items-center gap-1 text-lumiere-text hover:text-lumiere-gold font-semibold uppercase tracking-wider"
                            >
                              <span>Explore Piece</span>
                              <ArrowUpRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                );

                // Insert an Editorial Spotlight Break every 5 items
                if (i >= 5 && groupIndex === 1) {
                  nodes.push(
                    <div
                      key={`spotlight-${groupIndex}`}
                      className="relative bg-lumiere-deep text-white p-8 sm:p-14 my-16 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10"
                    >
                      <div className="relative z-10 max-w-xl">
                        <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-lumiere-gold block mb-3">
                          ATELIER PHILOSOPHY
                        </span>
                        <h3 className="font-serif text-2xl sm:text-4xl font-normal leading-snug mb-4">
                          "Jewellery is wearable sculpture — crafted not for seasons, but for generations."
                        </h3>
                        <p className="text-xs text-[#DDD5CB]/80 font-light leading-relaxed mb-6">
                          Each Lumière creation undergoes 14 distinct inspection stages, verified by BIS laser hallmarking and certified by international gemological authorities.
                        </p>
                        <Link
                          to="/about"
                          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-lumiere-gold hover:text-white transition-colors"
                        >
                          Discover Our Goldsmithing Heritage →
                        </Link>
                      </div>

                      <div className="relative z-10 w-full md:w-72 aspect-[4/5] overflow-hidden border border-white/20">
                        <OptimizedImage
                          src="/assets/craftsmanship.webp"
                          alt="Master Artisan"
                          sizes="half"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          containerClassName="w-full h-full"
                        />
                      </div>
                    </div>
                  );
                }

                // Group B: 3-Column Product Trio (if items remain)
                if (i < products.length) {
                  const trio = products.slice(i, i + 3);
                  i += trio.length;

                  nodes.push(
                    <div key={`trio-${groupIndex}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {trio.map((product) => (
                        <ProductCard
                          key={product._id || product.id}
                          product={product}
                          onQuickView={onQuickView}
                        />
                      ))}
                    </div>
                  );
                }

                groupIndex++;
              }

              return nodes;
            })()}
          </div>
        ) : (
          /* Standard Matrix Grid (4 col desktop, 3 col tablet, 2 col mobile) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}

        {/* Minimal Editorial Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-20 pt-8 border-t border-lumiere-border">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => updateParam('page', String(p))}
                className={`w-10 h-10 flex items-center justify-center text-xs font-semibold tracking-wider transition-all ${
                  currentPage === p
                    ? 'bg-lumiere-text text-white'
                    : 'bg-transparent text-lumiere-text hover:bg-lumiere-secondary'
                }`}
              >
                {p.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Slide-out Filter Drawer */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full max-w-md bg-lumiere-bg h-full shadow-2xl z-10 flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center px-8 py-6 border-b border-lumiere-border">
                <div>
                  <h3 className="font-serif text-2xl text-lumiere-text font-normal">
                    Filter Archive
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-lumiere-light">
                    {totalCount} Pieces Available
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1.5 text-lumiere-text hover:text-lumiere-gold transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Filter Options */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 divide-y divide-lumiere-border/60">
                {/* 1. Category */}
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-lumiere-text block">
                    Atelier Category
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateParam('category', cat)}
                        className={`px-3 py-2 text-xs uppercase tracking-wider text-left border transition-all ${
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? 'bg-lumiere-text text-white border-lumiere-text font-semibold'
                            : 'bg-white text-lumiere-text border-lumiere-border hover:border-lumiere-gold'
                        }`}
                      >
                        {cat === 'all' ? 'All Categories' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Precious Metal */}
                <div className="pt-6 space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-lumiere-text block">
                    Precious Metal Purity
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {metalOptions.map((metal) => (
                      <button
                        key={metal || 'all-metals'}
                        type="button"
                        onClick={() => updateParam('material', metal)}
                        className={`px-3 py-2 text-xs uppercase tracking-wider text-left border transition-all ${
                          selectedMaterial === metal
                            ? 'bg-lumiere-text text-white border-lumiere-text font-semibold'
                            : 'bg-white text-lumiere-text border-lumiere-border hover:border-lumiere-gold'
                        }`}
                      >
                        {metal || 'All Metals'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Gemstone & Diamond */}
                <div className="pt-6 space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-lumiere-text block">
                    Gemstone & Diamond Type
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {stoneOptions.map((st) => (
                      <button
                        key={st || 'all-stones'}
                        type="button"
                        onClick={() => updateParam('stone', st)}
                        className={`px-3 py-2 text-xs uppercase tracking-wider text-left border transition-all ${
                          selectedStone === st
                            ? 'bg-lumiere-text text-white border-lumiere-text font-semibold'
                            : 'bg-white text-lumiere-text border-lumiere-border hover:border-lumiere-gold'
                        }`}
                      >
                        {st || 'All Gemstones'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Collection */}
                <div className="pt-6 space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-lumiere-text block">
                    Collection Realm
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {collectionOptions.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => updateParam('collection', col)}
                        className={`px-3 py-2 text-xs uppercase tracking-wider text-left border transition-all ${
                          selectedCollection.toLowerCase() === col.toLowerCase()
                            ? 'bg-lumiere-text text-white border-lumiere-text font-semibold'
                            : 'bg-white text-lumiere-text border-lumiere-border hover:border-lumiere-gold'
                        }`}
                      >
                        {col === 'all' ? 'All Realms' : col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Price Range */}
                <div className="pt-6 space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-lumiere-text block">
                    Price Range
                  </span>
                  <div className="flex flex-col gap-2">
                    {priceOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateParam('priceRange', opt.value)}
                        className={`px-3 py-2 text-xs uppercase tracking-wider text-left border transition-all flex items-center justify-between ${
                          selectedPriceRange === opt.value
                            ? 'bg-lumiere-text text-white border-lumiere-text font-semibold'
                            : 'bg-white text-lumiere-text border-lumiere-border hover:border-lumiere-gold'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {selectedPriceRange === opt.value && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 bg-lumiere-secondary border-t border-lumiere-border flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setFilterDrawerOpen(false);
                  }}
                  className="flex-1 py-3 text-xs uppercase font-semibold tracking-wider text-lumiere-text border border-lumiere-border bg-white hover:border-lumiere-gold transition-colors"
                >
                  Reset Criteria
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 py-3 bg-lumiere-text text-white text-xs uppercase font-semibold tracking-wider hover:bg-lumiere-gold transition-colors"
                >
                  View Creations ({totalCount})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
