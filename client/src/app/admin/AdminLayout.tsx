// components/admin/AdminLayout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const ADMIN_MENU_ITEMS = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: <FaTachometerAlt />
  },
  {
    name: 'Products',
    href: '/admin/products',
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed md:static z-40 top-0 left-0 h-full w-64 bg-white shadow-lg transform 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        
        <nav className="p-4">
          {ADMIN_MENU_ITEMS.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`
                flex items-center p-3 mb-2 rounded 
                ${pathname === item.href 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main 
        className={`
          flex-1 overflow-y-auto p-4 
          ${isSidebarOpen ? 'md:ml-0' : 'md:ml-64'}
          transition-margin duration-300 ease-in-out
        `}
        onClick={() => setIsSidebarOpen(false)}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;