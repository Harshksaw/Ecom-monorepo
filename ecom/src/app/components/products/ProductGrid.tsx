// components/products/ProductGrid.tsx
import Link from 'next/link';
import Image from 'next/image';

import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import ProductPagination from './ProductPagination';

interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    rating?: number;
    stock: number;
  }
interface ProductGridProps {
  products: Product[];
  totalPages?: number;
  currentPage?: number;
  categorySlug?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  totalPages = 1,
  currentPage = 1,
  categorySlug
}) => {
  return (
    <div className="container mx-auto px-4">
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <ProductPagination
          totalPages={totalPages} 
          currentPage={currentPage}
          categorySlug={categorySlug}
        />
      )}
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  console.log("🚀 ~ product:", product)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Product Image */}
      <Link href={`/product/${product._id}`} className="block relative">
        {/* {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs z-10">
            {discountPercentage}% OFF
          </div>
        )} */}
        <div className="relative w-full pt-[100%]">
          <Image 
            loading='lazy'
            src={product.images[1] }
            alt={product.name}
            fill
            className="absolute top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        <Link href={`/products/₹{product.slug}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-red-600 font-bold mr-2">
                  ₹{product.salePrice.toFixed(2)}
                </span>
                <span className="text-gray-400 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-black font-bold">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center text-yellow-500">
              ★ {product.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
            title="Add to Cart"
          >
            <FaShoppingCart className="mr-2" /> Add
          </button>
          
          <button 
            className="text-gray-500 hover:text-red-500 transition-colors"
            title="Add to Wishlist"
          >
            <FaHeart size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;

// Pagination Component
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  categorySlug?: string;
}


export { ProductCard };