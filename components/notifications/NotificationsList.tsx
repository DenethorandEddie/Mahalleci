import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export default function NotificationsList() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Bildirimler yüklenirken hata:', error);
          return;
        }

        setNotifications(data || []);
      } catch (error) {
        console.error('Beklenmeyen hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    // Realtime subscription
    const subscription = supabase
      .channel('notifications_list')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        loadNotifications();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Bildirimler güncellenirken hata:', error);
      return;
    }

    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  // Bildirimlere tıklama işlevi
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id);

      if (error) {
        console.error('Bildirim güncellenirken hata:', error);
        return;
      }

      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, is_read: true } : n
      ));
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  // Bildirimi silme fonksiyonu
  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Bildirime tıklama olayının tetiklenmesini engelle
    setDeleteId(notificationId);
  };

  // Silme işlemini gerçekleştir
  const confirmDelete = async () => {
    if (!deleteId || !user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .match({ id: deleteId, user_id: user.id });

      if (error) {
        console.error('Bildirim silinirken hata:', error);
        return;
      }

      // Bildirimi UI'dan kaldır
      setNotifications(notifications.filter(n => n.id !== deleteId));
    } catch (error) {
      console.error('Bildirim silme hatası:', error);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      {notifications.length > 0 && (
        <div className="flex justify-end mb-6">
          <Button 
            variant="outline"
            onClick={markAllAsRead}
          >
            Tümünü Okundu İşaretle
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Bildiriminiz bulunmuyor
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group relative ${
                !notification.is_read 
                  ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Silme butonu */}
              <button
                onClick={(e) => handleDeleteNotification(notification.id, e)}
                className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity 
                  p-2 rounded-full
                  bg-red-50 hover:bg-red-100 
                  dark:bg-red-900/20 dark:hover:bg-red-900/40
                  border border-red-200 dark:border-red-800"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>

              <div className="font-medium">{notification.title}</div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">
                {notification.message}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {new Date(notification.created_at).toLocaleString('tr-TR', {
                  timeZone: 'Europe/Istanbul'
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Silme onay dialog'u */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bildirimi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu bildirimi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-24">Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="w-full sm:w-24 bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 