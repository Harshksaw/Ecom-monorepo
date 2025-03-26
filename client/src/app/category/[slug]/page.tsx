// app/categories/[categorySlug]/page.tsx
import { Metadata } from 'next';
import { fetchCategoryBySlug, fetchProductsByCategory } from '../../lib/api';
import ProductGrid from '../../components/products/ProductGrid'

type CategoryPageProps = {
  params: { categorySlug: string };
  searchParams: { page?: string };
};

export async function generateMetadata({ 
  params 
}: CategoryPageProps): Promise<Metadata> {
  try {
    const category = await fetchCategoryBySlug(params.categorySlug);
    return {
      title: `${category.name} - Category`,
      description: category.description || `Browse products in ${category.name} category`
    };
  } catch (error) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found'
    };
  }
}

export default async function CategoryDetailPage({ 
  params, 
  searchParams 
}: CategoryPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  try {
    // Fetch category details
    const category = await fetchCategoryBySlug(params.categorySlug);
    
    // Fetch products for this category
    const { data: products, totalPages } = await fetchProductsByCategory(
      params.categorySlug, 
      page
    );

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <ProductGrid 
          products={products} 
          totalPages={totalPages}
          currentPage={page}
          categorySlug={params.categorySlug}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Category Not Found
        </h1>
        <p className="text-gray-600 mt-4">
          The category you are looking for does not exist.
        </p>
      </div>
    );
  }
}

// Optional: generate static params for better performance
export async function generateStaticParams() {
  const { data: categories } = await fetchCategories();
  
  return categories.map((category) => ({
    categorySlug: category.slug
  }));
}