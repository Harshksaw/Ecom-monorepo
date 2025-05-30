import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaWhatsapp } from 'react-icons/fa'

const Footer = ({categories}:any) => {

  return (
    <footer className="bg-gray-900 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Our Company Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Our Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link href="/product-care" className="text-gray-400 hover:text-white">Product Care</Link></li>
            </ul>

            <div className="pt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Head Office</h4>
              <address className="not-italic text-sm text-gray-400 leading-relaxed">
                House No.4357,<br />
                Nathmal Ji Ka Chowk,<br />
                Johari Bazar, Jaipur 302003<br />
                Tel: <a href="tel:+919782441137" className="text-gray-300 hover:text-white hover:underline">+91 97824 41137</a><br />
                Email: <a href="mailto:shrinanugems111@gmail.com" className="text-gray-300 hover:text-white hover:underline">shrinanugems111@gmail.com</a>
              </address>
            </div>
          </div>

          {/* Our Policies Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Our Policies</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/return-policy" className="text-gray-400 hover:text-white">Return Policy</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link href="/terms-conditions" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Categories Section */}
     <div className="space-y-3">
  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Categories</h3>
  <ul className="space-y-2">
    {categories?.filter((cat: any) => cat.isActive)
      .sort((a: any, b: any) => {
        // Define the desired order
        const categoryOrder = [
          "New Arrivals",
          "Necklace",
          "Pendant", 
          "Rings",
          "Earring",
          "Bracelet",
          "Gift",
          "Watches",
          "Gemstones"
        ];
        
        // Get the index of each category in the desired order
        const indexA = categoryOrder.findIndex(cat => 
          cat.toLowerCase() === a.name.toLowerCase()
        );
        const indexB = categoryOrder.findIndex(cat => 
          cat.toLowerCase() === b.name.toLowerCase()
        );
        
        // If both categories are in the order array
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        
        // If only category A is in the order array, it comes first
        if (indexA !== -1) return -1;
        
        // If only category B is in the order array, it comes first
        if (indexB !== -1) return 1;
        
        // If neither category is in the order array, sort alphabetically
        return a.name.localeCompare(b.name);
      })
      .map((category: any) => (
        <li key={category._id}>
          <Link href={`/category/${category.slug}`} className="text-gray-400 hover:text-white">
            {category.name}
          </Link>
        </li>
      ))}
  </ul>
</div>
        </div>

        {/* Social Media */}
        <div className="mt-10 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SHRI NANU GEMS & JEWELERS. All rights reserved.
            </p>
            <div className="flex space-x-4 mr-28">
              <a
                href="https://www.facebook.com/share/1BYZVxzmBg/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/shrinanugems?igsh=MW8wZ3JtMnc2c2F6Yw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/gajanand-daga-926a68208"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://wa.me/919782441137/?text=Hello"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://x.com/shrinanu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors"
                aria-label="WhatsApp"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;