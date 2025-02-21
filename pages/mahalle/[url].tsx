import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import path from 'path';
import fs from 'fs';
import locationData from '@/public/data/normalized-data.json';
import { normalizeString } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { StarRating } from "@/components/ui/star-rating";

// Mahalle tipi güncellemesi
interface Mahalle {
  id: string;
  url: string;
  il: string;
  ilce: string;
  mahalle: string;
  toplam_puan: number;
  degerlendirme_sayisi: number;
  kategori_puanlari?: {
    guvenlik: number;
    ulasim: number;
    sessizlik: number;
    temizlik: number;
    sosyal_hayat: number;
    yesil_alan: number;
  };
}

interface MahalleYorum {
  id: string;
  user_id: string;
  yorum: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
  puanlar?: {
    guvenlik: number;
    ulasim: number;
    sessizlik: number;
    temizlik: number;
    sosyal_hayat: number;
    yesil_alan: number;
  }[];
}

const MahallePage: React.FC<{ mahalleData: Mahalle }> = ({ mahalleData }) => {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  if (router.isFallback) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>{`${mahalleData.mahalle} Mahallesi, ${mahalleData.ilce}/${mahalleData.il}`}</title>
        <meta name="description" content={`${mahalleData.mahalle} mahallesi hakkında yorumlar, puanlar ve detaylı bilgiler`} />
      </Head>

      {/* Hero Section with Gradient Background */}
      <div className="relative py-16 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#dd6b20] to-[#e53e3e] opacity-90"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {mahalleData.mahalle} Mahallesi
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {mahalleData.ilce}/{mahalleData.il}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Genel Bilgiler Kartı */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Mahalle Puanları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(mahalleData.kategori_puanlari || {}).map(([kategori, puan]) => (
                  <div key={kategori} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{puan}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {kategori.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="yorumlar" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="yorumlar">Yorumlar</TabsTrigger>
            <TabsTrigger value="istatistikler">İstatistikler</TabsTrigger>
          </TabsList>

          <TabsContent value="yorumlar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mahalle Yorumları</CardTitle>
              </CardHeader>
              <CardContent>
                <YorumForm mahalleId={mahalleData.id} onSuccess={() => setRefreshKey(prev => prev + 1)} />
                <YorumListesi mahalleId={mahalleData.id} refreshKey={refreshKey} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="istatistikler" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mahalle İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent>
                {/* İstatistikler buraya gelecek */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MahallePage;

export const getStaticPaths: GetStaticPaths = async () => {
  // Her il-ilçe-mahalle kombinasyonu için path oluştur
  const paths = locationData.flatMap(location => 
    location.mahalle.map((mahalle, index) => ({
      params: {
        url: normalizeString(`${location.il}-${location.ilce}-${mahalle}`)
      }
    }))
  );

  return {
    paths,
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.url) {
    return { notFound: true };
  }

  try {
    // URL'den il, ilçe ve mahalle bilgilerini ayır
    const urlParts = (params.url as string).split('-');
    if (urlParts.length !== 3) {
      return { notFound: true };
    }

    const [urlIl, urlIlce, urlMahalle] = urlParts;

    // URL'deki bilgilere göre mahalleyi bul
    const locationInfo = locationData.find(location => 
      location.il === urlIl && 
      location.ilce === urlIlce && 
      location.mahalle.includes(urlMahalle)
    );

    if (!locationInfo) {
      return { notFound: true };
    }

    // Mahallenin normal (görüntülenecek) adını bul
    const mahalleIndex = locationInfo.mahalle.indexOf(urlMahalle);
    const normalMahalle = locationInfo.normalMahalle[mahalleIndex];

    // Supabase'den sadece puanlamaları al
    const { data: puanlar } = await supabase
      .from('mahalle_puanlamalari')
      .select('guvenlik, ulasim, sessizlik, temizlik, sosyal_hayat, yesil_alan')
      .eq('il', urlIl)
      .eq('ilce', urlIlce)
      .eq('mahalle', urlMahalle);

    // Varsayılan mahalle verisi
    const mahalleData: Mahalle = {
      id: `${urlIl}-${urlIlce}-${urlMahalle}`,
      url: params.url as string,
      il: locationInfo.normalIl, // Görüntülenecek il adı
      ilce: locationInfo.normalIlce, // Görüntülenecek ilçe adı
      mahalle: normalMahalle, // Görüntülenecek mahalle adı
      toplam_puan: 0,
      degerlendirme_sayisi: 0,
      kategori_puanlari: {
        guvenlik: 0,
        ulasim: 0,
        sessizlik: 0,
        temizlik: 0,
        sosyal_hayat: 0,
        yesil_alan: 0
      }
    };

    // Puanlamalar varsa ortalamaları hesapla
    if (puanlar && puanlar.length > 0) {
      mahalleData.degerlendirme_sayisi = puanlar.length;
      mahalleData.kategori_puanlari = {
        guvenlik: Number((puanlar.reduce((acc, cur) => acc + cur.guvenlik, 0) / puanlar.length).toFixed(1)),
        ulasim: Number((puanlar.reduce((acc, cur) => acc + cur.ulasim, 0) / puanlar.length).toFixed(1)),
        sessizlik: Number((puanlar.reduce((acc, cur) => acc + cur.sessizlik, 0) / puanlar.length).toFixed(1)),
        temizlik: Number((puanlar.reduce((acc, cur) => acc + cur.temizlik, 0) / puanlar.length).toFixed(1)),
        sosyal_hayat: Number((puanlar.reduce((acc, cur) => acc + cur.sosyal_hayat, 0) / puanlar.length).toFixed(1)),
        yesil_alan: Number((puanlar.reduce((acc, cur) => acc + cur.yesil_alan, 0) / puanlar.length).toFixed(1))
      };
      mahalleData.toplam_puan = Number((Object.values(mahalleData.kategori_puanlari).reduce((a, b) => a + b, 0) / 6).toFixed(1));
    }

    return {
      props: { mahalleData },
      revalidate: 3600
    };
  } catch (error) {
    console.error('Sayfa oluşturulurken hata:', error);
    return { notFound: true };
  }
};

const YorumForm: React.FC<{ mahalleId: string; onSuccess?: () => void }> = ({ mahalleId, onSuccess }) => {
  const { user } = useAuth();
  const [yorum, setYorum] = useState('');
  const [puanlar, setPuanlar] = useState({
    guvenlik: 0,
    ulasim: 0,
    sessizlik: 0,
    temizlik: 0,
    sosyal_hayat: 0,
    yesil_alan: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Yorum yapmak için giriş yapmalısınız");
      return;
    }

    if (!yorum.trim()) {
      toast.error("Lütfen bir yorum yazınız");
      return;
    }

    const eksikKategoriler = Object.entries(puanlar)
      .filter(([_, puan]) => puan === 0)
      .map(([kategori]) => kategori.replace(/_/g, ' '));

    if (eksikKategoriler.length > 0) {
      toast.error(`Lütfen şu kategorileri puanlayınız: ${eksikKategoriler.join(', ')}`);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('add_mahalle_yorum', {
        p_mahalle_id: mahalleId,
        p_user_id: user.id,
        p_yorum: yorum.trim(),
        p_guvenlik: puanlar.guvenlik,
        p_ulasim: puanlar.ulasim,
        p_sessizlik: puanlar.sessizlik,
        p_temizlik: puanlar.temizlik,
        p_sosyal_hayat: puanlar.sosyal_hayat,
        p_yesil_alan: puanlar.yesil_alan
      });

      if (error) {
        console.error('RPC Hata Detayı:', error);
        toast.error(error.message || "Değerlendirme kaydedilirken bir hata oluştu");
        return;
      }

      if (data) {
        console.log('RPC Yanıtı:', data);
      }

      toast.success("Değerlendirmeniz başarıyla kaydedildi");
      setYorum('');
      setPuanlar({
        guvenlik: 0,
        ulasim: 0,
        sessizlik: 0,
        temizlik: 0,
        sosyal_hayat: 0,
        yesil_alan: 0
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Değerlendirme kaydedilirken beklenmeyen hata:', error);
      toast.error(error.message || "Değerlendirme kaydedilirken bir hata oluştu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(puanlar).map(([kategori, puan]) => (
          <div key={kategori} className="space-y-2">
            <label className="block text-sm font-medium capitalize">
              {kategori.replace(/_/g, ' ')}
            </label>
            <StarRating
              rating={puan}
              onRatingChange={(newRating) => 
                setPuanlar(prev => ({ ...prev, [kategori]: newRating }))
              }
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Yorumunuz
        </label>
        <Textarea
          value={yorum}
          onChange={(e) => setYorum(e.target.value)}
          placeholder="Mahalle hakkında düşüncelerinizi paylaşın..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" className="w-full md:w-auto">
        Değerlendir
      </Button>
    </form>
  );
};

const YorumListesi: React.FC<{ mahalleId: string; refreshKey?: number }> = ({ mahalleId, refreshKey }) => {
  const [yorumlar, setYorumlar] = useState<MahalleYorum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getYorumlar = async () => {
      try {
        // Güncellenmiş sorgu ile ilişkisel verileri doğru şekilde al
        const { data: yorumData, error } = await supabase
          .from('mahalle_yorumlari')
          .select(`
            ...,
            profiles:user_id (id, full_name, avatar_url),
            mahalle_puanlamalari!fk_mahalle_puanlamalari_yorum_id (
              guvenlik, ulasim, sessizlik, temizlik, sosyal_hayat, yesil_alan
            )
          `)
          .eq('mahalle_id', mahalleId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Verileri formatla
        const birlesikData = yorumData.map(yorum => ({
          ...yorum,
          profiles: yorum.profiles,
          puanlar: yorum.mahalle_puanlamalari?.[0] // Optional chaining ekledik
        }));

        setYorumlar(birlesikData);
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        toast.error("Yorumlar yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    getYorumlar();
  }, [mahalleId, refreshKey]);

  // Profil fotoğrafı URL'sini düzgün şekilde oluşturan yardımcı fonksiyon
  const getAvatarUrl = (avatarPath: string | undefined | null) => {
    if (!avatarPath) {
      return "https://public.readdy.ai/ai/img_res/7c32885960e29eb8a74b94283c165361.jpg";
    }
    
    // Eğer tam URL ise direkt kullan
    if (avatarPath.startsWith('http')) {
      return avatarPath;
    }
    
    // Supabase storage URL'sini oluştur
    return avatarPath;
  };

  if (loading) {
    return <div>Yorumlar yükleniyor...</div>;
  }

  if (yorumlar.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Henüz yorum yapılmamış</div>;
  }

  return (
    <div className="space-y-6">
      {yorumlar.map((yorum) => (
        <div key={yorum.id} className="border-b pb-6 last:border-0">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10 overflow-hidden">
              <AvatarImage 
                src={getAvatarUrl(yorum.profiles?.avatar_url)} 
                alt={yorum.profiles?.full_name || 'Kullanıcı'} 
                className="object-cover"
                style={{ width: '100%', height: '100%' }}
              />
              <AvatarFallback>
                {yorum.profiles?.full_name?.charAt(0)?.toUpperCase() || 'K'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{yorum.profiles?.full_name}</h4>
                <time className="text-sm text-muted-foreground">
                  {new Date(yorum.created_at).toLocaleDateString('tr-TR')}
                </time>
              </div>
              <p className="mt-2 text-muted-foreground">{yorum.yorum}</p>
              {yorum.puanlar && Object.keys(yorum.puanlar).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(yorum.puanlar).map(([kategori, puan]) => (
                    <div key={kategori} className="flex items-center text-sm">
                      <span className="capitalize mr-1">{kategori.replace(/_/g, ' ')}:</span>
                      <StarRating 
                        rating={puan as number} 
                        onRatingChange={() => {}} 
                        className="pointer-events-none" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 