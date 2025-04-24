import Link from 'next/link';

import { HeroBanner } from './components/HeroBanner';
import HomeProductGrid from './components/HomeProductGrid';

import { ProductService } from "./lib/api";


export default async function Home() {
  // In a real application, you would fetch data from your API
  const products = await ProductService.getAllProducts();

  return (
    <main className="bg-white">
      {/* Hero Banner */}
      <HeroBanner />



      {/* Welcome Section */}
      <div className="text-center max-w-[800px] mx-auto  md:my-[80px] px-4">
        <Link
          href="/"

        >
          <div className="text-3xl md:text-4xl mt-4 mb-5 font-bold leading-tight text-gray-800" >

            Shri Nanu Gems & Jewelers
          </div>
        </Link>



        <div className="text-md md:text-xl text-gray-700 mt-4">
  <div>Since 2014, Discover Timeless Elegance     At Shri Nanu Gems,</div>
  <div>
 we specialize in crafting high-quality, handcrafted jewelry blending timeless elegance with modern design. Each piece is crafted with care using premium materials for lasting beauty. Whether for a gift or personal use, our unique collection offers something special for every occasion, designed to complement your individual style.
  </div>
</div>

      </div>

      <section className="mb-14">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 mt-8 ">Our Collections</h2>

        {/* Product Grid */}
        <HomeProductGrid products={products} />
      </section>



    </main>
  );
}