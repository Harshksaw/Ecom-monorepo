'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { BsCart } from 'react-icons/bs'
import { FaUser, FaSignOutAlt, FaUserCog, FaShoppingBag, FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa'
import { useAuth } from '../../context/authcontext'
import CategoryTabs from './CategoryTabs'
import Link from 'next/link'
import { selectCartItemsCount } from '@/app/store/slices/cartSlice'
import CurrencySelector from '../CurrencySelector'
import SearchBar from '../SearchBar'

const Header = ({ categories }: any) => {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const cartItems = useSelector(selectCartItemsCount);
  const { user, logout } = useAuth()

  const userMenuRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const sideMenuRef = useRef<HTMLDivElement>(null)

  const isAdmin = user?.role === 'Admin'

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
      if (mobileMenu && sideMenuRef.current && !sideMenuRef.current.contains(e.target as Node) && 
          !(e.target as Element).closest('.mobile-menu-button')) {
        setMobileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenu])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileMenu(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => { 
    logout(); 
    setShowUserMenu(false) 
  }
  
  const toggleMobileMenu = () => setMobileMenu(!mobileMenu)

  return (
    <>
      {/* Fixed header */}
      <header 
        ref={headerRef} 
        className="fixed top-0 left-0 w-full bg-gray-200 border-b-2 border-gray-300 z-40"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Left side: Menu button */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-button p-2 text-black hover:text-gray-700"
                aria-label={mobileMenu ? 'Close menu' : 'Open menu'}
              >
                <FaBars className="h-6 w-6" />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center absolute left-1/2 transform -translate-x-1/2 ">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  width={160} 
                  height={80} 
                  className="h-16 md:h-20 w-auto" 
                  priority
                />
              </Link>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search component */}
              <SearchBar />
              
              {/* Desktop only: Currency selector */}
              <div className="hidden md:block">
                <CurrencySelector />
              </div>
              
              {/* Desktop only: User menu */}
              <div className="hidden md:block">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-300 transition-colors text-black"
                    >
                      <FaUser />
                      <span className="text-sm font-medium">{user.firstName || 'Account'}</span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 flex flex-col z-50">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-300">
                          <p className="font-medium">Signed in as</p>
                          <p className="truncate">{user.email}</p>
                        </div>
                        <Link href="/profile" className="px-4 py-2 text-sm text-black hover:bg-gray-100 flex items-center">
                          <FaUser className="mr-2" /> Profile
                        </Link>
                        <Link href="/orders" className="px-4 py-2 text-sm text-black hover:bg-gray-100 flex items-center">
                          <FaShoppingBag className="mr-2" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link href="/admin/dashboard" className="px-4 py-2 text-sm text-black hover:bg-gray-100 flex items-center">
                            <FaUserCog className="mr-2" /> Admin Dashboard
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center">
                          <FaSignOutAlt className="mr-2" /> Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <button className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors">
                      Login
                    </button>
                  </Link>
                )}
              </div>

              {/* Mobile only: User icon */}
              <div className="md:hidden">
                {user ? (
                  <button
                    onClick={() => setMobileMenu(true)}
                    className="p-2 text-black hover:text-gray-700"
                  >
                    <FaUser className="h-5 w-5" />
                  </button>
                ) : (
                  <Link href="/auth/login">
                    <button className="p-2 text-black hover:text-gray-700">
                      <FaUser className="h-5 w-5" />
                    </button>
                  </Link>
                )}
              </div>

              {/* Cart icon */}
              <Link href="/cart" className="relative">
                <BsCart className="text-2xl text-black" />
                {cartItems > 0 && (
                  <div className="absolute -top-2 -right-2 h-5 min-w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center px-1">
                    {cartItems}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to push content below the fixed header */}
      <div className="h-20"></div>

      {/* Category tabs */}
      <div className="w-full z-30 bg-white">
        <CategoryTabs activeCategory={undefined} categories={categories} />
      </div>

      {/* Mobile side menu */}
      <div
        ref={sideMenuRef}
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-gray-200 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          mobileMenu ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto text-gray-900`}
      >
        {/* Menu header */}
        <div className="p-4 border-b border-gray-300 flex justify-between items-center">
          <h3 className="text-lg font-medium text-black">Menu</h3>
          <button
            onClick={() => setMobileMenu(false)}
            className="p-2 rounded-md text-black hover:bg-gray-300"
            aria-label="Close menu"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Currency selector */}
        <div className="px-4 py-3 border-b border-gray-300">
          <CurrencySelector />
        </div>

        {/* Main navigation */}
        <nav className="px-4 py-2 space-y-1">
          <Link 
            href="/" 
            className="block px-4 py-3 text-gray-900 hover:bg-gray-300 rounded-md" 
            onClick={() => setMobileMenu(false)}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className="block px-4 py-3 text-gray-900 hover:bg-gray-300 rounded-md" 
            onClick={() => setMobileMenu(false)}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="block px-4 py-3 text-gray-900 hover:bg-gray-300 rounded-md" 
            onClick={() => setMobileMenu(false)}
          >
            Contact Us
          </Link>
        </nav>

        {/* Categories section */}
     <div className="border-t border-gray-300 px-4 py-3">
  <h3 className="font-medium mb-2 text-black">Categories</h3>
  <ul className="space-y-1">
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
          <Link 
            href={`/category/${category.slug}`} 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md" 
            onClick={() => setMobileMenu(false)}
          >
            {category.name}
          </Link>
        </li>
      ))}
  </ul>
</div>

        {/* Policies section */}
        <div className="border-t border-gray-300 px-4 py-3">
          <h3 className="font-medium mb-2 text-black flex items-center">
            <FaShieldAlt className="mr-2" /> Our Policies
          </h3>
          <ul className="space-y-1">
            <Link 
              href="/privacy-policy" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md" 
              onClick={() => setMobileMenu(false)}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/return-policy" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md" 
              onClick={() => setMobileMenu(false)}
            >
              Return Policy
            </Link>
            <Link 
              href="/shipping-policy" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md" 
              onClick={() => setMobileMenu(false)}
            >
              Shipping Policy
            </Link>
            <Link 
              href="/terms-conditions" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md" 
              onClick={() => setMobileMenu(false)}
            >
              Terms & Conditions
            </Link>
          </ul>
        </div>

        {/* Account section (for logged-in users) */}
        {user && (
          <div className="border-t border-gray-300 px-4 py-3">
            <h3 className="font-medium mb-2 text-black">Account</h3>
            <ul className="space-y-1">
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md flex items-center" 
                onClick={() => setMobileMenu(false)}
              >
                <FaUser className="mr-2" /> Profile
              </Link>
              <Link 
                href="/orders" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md flex items-center" 
                onClick={() => setMobileMenu(false)}
              >
                <FaShoppingBag className="mr-2" /> My Orders
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin/dashboard" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md flex items-center" 
                  onClick={() => setMobileMenu(false)}
                >
                  <FaUserCog className="mr-2" /> Admin Dashboard
                </Link>
              )}
              <button 
                onClick={() => { handleLogout(); setMobileMenu(false); }} 
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-300 rounded-md flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Sign out
              </button>
            </ul>
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {mobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40" 
          onClick={() => setMobileMenu(false)} 
        />
      )}
    </>
  )
}

export default Header;