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


const Header = () => {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showCatMenu, setShowCatMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [show, setShow] = useState('translate-y-0')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showSearchBar, setShowSearchBar] = useState(false)
  
  const { cartItems } = useSelector((state:any) => state.cart)
  const { user, logout } = useAuth()
  
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isAdmin = user?.role === 'Admin'
  
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
  
  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }
  
  return (
    <header className={`w-full transition-transform duration-300 z-50 ${show}`}>
      {/* Top promotional bar */}
      <div className="bg-pink-100 py-1 text-center text-sm">
        New Arrivals: Gold & Silver Collections Now Available!
      </div>
      
      {/* Main header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          {/* Logo and search bar */}
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-pink-700">
                SHRI NANU GEMS & JEWELERS
              </h1>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              {/* Search bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for jewelry..."
                  className={`border border-gray-300 rounded-full pl-10 pr-4 py-2 transition-all duration-300 w-64 focus:border-pink-500 focus:outline-none`}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              {/* User Account */}
              {user ? (
                <div className="relative z-50" ref={userMenuRef}>
                  <button 
                    className="flex items-center gap-2 px-3 py-2 hover:bg-pink-50 rounded-full"
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
                        className=" px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 flex items-center"
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
                          className=" px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 flex items-center"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaUserCog className="mr-2 text-pink-700" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-pink-50 flex items-center"
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
                  <BsCart className="text-[20px] text-gray-700" />
                  {cartItems.length > 0 && (
                    <div className="h-[18px] min-w-[18px] rounded-full bg-pink-600 absolute -top-2 -right-2 text-white text-[12px] flex justify-center items-center px-[5px]">
                      {cartItems.length}
                    </div>
                  )}
                </div>
              </Link>
            </div>
            
            {/* Mobile icons */}
            <div className="flex items-center space-x-4 md:hidden">
              <Link href="/cart">
                <div className="relative">
                  <BsCart className="text-[20px] text-gray-700" />
                  {cartItems.length > 0 && (
                    <div className="h-[14px] min-w-[14px] rounded-full bg-pink-600 absolute -top-1 -right-1 text-white text-[10px] flex justify-center items-center px-[2px]">
                      {cartItems.length}
                    </div>
                  )}
                </div>
              </Link>
              
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
      
      {/* Category Tabs */}
      <CategoryTabs />
      
      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-md fixed top-[125px] left-0 right-0 h-[calc(100vh-125px)] z-20 overflow-y-auto">
          <div className="px-4 py-2 border-b">
            <input
              type="text"
              placeholder="Search for jewelry..."
              className="w-full border border-gray-300 rounded-full px-4 py-2"
            />
          </div>
          
          <ul className="divide-y">
            <li>
              <Link 
                href="/new-arrivals" 
                className="block px-4 py-3 text-gray-700"
                onClick={() => setMobileMenu(false)}
              >
                New Arrivals
              </Link>
            </li>
            
            {/* Mobile Menu Categories */}
            <li>
              <Link 
                href="/category/rings" 
                className="block px-4 py-3 text-gray-700"
                onClick={() => setMobileMenu(false)}
              >
                Rings
              </Link>
            </li>
            <li>
              <Link 
                href="/category/earrings" 
                className="block px-4 py-3 text-gray-700"
                onClick={() => setMobileMenu(false)}
              >
                Earrings
              </Link>
            </li>
            <li>
              <Link 
                href="/category/pendant" 
                className="block px-4 py-3 text-gray-700"
                onClick={() => setMobileMenu(false)}
              >
                Pendant
              </Link>
            </li>
            <li>
              <Link 
                href="/category/bracelet" 
                className="block px-4 py-3 text-gray-700"
                onClick={() => setMobileMenu(false)}
              >
                Bracelet
              </Link>
            </li>
            <li>
              <Link 
                href="/category/necklace" 
                className="block px-4 py-3 text-gray-700"
                onClick={() => setMobileMenu(false)}
              >
                Necklace
              </Link>
            </li>
            <li>
              <Link 
                href="/category/gifts" 
                className="block px-4 py-3 text-gray-700"
                onClick={() => setMobileMenu(false)}
              >
                Gifts
              </Link>
            </li>
            <li>
              <Link 
                href="/category/watches" 
                className="block px-4 py-3 text-gray-700"
                onClick={() => setMobileMenu(false)}
              >
                Watches
              </Link>
            </li>
            
            {!user && (
              <li>
                <Link 
                  href="/auth/login" 
                  className="block px-4 py-3 text-pink-700 font-medium"
                  onClick={() => setMobileMenu(false)}
                >
                  Login / Register
                </Link>
              </li>
            )}
          </ul>
          
          {user && (
            <div className="p-4 bg-pink-50">
              <div className="font-medium text-gray-700 mb-2">My Account</div>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/profile"
                    className="text-gray-600 flex items-center"
                    onClick={() => setMobileMenu(false)}
                  >
                    <FaUser className="mr-2 text-pink-700" size={14} />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/orders"
                    className="text-gray-600 flex items-center"
                    onClick={() => setMobileMenu(false)}
                  >
                    <FaShoppingBag className="mr-2 text-pink-700" size={14} />
                    My Orders
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenu(false);
                    }}
                    className="text-red-600 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" size={14} />
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default Header