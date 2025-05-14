
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface UserData {
  nombre: string;
  rol: string;
  codigo: number;
  repartidor_id?: string;
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = request.nextUrl;

  const cookie = request.cookies.get('userData');
  let userData: UserData | null = null;

  if (cookie?.value) {
    try {
      userData = JSON.parse(cookie.value);
    } catch (e) {
      console.error("Failed to parse user data from cookie in middleware. Cookie value:", cookie.value, "Error:", e);
      const newHeaders = new Headers(res.headers);
      // Clear without HttpOnly, add SameSite=Lax for consistency
      newHeaders.append('Set-Cookie', `userData=; Path=/; Max-Age=0; SameSite=Lax`); 
      return NextResponse.redirect(new URL('/login', request.url),{ headers: newHeaders });
    }
  }

  const publicPaths = ['/login', '/test-login'];
  const adminDashboardPath = '/dashboard';
  const repartidorDashboardPath = '/dashboardrepartomobile';
  const protectedAdminPathsBase = [adminDashboardPath, '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  const allProtectedAdminPaths = ['/', ...protectedAdminPathsBase];


  // 1. Handle unauthenticated users
  if (!userData) {
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return res;
  }

  // 2. Handle authenticated users trying to access public paths
  if (publicPaths.includes(pathname)) {
    if (userData.rol === 'admin') {
      return NextResponse.redirect(new URL(adminDashboardPath, request.url));
    } else if (userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));
    }
    console.warn(`Authenticated user "${userData.nombre}" with role "${userData.rol || 'desconocido'}" on public path "${pathname}". Defaulting to admin dashboard.`);
    return NextResponse.redirect(new URL(adminDashboardPath, request.url));
  }

  // 3. Handle authenticated users accessing protected paths (role-based access)
  if (userData.rol === 'admin') {
    if (pathname === repartidorDashboardPath) {
      return NextResponse.redirect(new URL(adminDashboardPath, request.url));
    }
    if (allProtectedAdminPaths.includes(pathname)) {
      return res; 
    }
    console.warn(`Admin "${userData.nombre}" on unhandled/unauthorized path "${pathname}". Redirecting to admin dashboard.`);
    return NextResponse.redirect(new URL(adminDashboardPath, request.url));
  }

  if (userData.rol === 'repartidor') {
    if (allProtectedAdminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));
    }
    if (pathname === repartidorDashboardPath) {
      return res; 
    }
    console.warn(`Repartidor "${userData.nombre}" on unhandled/unauthorized path "${pathname}". Redirecting to repartidor dashboard.`);
    return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));
  }

  // 4. Handle authenticated user with an unknown/unhandled role on a protected path
  console.warn(`Authenticated user "${userData.nombre}" with unknown role "${userData.rol || 'desconocido'}" accessing protected path "${pathname}". Redirecting to login and clearing session.`);
  const newHeaders = new Headers(res.headers);
  newHeaders.append('Set-Cookie', `userData=; Path=/; Max-Age=0; SameSite=Lax`); 
  return NextResponse.redirect(new URL('/login', request.url), { headers: newHeaders });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

