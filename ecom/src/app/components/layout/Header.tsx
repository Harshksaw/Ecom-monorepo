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
  const [showCatMenu, setShowCatMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [show, setShow] = useState('translate-y-0')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  
  const cartItems = useSelector(selectCartItemsCount);
  const { user, logout } = useAuth()
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const isAdmin = user?.role === 'Admin'
  
 
  
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
  
  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }
  
  return (
    <>
      <header ref={headerRef} className={`w-full  transition-transform duration-300 z-50 ${show}`}>
        {/* Top promotional bar */}
        <div className="bg-pink-100 py-1 text-center text-sm">
          New Arrivals: Gold & Silver Collections Now Available!
        </div>
        
        {/* Main header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            {/* Logo and search bar */}
            <div className="flex items-center justify-between py-4">
              <Link href="/" className="flex items-center">
                <h1 className="text-xl md:text-2xl font-bold text-pink-700">
                  SHRI NANU GEMS & JEWELERS
                </h1>
              </Link>
              
              <div className="hidden md:flex items-center space-x-6">
                {/* Search bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for jewelry..."
                    className="border border-gray-300 rounded-full pl-10 pr-4 py-2 transition-all duration-300 w-64 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
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
        className={`w-full z-40 transition-all duration-300 h-40 `}
        style={{ 
          marginTop: isFixed ? (headerRef.current ? headerRef.current.offsetHeight : 0) + 'px' : '0'
        }}
      >
        <CategoryTabs activeCategory={undefined} />
      </div>
      
      {/* Spacer to prevent content jump when category tabs become fixed */}
      {isFixed && (
        <div className="h-20"></div> /* Adjust this height to match your CategoryTabs component height */
      )}
      
      {/* Mobile menu */}
   
    </>
  )
}

export default Header