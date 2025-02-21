import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    console.log("Profil butonuna tıklandı");
    console.log("User durumu:", user);
    
    if (user) {
      router.push('/profile');
    } else {
      console.log("Kullanıcı giriş yapmamış");
      // Giriş modalını aç
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div 
          className="cursor-pointer"
          onClick={handleProfileClick}
        >
          <Avatar>
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user.user_metadata?.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <Button onClick={() => setIsLoginModalOpen(true)}>
          Giriş Yap
        </Button>
      )}
    </div>
  );
};

export default Header; 