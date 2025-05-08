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
    enum: [
      "gold",
      "silver",
      "platinum",
      "rose_gold",
      "white_gold",
      "yellow_gold",
      "diamond",
      "pearl",
      "gemstone",
      "brass",
      "bronze",
      "titanium",
      "stainless_steel",
      "palladium",
      "rhodium",
      "sterling",
      "kundan",
      "polki",
      "meenakari",
      "jadau",
      "antique",
      "oxidized",
      "filigree",
      "enamel",
      "lac",
      "wood",
      "bone",
      "ivory",
      "coral",
      "amber",
      "turquoise",
      "lapis_lazuli",
      "onyx",
      "agate",
      "jade",
      "ruby",
      "emerald",
      "sapphire",
      "aquamarine",
      "garnet",
      "amethyst",
      "topaz",
      "zircon",
      "moonstone",
      "opal",
      "peridot",
      "tanzanite",
      "alexandrite",
      "spinel",
      "tourmaline"
    ],
    required: true,
  },
  materialFinish: {
    type: String,
    enum: [
      "polished",
      "matte",
      "brushed",
      "hammered",
      "sandblasted",
      "oxidized",
      "satin",
      "mirror",
      "textured",
      "engraved"
    ]
  },
  materialGrade: {
    type: String,
    enum: [
      "premium",
      "standard",
      "commercial",
      "luxury",
      "exclusive"
    ]
  },
  materialCertification: {
    type: String,
    enum: [
      "hallmark",
      "bureau_of_indian_standards",
      "international_standards_organization",
      "american_gem_society",
      "gemological_institute_of_america",
      "international_gemological_institute",
      "european_gemological_laboratory"
    ]
  },
  materialOrigin: {
    type: String,
    enum: [
      "india",
      "italy",
      "switzerland",
      "germany",
      "japan",
      "thailand",
      "china",
      "usa",
      "uk",
      "france",
      "australia",
      "south_africa",
      "russia",
      "brazil",
      "colombia"
    ]
  },
  materialPurity: {
    type: String,
    enum: [
      "24k",
      "22k",
      "18k",
      "14k",
      "10k",
      "925",
      "950",
      "900",
      "800",
      "750",
      "585",
      "375"
    ]
  },
  materialTreatment: {
    type: String,
    enum: [
      "none",
      "heat_treated",
      "irradiated",
      "coated",
      "filled",
      "dyed",
      "bleached",
      "diffusion_treated"
    ]
  },
  materialSustainability: {
    type: String,
    enum: [
      "recycled",
      "ethically_sourced",
      "fair_trade",
      "conflict_free",
      "sustainable_mining",
      "lab_grown",
      "vintage"
    ]
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
