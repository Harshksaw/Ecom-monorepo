// components/admin/AdminLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaBars,
  FaTimes,
  FaTag
} from 'react-icons/fa';

const ADMIN_MENU_ITEMS = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: <FaTachometerAlt />
  },
  {
    name: 'Category',
    href: '/admin/dashboard/category',
    icon: <FaTag />
  },
  {
    name: 'Products',
    href: '/admin/dashboard/products',
    icon: <FaBox />
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: <FaShoppingCart />
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: <FaUsers />
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: <FaCog />
  }
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile - closes sidebar when clicking outside */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 z-40 h-screen w-64 bg-white shadow-lg transform 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-200 ease-in-out
        `}
      >
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        
        <nav className="p-4 overflow-y-auto h-[calc(100vh-70px)]">
          {ADMIN_MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`
                  flex items-center p-3 mb-2 rounded-md transition-colors duration-150
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;