'use client'

import Link from 'next/link'
import { BsChevronDown } from 'react-icons/bs'

// Updated Category interface to match MongoDB data structure
interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MenuProps {
  showCatMenu: boolean;
  setShowCatMenu: (show: boolean) => void;
  categories: Category[];
}

const Menu: React.FC<MenuProps> = ({ showCatMenu, setShowCatMenu, categories }) => {
  console.log("🚀 ~ categories:", categories)
  const navigationItems = [
    { id: 1, name: "Home", url: "/" },
    { id: 2, name: "About", url: "/about" },
    { id: 3, name: "Categories", subMenu: true },
    { id: 4, name: "Contact", url: "/contact" },
  ];
  
  return (
    <ul className="hidden md:flex items-center gap-8 font-medium text-black">
      {navigationItems.map((item) => (
        <li key={item.id}>
          {!!item?.subMenu ? (
            <div
              className="cursor-pointer flex items-center gap-2 relative"
              onMouseEnter={() => setShowCatMenu(true)}
              onMouseLeave={() => setShowCatMenu(false)}
            >
              {item.name}
              <BsChevronDown size={14} />
              
              {showCatMenu && (
                <ul className="bg-white absolute top-6 left-0 min-w-[250px] px-1 py-1 text-black shadow-lg z-10">
                  {categories?.filter(cat => cat.isActive).map((category) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      onClick={() => setShowCatMenu(false)}
                    >
                      <li className="h-12 flex justify-between items-center px-3 hover:bg-black/[0.03] rounded-md">
                        {category.name}
                        {/* If you don't have product count, you can remove this span or add it later */}
                        {/* <span className="opacity-50 text-sm">
                          {`(${category.productCount || 0})`}
                        </span> */}
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <Link href={item?.url || "#"}>
              {item.name}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Menu;