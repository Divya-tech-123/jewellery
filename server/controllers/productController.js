const Product = require('../models/Product');
const { getDBStatus } = require('../config/db');
const { memoryStore } = require('../seed/seedData');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
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
      newArrival
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;

    if (getDBStatus()) {
      let query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { collectionName: { $regex: search, $options: 'i' } },
          { material: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (collection && collection !== 'all') {
        query.collectionName = { $regex: new RegExp(`^${collection}$`, 'i') };
      }

      if (material) {
        query.material = { $regex: material, $options: 'i' };
      }

      if (purity) {
        query.purity = { $regex: purity, $options: 'i' };
      }

      if (featured === 'true') query.featured = true;
      if (bestseller === 'true') query.bestseller = true;
      if (newArrival === 'true') query.newArrival = true;

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price-asc') sortOption = { price: 1 };
      else if (sort === 'price-desc') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else if (sort === 'bestseller') sortOption = { bestseller: -1 };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return res.json({
        success: true,
        count: products.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        products,
      });
    } else {
      // In-memory fallback
      let list = [...memoryStore.products];

      if (search) {
        const s = search.toLowerCase();
        list = list.filter(p =>
          p.name.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s) ||
          (p.collectionName && p.collectionName.toLowerCase().includes(s)) ||
          p.material.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
        );
      }

      if (category && category.toLowerCase() !== 'all') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (collection && collection.toLowerCase() !== 'all') {
        list = list.filter(p => p.collectionName && p.collectionName.toLowerCase() === collection.toLowerCase());
      }

      if (material) {
        list = list.filter(p => p.material.toLowerCase().includes(material.toLowerCase()));
      }

      if (purity) {
        list = list.filter(p => p.purity.toLowerCase().includes(purity.toLowerCase()));
      }

      if (featured === 'true') list = list.filter(p => p.featured);
      if (bestseller === 'true') list = list.filter(p => p.bestseller);
      if (newArrival === 'true') list = list.filter(p => p.newArrival);

      if (minPrice) list = list.filter(p => p.price >= Number(minPrice));
      if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice));

      if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      else if (sort === 'bestseller') list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
      else list.sort((a, b) => (b.id || 0) - (a.id || 0));

      const total = list.length;
      const paginated = list.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return res.json({
        success: true,
        count: paginated.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        products: paginated,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:slug
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (getDBStatus()) {
      const product = await Product.findOne({
        $or: [{ slug: slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }]
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Jewellery piece not found' });
      }

      const related = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      }).limit(4);

      return res.json({ success: true, product, related });
    } else {
      const s = String(slug).toLowerCase();
      const product = memoryStore.products.find(
        (p) =>
          String(p.slug).toLowerCase() === s ||
          String(p.id).toLowerCase() === s ||
          String(p._id).toLowerCase() === s
      );
      if (!product) {
        return res.status(404).json({ success: false, message: 'Jewellery piece not found' });
      }

      const related = memoryStore.products
        .filter((p) => p.category === product.category && p.slug !== product.slug)
        .slice(0, 4);

      return res.json({ success: true, product, related });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      category,
      collectionName,
      images,
      material,
      purity,
      weight,
      diamondDetails,
      sizes,
      purities,
      stock,
      featured,
      bestseller,
      newArrival
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (getDBStatus()) {
      const newProduct = await Product.create({
        name,
        slug,
        description,
        price,
        compareAtPrice: compareAtPrice || 0,
        category,
        collectionName: collectionName || 'Timeless',
        images: images && images.length ? images : ['/assets/product_elan_1.webp'],
        material,
        purity: purity || '22K Gold',
        weight: weight || '',
        diamondDetails: diamondDetails || {},
        sizes: sizes || ['Standard'],
        purities: purities || ['22K Gold'],
        stock: stock !== undefined ? stock : 10,
        featured: !!featured,
        bestseller: !!bestseller,
        newArrival: !!newArrival
      });

      return res.status(201).json({ success: true, product: newProduct });
    } else {
      const newProduct = {
        _id: 'prd_' + Date.now(),
        id: String(Date.now()),
        name,
        slug,
        description,
        price: Number(price),
        compareAtPrice: Number(compareAtPrice) || 0,
        category,
        collectionName: collectionName || 'Timeless',
        images: images && images.length ? images : ['/assets/product_elan_1.webp'],
        material,
        purity: purity || '22K Gold',
        weight: weight || '',
        diamondDetails: diamondDetails || { carat: 'N/A', clarity: 'N/A', color: 'N/A', certification: 'BIS Hallmark' },
        sizes: sizes || ['Standard'],
        purities: purities || ['22K Gold'],
        stock: stock !== undefined ? Number(stock) : 10,
        featured: !!featured,
        bestseller: !!bestseller,
        newArrival: !!newArrival,
        rating: 5.0,
        reviewsCount: 1,
        createdAt: new Date()
      };

      memoryStore.products.unshift(newProduct);
      return res.status(201).json({ success: true, product: newProduct });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, product });
    } else {
      const index = memoryStore.products.findIndex(p => p.id === id || p._id === id || p.slug === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      memoryStore.products[index] = { ...memoryStore.products[index], ...req.body };
      return res.json({ success: true, product: memoryStore.products[index] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      const index = memoryStore.products.findIndex(p => p.id === id || p._id === id || p.slug === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      memoryStore.products.splice(index, 1);
      return res.json({ success: true, message: 'Product deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
