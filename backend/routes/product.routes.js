// ===================== routes/product.routes.js =====================
const express = require('express');
const router = express.Router();
const productController = require('../controller/product.controller');
const { authenticate, isAdmin } = require('../middleware/authorization');
const { upload, handleUpload } = require('../utils/cloudinary');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/materials', productController.getProductMaterials);
router.get('/categories/:category', productController.getAllProductsByCategory);
router.get('/:id', productController.getProductById);
router.get('/sku/:sku', productController.getProductBySlug);
router.get('/:id/related', productController.getRelatedProducts);

router.get('/products/search', productController.searchProducts);

// Admin routes

router.post('/:id',handleUpload , productController.updateProduct)
router.put('/edit/:id', productController.updateProduct);
router.post('/',handleUpload , productController.createProduct);
router.delete('/:id',  productController.deleteProduct);
router.patch('/:id/stock', authenticate, isAdmin, productController.updateStock);
router.post('/bulk-status', authenticate, isAdmin, productController.bulkUpdateStatus);
router.post('/bulk-delete', authenticate, isAdmin, productController.bulkDeleteProducts);

module.exports = router;