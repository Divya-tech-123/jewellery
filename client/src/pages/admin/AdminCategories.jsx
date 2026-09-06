import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { getCategories } from '../../services/productService';
import api from '../../services/api';
import Loading from '../../components/Loading';
import OptimizedImage from '../../components/OptimizedImage';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: '/assets/category_gold.webp', featured: true });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res.success) setCategories(res.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', form);
      fetchCategories();
      setModalOpen(false);
      setForm({ name: '', description: '', image: '/assets/category_gold.webp', featured: true });
    } catch (err) {
      console.error(err);
      alert('Failed to add category');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center pb-6 mb-8 border-b border-lumiere-border">
        <div>
          <span className="font-eyebrow block mb-1">REALMS & CURATIONS</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-charcoal font-normal">
            Collections & Categories ({categories.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-luxury-primary text-xs py-3 px-5 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Realm Category</span>
        </button>
      </div>

      {loading ? (
        <Loading text="Loading Categories..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div key={c.slug} className="bg-white border border-lumiere-border p-6 shadow-sm flex flex-col justify-between">
              <div>
                <OptimizedImage
                  src={c.image || '/assets/category_gold.webp'}
                  alt={c.name}
                  className="w-full h-40 object-cover bg-lumiere-secondary mb-4"
                  sizes="product-card"
                  aspectRatio="16/9"
                />
                <h4 className="font-serif text-2xl font-normal text-lumiere-charcoal mb-2">{c.name}</h4>
                <p className="text-xs text-lumiere-muted font-light leading-relaxed mb-4">{c.description}</p>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-lumiere-bronze">
                slug: /category/{c.slug}
              </span>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-elevated z-10 p-6 sm:p-8">
            <div className="flex justify-between items-center pb-4 border-b border-lumiere-border mb-6">
              <h3 className="font-serif text-2xl font-normal">Add Category Realm</h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Solitaires"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none focus:border-lumiere-gold"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none focus:border-lumiere-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-lumiere-deep text-white py-3.5 text-xs font-semibold tracking-widest uppercase hover:bg-lumiere-gold-hover transition-colors mt-2"
              >
                CREATE REALM CATEGORY
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
