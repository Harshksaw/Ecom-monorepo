'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaSort, 

  FaPlus
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '@/app/lib/api';


// Interfaces for type safety
interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  categoryId: {
    _id: string;
    name: string;
  };
  images: string[];
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  materials: string[];
  gems: Array<{
    type: string;
    carat: number;
    color: string;
    clarity: string;
  }>;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductWithCategory extends Product {
  category?: {
    _id: string;
    name: string;

  };

  variants: {
    _id: any;
    name: any;
    sku: any;
    price:any;
    images:any;
    salePrice?: any;
  }
}

export default function ProductsListPage() {
  // State
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  console.log("🚀 ~ ProductsListPage ~ products:", products[0])
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(10);
  
  // Confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Fetch products and categories on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentPage, selectedCategory, searchTerm, sortBy, sortOrder, showActiveOnly, showFeaturedOnly]);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      setError('Failed to fetch categories');
      toast.error('Failed to fetch categories');
    }
  };

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/products?page=${currentPage}&limit=${productsPerPage}&sort=${sortBy}&order=${sortOrder}`;
      
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      if (showActiveOnly) {
        url += '&active=true';
      }
      
      if (showFeaturedOnly) {
        url += '&featured=true';
      }
      
      const response = await axios.get(url);
      
      // Assuming the API returns { products: [], totalPages: number }
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch products');
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  // Handle delete product
  const deleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/products/${productToDelete}`);
      setProducts(products.filter(product => product._id !== productToDelete));
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Refresh the products list
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle reset filters
  const resetFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setShowActiveOnly(false);
    setShowFeaturedOnly(false);
    setCurrentPage(1);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Find category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    console.log("🚀 ~ getCategoryName ~ category:", category)
    return category ? category.name : 'Unknown';
  };



  return (

    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link 
          href="/admin/products/create" 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FaFilter className="mr-2" /> Filters
          </h2>
          <button 
            onClick={resetFilters}
            className="text-blue-500 hover:text-blue-700"
          >
            Reset Filters
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name or SKU"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort By */}
          {/* <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sort By
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stockQuantity-asc">Stock (Low to High)</option>
              <option value="stockQuantity-desc">Stock (High to Low)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
          </div> */}
          
          {/* Checkbox Filters */}
          {/* <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="activeOnly"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activeOnly" className="text-gray-700">
                Active Only
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featuredOnly"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featuredOnly" className="text-gray-700">
                Featured Only
              </label>
            </div>
          </div> */}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Loading products...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <p>No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('name')}
                  >
                    <div className="flex items-center">
                      Product
                      {sortBy === 'name' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortBy === 'category' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('price')}
                  >
                    <div className="flex items-center">
                    EDIT
                      {sortBy === 'price' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  {/* <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange('stockQuantity')}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortBy === 'stockQuantity' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th> */}
                  {/* <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th> */}
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">

                      <Link href={`/product/${product._id}`} className="text-lg text-gray-900">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {product?.variants &&Array.isArray(product.variants)  && product?.variants[0]?.images.length > 0 ? (
                            <Image
                              src={product?.variants[0]?.images[0] }
                              alt={product.name}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.categoryId ? product.categoryId?.name : 'Unknown'}

                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                   
                        <Link
                        href={`/admin/dashboard/products/edit/${product._id}`}
                        className="text-lg text-gray-900">
                         <FaEdit className="mr-2" /> 
                        </Link>

                    </td>
               
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        {/* <Link
                          href={`/admin/products/${product._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View"
                        >
                          <FaEye />
                        </Link> */}
                        {/* <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link> */}
                        <button
                          onClick={() => confirmDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={deleteProduct}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}