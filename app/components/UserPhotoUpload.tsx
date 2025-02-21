'use client';

import { useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface UserPhotoUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onUploadSuccess?: (url: string) => void;
}

const UserPhotoUpload = ({ userId, currentAvatarUrl, onUploadSuccess }: UserPhotoUploadProps) => {
  const supabase = createClientComponentClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    try {
      setIsUploading(true);

      // Eski fotoğrafı sil (eğer varsa)
      if (currentAvatarUrl) {
        const oldFileName = currentAvatarUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      // Dosya adını unique yapmak için timestamp ekliyoruz
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      // Dosyayı Supabase Storage'a yükle
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Storage URL'ini oluştur
      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const storageUrl = `${baseUrl}/storage/v1/object/public/avatars/${fileName}`;

      console.log('Storage URL:', storageUrl); // URL'i kontrol etmek için

      // user_profiles tablosunu güncelle
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: storageUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Profil güncelleme hatası:', updateError);
        throw updateError;
      }

      // Önizleme URL'ini güncelle
      setPreviewUrl(storageUrl);
      
      // Başarı callback'ini çağır
      if (onUploadSuccess) {
        onUploadSuccess(storageUrl);
      }

      toast.success('Profil fotoğrafı başarıyla güncellendi');
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      toast.error('Fotoğraf yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Profil fotoğrafı"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                   disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading ? 'Yükleniyor...' : 'Fotoğraf Seç'}
      </button>
    </div>
  );
};

export default UserPhotoUpload; 