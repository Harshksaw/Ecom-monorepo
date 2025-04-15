import Link from 'next/link'
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-pink-100 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Our Company Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-pink-800 border-b border-pink-200 pb-2">Our Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-700 hover:text-pink-700">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-pink-700">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-700 hover:text-pink-700">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/product-care" className="text-gray-700 hover:text-pink-700">
                  Product Care
                </Link>
              </li>
            </ul>
            
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-pink-800 mb-2">Company Info</h4>
              <address className="not-italic text-sm text-gray-600">
                <p>123 Jewelry Lane, Diamond District</p>
                <p>Mumbai, Maharashtra 400001</p>
                <p>Tel: +91 98765 43210</p>
                <p>Email: info@shrinanugems.com</p>
              </address>
            </div>
          </div>
          
          {/* Our Policies Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-pink-800 border-b border-pink-200 pb-2">Our Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-700 hover:text-pink-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-gray-700 hover:text-pink-700">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-gray-700 hover:text-pink-700">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="text-gray-700 hover:text-pink-700">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-pink-800 border-b border-pink-200 pb-2">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/rings" className="text-gray-700 hover:text-pink-700">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="text-gray-700 hover:text-pink-700">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/category/pendant" className="text-gray-700 hover:text-pink-700">
                  Pendant
                </Link>
              </li>
              <li>
                <Link href="/category/bracelet" className="text-gray-700 hover:text-pink-700">
                  Bracelet
                </Link>
              </li>
              <li>
                <Link href="/category/necklace" className="text-gray-700 hover:text-pink-700">
                  Necklace
                </Link>
              </li>
              <li>
                <Link href="/category/gifts" className="text-gray-700 hover:text-pink-700">
                  Gifts
                </Link>
              </li>
              <li>
                <Link href="/category/watches" className="text-gray-700 hover:text-pink-700">
                  Watches
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social media and copyright */}
        <div className="mt-10 pt-6 border-t border-pink-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} SHRI NANU GEMS & JEWELERS. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-pink-700 flex items-center justify-center text-white hover:bg-pink-800 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-pink-700 flex items-center justify-center text-white hover:bg-pink-800 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-pink-700 flex items-center justify-center text-white hover:bg-pink-800 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-pink-700 flex items-center justify-center text-white hover:bg-pink-800 transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterest />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer