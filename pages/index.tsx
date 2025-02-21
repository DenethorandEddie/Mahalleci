// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// start
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import Link from "next/link";
import Head from "next/head";
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';
import { normalizeString } from '@/lib/utils';

interface LocationData {
  il: string;
  normalIl: string;
  ilce: string;
  normalIlce: string;
  mahalle: string[];
  normalMahalle: string[];
}

const App: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [cities, setCities] = useState<{normal: string, url: string}[]>([]);
  const [districts, setDistricts] = useState<{normal: string, url: string}[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<{normal: string, url: string}[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const router = useRouter();

  // showLogin parametresini kontrol et
  useEffect(() => {
    if (router.query.showLogin === 'true') {
      setIsLoginModalOpen(true);
      // URL'den parametreyi temizle
      router.replace('/', undefined, { shallow: true });
    }
  }, [router.query.showLogin]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Doğrudan data klasöründen okuma
    fetch('/data/normalized-data.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Veri yüklenemedi');
        }
        return res.json();
      })
      .then((data: LocationData[]) => {
        console.log('Yüklenen veri:', data); // Debug için
        setLocationData(data);
        // Benzersiz şehirleri al ve sırala
        const uniqueCities = Array.from(new Set(data.map(item => item.normalIl)))
          .sort()
          .map(city => ({
            normal: city,
            url: data.find(item => item.normalIl === city)?.il || ''
          }));
        setCities(uniqueCities);
      })
      .catch(error => {
        console.error('Veri yüklenirken hata oluştu:', error);
        setCities([]);
      });
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const cityData = locationData.filter(item => item.normalIl === selectedCity);
      const uniqueDistricts = Array.from(new Set(cityData.map(item => item.normalIlce)))
        .map(district => ({
          normal: district,
          url: cityData.find(item => item.normalIlce === district)?.ilce || ''
        }));
      setDistricts(uniqueDistricts);
      setSelectedDistrict('');
      setSelectedNeighborhood('');
    }
  }, [selectedCity, locationData]);

  useEffect(() => {
    if (selectedDistrict) {
      const districtData = locationData.find(
        item => item.normalIl === selectedCity && item.normalIlce === selectedDistrict
      );
      if (districtData) {
        const neighborhoodList = districtData.normalMahalle.map((normal, index) => ({
          normal,
          url: districtData.mahalle[index]
        }));
        setNeighborhoods(neighborhoodList);
      }
      setSelectedNeighborhood('');
    }
  }, [selectedDistrict, selectedCity, locationData]);

  const handleNeighborhoodSelect = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    if (selectedCity && selectedDistrict && neighborhood) {
      // URL'leri normalize et
      const cityUrl = normalizeString(selectedCity);
      const districtUrl = normalizeString(selectedDistrict);
      const neighborhoodUrl = normalizeString(neighborhood);
      
      // Mahalle sayfasına yönlendir
      router.push(`/mahalle/${cityUrl}-${districtUrl}-${neighborhoodUrl}`);
    }
  };

  const filteredCities = cities.filter(city =>
    city.normal.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredDistricts = districts.filter(district =>
    district.normal.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const filteredNeighborhoods = neighborhoods.filter(neighborhood =>
    neighborhood.normal.toLowerCase().includes(neighborhoodSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head>
        <title>Mahalleci - Mahallenizi Keşfedin</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img src="/logo_nobg.png" alt="Mahalleci Logo" className="h-6 cursor-pointer" />
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

          <div className="flex items-center gap-4">
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
      {/* Hero Section */}
      <div className="min-h-[850px] flex items-center px-6 mt-[0px] py-20 relative bg-gradient-to-r from-orange-500 to-red-500 before:absolute before:inset-0 before:bg-black/10 dark:before:bg-black/20">
        <div className="max-w-[1440px] mx-auto w-full flex justify-between items-center relative z-10">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl font-bold mb-6">Mahallenizi Keşfedin</h1>
            <p className="text-white text-xl mb-8">Türkiye'nin en kapsamlı mahalle platformunda yeni deneyimleri keşfedin, paylaşın ve topluluğa katılın.</p>
            <div className="flex gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold">81</div>
                <div className="text-sm opacity-80">İl</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">922</div>
                <div className="text-sm opacity-80">İlçe</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">32K+</div>
                <div className="text-sm opacity-80">Mahalle</div>
              </div>
            </div>
            <div className="space-y-4 max-w-md bg-white/10 dark:bg-[#1a202c]/10 p-6 rounded-xl backdrop-blur-lg">
              <h3 className="text-white text-xl font-semibold mb-6">Mahalle Bul</h3>
              <div className="space-y-4 w-[400px]">
                <div className="relative">
                  <i className="fas fa-city absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full bg-background/90 dark:bg-[#1a202c]/90 text-foreground !rounded-button pl-10 h-12 hover:bg-background/80 dark:hover:bg-[#1a202c]/80 transition-colors">
                        <span className="flex items-center justify-between w-full">
                          {selectedCity || 'İl seçiniz'}
                          <i className="fas fa-chevron-down text-sm text-gray-400"></i>
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[400px] mt-1 max-h-[300px] overflow-y-auto">
                      <div className="p-2 sticky top-0 bg-background z-10">
                        <Input 
                          className="mb-2" 
                          placeholder="İl Ara..." 
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                        />
                      </div>
                      {filteredCities.map(city => (
                        <DropdownMenuItem 
                          key={city.url} 
                          className="hover:bg-orange-50" 
                          onClick={() => setSelectedCity(city.normal)}
                        >
                          {city.normal}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {selectedCity && (
                  <div className="relative">
                    <i className="fas fa-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full bg-background/90 dark:bg-[#1a202c]/90 text-foreground !rounded-button pl-10 h-12 hover:bg-background/80 dark:hover:bg-[#1a202c]/80 transition-colors">
                          <span className="flex items-center justify-between w-full">
                            {selectedDistrict || 'İlçe seçiniz'}
                            <i className="fas fa-chevron-down text-sm text-gray-400"></i>
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[400px] mt-1 max-h-[300px] overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-background z-10">
                          <Input 
                            className="mb-2" 
                            placeholder="İlçe Ara..." 
                            value={districtSearch}
                            onChange={(e) => setDistrictSearch(e.target.value)}
                          />
                        </div>
                        {filteredDistricts.map(district => (
                          <DropdownMenuItem 
                            key={district.url} 
                            className="hover:bg-orange-50" 
                            onClick={() => setSelectedDistrict(district.normal)}
                          >
                            {district.normal}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                {selectedDistrict && (
                  <div className="relative">
                    <i className="fas fa-home absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full bg-background/90 dark:bg-[#1a202c]/90 text-foreground !rounded-button pl-10 h-12 hover:bg-background/80 dark:hover:bg-[#1a202c]/80 transition-colors">
                          <span className="flex items-center justify-between w-full">
                            {selectedNeighborhood || 'Mahalle seçiniz'}
                            <i className="fas fa-chevron-down text-sm text-gray-400"></i>
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[400px] mt-1 max-h-[300px] overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-background z-10">
                          <Input 
                            className="mb-2" 
                            placeholder="Mahalle Ara..." 
                            value={neighborhoodSearch}
                            onChange={(e) => setNeighborhoodSearch(e.target.value)}
                          />
                        </div>
                        {filteredNeighborhoods.map(neighborhood => (
                          <DropdownMenuItem 
                            key={neighborhood.url} 
                            className="hover:bg-orange-50" 
                            onClick={() => handleNeighborhoodSelect(neighborhood.normal)}
                          >
                            {neighborhood.normal}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                {selectedNeighborhood && (
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 mt-4 !rounded-button">
                    <i className="fas fa-search mr-2"></i>
                    Mahalleyi Keşfet
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="relative w-[800px] h-[500px] ml-36 transform">
            <img
              src="/hero_pic.jpg"
              alt="Modern Neighborhood Visualization"
              className="w-full h-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-red-500 rounded-full opacity-20 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent py-1">Neler Sunuyoruz?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Mahallenizi daha iyi tanımanız ve komşularınızla etkileşime geçmeniz için ihtiyacınız olan tüm özellikler tek bir platformda.
          </p>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-card shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-building text-blue-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Mahalle Keşfi</h3>
              <p className="text-gray-600 dark:text-gray-300">Türkiye'nin tüm mahallelerini keşfedin ve detaylı bilgilere ulaşın</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-star text-yellow-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Değerlendirmeler</h3>
              <p className="text-gray-600 dark:text-gray-300">Mahalleler hakkında en güncel yorumlara göz atın ve kendi deneyimlerinizi ekleyin</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-users text-green-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Topluluk</h3>
              <p className="text-gray-600 dark:text-gray-300">Mahalle sakinleriyle etkileşime geçin ve deneyimlerinizi paylaşın</p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
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
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Mahalleci, Türkiye'nin en kapsamlı mahalle platformudur.<br />Mahallenizi keşfedin, deneyimlerinizi paylaşın ve topluluğa katılın.</p>
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
    </div>
  );
}

export default App;
// end
