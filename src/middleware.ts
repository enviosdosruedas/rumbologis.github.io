
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// createSupabaseMiddlewareClient is not used in this version for auth check
// import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

interface UserData {
  nombre: string;
  rol: string;
  codigo: number;
  repartidor_id?: string; // Optional UUID for repartidor profile
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = request.nextUrl;

  const cookie = request.cookies.get('userData');
  let userData: UserData | null = null;
  if (cookie) {
    try {
      userData = JSON.parse(cookie.value);
    } catch (e) {
      console.error("Failed to parse user data from cookie in middleware", e);
    }
  }

  const publicPaths = ['/login'];
  const adminPaths = ['/dashboard', '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  const repartidorPaths = ['/dashboardrepartomobile'];

  if (!userData) {
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return res;
  }

  if (pathname === '/login') {
    if (userData.rol === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (userData.rol === 'admin') {
    if (repartidorPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return res;
  }

  if (userData.rol === 'repartidor') {
    if (adminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    return res;
  }

  if (!publicPaths.includes(pathname) && !adminPaths.includes(pathname) && !repartidorPaths.includes(pathname) ) {
      return NextResponse.redirect(new URL('/login', request.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
