const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
// schema design
const validator = require("validator");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  weight: { type: Number }, // in grams
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  materials: [{ type: String }],
  gems: [{
    type: { type: String },
    carat: { type: Number },
    color: { type: String },
    clarity: { type: String }
  }],
  stockQuantity: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Products = mongoose.model('Products', productSchema)

module.exports = Products;