// app/categories/[slug]/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import { CategoryService, ProductService } from '../../lib/api';
import ProductGrid from '../../components/products/ProductGrid';

type CategoryPageProps = {
  params: { slug: string };
  searchParams: { 
    page?: string;
    sort?: string;
    price?: string;
  };
};

// export async function generateMetadata({ 
//   params 
// }: CategoryPageProps): Promise<Metadata> {
//   try {
//     const category = await CategoryService.getCategoryBySlug(params.slug);
    
//     return {
//       title: `${category.attributes.name} - Category`,
//       description: category.attributes.description || 
//         `Explore our collection of ${category.attributes.name} products`
//     };
//   } catch (error) {
//     return {
//       title: 'Category Not Found',
//       description: 'The requested category could not be found'
//     };
//   }
// }

export default async function CategoryDetailPage({ 
  params, 
  searchParams 
}: CategoryPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  try {
    // Fetch category details
    // const category = await CategoryService.getCategoryBySlug(params.slug);
    
    // // Prepare filters
    // const filters: Record<string, any> = {
    //   category: params.slug
    // };

    // // Handle sorting
    // if (searchParams.sort) {
    //   switch(searchParams.sort) {
    //     case 'price-asc':
    //       filters.sort = 'price:asc';
    //       break;
    //     case 'price-desc':
    //       filters.sort = 'price:desc';
    //       break;
    //     case 'newest':
    //       filters.sort = 'createdAt:desc';
    //       break;
    //   }
    // }

    // // Handle price filtering
    // if (searchParams.price) {
    //   const [minPrice, maxPrice] = searchParams.price.split('-').map(Number);
    //   if (!isNaN(minPrice)) filters.minPrice = minPrice;
    //   if (!isNaN(maxPrice)) filters.maxPrice = maxPrice;
    // }

    // Fetch products for this category
    const productResponse = await ProductService.getAllProducts({
      page,
      pageSize: 12,

    });
    console.log("🚀 ~ productResponse:", productResponse)

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row items-center mb-8">
          {/* Category Image */}
          {/* {category.attributes.imageUrl && (
            <div className="w-32 h-32 md:mr-6 mb-4 md:mb-0 relative">
              <Image 
                src={category.attributes.imageUrl} 
                alt={category.attributes.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
          )} */}
          
          {/* Category Info */}
          {/* <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">
              {category.attributes.name}
            </h1>
            
            {category.attributes.description && (
              <p className="text-gray-600 max-w-2xl">
                {category.attributes.description}
              </p>
            )}
          </div> */}
        </div>

        {/* Filtering and Sorting Options */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600">
            {productResponse.meta?.pagination?.total || 0} Products
          </div>
          
          <div className="flex space-x-4">
            {/* Sorting Dropdown */}
            <select 
              className="border rounded px-2 py-1"
              defaultValue={searchParams.sort || ''}
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            {/* Price Filter */}
            <select 
              className="border rounded px-2 py-1"
              defaultValue={searchParams.price || ''}
            >
              <option value="">All Prices</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1000</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid 
          products={productResponse} 
          totalPages={productResponse.meta?.pagination?.pageCount || 1}
          currentPage={page}
          categorySlug={params.slug}
        />
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
          The category you are looking for does not exist.
        </p>
      </div>
    );
  }
}

// Generate static params for SEO and performance
// export async function generateStaticParams() {
//   try {
//     const { data: categories } = await CategoryService.getAllCategories();
    
//     return categories.map((category) => ({
//       slug: category.attributes.slug
//     }));
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }