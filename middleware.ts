import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    // Response oluştur
    const res = NextResponse.next();
    
    // Supabase client'ı oluştur
    const supabase = createMiddlewareClient({ req, res });

    // Session'ı kontrol et
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Middleware session hatası:", error);
      return NextResponse.redirect(new URL('/?showLogin=true', req.url));
    }

    // /profile sayfası kontrolü
    if (req.nextUrl.pathname === '/profile') {
      if (!session?.user) {
        console.log("Middleware: Oturum yok, login'e yönlendiriliyor");
        const redirectUrl = new URL('/?showLogin=true', req.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      console.log("Middleware: Oturum var, profile sayfasına erişim izni verildi");
      return res;
    }

    // Diğer tüm durumlar için normal akışa devam et
    return res;
  } catch (error) {
    console.error("Middleware kritik hata:", error);
    return NextResponse.redirect(new URL('/?showLogin=true', req.url));
  }
}

// Sadece /profile URL'ini yakala
export const config = {
  matcher: ['/profile']
}; 