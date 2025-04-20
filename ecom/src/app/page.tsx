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
      <div className="text-center max-w-[800px] mx-auto my-[50px] md:my-[80px] px-4">
        <Link 
          href="/"
        
        >
          <div className="text-3xl md:text-4xl mb-5 font-bold leading-tight text-pink-800" >

          Shri Nanu Gems & Jewelers
          </div>
        </Link>
        <div className="text-md md:text-xl text-gray-700">
          Shri Nanu Gems creates high-quality, handcrafted jewelry blending timeless elegance with modern design. 
          Each piece is crafted with care using premium materials for lasting beauty. 
          Whether for a gift or personal use, their unique collection offers something special for every occasion, 
          designed to complement your individual style.
        </div>
      </div>

      <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Collections</h2>
          
          {/* Product Grid */}
          <HomeProductGrid products={products} />
        </section>



    </main>
  );
}