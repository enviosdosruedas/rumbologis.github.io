
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

interface UserData {
  nombre: string;
  rol: string;
  codigo: number;
  repartidor_id?: string;
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  // Initialize Supabase client for middleware.
  // While not directly used for the custom 'userData' cookie check below,
  // it's good practice to have it correctly set up if other parts of the
  // middleware or Supabase Auth features (like getSession) were to be used.
  // const supabase = await createSupabaseMiddlewareClient(request, res);

  const { pathname } = request.nextUrl;

  const cookie = request.cookies.get('userData');
  let userData: UserData | null = null;
  
  if (cookie) {
    try {
      userData = JSON.parse(cookie.value);
    } catch (e) {
      console.error("Failed to parse user data from cookie in middleware. Cookie value:", cookie.value, "Error:", e);
      // Optional: Treat as unauthenticated or try to delete the malformed cookie
      // To delete: res.cookies.delete('userData', { path: '/' });
      // return NextResponse.redirect(new URL('/login', request.url), { headers: res.headers });
    }
  }

  const publicPaths = ['/login', '/test-login'];
  const adminPaths = ['/','/dashboard', '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  const repartidorPaths = ['/dashboardrepartomobile'];

  if (!userData) {
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return res;
  }

  // User is authenticated
  if (pathname === '/login' || pathname === '/test-login') {
    if (userData.rol === 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    } else if (userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (userData.rol === 'admin') {
    if (repartidorPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (userData.rol === 'repartidor') {
    if (adminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
  } else {
    // If role is unknown but user is somehow authenticated and not on a public path
    if (!publicPaths.includes(pathname)) {
        console.warn(`Unknown role "${userData.rol}" for user "${userData.nombre}". Redirecting to login.`);
        // Clear potentially problematic cookie
        res.cookies.delete('userData', { path: '/' });
        return NextResponse.redirect(new URL('/login', request.url), { headers: res.headers });
    }
  }
  
  // Fallback if path does not match allowed paths for the role (and not public)
   if (!publicPaths.includes(pathname) &&
       ((userData.rol === 'admin' && !adminPaths.includes(pathname)) ||
        (userData.rol === 'repartidor' && !repartidorPaths.includes(pathname)))
      ) {
        console.warn(`User "${userData.nombre}" with role "${userData.rol}" attempted to access restricted path "${pathname}".`);
        if (userData.rol === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else if (userData.rol === 'repartidor') {
            return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
        }
        // Default redirect for other authenticated roles trying to access restricted paths
        res.cookies.delete('userData', { path: '/' });
        return NextResponse.redirect(new URL('/login', request.url), { headers: res.headers });
   }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
