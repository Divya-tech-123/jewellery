const Category = require('../models/Category');
const { getDBStatus } = require('../config/db');
const { memoryStore } = require('../seed/seedData');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const categories = await Category.find().sort({ featured: -1, name: 1 });
      return res.json({ success: true, count: categories.length, categories });
    } else {
      return res.json({ success: true, count: memoryStore.categories.length, categories: memoryStore.categories });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category (Admin only)
// @route   POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, featured } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (getDBStatus()) {
      const category = await Category.create({ name, slug, description, image, featured });
      return res.status(201).json({ success: true, category });
    } else {
      const newCategory = {
        _id: 'cat_' + Date.now(),
        name,
        slug,
        description: description || '',
        image: image || '/assets/category_gold.webp',
        featured: !!featured,
        createdAt: new Date(),
      };
      memoryStore.categories.push(newCategory);
      return res.status(201).json({ success: true, category: newCategory });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category (Admin only)
// @route   PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      return res.json({ success: true, category });
    } else {
      const index = memoryStore.categories.findIndex(c => c._id === id || c.slug === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Category not found' });
      memoryStore.categories[index] = { ...memoryStore.categories[index], ...req.body };
      return res.json({ success: true, category: memoryStore.categories[index] });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category (Admin only)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const category = await Category.findByIdAndDelete(id);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      return res.json({ success: true, message: 'Category deleted' });
    } else {
      const index = memoryStore.categories.findIndex(c => c._id === id || c.slug === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Category not found' });
      memoryStore.categories.splice(index, 1);
      return res.json({ success: true, message: 'Category deleted' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
