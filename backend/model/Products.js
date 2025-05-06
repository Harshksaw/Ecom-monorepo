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

  },
  color: {
    type: String,

  }
,  
variants: [
  {
    metalColor: {
      type: String,

      required: true,
    },
    images: [{ type: String }],
    price: {
      type: Map,
      of: Number,
      default: {}
    },
    size:[
  {
    type: { type: String }, // e.g., "standard", "express"
    size: { type: String }, // e.g., "5-7 business days"

  }
],

  }
],


deliveryOptions: [
  {
    type: { type: String }, // e.g., "standard", "express"
    duration: { type: String }, // e.g., "5-7 business days"
    price: { type: Number }, // e.g., extra cost for faster shipping
  }
],
reviews: [
  {

    userName: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },

    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
],




  
  


  isActive: { type: Boolean, default: true },

  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
