# Ecom-turborepo




GET /api/products - List all products with filtering
GET /api/products/search - Search products
GET /api/products/featured - Get featured products
GET /api/products/materials - Get materials for filtering
GET /api/products/:id - Get a specific product
GET /api/products/sku/:sku - Get product by SKU
GET /api/products/:id/related - Get related products


POST /api/products - Create a new product
PUT /api/products/:id - Update a product
DELETE /api/products/:id - Delete a product
PATCH /api/products/:id/stock - Update stock only
POST /api/products/bulk-status - Bulk update product status
POST /api/products/bulk-delete - Bulk delete products