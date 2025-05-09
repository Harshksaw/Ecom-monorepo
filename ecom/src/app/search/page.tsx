// src/app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '../lib/api';
import Wrapper from '../components/Wrapper';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface SearchResult {
  _id: string;
  name: string;
  images: string[];
  price: number;
  variants: any[];
  [key: string]: any;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    
    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API_URL}/products/search?query=${encodeURIComponent(query)}`);
        setResults(response.data.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setError('An error occurred while searching. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  if (isLoading) {
    return (
      <Wrapper>
        <div className="py-10 flex flex-col items-center justify-center min-h-[400px]">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600">Searching for "{query}"...</p>
        </div>
      </Wrapper>
    );
  }
  
  if (error) {
    return (
      <Wrapper>
        <div className="py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Wrapper>
    );
  }
  
  return (
    <Wrapper>
      <div className="py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <FaSearch className="mr-2" />
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600 mt-2">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {results.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No results found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any products matching your search for "{query}". 
              Please try another search term or browse our categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}