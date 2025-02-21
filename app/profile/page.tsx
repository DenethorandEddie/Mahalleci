'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function ProfilPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Önce AuthContext'in yüklenmesini bekle
        if (isLoading) return;

        // Kullanıcı yoksa ana sayfaya yönlendir
        if (!user) {
          console.log("Profile: Kullanıcı bulunamadı, ana sayfaya yönlendiriliyor");
          router.replace(`/?showLogin=true&redirect=/profile`);
          return;
        }

        console.log("Profile: Kullanıcı doğrulandı", user.email);
      } catch (error) {
        console.error("Profile auth kontrolü hatası:", error);
        router.replace(`/?showLogin=true&redirect=/profile`);
      }
    };

    checkAuth();
  }, [user, isLoading, router]);

  // Yükleme durumu
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Kullanıcı yoksa loading göster
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="yorumlarim" className="space-y-6">
          <TabsList>
            <TabsTrigger value="yorumlarim">Yorumlarım</TabsTrigger>
            <TabsTrigger value="bilgilerim">Bilgilerim</TabsTrigger>
            <TabsTrigger value="ayarlar">Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="yorumlarim">
            <Card>
              <CardHeader>
                <CardTitle>Yorumlarım</CardTitle>
              </CardHeader>
              <CardContent>
                <KullaniciYorumlari userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bilgilerim">
            <Card>
              <CardHeader>
                <CardTitle>Bilgilerim</CardTitle>
              </CardHeader>
              <CardContent>
                <KullaniciBilgileri userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ayarlar">
            <Card>
              <CardHeader>
                <CardTitle>Ayarlar</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfilAyarlari userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// Kullanıcı yorumları komponenti
const KullaniciYorumlari = ({ userId }: { userId: string }) => {
  const [yorumlar, setYorumlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getYorumlar = async () => {
      try {
        const { data, error } = await supabase
          .from('mahalle_yorumlari')
          .select(`
            *,
            mahalle_puanlamalari (*)
          `)
          .eq('user_id', userId);

        if (error) throw error;
        setYorumlar(data || []);
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    getYorumlar();
  }, [userId]);

  if (loading) return <div>Yorumlar yükleniyor...</div>;

  return (
    <div className="space-y-4">
      {yorumlar.length === 0 ? (
        <div className="text-center text-muted-foreground">
          Henüz yorum yapmamışsınız
        </div>
      ) : (
        yorumlar.map((yorum) => (
          <div key={yorum.id} className="border p-4 rounded-lg">
            <p>{yorum.yorum}</p>
            <div className="text-sm text-muted-foreground mt-2">
              {new Date(yorum.created_at).toLocaleDateString('tr-TR')}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Kullanıcı bilgileri komponenti
const KullaniciBilgileri = ({ userId }: { userId: string }) => {
  return (
    <div>
      {/* Kullanıcının profil bilgileri burada gösterilecek */}
    </div>
  );
};

// Profil ayarları komponenti
const ProfilAyarlari = ({ userId }: { userId: string }) => {
  return (
    <div>
      {/* Kullanıcının profil ayarları burada gösterilecek */}
    </div>
  );
}; 