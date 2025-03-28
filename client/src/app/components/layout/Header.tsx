'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { BiMenuAltRight } from 'react-icons/bi'
import { BsCart } from 'react-icons/bs'
import { VscChromeClose } from 'react-icons/vsc'
import { FaUser, FaSignOutAlt, FaUserCog, FaShoppingBag } from 'react-icons/fa'

import Menu from './Menu'
import MobileMenu from './MobileMenu'
import { CategoryService } from '@/app/lib/api'
import { useAuth } from '@/app/context/authcontext'


const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showCatMenu, setShowCatMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [show, setShow] = useState('translate-y-0')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [categories, setCategories] = useState<any[]>([])
  
  const { cartItems } = useSelector((state: RootState) => state.cart)
  const { user, logout } = useAuth()
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  
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
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
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
  
  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }
  
  return (
    <header
      className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between z-20 sticky top-0 transition-transform duration-300 ${show}`}
    >
      <div className="container mx-auto px-4 h-[60px] flex justify-between items-center">
        <Link href="/" className="flex items-center">
          {/* <Image 
            src="/logo.svg" 
            alt="Store Logo" 
            width={60} 
            height={60}
            className="w-[40px] md:w-[60px]"
          /> */}
        </Link>
        
        <Menu 
          showCatMenu={showCatMenu} 
          setShowCatMenu={setShowCatMenu} 
          categories={categories?.categories || []} 
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
          {/* User Account / Login Button */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUser className="text-[15px] md:text-[18px]" />
                <span className="hidden md:block text-sm font-medium">
                  {user.firstName || 'Account'}
                </span>
              </button>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    <p className="font-medium">Signed in as</p>
                    <p className="truncate">{user.email}</p>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  
                  <Link 
                    href="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FaShoppingBag className="mr-2" />
                    My Orders
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUserCog className="mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login">
              <button className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700">
                Login
              </button>
            </Link>
          )}
          
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