'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BsChevronDown } from 'react-icons/bs'
import { Category } from '../../lib/api'

interface MobileMenuProps {
  showCatMenu: boolean
  setShowCatMenu: (show: boolean) => void
  setMobileMenu: (show: boolean) => void
  categories: Category[]
}

const MobileMenu = ({ 
  showCatMenu, 
  setShowCatMenu, 
  setMobileMenu,
  categories 
}: MobileMenuProps) => {
  const data = [
    { id: 1, name: "Home", url: "/" },
    { id: 2, name: "About", url: "/about" },
    { id: 3, name: "Categories", subMenu: true },
    { id: 4, name: "Contact", url: "/contact" },
  ]
  
  return (
    <ul className="md:hidden flex flex-col gap-4 font-medium text-gray-600 absolute top-[50px] left-0 w-full h-[calc(100vh-50px)] bg-white border-t">
      {data.map((item) => (
        <li key={item.id}>
          {!!item?.subMenu ? (
            <div className="cursor-pointer flex justify-center gap-2 relative border-b flex-col px-5 py-4">
              <div 
                className="flex justify-between items-center"
                onClick={() => setShowCatMenu(!showCatMenu)}
              >
                {item.name} 
                <BsChevronDown size={14} />
              </div>
              
              {showCatMenu && (
                <ul className="bg-black/[0.05] -mx-5 mt-4 -mb-4">
                  {categories?.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.attributes.slug}`}
                      onClick={() => {
                        setShowCatMenu(false)
                        setMobileMenu(false)
                      }}
                    >
                      <li className="h-12 flex justify-between items-center px-3 hover:bg-black/[0.03] rounded-md">
                        {category.attributes.name}
                        <span className="opacity-50 text-sm">
                          {`(${category.attributes.products.data.length})`}
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <Link 
              href={item?.url || "#"} 
              onClick={() => setMobileMenu(false)}
              className="block py-4 px-5 border-b"
            >
              {item.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export default MobileMenu