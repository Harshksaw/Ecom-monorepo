const Category = require('../model/Category');
const Product = require('../model/Products');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    console.log("🚀 ~ exports.createCategory= ~ file:", req.files)
    // Get the image path from the uploaded file
    const imagePath = req.files && req.files.images && req.files.images[0] ? req.files.images[0].path : null;
    console.log("🚀 ~ exports.createCategory= ~ imagePath:", imagePath)

    // Check if category with same name or slug exists
    const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with same name or slug already exists' });
    }

    const newCategory = new Category({
      name,
      imageUrl: imagePath,
      slug,
    });

    await newCategory.save();

    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {


    const category = await Category.findById(req.params.id);
    console.log("🚀 ~ exports.getCategoryById= ~ material:", material)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update category
// Backend update handler for category name updates
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const imagePath = req.files && req.files.images && req.files.images[0] ? req.files.images[0].path : null;
    console.log("🚀 ~ exports.createCategory= ~ imagePath:", imagePath)
    // Check if the category exists
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If updating name, check for duplicates
    if (name) {
      const existingCategory = await Category.findOne({
        name,
        _id: { $ne: req.params.id }

      });

      if (existingCategory) {
        return res.status(400).json({
          message: 'Category with this name already exists'
        });
      }
    }

    // Update the category
    // If imagePath is null, keep the existing imageUrl
    if (imagePath) {
      var updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          name,
          imageUrl: imagePath,
          updatedAt: Date.now()
        },
        { new: true }
      );

    }
    else {
      var updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          name,
          updatedAt: Date.now()
        },
        { new: true }
      );
    }


    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    // Check if category is being used by products
    const productsUsingCategory = await Product.countDocuments({ categoryId: req.params.id });
    if (productsUsingCategory > 0) {
      return res.status(400).json({
        message: 'Cannot delete category as it is being used by products',
        count: productsUsingCategory
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
