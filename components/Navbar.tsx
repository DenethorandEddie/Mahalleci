import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-800">Logo</span>
          </Link>

          {/* Ana Menü */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/hakkimizda" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Hakkımızda
            </Link>
            <Link 
              href="/iletisim" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              İletişim
            </Link>
            <Link 
              href="/gizlilik-politikasi" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Gizlilik Politikası
            </Link>
            <Link 
              href="/cerez-politikasi" 
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Çerez Politikası
            </Link>
          </div>

          {/* Mobil Menü Butonu */}
          <div className="md:hidden">
            <button 
              type="button" 
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Menüyü aç/kapat"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/hakkimizda" 
              className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Hakkımızda
            </Link>
            <Link 
              href="/iletisim" 
              className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              İletişim
            </Link>
            <Link 
              href="/gizlilik-politikasi" 
              className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Gizlilik Politikası
            </Link>
            <Link 
              href="/cerez-politikasi" 
              className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 