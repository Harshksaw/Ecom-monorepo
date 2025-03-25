import Link from 'next/link'
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-14 pb-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-[50px] md:gap-0">
          {/* Left section */}
          <div className="flex gap-[50px] md:gap-[75px] lg:gap-[100px] flex-col md:flex-row">
            {/* First column */}
            <div className="flex flex-col gap-3">
              <div className="font-medium uppercase text-sm cursor-pointer">
                Find a store
              </div>
              <div className="font-medium uppercase text-sm cursor-pointer">
                Become a partner
              </div>
              <div className="font-medium uppercase text-sm cursor-pointer">
                Sign up for email
              </div>
              <div className="font-medium uppercase text-sm cursor-pointer">
                Send us feedback
              </div>
              <div className="font-medium uppercase text-sm cursor-pointer">
                Student discount
              </div>
            </div>
            
            {/* Second column group */}
            <div className="flex gap-[50px] md:gap-[75px] lg:gap-[100px]">
              {/* Get help section */}
              <div className="flex flex-col gap-3">
                <div className="font-medium uppercase text-sm">
                  Get help
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  Order Status
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  Delivery
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  Returns
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  Payment Options
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  Contact Us
                </div>
              </div>
              
              {/* About section */}
              <div className="flex flex-col gap-3">
                <div className="font-medium uppercase text-sm">
                  About us
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  News
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  Careers
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  Investors
                </div>
                <div className="text-sm text-white/[0.5] hover:text-white cursor-pointer">
                  Sustainability
                </div>
              </div>
            </div>
          </div>
          
          {/* Social icons */}
          <div className="flex gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-white/[0.25] flex items-center justify-center text-black hover:bg-white/[0.5] cursor-pointer">
              <FaFacebookF size={20} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/[0.25] flex items-center justify-center text-black hover:bg-white/[0.5] cursor-pointer">
              <FaTwitter size={20} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/[0.25] flex items-center justify-center text-black hover:bg-white/[0.5] cursor-pointer">
              <FaYoutube size={20} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/[0.25] flex items-center justify-center text-black hover:bg-white/[0.5] cursor-pointer">
              <FaInstagram size={20} />
            </div>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="flex justify-between mt-10 flex-col md:flex-row gap-[10px] md:gap-0">
          <div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer text-center md:text-left">
            © 2025 Store, Inc. All Rights Reserved
          </div>
          
          <div className="flex gap-2 md:gap-5 text-center md:text-left flex-wrap justify-center">
            <div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer">
              Guides
            </div>
            <div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer">
              Terms of Sale
            </div>
            <div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer">
              Terms of Use
            </div>
            <div className="text-[12px] text-white/[0.5] hover:text-white cursor-pointer">
              Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer