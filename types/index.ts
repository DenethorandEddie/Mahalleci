export interface MahalleYorum {
  id: string;
  user_id: string;
  yorum: string;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
  mahalle_puanlamalari: {
    guvenlik: number;
    ulasim: number;
    sessizlik: number;
    temizlik: number;
    sosyal_hayat: number;
    yesil_alan: number;
  }[];
} 