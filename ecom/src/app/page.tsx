import Image from "next/image";
import { HeroBanner } from './components/HeroBanner';
import Wrapper from './components/Wrapper';
import { ProductService } from "./lib/api";
import HomeProductGrid from "./components/HomeProductGrid";

export default async function Home() {

  const products = await ProductService.getAllProducts()
  console.log("🚀 ~ Home ~ products:", products)
  return (
    <main>
      <HeroBanner />

      <Wrapper>
        <div className="text-center max-w-[800px] mx-auto my-[50px] md:my-[80px]">
          <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">
            Radiant Elegance
          </div>
          <div className="text-md md:text-xl">
            Discover exquisite pieces that capture the sparkle of every moment.
          </div>
        </div>


        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Collections</h2>
          
          {/* Product Grid */}
          <HomeProductGrid products={products} />
        </section>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
        {products?.data?.map((product) => (
          <ProductCard key={product.id} data={product} />
        ) 
        )} */}


        {/* </div> */}
      </Wrapper>
    </main>
  );
}
