// components/products/ProductPagination.tsx
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ProductPaginationProps {
  totalPages: number;
  currentPage: number;
  categorySlug?: string;
}

const ProductPagination: React.FC<ProductPaginationProps> = ({
  totalPages,
  currentPage,
  categorySlug
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create pagination URL
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Render page numbers
  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // Always show first page
    if (totalPages > 0) pages.push(1);
    
    // Logic for middle pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if needed
    if (startPage > 2) pages.push('...');
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages - 1) pages.push('...');
    
    // Always show last page if more than 1 page
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  // Render pagination
  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center"
        >
          <FaChevronLeft className="mr-2" /> Prev
        </Link>
      )}

      {/* Page Numbers */}
      {renderPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <span 
              key={`ellipsis-${index}`} 
              className="px-4 py-2 text-gray-500"
            >
              ...
            </span>
          );
        }

        return (
          <Link
            key={page}
            href={createPageURL(page as number)}
            className={`px-4 py-2 border rounded-md transition-colors ${
              page === currentPage 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center"
        >
          Next <FaChevronRight className="ml-2" />
        </Link>
      )}
    </div>
  );
};

export default ProductPagination;