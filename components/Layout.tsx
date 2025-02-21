import React from 'react';
import Head from 'next/head';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useState } from 'react';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import NotificationDropdown from './notifications/NotificationDropdown';
import { Toaster } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Mahalleci - Mahallenizi Keşfedin</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <header className="border-b border-border bg-white dark:bg-[#0f1729]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <img 
                src="/logo_nobg.png" 
                alt="Mahalleci Logo" 
                className="h-6 cursor-pointer" 
              />
            </Link>
          </div>
          
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-base">
              <Button variant="ghost" className="!rounded-button text-base">Ana Sayfa</Button>
            </Link>
            <Link href="/hakkimizda" className="text-base">
              <Button variant="ghost" className="!rounded-button text-base">Hakkımızda</Button>
            </Link>
            <Link href="/iletisim" className="text-base">
              <Button variant="ghost" className="!rounded-button text-base">Bize Ulaşın</Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {user && <NotificationDropdown />}
            {!user ? (
              <>
                <Button 
                  variant="outline" 
                  className="!rounded-button whitespace-nowrap text-base"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Giriş Yap
                </Button>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 !rounded-button whitespace-nowrap text-base"
                  onClick={() => setIsRegisterModalOpen(true)}
                >
                  Üye Ol
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer w-10 h-10 overflow-hidden">
                    <AvatarImage 
                      src={user?.user_metadata?.avatar_url || "https://public.readdy.ai/ai/img_res/7c32885960e29eb8a74b94283c165361.jpg"} 
                      className="object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => router.push('/profile')}
                  >
                    <i className="fas fa-user mr-2"></i>
                    Profilim
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => router.push('/profile?tab=ayarlar')}
                  >
                    <i className="fas fa-cog mr-2"></i>
                    Ayarlar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 dark:text-red-400"
                    onClick={() => signOut()}
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="!rounded-button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && (
                theme === 'dark' ? (
                  <i className="fas fa-sun text-xl"></i>
                ) : (
                  <i className="fas fa-moon text-xl"></i>
                )
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="pt-0">
          {children}
        </div>
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <footer className="bg-background py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 pb-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-300 mb-4">Hakkımızda</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <Link href="/hakkimizda" className="hover:text-gray-900">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="hover:text-gray-900">
                    Bize Ulaşın
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-300 mb-4">Yasal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <Link href="/gizlilik-politikasi" className="hover:text-gray-900">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/kullanim-kosullari" className="hover:text-gray-900">
                    Kullanım Koşulları
                  </Link>
                </li>
                <li>
                  <Link href="/kvkk-aydinlatma-metni" className="hover:text-gray-900">
                    KVKK Aydınlatma Metni
                  </Link>
                </li>
                <li>
                  <Link href="/cerez-politikasi" className="hover:text-gray-900">
                    Çerez Politikası
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-300 mb-4">İletişim</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">E-posta: info@mahalleci.com</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Adres: İstanbul, Türkiye</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">www.mahalleci.com</p>
            </div>
          </div>
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-gray-600 dark:text-gray-300">© 2025 Mahalleci. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  );
} 