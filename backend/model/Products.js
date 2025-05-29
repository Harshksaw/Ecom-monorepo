const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
// schema design
const validator = require("validator");
const productSchema = new mongoose.Schema({
  name: { type: String, required: false },
  sku: { type: String, required: false, unique: true },
  description: { type: String, required: false },


  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  images: [{ type: String }],
  weight: {
    value: { type: Number },
    unit: {
      type: String,
     
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
  
    required: false,
  },
  materialFinish: {
    type: String,
  
  },
  materialGrade: {
    type: String,
 
  },
  materialCertification: {
    type: String,
 
  },
  materialOrigin: {
    type: String,
    
  },
  materialPurity: {
    type: String,
    
  },
  materialTreatment: {
    type: String,
  
  },
  materialSustainability: {
    type: String,

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

      required: false,
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

    userName: { type: String, required: false },
    rating: {
      type: Number,
      required: false,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: false,
      trim: true
    },
    comment: {
      type: String,
      required: false,
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
