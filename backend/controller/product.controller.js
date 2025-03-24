// ===================== controllers/product.controller.js =====================
const Product = require('../model/Products');
const Category = require('../model/Category');
const { deleteImage, getPublicIdFromUrl } = require('../utils/cloudinary');
const { validateProductInput } = require('../utils/validator');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name, sku, description, price, salePrice, categoryId,
      images, weight, dimensions, materials, gems,
      stockQuantity, isActive, isFeatured, tags
    } = req.body;
    
    // Validate input
    const { errors, isValid } = validateProductInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    
    // Check if product with same SKU exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with same SKU already exists' });
    }
    
    // Validate category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    const newProduct = new Product({
      name,
      sku,
      description,
      price,
      salePrice,
      categoryId,
      images,
      weight,
      dimensions,
      materials,
      gems,
      stockQuantity,
      isActive,
      isFeatured,
      tags
    });
    
    await newProduct.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      materials,
      inStock
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter
    const filter = { isActive: true };
    
    if (category) filter.categoryId = category;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (featured === 'true') filter.isFeatured = true;
    
    if (materials) {
      const materialsList = Array.isArray(materials) ? materials : [materials];
      filter.materials = { $in: materialsList };
    }
    
    if (inStock === 'true') filter.stockQuantity = { $gt: 0 };
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('categoryId', 'name slug');
    
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      sku: req.params.sku,
      isActive: true 
    }).populate('categoryId', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({ 
      isActive: true,
      isFeatured: true,
      stockQuantity: { $gt: 0 }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('categoryId', 'name slug');
    
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find products in the same category, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      categoryId: product.categoryId,
      isActive: true
    })
    .limit(limit)
    .populate('categoryId', 'name slug');
    
    res.status(200).json({ products: relatedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get product materials filter options
exports.getProductMaterials = async (req, res) => {
  try {
    // Aggregate to get unique materials
    const materials = await Product.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$materials' },
      { $group: { _id: '$materials' } },
      { $sort: { _id: 1 } }
    ]);
    
    const materialsList = materials.map(item => item._id);
    
    res.status(200).json({ materials: materialsList });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const {
      name, sku, description, price, salePrice, categoryId,
      images, weight, dimensions, materials, gems,
      stockQuantity, isActive, isFeatured, tags,
      removedImages
    } = req.body;
    
    // Check if updated SKU conflicts with another product
    if (sku) {
      const existingProduct = await Product.findOne({ 
        sku, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with same SKU already exists' });
      }
    }
    
    // Validate category if provided
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }
    
    // Get existing product to find images to delete
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete removed images from Cloudinary
    if (removedImages && Array.isArray(removedImages) && removedImages.length > 0) {
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
        updatedImages = updatedImages.filter(img => !removedImages.includes(img));
      }
      // Add new images
      updatedImages = [...updatedImages, ...images.filter(img => !updatedImages.includes(img))];
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(sku && { sku }),
        ...(description && { description }),
        ...(price && { price }),
        ...(salePrice !== undefined && { salePrice }),
        ...(categoryId && { categoryId }),
        images: updatedImages,
        ...(weight !== undefined && { weight }),
        ...(dimensions && { dimensions }),
        ...(materials && { materials }),
        ...(gems && { gems }),
        ...(stockQuantity !== undefined && { stockQuantity }),
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(typeof isFeatured === 'boolean' && { isFeatured }),
        ...(tags && { tags }),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
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
    
    // Delete the product from database
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product stock
exports.updateStock = async (req, res) => {
  try {
    const { stockQuantity } = req.body;
    
    if (stockQuantity === undefined || isNaN(stockQuantity) || stockQuantity < 0) {
      return res.status(400).json({ message: 'Valid stock quantity is required' });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        stockQuantity,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({
      message: 'Stock updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk update product status
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { productIds, isActive } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean' });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      {
        isActive,
        updatedAt: Date.now()
      }
    );
    
    res.status(200).json({
      message: `${result.nModified} products updated successfully`,
      modifiedCount: result.nModified
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk delete products
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }
    
    // Get all products to delete their images
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Delete images from Cloudinary
    for (const product of products) {
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
    }
    
    // Delete products from database
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    
    res.status(200).json({
      message: `${result.deletedCount} products deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('categoryId', 'name slug');
    
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

