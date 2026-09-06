import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const Category = () => {
  const { slug } = useParams();
  const { onQuickView } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryTitles = {
    gold: 'Gold Jewellery Collection',
    diamond: 'Certified Diamond Solitaires',
    bridal: 'The Royal Bridal Edit',
    everyday: 'Everyday Minimalist Luxury',
    necklaces: 'Chokers & Necklaces',
    rings: 'Solitaires & Rings',
    earrings: 'Earrings & Jhumkas',
    bracelets: 'Cuffs & Tennis Bracelets',
  };

  const title = categoryTitles[slug?.toLowerCase()] || `${slug?.toUpperCase()} COLLECTION`;

  useEffect(() => {
    const fetchCatProducts = async () => {
      setLoading(true);
      try {
        let params = { limit: 16 };
        if (slug === 'gold') params.material = '22K Gold';
        else if (slug === 'diamond') params.material = 'Diamond';
        else if (slug === 'bridal') params.collection = 'Bridal';
        else if (slug === 'everyday') params.collection = 'Everyday';
        else params.category = slug;

        const res = await getProducts(params);
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatProducts();
    window.scrollTo(0, 0);
  }, [slug]);

  const bannerImages = {
    gold: '/assets/category_gold.jpg',
    diamond: '/assets/category_diamond.jpg',
    bridal: '/assets/bridal_campaign.jpg',
    everyday: '/assets/category_everyday.jpg',
  };

  const bannerImg = bannerImages[slug?.toLowerCase()] || '/assets/hero_campaign.jpg';

  return (
    <div className="bg-lumiere-bg">
      {/* Editorial Banner */}
      <div className="relative h-[48vh] min-h-[380px] bg-lumiere-deep flex items-center justify-center overflow-hidden">
        <img
          src={bannerImg}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lumiere-deep via-lumiere-deep/40 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-2xl text-white">
          <span className="font-eyebrow text-lumiere-gold block mb-2">CURATED ATELIER</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-white font-normal mb-3">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-lumiere-bg/80 font-light max-w-md mx-auto leading-relaxed">
            Every creation is sculpted to celebrate authentic grace, pure heritage metal fineness, and eternal radiance.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {loading ? (
          <Loading text="Loading Curated Collection..." />
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="font-serif text-2xl text-lumiere-charcoal mb-2">No creations available in this edit yet.</h3>
            <Link to="/shop" className="btn-luxury-primary text-xs py-3 px-6 mt-4">
              Explore All Jewellery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((p) => (
              <ProductCard key={p._id || p.id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
