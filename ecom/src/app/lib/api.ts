// lib/api-service.ts
import axios from 'axios';

// API base URL
// export const API_URL = "https://ecom-turborepo.onrender.com/api"
export const API_URL = "http://localhost:7003/api"
// export const API_URL = "https://ecom-turborepo.onrender.com/api"
// export const API_URL = "http://localhost:7003/api"
// export const API_URL = "https://glowing-orbit-7v95rjwg75j53p4x7-7003.app.github.dev/api"


// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});



// Type Definitions
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
    featured?: boolean;
    [key: string]: any;
  }
}

export interface Category {
  id: string;
  categories:any;
  attributes: {
    categories:any;
    name: string;
    slug: string;
    products: {
      data: Product[];
    };
    [key: string]: any;
  }
}

export interface ApiResponse<T> {
  categories:any,
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    }
  },
  length: number
}

// Product Service
export const ProductService = {
  /**
   * Fetch all products with flexible filtering
   */
  async getAllProducts(



  ) {


    const response = await axios.get(`${API_URL}/products`);
  

    return response.data.products;
  },

  async getAllProductByCategory(options: {
    category?: string;
    page?: number;
    pageSize?: number;
    material?: string;
  }) {
    try {
      const { category, page = 1, pageSize = 12 , material} = options;
      
      // Make sure category is provided
      if (!category ) {
        throw new Error('Category is required');
      }
      
    
      // Make the request with proper parameters
      const response = await axios.get(`${API_URL}/products/categories/${category}?material=${material}`);
      
      // Return the data from the response
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },


  async getProductBySlug(slug: string) {
    try {
      // Make the API request to fetch product by slug
      const response = await axios.get(`${API_URL}/products/${slug}`);
      
      // Return the product data
      // console.log("🚀 ~ getProductBySlug ~ response.data.product:", response.data.product)
      return response.data.product
    } catch (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
      return null;
    }
  },
  /**
   * Fetch featured products
   */
  async getFeaturedProducts(limit = 6) {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `/products?populate=*&filters[featured][$eq]=true&pagination[pageSize]=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  /**
   * Fetch related products
   */
  async getRelatedProducts(currentSlug: string, categoryId?: string, limit = 4) {
    try {
      let url = `/products?populate=*&filters[slug][$ne]=${currentSlug}`;
      if (categoryId) {
        url += `&filters[categories][id][$eq]=${categoryId}`;
      }
      url += `&pagination[pageSize]=${limit}`;

      const response = await apiClient.get<ApiResponse<Product[]>>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  },

  /**
   * Search products
   */
  async searchProducts(query: string, page = 1, pageSize = 10) {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        `/products?populate=*&filters[$or][0][name][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  }
};

// Category Service
export class CategoryService {
  // Add cache storage
  private static _cache: any[] | null = null;

  /**
   * Fetch all categories
   */
  static async getAllCategories() {
    // Return cached if present
    if (this._cache) {
      return { categories: this._cache };
    }

    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
      const data = response.data;

      // Cache result
      this._cache = data.categories;
      return { categories: this._cache };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Fetch a category by slug
   */
  static async getCategoryBySlug(slug: string) {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>(
        `/categories?populate=*&filters[slug][$eq]=${slug}`
      );
      // Return first category or null
      return response.data.data[0] || null;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  }

  /**
   * Fetch products in a specific category
   */
  static async getProductsByCategory(categorySlug: string, page = 1, pageSize = 10) {
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
}

// Utility Helpers
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
  },

  /**
   * Get product image URL
   */
  getProductImageUrl(product: Product, index = 0): string {
    // Handle thumbnail or first image
    if (product.attributes.thumbnail?.data?.attributes?.url) {
      return `${API_URL}${product.attributes.thumbnail.data.attributes.url}`;
    }
    
    if (product.attributes.image?.data?.[index]?.attributes?.url) {
      return `${API_URL}${product.attributes.image.data[index].attributes.url}`;
    }
    
    return '/placeholder-image.jpg'; // Fallback placeholder
  }
};


export const User = {

  async getUserProfile(userId: string){
    const res  = await axios.get(`${API_URL}/auth/profile/${userId}`);
    return res
  }

}
// Configure Axios Interceptors
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      console.error('Unauthorized: Please login again');
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Optional: redirect to login
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);


// Export services
export default {
  product: ProductService,
  category: CategoryService,
  helpers: Helpers
};