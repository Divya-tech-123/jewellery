import api from './api';
import { productsData, categoriesData, findLocalProduct } from '../data/products';

export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    if (response.data && response.data.success && response.data.products?.length > 0) {
      return response.data;
    }
  } catch (err) {
    console.warn('API /products unavailable or failed, using local product catalog dataset:', err.message);
  }

  // Resilient fallback filtering from local dataset
  const {
    search,
    category,
    collection,
    minPrice,
    maxPrice,
    material,
    purity,
    sort,
    page = 1,
    limit = 12,
    featured,
    bestseller,
    newArrival,
  } = params;

  let list = [...productsData];

  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        (p.collectionName && p.collectionName.toLowerCase().includes(s)) ||
        (p.material && p.material.toLowerCase().includes(s)) ||
        (p.description && p.description.toLowerCase().includes(s))
    );
  }

  if (category && category.toLowerCase() !== 'all') {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (collection && collection.toLowerCase() !== 'all') {
    list = list.filter(
      (p) => p.collectionName && p.collectionName.toLowerCase() === collection.toLowerCase()
    );
  }

  if (material) {
    list = list.filter((p) => p.material && p.material.toLowerCase().includes(material.toLowerCase()));
  }

  if (purity) {
    list = list.filter((p) => p.purity && p.purity.toLowerCase().includes(purity.toLowerCase()));
  }

  if (featured === 'true' || featured === true) list = list.filter((p) => p.featured);
  if (bestseller === 'true' || bestseller === true) list = list.filter((p) => p.bestseller);
  if (newArrival === 'true' || newArrival === true) list = list.filter((p) => p.newArrival);

  if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));

  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  else if (sort === 'bestseller') list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
  else if (sort === 'newest') list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
  else list.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const total = list.length;
  const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return {
    success: true,
    count: paginated.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    products: paginated,
  };
};

export const getProductBySlug = async (slugOrId) => {
  if (!slugOrId) {
    return { success: false, message: 'Invalid product identifier' };
  }

  try {
    const response = await api.get(`/products/${encodeURIComponent(slugOrId)}`);
    if (response.data && response.data.success && response.data.product) {
      return response.data;
    }
  } catch (err) {
    console.warn(`API /products/${slugOrId} request failed, checking local catalog:`, err.message);
  }

  // Fallback lookup from canonical dataset
  const product = findLocalProduct(slugOrId);
  if (product) {
    const related = productsData
      .filter((p) => p.category === product.category && p.slug !== product.slug)
      .slice(0, 4);

    return {
      success: true,
      product,
      related,
    };
  }

  return {
    success: false,
    message: 'Jewellery piece not found',
  };
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    if (response.data && response.data.success && response.data.categories?.length > 0) {
      return response.data;
    }
  } catch (err) {
    console.warn('API /categories failed, returning canonical categories:', err.message);
  }

  return {
    success: true,
    categories: categoriesData,
  };
};

// Admin Operations
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
