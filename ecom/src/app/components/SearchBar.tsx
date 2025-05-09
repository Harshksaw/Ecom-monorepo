'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import { API_URL } from '../lib/api';
import Image from 'next/image';

const SearchBar = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
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

  // Debounce search
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

  // Close search when clicking outside
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

  // Focus input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && inputRef.current) {
      setTimeout(() => {
        //@ts-ignore
        inputRef.current.focus();
      }, 100);
    }
  }, [showMobileSearch]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setShowMobileSearch(false);
    }
  };

  // Get product image
  const getProductImage = (product: any): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.images && firstVariant.images.length > 0) {
        return firstVariant.images[0];
      }
    }
    
    return '/placeholder-image.jpg';
  };

  // Reusable function to render search results
  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm">Searching...</p>
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <div className="max-h-[60vh] overflow-y-auto">
          {results.map((product: any) => (
            <Link 
              href={`/product/${product._id}`} 
              key={product._id}
              onClick={() => {
                setIsOpen(false);
                setShowMobileSearch(false);
              }}
              className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100"
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
          
          <div className="p-3 bg-gray-50">
            <Link 
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => {
                setIsOpen(false);
                setShowMobileSearch(false);
              }}
              className="block text-center text-sm text-blue-600 font-medium"
            >
              View all results for "{query}"
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No results found for "{query}"
      </div>
    );
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="p-2 text-gray-700 rounded-full md:hidden"
        aria-label="Search"
      >
        <FaSearch size={18} />
      </button>

      {/* Desktop search bar */}
      <div 
        ref={searchRef}
        className="hidden md:block relative"
      >
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products..."
            className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <FaSearch size={16} />
          </button>

          {/* Desktop search results */}
          {isOpen && query && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {renderSearchResults()}
            </div>
          )}
        </form>
      </div>

      {/* Mobile search overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-50 pt-20">
          <div className="container mx-auto px-4">
            {/* Close button */}
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="absolute top-4 right-4 p-2 text-gray-500"
            >
              <FaTimes size={20} />
            </button>

            {/* Search form */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                placeholder="Search products..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                autoFocus
              />
              {query && (
                <button 
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <FaTimes size={16} />
                </button>
              )}
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <FaSearch size={20} />
              </button>
            </form>

            {/* Mobile search results */}
            {query && (
              <div className="mt-4 bg-white border-t border-gray-200">
                {renderSearchResults()}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;