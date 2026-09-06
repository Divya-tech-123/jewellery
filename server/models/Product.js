const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  compareAtPrice: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  collectionName: {
    type: String,
    default: 'Timeless',
    trim: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  material: {
    type: String,
    required: true,
  },
  purity: {
    type: String,
    default: '22K Gold',
  },
  weight: {
    type: String,
    default: '',
  },
  diamondDetails: {
    carat: { type: String, default: '' },
    clarity: { type: String, default: '' },
    color: { type: String, default: '' },
    certification: { type: String, default: 'BIS / IGI Certified' },
  },
  sizes: [{
    type: String,
  }],
  purities: [{
    type: String,
  }],
  stock: {
    type: Number,
    default: 10,
    min: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  bestseller: {
    type: Boolean,
    default: false,
  },
  newArrival: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 12,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create required indexes
productSchema.index({ category: 1 });
productSchema.index({ collectionName: 1 });
productSchema.index({ name: 'text', description: 'text', material: 'text' });
productSchema.index({ featured: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ newArrival: 1 });

module.exports = mongoose.model('Product', productSchema);
