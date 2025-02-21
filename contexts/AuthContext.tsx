import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{error: any}>;
  signUp: (email: string, password: string) => Promise<{error: any}>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  deleteUser: (userId: string) => Promise<{error: any}>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Session kontrolü ve yönetimi
  useEffect(() => {
    let mounted = true;

    const getCurrentSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session hatası:", error);
          if (mounted) setUser(null);
          return;
        }

        if (session?.user && mounted) {
          console.log("Oturum bulundu:", session.user.email);
          setUser(session.user);
        } else {
          console.log("Oturum bulunamadı");
          setUser(null);
        }
      } catch (error) {
        console.error("Session kontrolü hatası:", error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setLoading(false);
        }
      }
    };

    getCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth durumu değişti:", event, session?.user?.email);

      if (event === 'SIGNED_IN') {
        if (mounted && session?.user) {
          console.log("Giriş yapıldı:", session.user.email);
          setUser(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          console.log("Çıkış yapıldı");
          setUser(null);
        }
      }

      setIsLoading(false);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Giriş hatası:", error.message);
        return { error };
      }

      if (data?.user) {
        console.log("Başarılı giriş:", data.user.email);
        setUser(data.user);
      }

      return { error: null };
    } catch (error) {
      console.error("Giriş işlemi hatası:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { error };
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // State'i temizle
      setUser(null);
      
      // Ana sayfaya yönlendir
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(null);
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,  // Ana sayfaya yönlendir
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Kullanıcının verilerini silme
      const { error: deleteDataError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (deleteDataError) throw deleteDataError;

      // Kullanıcı hesabını silme
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
        userId
      );

      if (deleteUserError) throw deleteUserError;

      // Kullanıcı state'ini temizle
      setUser(null);
      
      return { error: null };
    } catch (error) {
      console.error('Delete user error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isLoading,
      signIn, 
      signUp, 
      signOut, 
      googleSignIn,
      deleteUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 