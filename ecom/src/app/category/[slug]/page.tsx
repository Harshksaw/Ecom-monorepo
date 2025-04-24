// src/app/category/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { ProductService } from '../../lib/api';
import ProductGrid from '../../components/products/ProductGrid';

// Define the props type correctly for Next.js App Router
type Props = {
  params: any;
  searchParams: any;
};



// Main page component
export default async function CategoryDetailPage({ 
  params, 
  searchParams 
}: Props) {




  
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1;

  
  try {
    const category =decodeURIComponent(params.slug);
    console.log("🚀 ~ category:", category)



    // Fetch products for this category
    const productResponse = await ProductService.getAllProductByCategory({
      page,
      pageSize: 12,
      category: category,
      material: searchParams?.material,
    });

    // Check if products array is empty
    const hasProducts = productResponse && productResponse.length > 0;

    if (!hasProducts && page > 1) {
      // If we're on a page that doesn't exist, redirect to first page
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h1>
          <p className="text-gray-600 mt-2">
            Explore our collection of {category} designs
          </p>
        </div>

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