
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
      // Invalidate the malformed cookie by setting it to expire immediately
      newHeaders.append('Set-Cookie', `userData=; Path=/; HttpOnly; Max-Age=0`);
      // It's safer to redirect to login if cookie is malformed.
      return NextResponse.redirect(new URL('/login', request.url),{ headers: newHeaders });
    }
  }

  const publicPaths = ['/login', '/test-login'];
  const adminDashboardPath = '/dashboard';
  const repartidorDashboardPath = '/dashboardrepartomobile';
  const protectedAdminPathsBase = [adminDashboardPath, '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  // The root path '/' is also considered protected and for admins by default here.
  const allProtectedAdminPaths = ['/', ...protectedAdminPathsBase];


  // 1. Handle unauthenticated users
  if (!userData) {
    // If trying to access a path that is NOT public, redirect to login
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to public paths for unauthenticated users
    return res;
  }

  // 2. Handle authenticated users trying to access public paths
  // If authenticated user tries to access /login or /test-login, redirect them to their dashboard
  if (publicPaths.includes(pathname)) {
    if (userData.rol === 'admin') {
      return NextResponse.redirect(new URL(adminDashboardPath, request.url));
    } else if (userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));
    }
    // Fallback for other authenticated roles or if logic is missing, default to admin dashboard
    console.warn(`Authenticated user "${userData.nombre}" with role "${userData.rol}" on public path "${pathname}". Defaulting to admin dashboard.`);
    return NextResponse.redirect(new URL(adminDashboardPath, request.url));
  }

  // 3. Handle authenticated users accessing protected paths (role-based access)
  if (userData.rol === 'admin') {
    // Admin trying to access repartidor's specific dashboard
    if (pathname === repartidorDashboardPath) {
      return NextResponse.redirect(new URL(adminDashboardPath, request.url));
    }
    // Admin can access all defined admin paths
    if (allProtectedAdminPaths.includes(pathname)) {
      return res; // Allow access
    }
    // Admin on an unknown/unauthorized path, redirect to their dashboard
    // This catches any path not explicitly allowed for admin.
    console.warn(`Admin "${userData.nombre}" on unhandled/unauthorized path "${pathname}". Redirecting to admin dashboard.`);
    return NextResponse.redirect(new URL(adminDashboardPath, request.url));
  }

  if (userData.rol === 'repartidor') {
    // Repartidor trying to access any of the admin paths
    if (allProtectedAdminPaths.includes(pathname)) {
      return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));
    }
    // Repartidor can access their specific dashboard
    if (pathname === repartidorDashboardPath) {
      return res; // Allow access
    }
    // Repartidor on an unknown/unauthorized path, redirect to their dashboard
    // This catches any path not explicitly allowed for repartidor.
    console.warn(`Repartidor "${userData.nombre}" on unhandled/unauthorized path "${pathname}". Redirecting to repartidor dashboard.`);
    return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));
  }

  // 4. Handle authenticated user with an unknown/unhandled role on a protected path
  // This case should ideally not be reached if roles are well-defined.
  console.warn(`Authenticated user "${userData.nombre}" with unknown role "${userData.rol}" accessing protected path "${pathname}". Redirecting to login and clearing session.`);
  const newHeaders = new Headers(res.headers);
  newHeaders.append('Set-Cookie', `userData=; Path=/; HttpOnly; Max-Age=0`); // Clear cookie
  return NextResponse.redirect(new URL('/login', request.url), { headers: newHeaders });
}

export const config = {
  matcher: [
    // Match all routes except for static files, images, and specific assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
