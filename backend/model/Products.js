const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
// schema design
const validator = require("validator");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String, required: true },


  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  images: [{ type: String }],
  weight: {
    value: { type: Number },
    unit: {
      type: String,
      enum: ["grams", "carat", "tola", "oz"],
      default: "grams"
    }
  },
  
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  materials: [{ type: String }],
  gems: [
    {
      type: { type: String },
      carat: { type: Number },
      color: { type: String },
      clarity: { type: String },
    },
  ],

  materialType: {
    type: String,
    enum: ["gold", "silver"],
    required: true,
  },
  purity: {
    type: String,

  },
  shape: {
    type: String,
    enum: ["round", "oval", "princess", "emerald", "pear", "marquise", "heart", "cushion"],
  },
  color: {
    type: String,
    enum: ["yellow", "white", "rose", "silver", "multicolor"],
  }
,  
variants: [
  {
    metalColor: {
      type: String,
      enum: ["gold", "silver", "rosegold", "pinkgold"],
      required: true,
    },
    images: [{ type: String }],
    price: {
      type: Map,
      of: Number,
      default: {}
    },
    stock: { type: Number, default: 100 },
  }
],


deliveryOptions: [
  {
    type: { type: String }, // e.g., "standard", "express"
    duration: { type: String }, // e.g., "5-7 business days"
    price: { type: Number }, // e.g., extra cost for faster shipping
  }
],



  
  


  isActive: { type: Boolean, default: true },

  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
