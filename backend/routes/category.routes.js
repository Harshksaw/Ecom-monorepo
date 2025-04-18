const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');
const { handleUpload } = require('../utils/cloudinary');


// Create a new category (admin only)
router.post('/',handleUpload, categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

router.delete('/:id', categoryController.deleteCategory);

// Update category (admin only)


module.exports = router;