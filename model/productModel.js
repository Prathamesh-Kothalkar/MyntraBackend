const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ['men', 'women', 'kids'],
    required: true,
  },
  brand: String,
  sizes: [String],
  colors: [String],
  images: [String],
  stock: {
    type: Number,
    default: 0,
  },
  
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
