
const Category = require('../model/Category');
const Product = require('../model/Products');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    
    // Check if category with same name or slug exists
    const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with same name or slug already exists' });
    }
    
    const newCategory = new Category({
      name,
      description,
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
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, slug, imageUrl, isActive } = req.body;
    
    // Check if updated slug or name conflicts with another category
    if (slug || name) {
      const query = { _id: { $ne: req.params.id } };
      if (slug) query.slug = slug;
      if (name) query.name = name;
      
      const existingCategory = await Category.findOne(query);
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with same name or slug already exists' });
      }
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(slug && { slug }),
        ...(imageUrl && { imageUrl }),
        ...(typeof isActive === 'boolean' && { isActive }),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory
    });
  } catch (error) {
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
