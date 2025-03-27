'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { BiMenuAltRight } from 'react-icons/bi'
import { BsCart } from 'react-icons/bs'
import { IoMdHeartEmpty } from 'react-icons/io'
import { VscChromeClose } from 'react-icons/vsc'


import Menu from './Menu'
import MobileMenu from './MobileMenu'
import { CategoryService } from '@/app/lib/api'


const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showCatMenu, setShowCatMenu] = useState(false)
  const [show, setShow] = useState('translate-y-0')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  
  const { cartItems } = useSelector((state: RootState) => state.cart)
  
  // Navbar control based on scroll
  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > 200) {
        if (window.scrollY > lastScrollY && !mobileMenu) {
          setShow('-translate-y-[80px]')
        } else {
          setShow('shadow-sm')
        }
      } else {
        setShow('translate-y-0')
      }
      setLastScrollY(window.scrollY)
    }
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar)
      return () => {
        window.removeEventListener('scroll', controlNavbar)
      }
    }
  }, [lastScrollY])
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await CategoryService.getAllCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    fetchCategories()
  }, [])
  
  return (
    <header
      className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show}`}
    >
      <div className="container mx-auto px-4 h-[60px] flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.svg" 
            alt="Store Logo" 
            width={60} 
            height={60}
            className="w-[40px] md:w-[60px]"
          />
        </Link>
        
        <Menu 
          showCatMenu={showCatMenu} 
          setShowCatMenu={setShowCatMenu} 
          categories={categories.categories} 
        />
        
        {mobileMenu && (
          <MobileMenu
            showCatMenu={showCatMenu}
            setShowCatMenu={setShowCatMenu}
            setMobileMenu={setMobileMenu}
            categories={categories}
          />
        )}
        
        <div className="flex items-center gap-2 text-black">
          {/* Wishlist Icon */}
          <Link href="/login">
            <button className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700">
              Login
            </button>
          </Link>
          
          {/* Cart Icon */}
          <Link href="/cart">
            <div className="w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
              <BsCart className="text-[15px] md:text-[20px]" />
              {cartItems.length > 0 && (
                <div className="h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px] rounded-full bg-red-600 absolute top-1 left-5 md:left-7 text-white text-[10px] md:text-[12px] flex justify-center items-center px-[2px] md:px-[5px]">
                  {cartItems.length}
                </div>
              )}
            </div>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <div className="w-8 md:w-12 h-8 md:h-12 md:hidden rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer relative">
            {mobileMenu ? (
              <VscChromeClose 
                className="text-[16px]"
                onClick={() => setMobileMenu(false)}
              />
            ) : (
              <BiMenuAltRight 
                className="text-[20px]"
                onClick={() => setMobileMenu(true)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header