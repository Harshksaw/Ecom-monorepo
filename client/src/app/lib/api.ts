// src/lib/api.ts

/**
 * This file contains all the API utility functions for fetching data from the backend
 */

// API base URL - make sure to set this in your .env.local file
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Types for API responses and data models
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
  error?: {
    status: number;
    message: string;
  };
}

/**
 * Fetch data from the API with error handling
 * @param endpoint - API endpoint to fetch from
 * @param options - Fetch options
 * @returns API response with typed data
 */
export async function fetchDataFromApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Set default cache option if not provided
    const cacheOption = options.cache || options.next || 'force-cache';
    
    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    // Combine options
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      cache: cacheOption
    };

    // Make API request
    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

    // Handle error responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API error (${response.status}):`, errorData);
      
      return {
        data: [] as unknown as T,
        error: {
          status: response.status,
          message: errorData.message || response.statusText || 'An error occurred'
        }
      };
    }

    // Parse and return successful response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    
    return {
      data: [] as unknown as T,
      error: {
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    };
  }
}

/**
 * Get all products with optional filtering
 * @param params - Query parameters
 * @returns Promise with product data
 */
export async function getProducts(
  params: Record<string, any> = {}
): Promise<ApiResponse<Product[]>> {
  // Construct query string from params
  const queryParams = new URLSearchParams();
  
  // Always include images, categories, etc.
  queryParams.append('populate', '*');
  
  // Add custom filters
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
  
  // Add pagination if provided
  if (params.page) {
    queryParams.append('pagination[page]', params.page.toString());
  }
  if (params.pageSize) {
    queryParams.append('pagination[pageSize]', params.pageSize.toString());
  }
  
  // Make the API request
  return fetchDataFromApi<Product[]>(`/products?${queryParams.toString()}`);
}

/**
 * Get a single product by slug
 * @param slug - Product slug
 * @returns Promise with product data
 */
export async function getProductBySlug(
  slug: string
): Promise<ApiResponse<Product[]>> {
  return fetchDataFromApi<Product[]>(`/products?populate=*&filters[slug][$eq]=${slug}`);
}

/**
 * Get all categories
 * @returns Promise with categories data
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  return fetchDataFromApi<Category[]>('/categories?populate=*');
}

/**
 * Get a single category by slug with its products
 * @param slug - Category slug
 * @param page - Page number for pagination
 * @param pageSize - Items per page
 * @returns Promise with category data including products
 */
export async function getCategoryBySlug(
  slug: string,
  page = 1,
  pageSize = 10
): Promise<ApiResponse<Category[]>> {
  return fetchDataFromApi<Category[]>(
    `/categories?populate=*&filters[slug][$eq]=${slug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
  );
}

/**
 * Get products from a specific category
 * @param categorySlug - Category slug
 * @param page - Page number
 * @param pageSize - Products per page
 * @returns Promise with products in category
 */
export async function getProductsByCategory(
  categorySlug: string,
  page = 1,
  pageSize = 10
): Promise<ApiResponse<Product[]>> {
  return fetchDataFromApi<Product[]>(
    `/products?populate=*&filters[categories][slug][$eq]=${categorySlug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
  );
}

/**
 * Search for products
 * @param query - Search query
 * @returns Promise with matching products
 */
export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  return fetchDataFromApi<Product[]>(
    `/products?populate=*&filters[$or][0][name][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}`
  );
}

/**
 * Create a payment session or order
 * @param endpoint - API endpoint for payment/order
 * @param payload - Order data
 * @returns Promise with payment/order response
 */
export async function makePaymentRequest<T = any>(
  endpoint: string,
  payload: any
): Promise<ApiResponse<T>> {
  return fetchDataFromApi<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload),
    cache: 'no-store',
    next: { revalidate: 0 }
  });
}

/**
 * Helper function to format price in currency
 * @param price - Price value
 * @param currency - Currency symbol
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency = '₹'): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage
 */
export function getDiscountPercentage(originalPrice: number, discountedPrice: number): string {
  if (!originalPrice || !discountedPrice) return '0';
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return discount.toFixed(2);
}