// src/app/product/[slug]/page.tsx

import ProductDetails from "@/app/components/ProductDetails";
import Wrapper from "@/app/components/Wrapper";
import { ProductService } from "@/app/lib/api";


type Params = { params: { slug: string } };

export default async function ProductPage({ params }: any) {
  try {
    const product = await ProductService.getProductBySlug(params.slug);

    if (!product) {
      return (
        <Wrapper>
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you are looking for does not exist or has been removed.</p>
          </div>
        </Wrapper>
      );
    }

    return <ProductDetails product={product} />;
  } catch (error) {

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

