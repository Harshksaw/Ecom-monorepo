// src/app/product/[slug]/page.tsx
import { Metadata } from 'next';
import { ProductService } from '../../lib/api';
import Wrapper from '../../components/Wrapper';
import ProductDetailsCarousel from '../../components/ProductDetailsCarousel';
import RelatedProducts from '../../components/RelatedProducts';
import AddToCartButton from '../../components/AddToCartButton';
import {  FaRuler, FaWeight, FaShippingFast } from 'react-icons/fa';

// Define the props for the page component
type ProductPageProps = {
  params: any;
};

// Define product interface based on your API response
interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  images: string[];
  weight?: number;
  materials?: string[];
  gems?: Array<{
    type: string;
    carat: number;
    color: string;
    clarity: string;
    _id: string;
  }>;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Metadata generation for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await ProductService.getProductBySlug(params.slug);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found',
      };
    }

    return {
      title: `${product.name} | Shri Nanu Gems & Jewelers`,
      description: product.description || 'Exquisite jewelry crafted with precision and care',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Details',
      description: 'View detailed information about this product',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    // Fetch the product data using the slug
    const product = await ProductService.getProductBySlug(params.slug);
    
    if (!product) {
      return (
        <Wrapper>
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold text-pink-600 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you are looking for does not exist or has been removed.</p>
          </div>
        </Wrapper>
      );
    }

    // Fetch related products (products from the same category)
    const relatedProductsData = await ProductService.getRelatedProducts(
      params.slug,
      product.categoryId?._id
    );

    // Determine if product has gems or not for styling
    const hasGems = product.gems && product.gems.length > 0;
    
    // Get material color for styling
    const isGold = product.materials?.some(m => m.toLowerCase().includes('gold'));
    const materialColor = isGold ? 'from-yellow-50 to-yellow-100' : 'from-gray-50 to-gray-100';

    return (
      <div className="w-full py-8 md:py-16 bg-gradient-to-b from-pink-50 to-white">
        <Wrapper>
          {/* Breadcrumbs */}
          <div className="text-sm mb-6 text-gray-500">
            <span>Home</span> / <span>{product.categoryId?.name}</span> / <span className="text-pink-600">{product.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left column with product images */}
            <div className="w-full lg:w-3/5 bg-white p-2 rounded-lg shadow-sm">
              <ProductDetailsCarousel images={product.images} />
            </div>

            {/* Right column with product details */}
            <div className="w-full lg:w-2/5">
              {/* Category */}
              <div className="uppercase tracking-wider text-sm text-pink-600 mb-2">
                {product.categoryId?.name}
              </div>
              
              {/* Product title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
                {product.name}
              </h1>

              {/* Materials tags */}
              {product.materials && product.materials.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.materials.map((material, index) => (
                    <span 
                      key={index} 
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        material.toLowerCase().includes('gold')
                          ? 'bg-yellow-100 text-yellow-800'
                          : material.toLowerCase().includes('silver')
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-pink-100 text-pink-800'
                      }`}
                    >
                      {material}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 ml-2">incl. taxes</span>
                </div>
                
                {/* Stock status */}
                <div className={`text-sm font-medium mt-1 ${
                  product.stockQuantity > 5 
                    ? 'text-green-600' 
                    : product.stockQuantity > 0 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                }`}>
                  {product.stockQuantity > 5 
                    ? 'In Stock' 
                    : product.stockQuantity > 0 
                      ? `Only ${product.stockQuantity} left in stock` 
                      : 'Out of Stock'}
                </div>
              </div>
              
              {/* Shipping notice */}
              <div className="flex items-center text-sm text-gray-600 mb-6">
                <FaShippingFast className="mr-2 text-pink-600" />
                Free shipping on orders above ₹5,000
              </div>

              {/* Add to cart & wishlist buttons */}
              <div className="flex gap-3 mb-8">
                <div className="flex-grow">
                  <AddToCartButton product={product} />
                </div>
           
              </div>

              {/* Product highlights */}
              <div className={`bg-gradient-to-r ${materialColor} p-5 rounded-lg mb-8`}>
                <h3 className="font-semibold mb-3 text-gray-800">Highlights</h3>
                
                {/* Product short description */}
                <p className="text-gray-700 mb-4">
                  {product.description.split('.')[0]}. {/* Just the first sentence */}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Materials */}
                  {product.materials && product.materials.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Materials:</span>
                      <span className="ml-1 text-gray-600">{product.materials.join(', ')}</span>
                    </div>
                  )}
                  
                  {/* Weight */}
                  {product.weight && (
                    <div className="text-sm flex items-center">
                      <FaWeight className="mr-1 text-gray-500" size={12} />
                      <span className="font-medium text-gray-700">Weight:</span>
                      <span className="ml-1 text-gray-600">{product.weight} g</span>
                    </div>
                  )}
                  
                  {/* SKU */}
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">SKU:</span>
                    <span className="ml-1 text-gray-600">{product.sku}</span>
                  </div>
                  
                  {/* Dimensions */}
                  {product.dimensions && (
                    <div className="text-sm flex items-center">
                      <FaRuler className="mr-1 text-gray-500" size={12} />
                      <span className="font-medium text-gray-700">Size:</span>
                      <span className="ml-1 text-gray-600">
                        {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height} mm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gems Information */}
              {hasGems && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-3 border-b pb-2">Gemstone Details</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product.gems.map((gem, index) => (
                      <div key={index} className="bg-white border border-gray-200 p-3 rounded-lg">
                        <div className="font-medium text-gray-800">{gem.type}</div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mt-1">
                          <div>Carat: {gem.carat}</div>
                          <div>Color: {gem.color}</div>
                          <div>Clarity: {gem.clarity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product description */}
              <div className="mb-8">
                <h3 className="font-semibold mb-3 border-b pb-2">Description</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  {product.description.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag:any, index:any) => (
                      <span 
                        key={index} 
                        className="inline-block bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related products section */}
          {relatedProductsData && relatedProductsData?.length > 0 && (
            <div className="mt-16 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-center">You Might Also Like</h2>
              <RelatedProducts products={relatedProductsData} />
            </div>
          )}
        </Wrapper>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product data:', error);
    return (
      <Wrapper>
        <div className="py-10 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h1>
          <p className="text-gray-600">There was an error loading the product information. Please try again later.</p>
        </div>
      </Wrapper>
    );
  }
}