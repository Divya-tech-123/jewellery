import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/productService';
import SectionHeading from '../components/SectionHeading';
import Loading from '../components/Loading';
import OptimizedImage from '../components/OptimizedImage';

const Collections = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.success) setCategories(res.categories);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  if (loading) return <Loading text="Curating Collections..." />;

  return (
    <div className="py-16 sm:py-24 bg-lumiere-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="HIGH JEWELLERY ARCHIVES"
          title="The Lumière Collections"
          subtitle="Sculpted for eternity. Explore our distinguished realms of heirloom gold, solitaire diamonds, and bridal finery."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative h-[440px] bg-lumiere-secondary overflow-hidden flex flex-col justify-end p-8 sm:p-12 block"
            >
              <OptimizedImage
                src={cat.image || '/assets/category_gold.webp'}
                alt={cat.name}
                sizes="category-card"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                containerClassName="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lumiere-deep/85 via-lumiere-deep/30 to-transparent" />

              <div className="relative z-10 text-white">
                <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-white/80 font-light max-w-md mb-4 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-lumiere-gold group-hover:translate-x-1 transition-transform">
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
