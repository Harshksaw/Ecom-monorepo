// app/categories/[slug]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { ProductService } from '../../lib/api';
import ProductGrid from '../../components/products/ProductGrid';

type CategoryPageProps = {
  params: { slug: string };
  searchParams: { 
    page?: string;
    sort?: string;
    price?: string;
  };
};

export default async function CategoryDetailPage({ 
  params, 
  searchParams 
}: CategoryPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  try {
    const category = params.slug;
    console.log("🚀 ~ category:", category);

    // Fetch products for this category
    const productResponse = await ProductService.getAllProductByCategory({
      page,
      pageSize: 12,
      category: category
    });

    // Check if products array is empty
    const hasProducts = productResponse && productResponse.length > 0;

    return (
      <div className="container mx-auto px-4 py-8">
        {/* No Products Message */}
        {!hasProducts ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              No Products Found
            </h2>
            <p className="text-gray-500">
              There are currently no products in this category.
            </p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <ProductGrid 
              products={productResponse} 
              totalPages={productResponse.meta?.pagination?.pageCount || 1}
              currentPage={page}
              categorySlug={params.slug}
            />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching category details:', error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Category Not Found
        </h1>
        <p className="text-gray-600 mt-4">
          The category you are looking for does not exist or has no products.
        </p>
      </div>
    );
  }
}