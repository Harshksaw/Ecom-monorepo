import CategorySection from './components/CategoryCard';
import { HeroBanner } from './components/HeroBanner';
import HomeProductGrid from './components/HomeProductGrid';
import Wrapper from './components/Wrapper';
import { ProductService } from "./lib/api";


export default async function Home() {
  // In a real application, you would fetch data from your API
  const products = await ProductService.getAllProducts();
  
  return (
    <main className="bg-white">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Feature Banner */}
      <div className="bg-pink-600 text-white py-2 relative top-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <span className="font-bold mb-1">Free Shipping</span>
              <span className="text-sm">On all orders above ₹10,000</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold mb-1">100% Genuine Products</span>
              <span className="text-sm">With certification & guarantee</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold mb-1">Easy Returns</span>
              <span className="text-sm">15-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="text-center max-w-[800px] mx-auto my-[50px] md:my-[80px] px-4">
        <div className="text-3xl md:text-4xl mb-5 font-bold leading-tight text-pink-800">
          Shri Nanu Gems & Jewelers
        </div>
        <div className="text-md md:text-xl text-gray-700">
          Discover exquisite pieces crafted with precision and passion. 
          From timeless classics to contemporary designs, our collection brings elegance to every occasion.
        </div>
      </div>

      <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Collections</h2>
          
          {/* Product Grid */}
          <HomeProductGrid products={products} />
        </section>



      {/* Category Section */}
      {/* <CategorySection /> */}




      {/* Special Offers Banner */}
      {/* <div className="bg-gradient-to-r from-pink-600 to-pink-500 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Special Offers</h2>
          <p className="text-lg mb-6">
            Sign up now and get 10% off on your first purchase!
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-md focus:outline-none text-gray-700"
            />
            <button className="bg-pink-800 px-6 py-3 rounded-r-md font-medium hover:bg-pink-900 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div> */}

      {/* Instagram Feed (Mockup) */}
      {/* <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-pink-800 mb-8">
            Follow Us on Instagram
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div 
                key={item} 
                className="aspect-square bg-pink-100 flex items-center justify-center"
              >
                <span className="text-pink-400">Instagram Post {item}</span>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </main>
  );
}