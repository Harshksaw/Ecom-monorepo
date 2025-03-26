// src/lib/api-service.ts

import axios from 'axios';

// API base URL - make sure to set this in your .env.local file
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7003/api';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type definitions
export interface Product {
  id: string;
  attributes: {
    name: string;
    slug: string;
    price: number;
    original_price?: number;
    description: string;
    subtitle?: string;
    thumbnail: {
      data: {
        attributes: {
          url: string;
        }
      }
    };
    image: {
      data: Array<{
        id: number;
        attributes: {
          url: string;
          name?: string;
        }
      }>
    };
    size: {
      data: Array<{
        size: string;
        enabled: boolean;
      }>
    };
    categories?: {
      data: Category[];
    };
    [key: string]: any;
  }
}

export interface Category {
  id: string;
  attributes: {
    name: string;
    slug: string;
    products: {
      data: Product[];
    };
    [key: string]: any;
  }
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    }
  };
}

// API Services
export const ProductService = {
  /**
   * Get all products with optional filtering
   */
  async getAllProducts(params: Record<string, any> = {}) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('populate', '*');
      
      // Add filters
      Object.entries(params).forEach(([key, value]) => {
        if (key === 'featured' && value === true) {
          queryParams.append('filters[featured][$eq]', 'true');
        } else if (key === 'category') {
          queryParams.append('filters[categories][slug][$eq]', value as string);
        } else if (key === 'slug') {
          queryParams.append('filters[slug][$eq]', value as string);
        } else if (key === 'search') {
          queryParams.append('filters[$or][0][name][$containsi]', value as string);
          queryParams.append('filters[$or][1][description][$containsi]', value as string);
        } else {
          queryParams.append(key, value as string);
        }
      });
      
      // Add pagination
      if (params.page) {
        queryParams.append('pagination[page]', params.page.toString());
      }
      if (params.pageSize) {
        queryParams.append('pagination[pageSize]', params.pageSize.toString());
      }
      
      const response = await apiClient.get<ApiResponse<Product[]>>(`/products?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  /**
   * Get a product by slug
   */
  async getProductBySlug(slug: string) {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(`/products?populate=*&filters[slug][$eq]=${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
      throw error;
    }
  },
  
  /**
   * Search for products
   */
  async searchProducts(query: string) {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `/products?populate=*&filters[$or][0][name][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  },
  
  /**
   * Get featured products
   */
  async getFeaturedProducts() {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>('/products?populate=*&filters[featured][$eq]=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },
  
  /**
   * Get related products (excluding current product)
   */
  async getRelatedProducts(currentSlug: string, categoryId?: string) {
    try {
      let url = `/products?populate=*&filters[slug][$ne]=${currentSlug}`;
      if (categoryId) {
        url += `&filters[categories][id][$eq]=${categoryId}`;
      }
      const response = await apiClient.get<ApiResponse<Product[]>>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  }
};

export const CategoryService = {
  /**
   * Get all categories
   */
  async getAllCategories() {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  /**
   * Get a category by slug
   */
  async getCategoryBySlug(slug: string) {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>(`/categories?populate=*&filters[slug][$eq]=${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  },
  
  /**
   * Get products from a specific category
   */
  async getProductsByCategory(categorySlug: string, page = 1, pageSize = 10) {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `/products?populate=*&filters[categories][slug][$eq]=${categorySlug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categorySlug}:`, error);
      throw error;
    }
  }
};

export const OrderService = {
  /**
   * Create a payment session
   */
  async createPaymentSession(products: any) {
    try {
      const response = await apiClient.post('/orders', { products });
      return response.data;
    } catch (error) {
      console.error('Error creating payment session:', error);
      throw error;
    }
  },
  
  /**
   * Get order history (requires authentication)
   */
  async getOrderHistory() {
    try {
      const response = await apiClient.get('/orders/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  }
};

// Helper functions
export const Helpers = {
  /**
   * Format price with currency
   */
  formatPrice(price: number, currency = '₹'): string {
    return `${currency}${price.toFixed(2)}`;
  },
  
  /**
   * Calculate discount percentage
   */
  getDiscountPercentage(originalPrice: number, discountedPrice: number): string {
    if (!originalPrice || !discountedPrice) return '0';
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return discount.toFixed(2);
  }
};

// Authentication interceptor - add token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized: Please login again');
      
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      
      // Redirect to login (if needed)
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);



// Export services
export default {
  product: ProductService,
  category: CategoryService,
  order: OrderService,
  helpers: Helpers,

};