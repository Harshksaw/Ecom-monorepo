// src/app/product/[slug]/page.tsx
import { Metadata } from 'next';

import { ProductService } from '../../lib/api';
import Wrapper from '../../components/Wrapper';
import ProductDetailsCarousel from '../../components/ProductDetailsCarousel';
import RelatedProducts from '../../components/RelatedProducts';
import AddToCartButton from '../../components/AddToCartButton';


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
    console.log("🚀 ~ generateMetadata ~ product:", product)
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found',
      };
    }

    return {
      title: `${product.name} | Jewelry Store`,
      description: product.description || 'Product details',
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
    // console.log("🚀 ~ ProductPage ~ product:", product.product)
    
    if (!product) {
      return (
        <Wrapper>
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
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

    // Calculate discount percentage if needed
    // const discountPercentage = product.originalPrice 
    //   ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    //   : null;

    return (
      <div className="w-full md:py-20">
        <Wrapper>
          <div className="flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]">
            {/* Left column with product images */}
            <div className="w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0">
              <ProductDetailsCarousel images={product.images} />
            </div>

            {/* Right column with product details */}
            <div className="flex-[1] py-3">
              {/* Product title */}
              <h1 className="text-[34px] font-semibold mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Product category */}
              {product.categoryId && (
                <div className="text-lg font-semibold mb-5">
                  {product.categoryId.name}
                </div>
              )}

              {/* SKU */}
              <div className="text-sm text-gray-500 mb-4">
                SKU: {product.sku}
              </div>

              {/* Product pricing */}
              <div className="flex items-center mb-2">
                <p className="text-2xl font-bold">
                ₹{product.price}
                </p>
              </div>

              <div className="text-md font-medium text-black/[0.5]">
                incl. of taxes
              </div>
              <div className="text-md font-medium text-black/[0.5] mb-8">
                {product.stockQuantity > 0 
                  ? `In stock (${product?.stockQuantity} available)` 
                  : 'Out of stock'}
              </div>

              {/* Materials */}
              {product.materials && product.materials.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material:any, index:any) => (
                      <span 
                        key={index} 
                        className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gems Information */}
              {product.gems && product.gems.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-md font-semibold mb-2">Gem Details</h3>
                  <div className="space-y-3">
                    {product.gems.map((gem:any, index:any) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium">{gem.type}</div>
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

              {/* Add to cart button */}
              <div className="mb-8">
                <AddToCartButton product={product} />
              </div>

              {/* Product description */}
              <div className="mb-8">
                <div className="text-lg font-bold mb-3">Product Description</div>
                <div className="text-md text-gray-700">
                  {product.description}
                </div>
              </div>

              {/* Product dimensions */}
              {product.dimensions && (
                <div className="mb-6">
                  <div className="text-lg font-bold mb-3">Dimensions</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-sm text-gray-500">Length</div>
                      <div className="font-medium">{product.dimensions.length} mm</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-sm text-gray-500">Width</div>
                      <div className="font-medium">{product.dimensions.width} mm</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-sm text-gray-500">Height</div>
                      <div className="font-medium">{product.dimensions.height} mm</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weight information */}
              {product.weight && (
                <div className="mb-6">
                  <div className="text-lg font-bold mb-2">Weight</div>
                  <div className="text-md">{product.weight} grams</div>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag:any, index:any) => (
                      <span 
                        key={index} 
                        className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600"
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
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
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