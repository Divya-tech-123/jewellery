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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative flex flex-col bg-white rounded-[30px] border border-[#EAE3D6] shadow-[0_8px_30px_rgba(45,40,35,0.04)] hover:shadow-[0_20px_45px_rgba(45,40,35,0.08)] hover:-translate-y-2 transition-all duration-350 ease-out p-3.5 sm:p-4 cursor-pointer select-none h-full"
            >
              <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-[#FAF7F2] transition-all duration-500">
                <OptimizedImage
                  src={cat.image || '/assets/category_gold.webp'}
                  alt={cat.name}
                  sizes="category-card"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  containerClassName="w-full h-full rounded-[24px]"
                />
              </div>

              <div className="px-2 sm:px-2.5 pt-4 pb-1.5 flex flex-col items-center text-center flex-1 justify-between bg-white">
                <div>
                  <span className="text-[10px] font-medium tracking-[0.2em] text-lumiere-gold uppercase font-sans mb-1 block">
                    ATELIER ARCHIVE
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-lumiere-text tracking-wide group-hover:text-lumiere-gold transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-lumiere-muted font-light max-w-sm mt-2 leading-relaxed line-clamp-2 font-sans">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F2ECE3] w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-lumiere-gold group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
