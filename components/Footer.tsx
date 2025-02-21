import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/hakkimizda" 
                  className="text-gray-600 hover:text-[#E84E36]"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link 
                  href="/iletisim" 
                  className="text-gray-600 hover:text-[#E84E36]"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/gizlilik-politikasi" 
                  className="text-gray-600 hover:text-[#E84E36]"
                >
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link 
                  href="/kullanim-kosullari" 
                  className="text-gray-600 hover:text-[#E84E36]"
                >
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link 
                  href="/kvkk-aydinlatma-metni" 
                  className="text-gray-600 hover:text-[#E84E36]"
                >
                  KVKK Aydınlatma Metni
                </Link>
              </li>
              <li>
                <Link 
                  href="/cerez-politikasi" 
                  className="text-gray-600 hover:text-[#E84E36]"
                >
                  Çerez Politikası
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:info@mahalleci.com" 
                  className="text-gray-600 hover:text-[#E84E36]"
                >
                  info@mahalleci.com
                </a>
              </li>
              <li className="text-gray-600">İstanbul, Türkiye</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Sosyal Medya</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#E84E36]">Twitter</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#E84E36]">Instagram</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#E84E36]">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Mahalleci. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 