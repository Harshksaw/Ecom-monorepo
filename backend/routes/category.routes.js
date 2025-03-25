const express = require('express');
const router = express.Router();
const categoryController = require('../controller/category.controller');
const { authenticate, isAdmin } = require('../middleware/authorization');

// Create a new category (admin only)
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Update category (admin only)
router.put('/:id',  categoryController.updateCategory);

// Delete category (admin only)
router.delete('/:id',  categoryController.deleteCategory);

module.exports = router;