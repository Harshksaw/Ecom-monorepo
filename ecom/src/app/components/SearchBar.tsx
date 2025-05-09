// src/app/components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import { API_URL } from '../lib/api';
import Image from 'next/image';

interface SearchResult {
  _id: string;
  name: string;
  images: string[];
  variants: any[];
}

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle search query
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products/search?query=${encodeURIComponent(searchQuery)}`);
      setResults(response.data.products || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle search input on mobile
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      // Reset when opening
      setQuery('');
      setResults([]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setIsSearching(false);
    }
  };

  // Get first available image for a product
  const getProductImage = (product: SearchResult): string => {
    // Try product images first
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // Try variant images if product images not available
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.images && firstVariant.images.length > 0) {
        return firstVariant.images[0];
      }
    }
    
    // Return placeholder if no images found
    return '/placeholder-image.jpg';
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Mobile Search Toggle Button */}
      <button 
        onClick={toggleSearch}
        className="md:hidden p-2 text-gray-700"
        aria-label={isSearching ? "Close search" : "Open search"}
      >
        {isSearching ? <FaTimes /> : <FaSearch />}
      </button>

      {/* Search Form - Hidden on mobile unless toggled */}
      <div className={`${isSearching ? 'flex' : 'hidden'} md:flex items-center`}>
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products..."
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            type="submit"
            className="absolute right-2 text-gray-400 hover:text-gray-600"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-full md:w-96 right-0">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map(product => (
                <Link 
                  href={`/product/${product._id}`} 
                  key={product._id}
                  onClick={() => {
                    setIsOpen(false);
                    setIsSearching(false);
                  }}
                  className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-12 h-12 relative bg-gray-100 rounded flex-shrink-0 mr-3">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.variants && product.variants.length > 0 
                        ? `${product.variants.length} variant${product.variants.length > 1 ? 's' : ''}`
                        : 'No variants'}
                    </p>
                  </div>
                </Link>
              ))}
              
              {/* View all results link */}
              <div className="p-2 bg-gray-50">
                <Link 
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                    setIsSearching(false);
                  }}
                  className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all results for "{query}"
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;