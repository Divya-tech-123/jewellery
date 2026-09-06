import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import Loading from '../../components/Loading';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const defaultForm = {
    name: '',
    price: '',
    category: 'Necklaces',
    collectionName: 'Heritage',
    material: '22K Gold',
    purity: '22K Gold | BIS Hallmarked',
    description: '',
    stock: 10,
    weight: '20.0 grams',
    images: ['/assets/product_elan_1.jpg'],
    bestseller: false,
    featured: false,
    newArrival: false,
  };

  const [form, setForm] = useState(defaultForm);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 100 });
      if (res.success) setProducts(res.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingId(product._id || product.id);
    setForm({
      name: product.name || '',
      price: product.price || '',
      category: product.category || 'Necklaces',
      collectionName: product.collectionName || 'Heritage',
      material: product.material || '22K Gold',
      purity: product.purity || '22K Gold | BIS Hallmarked',
      description: product.description || '',
      stock: product.stock !== undefined ? product.stock : 10,
      weight: product.weight || '20.0 grams',
      images: product.images && product.images.length ? product.images : ['/assets/product_elan_1.jpg'],
      bestseller: !!product.bestseller,
      featured: !!product.featured,
      newArrival: !!product.newArrival,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you wish to decommission this creation from the archive?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => (p._id !== id && p.id !== id)));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await updateProduct(editingId, form);
        if (res.success) {
          fetchAll();
          setModalOpen(false);
        }
      } else {
        const res = await createProduct(form);
        if (res.success) {
          fetchAll();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error saving creation.');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-lumiere-border gap-4">
        <div>
          <span className="font-eyebrow block mb-1">CATALOGUE MANAGEMENT</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-lumiere-charcoal font-normal">
            Creations Archive ({products.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-luxury-primary text-xs py-3 px-5 flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New High Jewellery Piece</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search creations by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-lumiere-border px-4 py-2.5 text-xs outline-none focus:border-lumiere-gold"
          />
          <Search size={16} className="absolute right-3 top-3 text-lumiere-light" />
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <Loading text="Loading Catalog Database..." />
      ) : (
        <div className="bg-white border border-lumiere-border overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-lumiere-border bg-[#FAF7F2] text-lumiere-charcoal uppercase tracking-wider text-[10px]">
                <th className="p-4">Piece</th>
                <th className="p-4">Category</th>
                <th className="p-4">Purity / Metal</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lumiere-border/60">
              {filtered.map((product) => {
                const prodId = product._id || product.id;
                return (
                  <tr key={prodId} className="hover:bg-[#FAF7F2]/50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={product.images?.[0] || '/assets/product_elan_1.jpg'}
                        alt={product.name}
                        className="w-12 h-14 object-cover bg-lumiere-secondary flex-shrink-0"
                      />
                      <div>
                        <span className="font-serif text-sm font-medium text-lumiere-charcoal block line-clamp-1">
                          {product.name}
                        </span>
                        <span className="text-[10px] text-lumiere-light uppercase tracking-wider font-mono">
                          {product.slug}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 uppercase tracking-wider text-[11px] font-medium">{product.category}</td>
                    <td className="p-4 text-lumiere-bronze text-[11px]">{product.purity || product.material}</td>
                    <td className="p-4 font-semibold text-xs">₹{Number(product.price).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        product.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="text-lumiere-charcoal hover:text-lumiere-gold"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(prodId)}
                          className="text-lumiere-light hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-lumiere-deep/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white shadow-elevated z-10 p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-lumiere-border mb-6">
              <h3 className="font-serif text-2xl font-normal">
                {editingId ? 'Edit Creation' : 'Archive New Creation'}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Creation Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none focus:border-lumiere-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none focus:border-lumiere-gold"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none focus:border-lumiere-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none focus:border-lumiere-gold"
                  >
                    <option value="Necklaces">Necklaces</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Rings">Rings</option>
                    <option value="Bracelets">Bracelets</option>
                    <option value="Bridal">Bridal</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Collection</label>
                  <select
                    value={form.collectionName}
                    onChange={(e) => setForm({ ...form, collectionName: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none focus:border-lumiere-gold"
                  >
                    <option value="Heritage">Heritage</option>
                    <option value="Solitaire">Solitaire</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Everyday">Everyday</option>
                    <option value="Diamond Luxury">Diamond Luxury</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Metal Material</label>
                  <input
                    type="text"
                    value={form.material}
                    onChange={(e) => setForm({ ...form, material: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1">Purity & Certification</label>
                  <input
                    type="text"
                    value={form.purity}
                    onChange={(e) => setForm({ ...form, purity: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-lumiere-border p-2.5 outline-none"
                />
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={form.bestseller}
                    onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
                    className="accent-lumiere-gold"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="accent-lumiere-gold"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={form.newArrival}
                    onChange={(e) => setForm({ ...form, newArrival: e.target.checked })}
                    className="accent-lumiere-gold"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-lumiere-deep text-white py-3.5 text-xs font-semibold tracking-widest uppercase hover:bg-lumiere-gold-hover transition-colors mt-4"
              >
                {editingId ? 'UPDATE CREATION' : 'ARCHIVE NEW PIECE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
