import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export default function NotificationDropdown() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Bildirimleri yükle fonksiyonunu dışarı çıkaralım
  const loadNotifications = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      return;
    }

    setNotifications(data);
    setUnreadCount(data.filter(n => !n.is_read).length);
  };

  // Bildirimleri yükle
  useEffect(() => {
    if (!user) return;
    
    console.log("Kullanıcı ID:", user.id); // Buradan ID'yi görebiliriz
    
    loadNotifications();

    // Realtime subscription
    const subscription = supabase
      .channel('notifications')
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

  // Bildirimi okundu olarak işaretle
  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Bildirim güncellenirken hata:', error);
      return;
    }
  };

  // Bildirime tıklandığında
  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    
    // Bildirimler sekmesine yönlendir
    router.push('/profile?tab=bildirimler');
  };

  // Tüm bildirimleri görüntüle
  const viewAllNotifications = () => {
    router.push('/profile?tab=bildirimler');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="error"
              className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h3 className="font-semibold">Bildirimler</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={viewAllNotifications}
          >
            Tümünü Gör
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Bildiriminiz bulunmuyor
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 cursor-pointer ${
                  !notification.is_read 
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 dark:border-orange-400' 
                    : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div>
                  <div className={`font-medium ${
                    !notification.is_read 
                      ? 'text-orange-700 dark:text-orange-300' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {notification.title}
                  </div>
                  <div className={`text-sm ${
                    !notification.is_read 
                      ? 'text-orange-600 dark:text-orange-200' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {notification.message}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleString('tr-TR', {
                      timeZone: 'Europe/Istanbul'
                    })}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 