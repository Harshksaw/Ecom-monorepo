const Product = require("../model/Products");
const Category = require("../model/Category");
const { deleteImage, getPublicIdFromUrl } = require("../utils/cloudinary");
const { validateProductInput } = require("../utils/validator");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    
    // Handle both standard multer and multer.fields() configurations
    let mainImages = [];
    if (req.files.images) {
      // If using fields configuration
      mainImages = req.files.images.map(file => file.path);
    } else if (Array.isArray(req.files)) {
      // If using array configuration
      mainImages = req.files.map(file => file.path);
    }

    const {
      name,
      sku,
      description,
      categoryId,
      weight,
      dimensions,
      materials,
      gems,
      isActive,
      isFeatured,
      tags,
      materialType,
      purity,
      shape,
      color,
      variants,
      deliveryOptions,
      reviews
    } = req.body;

    console.log(variants,"-----")


    // Validate input
    const { errors, isValid } = validateProductInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    // Check if product with same SKU exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with same SKU already exists" });
    }

    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Parse JSON strings if they are sent as strings from the frontend
    const parsedWeight = typeof weight === 'string' ? JSON.parse(weight) : weight;
    const parsedDimensions = typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions;
    const parsedGems = typeof gems === 'string' ? JSON.parse(gems) : gems;
    const parsedMaterials = typeof materials === 'string' ? JSON.parse(materials) : materials;
    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    const parsedDeliveryOptions = typeof deliveryOptions === 'string' ? 
      JSON.parse(deliveryOptions) : deliveryOptions;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    // Process variants to ensure they have proper structure and assign variant images
    const processedVariants = parsedVariants?.map((variant, index) => {
      const parsedStock = Number(variant.stock);
      const parsedPrice = {};
    
      for (const key in variant.price) {
        parsedPrice[key] = Number(variant.price[key]);
      }
    
      // Validate after conversion
      if (!parsedPrice.default || parsedPrice.default <= 0) {
        throw new Error("Product price is required");
      }
      // if (isNaN(parsedStock) || parsedStock < 0) {
      //   throw new Error("Stock quantity must be a non-negative number");
      // }
    

        const variantImages = req.files[`variant_${index}_images`] 
          ? req.files[`variant_${index}_images`].map(file => file.path) 
          : [];


          const parsedSize = variant.size ? 
          (typeof variant.size === 'string' ? JSON.parse(variant.size) : variant.size) : 
          [];
      
        return {
          ...variant,
          price: new Map(Object.entries(variant.price)),
          size: parsedSize,

          images: variantImages
        };

      
    });
    const parsedReviews =
    typeof reviews === "string" ? JSON.parse(reviews) : reviews;

    const newProduct = new Product({
      name,
      sku,
      description,
      categoryId,
      images: mainImages,
      weight: parsedWeight,
      dimensions: parsedDimensions,
      materials: parsedMaterials,
      gems: parsedGems,
      materialType,
      purity,
      shape,
      color,
      variants: processedVariants,
      deliveryOptions: parsedDeliveryOptions,
      isActive,
      isFeatured,
      tags: parsedTags,
      reviews:parsedReviews
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: product.controller.js ~ line 63 ~ exports.createProduct= ~ error",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all products with filters and pagination
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      featured,
      materials,
      inStock,
      materialType,
      purity,
      shape,
      color
    } = req.query;

    // Check if any filter parameters are provided
    const hasFilters = category || minPrice || maxPrice || search || featured || materials || inStock || materialType || purity || shape || color;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { isActive: true };
    
    // Only apply filters if any filter parameters are provided
    if (hasFilters) {
      if (materialType) filter.materialType = materialType;
      if (purity) filter.purity = purity;
      if (shape) filter.shape = shape;
      if (color) filter.color = color;
      if (category) filter.categoryId = category;

      if (minPrice || maxPrice) {
        const priceFilter = [];
        
        if (minPrice) {
          priceFilter.push({
            variants: {
              $elemMatch: {
                "price": { $elemMatch: { $gte: parseFloat(minPrice) } }
              }
            }
          });
        }
        
        if (maxPrice) {
          priceFilter.push({
            variants: {
              $elemMatch: {
                "price": { $elemMatch: { $lte: parseFloat(maxPrice) } }
              }
            }
          });
        }
        
        if (priceFilter.length > 0) {
          filter.$and = priceFilter;
        }
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      if (featured === "true") filter.isFeatured = true;

      if (materials) {
        const materialsList = Array.isArray(materials) ? materials : [materials];
        filter.materials = { $in: materialsList };
      }

      if (inStock === "true") {
        filter["variants.stock"] = { $gt: 0 };
      }
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("categoryId", "name slug");

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllProductsByCategory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
material: materialType,
      purity,
      shape,
      color
    } = req.query;

    const category = req.params.category;

    if (!category) {
      return res
        .status(400)
        .json({ message: "Category parameter is required" });
    }

    // First find the category by slug
    const categoryObj = await Category.findOne({ slug: category });

    if (!categoryObj) {
      return res
        .status(404)
        .json({ message: `Category with slug '${category}' not found` });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter using the category's _id
    const filter = {
      isActive: true,
      categoryId: categoryObj._id, 

    };
    
    if (materialType) filter.materialType = materialType;
    if (purity) filter.purity = purity;
    if (shape) filter.shape = shape;
    if (color) filter.color = color;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Get products for this category with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("categoryId", "name slug");

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      data: products,
      meta: {
        pagination: {
          total,
          page: parseInt(page),
          pageSize: parseInt(limit),
          pageCount: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    console.log(req.params.id)
    const product = await Product.findById(req.params.id).populate(
      "categoryId",

    );
    console.log("🚀 ~ exports.getProductById= ~ product:", product)

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      sku: req.params.sku,
      isActive: true,
    }).populate("categoryId", "name slug");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({
      isActive: true,
      isFeatured: true,
      "variants.stock": { $gt: 0 } // Check stock in variants
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("categoryId", "name slug");

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get related products
exports.getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    // Get the current product to find related ones
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      categoryId: product.categoryId,
      isActive: true,
    })
      .limit(limit)
      .populate("categoryId", "name slug");

    res.status(200).json({ products: relatedProducts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get product materials filter options
exports.getProductMaterials = async (req, res) => {
  try {
    // Aggregate to get unique materials
    const materials = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: "$materials" },
      { $group: { _id: "$materials" } },
      { $sort: { _id: 1 } },
    ]);

    const materialsList = materials.map((item) => item._id);

    res.status(200).json({ materials: materialsList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    console.log("🚀 ~ exports.updateProduct= ~ req.body:", req.body)
    const {
      name,
      sku,
      description,
      categoryId,
      images,
      weight,
      dimensions,
      materials,
      gems,
      isActive,
      isFeatured,
      tags,
      removedImages,
      materialType,
      purity,
      shape,
      color,
      variants,
      deliveryOptions
    } = req.body;


    // Check if updated SKU conflicts with another product
    if (sku) {
      const existingProduct = await Product.findOne({
        sku,
        _id: { $ne: req.params.id },
      });

      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Product with same SKU already exists" });
      }
    }

    // Validate category if provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    // Get existing product to find images to delete
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete removed images from Cloudinary
    if (
      removedImages &&
      Array.isArray(removedImages) &&
      removedImages.length > 0
    ) {
      for (const imageUrl of removedImages) {
        try {
          const publicId = getPublicIdFromUrl(imageUrl);
          if (publicId) {
            await deleteImage(publicId);
          }
        } catch (err) {
          console.error(`Error deleting image ${imageUrl}:`, err);
          // Continue with other images even if one fails
        }
      }
    }

    // Prepare updated images array
    let updatedImages = existingProduct.images;
    if (images) {
      if (removedImages && Array.isArray(removedImages)) {
        // Filter out removed images
        updatedImages = updatedImages.filter(
          (img) => !removedImages.includes(img)
        );
      }
      // Add new images
      updatedImages = [
        ...updatedImages,
        ...images.filter((img) => !updatedImages.includes(img)),
      ];
    }

    // Parse complex objects if they are strings
    const parsedWeight = typeof weight === 'string' ? JSON.parse(weight) : weight;
    const parsedDimensions = typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions;
    const parsedGems = typeof gems === 'string' ? JSON.parse(gems) : gems;
    const parsedMaterials = typeof materials === 'string' ? JSON.parse(materials) : materials;
    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    const parsedDeliveryOptions = typeof deliveryOptions === 'string' ? 
      JSON.parse(deliveryOptions) : deliveryOptions;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    // Process variants to ensure they have proper structure
// Process variants to ensure they have proper structure
const processedVariants = parsedVariants?.map(variant => {
  // Convert price from JSON to Map if needed
  let priceMap = variant.price;
  if (!(variant.price instanceof Map) && typeof variant.price === 'object') {
    priceMap = new Map(Object.entries(variant.price));
  }
  
  // Process size data
  const parsedSize = variant.size ? 
    (typeof variant.size === 'string' ? JSON.parse(variant.size) : variant.size) : 
    [];

  return {
    ...variant,
    price: priceMap,
    size: parsedSize, // Add the parsed size to the variant
    images: variant.existingImages || variant.images || [] // CRITICAL: Preserve existing images
  };
});

    const updateData = {
      ...(name && { name }),
      ...(sku && { sku }),
      ...(description && { description }),
      ...(categoryId && { categoryId }),
      images: updatedImages,
      ...(parsedWeight !== undefined && { weight: parsedWeight }),
      ...(parsedDimensions && { dimensions: parsedDimensions }),
      ...(parsedMaterials && { materials: parsedMaterials }),
      ...(parsedGems && { gems: parsedGems }),
      ...(materialType && { materialType }),
      ...(purity && { purity }),
      ...(shape && { shape }),
      ...(color && { color }),
      ...(processedVariants && { variants: processedVariants }),
      ...(parsedDeliveryOptions && { deliveryOptions: parsedDeliveryOptions }),
      ...(typeof isActive === "boolean" && { isActive }),
      ...(typeof isFeatured === "boolean" && { isFeatured }),
      ...(parsedTags && { tags: parsedTags }),
      updatedAt: Date.now(),
    };

          
    console.log("🚀 ~ exports.updateProduct= ~ updateData:", updateData)
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          const publicId = getPublicIdFromUrl(imageUrl);
          if (publicId) {
            await deleteImage(publicId);
          }
        } catch (err) {
          console.error(`Error deleting image ${imageUrl}:`, err);
          // Continue with other images even if one fails
        }
      }
    }

    // Delete variant images if they exist
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (variant.images && variant.images.length > 0) {
          for (const imageUrl of variant.images) {
            try {
              const publicId = getPublicIdFromUrl(imageUrl);
              if (publicId) {
                await deleteImage(publicId);
              }
            } catch (err) {
              console.error(`Error deleting variant image ${imageUrl}:`, err);
            }
          }
        }
      }
    }

    // Delete the product from database
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product stock (now working with variants)
exports.updateStock = async (req, res) => {
  try {
    const { variantId, stock } = req.body;

    if (!variantId) {
      return res.status(400).json({ message: "Variant ID is required" });
    }

    if (stock === undefined || isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: "Valid stock quantity is required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the variant and update its stock
    const variantIndex = product.variants.findIndex(v => v._id.toString() === variantId);
    if (variantIndex === -1) {
      return res.status(404).json({ message: "Variant not found" });
    }

    // Update the specific variant's stock
    product.variants[variantIndex].stock = stock;
    product.updatedAt = Date.now();
    
    await product.save();

    res.status(200).json({
      message: "Stock updated successfully",
      product: product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Bulk update product status
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { productIds, isActive } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs are required" });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      {
        isActive,
        updatedAt: Date.now(),
      }
    );

    res.status(200).json({
      message: `${result.nModified} products updated successfully`,
      modifiedCount: result.nModified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Bulk delete products
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs are required" });
    }

    // Get all products to delete their images
    const products = await Product.find({ _id: { $in: productIds } });

    // Delete images from Cloudinary
    for (const product of products) {
      // Delete main product images
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          try {
            const publicId = getPublicIdFromUrl(imageUrl);
            if (publicId) {
              await deleteImage(publicId);
            }
          } catch (err) {
            console.error(`Error deleting image ${imageUrl}:`, err);
          }
        }
      }
      
      // Delete variant images
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          if (variant.images && variant.images.length > 0) {
            for (const imageUrl of variant.images) {
              try {
                const publicId = getPublicIdFromUrl(imageUrl);
                if (publicId) {
                  await deleteImage(publicId);
                }
              } catch (err) {
                console.error(`Error deleting variant image ${imageUrl}:`, err);
              }
            }
          }
        }
      }
    }

    // Delete products from database
    const result = await Product.deleteMany({ _id: { $in: productIds } });

    res.status(200).json({
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { sku: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("categoryId", "name slug");

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};