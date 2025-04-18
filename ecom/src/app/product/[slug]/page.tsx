import { Metadata } from 'next';
import { ProductService } from '../../lib/api';
import Wrapper from '../../components/Wrapper';
import ProductDetailsCarousel from '../../components/ProductDetailsCarousel';
import AddToCartButton from '../../components/AddToCartButton';
import { FaRuler, FaWeight, FaShippingFast } from 'react-icons/fa';

// Updated interfaces to match the JSON structure
interface ProductVariant {
  metalColor: string;
  images: (string | null)[];
  price: {
    default: number;
    USD?: number;
  };
  stock: number;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  images: (string | null)[];
  weight?: {
    value: number;
    unit: string;
  };
  materials?: string[];
  gems?: any[];
  materialType: string;
  purity: string;
  shape: string;
  variants: ProductVariant[];
  dimensions?: {
    length: number;
    width: number;
    height?: number;
  };
  deliveryOptions: {
    type: string;
    duration: string;
    price: number;
  }[];
  isActive: boolean;
  isFeatured: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

type ProductPageProps = {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function ProductPage({ params }: ProductPageProps) {
  
  try {
    console.log("🚀 ~ ProductPage ~ params:",await params)
    const product = await ProductService.getProductBySlug(params.slug);
    console.log("🚀 ~ ProductPage ~ product:", product)
    
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

    // Get the first variant for primary details
    const firstVariant = product.variants[0] || {};
    
    // Determine primary image
    const primaryImages = [
      ...(product.images || []),
      ...(firstVariant.images || [])
    ].filter(img => img !== null) as string[];

    return (
      <div className="w-full py-8 md:py-16 bg-gradient-to-b from-pink-50 to-white">
        <Wrapper>
          {/* Breadcrumbs */}
          <div className="text-sm mb-6 text-gray-500">
            <span>Home</span> / <span>{product.categoryId.name}</span> / <span className="text-pink-600">{product.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left column with product images */}
            <div className="w-full lg:w-3/5 bg-white p-2 rounded-lg shadow-sm">
              <ProductDetailsCarousel images={primaryImages} />
            </div>

            {/* Right column with product details */}
            <div className="w-full lg:w-2/5">
              {/* Category */}
              <div className="uppercase tracking-wider text-sm text-pink-600 mb-2">
                {product.categoryId.name}
              </div>
              
              {/* Product title */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">
                {product.name}
              </h1>

              {/* Materials and Purity */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span 
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    product.materialType.toLowerCase().includes('gold')
                      ? 'bg-yellow-100 text-yellow-800'
                      : product.materialType.toLowerCase().includes('silver')
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-pink-100 text-pink-800'
                  }`}
                >
                  {product.materialType} {product.purity}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{firstVariant.price?.default?.toLocaleString() || 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">incl. taxes</span>
                </div>
                
                {/* Stock status */}
                <div className={`text-sm font-medium mt-1 ${
                  firstVariant.stock > 5 
                    ? 'text-green-600' 
                    : firstVariant.stock > 0 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                }`}>
                  {firstVariant.stock > 5 
                    ? 'In Stock' 
                    : firstVariant.stock > 0 
                      ? `Only ${firstVariant.stock} left in stock` 
                      : 'Out of Stock'}
                </div>
              </div>
              
              {/* Shipping notice */}
              <div className="flex items-center text-sm text-gray-600 mb-6">
                <FaShippingFast className="mr-2 text-pink-600" />
                Free shipping on orders above ₹5,000
              </div>

              {/* Add to cart button */}
              <div className="flex gap-3 mb-8">
                <div className="flex-grow">
                  <AddToCartButton product={product} />
                </div>
              </div>

              {/* Product highlights */}
              <div className={`bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-lg mb-8`}>
                <h3 className="font-semibold mb-3 text-gray-800">Highlights</h3>
                
                {/* Product short description */}
                <p className="text-gray-700 mb-4">
                  {product.description.split('.')[0]}. {/* Just the first sentence */}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Material and Purity */}
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Material:</span>
                    <span className="ml-1 text-gray-600">{product.materialType} {product.purity}</span>
                  </div>
                  
                  {/* Weight */}
                  {product.weight && (
                    <div className="text-sm flex items-center">
                      <FaWeight className="mr-1 text-gray-500" size={12} />
                      <span className="font-medium text-gray-700">Weight:</span>
                      <span className="ml-1 text-gray-600">{product.weight.value} {product.weight.unit}</span>
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
                        {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height || 0} mm
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Variant Information */}
              {product.variants.length > 1 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-3 border-b pb-2">Available Variants</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {product.variants.map((variant, index) => (
                      <div 
                        key={variant._id} 
                        className="bg-white border border-gray-200 p-3 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-gray-800">
                            {variant.metalColor} Variant
                          </div>
                          <div className="text-sm text-gray-600">
                            Stock: {variant.stock}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Price: ₹{variant.price.default.toLocaleString()}
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
                    {product.tags.map((tag, index) => (
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