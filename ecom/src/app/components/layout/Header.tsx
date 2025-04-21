'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { BiMenuAltRight } from 'react-icons/bi'
import { BsCart } from 'react-icons/bs'
import { VscChromeClose } from 'react-icons/vsc'
import { FaUser, FaSignOutAlt, FaUserCog, FaShoppingBag, FaSearch } from 'react-icons/fa'
import { CategoryService } from '../../lib/api'
import { useAuth } from '../../context/authcontext'
import CategoryTabs from './CategoryTabs'
import Link from 'next/link'
import { selectCartItemsCount } from '@/app/store/slices/cartSlice'
import CurrencySelector from '../CurrencySelector'


const Header = ({categories}:any) => {
  const [mobileMenu, setMobileMenu] = useState(false)

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [show, setShow] = useState('translate-y-0')
  const [lastScrollY, setLastScrollY] = useState(0)

  const [isFixed, setIsFixed] = useState(false)
  
  const cartItems = useSelector(selectCartItemsCount);
  const { user, logout } = useAuth()
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const isAdmin = user?.role === 'Admin'
  
  // Handle scroll for header visibility
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 200) {
        if (window.scrollY > lastScrollY) {
          setShow('-translate-y-full')
        } else {
          setShow('translate-y-0')
        }
        setIsFixed(true)
      } else {
        setShow('translate-y-0')
        setIsFixed(false)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener('scroll', controlNavbar)
    return () => {
      window.removeEventListener('scroll', controlNavbar)
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
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenu(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }
  
  return (
    <>
      <header ref={headerRef} className={`w-full fixed top-0 left-0 transition-transform duration-300 z-50  ${show}`}>
        {/* Top promotional bar */}
        <div className="bg-white py-1 text-center text-sm">
          New Arrivals: Gold & Silver Collections Now Available!
        </div>
        
        {/* Main header */}
        <div className="bg-gray-100 shadow-sm">
          <div className="container mx-auto px-4">
            {/* Logo and search bar */}
            <div className="flex items-center justify-between py-0">
              <Link href="/" className="flex items-center">
               <Image 
                  src="/logo.png"
                  alt="Logo"
                  width={160}
                  height={80}
                  className="h-16 md:h-18 w-auto"
                />
              </Link>
              
              <div className="hidden md:flex items-center space-x-6">
                {/* Currency Selector */}
                <CurrencySelector />
                
                {/* User Account */}
                {user ? (
                  <div className="relative z-50" ref={userMenuRef}>
                    <button 
                      className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-full transition-colors"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <FaUser className="text-pink-700" />
                      <span className="text-sm font-medium">
                        {user.firstName || 'Account'}
                      </span>
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-auto flex flex-col">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                          <p className="font-medium">Signed in as</p>
                          <p className="truncate">{user.email}</p>
                        </div>
                        
                        <Link 
                          href="/profile" 
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 flex items-center"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaUser className="mr-2 text-pink-700" />
                          Profile
                        </Link>
                        
                        <Link 
                          href="/orders" 
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 flex items-center"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaShoppingBag className="mr-2 text-pink-700" />
                          My Orders
                        </Link>
                        
                        {user.role === 'Admin' && (
                          <Link 
                            href="/admin/dashboard" 
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 flex items-center"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FaUserCog className="mr-2 text-pink-700" />
                            Admin Dashboard
                          </Link>
                        )}
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-pink-50 flex items-center"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors">
                      Login
                    </button>
                  </Link>
                )}
                
                {/* Cart Icon */}
                <Link href="/cart">
                  <div className="relative">
                    <BsCart className="text-[24px] text-gray-700" />
                    {cartItems > 0 && (
                      <div className="h-[18px] min-w-[18px] rounded-full bg-pink-600 absolute -top-2 -right-2 text-white text-[12px] flex justify-center items-center px-[5px]">
                        {cartItems}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              
              {/* Mobile icons */}
              <div className="flex items-center space-x-4 md:hidden">
                {/* Currency selector (mobile) */}
                <CurrencySelector />
                
                {/* Cart (mobile) */}
                <Link href="/cart">
                  <div className="relative">
                    <BsCart className="text-[20px] text-gray-700" />
                    {cartItems > 0 && (
                      <div className="h-[14px] min-w-[14px] rounded-full bg-pink-600 absolute -top-1 -right-1 text-white text-[10px] flex justify-center items-center px-[2px]">
                        {cartItems}
                      </div>
                    )}
                  </div>
                </Link>
                
                {/* Menu toggle (mobile) */}
                {mobileMenu ? (
                  <VscChromeClose 
                    className="text-[20px]"
                    onClick={() => setMobileMenu(false)}
                  />
                ) : (
                  <BiMenuAltRight 
                    className="text-[24px]"
                    onClick={() => setMobileMenu(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Category Tabs - either fixed or not based on scroll position */}
      <div 
        className={`w-full z-40 transition-all duration-300 ${isFixed ? 'fixed top-0 left-0' : ''}`}
        style={{ 
          marginTop: isFixed ? '0' : (headerRef.current ? headerRef.current.offsetHeight : 0) + 'px' 
        }}
      >
        <CategoryTabs activeCategory={undefined} />
      </div>
      
      {/* Spacer for fixed header */}
      {/* <div className="h-24 md:h-32"></div>
       */}
      {/* Mobile menu */}
      {mobileMenu && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 pt-20 px-4 overflow-y-auto">
          <div className="absolute top-4 right-4">
            <VscChromeClose 
              className="text-[24px]"
              onClick={() => setMobileMenu(false)}
            />
          </div>
          
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="py-3 border-b border-gray-200 font-medium"
              onClick={() => setMobileMenu(false)}
            >
              Home
            </Link>

            {/* User account section */}
            {user ? (
              <>
                <div className="py-2 border-b border-gray-200">
                  <p className="font-medium text-gray-800">Account</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                
                <Link 
                  href="/profile" 
                  className="py-3 border-b border-gray-200 flex items-center"
                  onClick={() => setMobileMenu(false)}
                >
                  <FaUser className="mr-2 text-pink-700" />
                  Profile
                </Link>
                
                <Link 
                  href="/orders" 
                  className="py-3 border-b border-gray-200 flex items-center"
                  onClick={() => setMobileMenu(false)}
                >
                  <FaShoppingBag className="mr-2 text-pink-700" />
                  My Orders
                </Link>
                
                {user.role === 'Admin' && (
                  <Link 
                    href="/admin/dashboard" 
                    className="py-3 border-b border-gray-200 flex items-center"
                    onClick={() => setMobileMenu(false)}
                  >
                    <FaUserCog className="mr-2 text-pink-700" />
                    Admin Dashboard
                  </Link>
                )}
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenu(false);
                  }}
                  className="py-3 border-b border-gray-200 flex items-center text-red-600 w-full text-left"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                className="py-3 border-b border-gray-200"
                onClick={() => setMobileMenu(false)}
              >
                <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors">
                  Login
                </button>
              </Link>
            )}
            
            <Link 
              href="/cart" 
              className="py-3 border-b border-gray-200 flex items-center"
              onClick={() => setMobileMenu(false)}
            >
              <BsCart className="mr-2 text-pink-700" />
              Cart {cartItems > 0 && `(${cartItems})`}
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Header