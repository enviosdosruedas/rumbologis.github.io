
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
  if (cookie) {
    try {
      userData = JSON.parse(cookie.value);
    } catch (e) {
      console.error("Failed to parse user data from cookie in middleware", e);
    }
  }

  const publicPaths = ['/login', '/test-login']; // Added /test-login
  const adminPaths = ['/dashboard', '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  const repartidorPaths = ['/dashboardrepartomobile'];

  if (!userData) {
    if (!publicPaths.includes(pathname)) {
      // If trying to access a non-public path without user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // If it's a public path and no user data, allow access
    return res;
  }

  // User is authenticated (userData exists)
  if (pathname === '/login' || pathname === '/test-login') {
    // If authenticated user tries to access login or test-login, redirect them to their dashboard
    if (userData.rol === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    // Fallback for other roles or if dashboard path is not defined for a role
    return NextResponse.redirect(new URL('/', request.url)); 
  }

  // Role-based access control for authenticated users
  if (userData.rol === 'admin') {
    if (repartidorPaths.includes(pathname)) {
      // Admin trying to access repartidor-specific path
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Admin can access adminPaths and other non-role-specific protected paths
    return res;
  }

  if (userData.rol === 'repartidor') {
    if (adminPaths.includes(pathname)) {
      // Repartidor trying to access admin-specific path
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    // Repartidor can access repartidorPaths and other non-role-specific protected paths
    return res;
  }

  // If user role is unknown or doesn't match any specific path rules,
  // and it's not a public path, redirect to login as a fallback.
  // This also covers cases where an authenticated user tries to access a path not matching their role's allowed paths.
   if (!publicPaths.includes(pathname) && 
      (userData.rol === 'admin' && !adminPaths.includes(pathname)) ||
      (userData.rol === 'repartidor' && !repartidorPaths.includes(pathname))
     ) {
        if (userData.rol === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else if (userData.rol === 'repartidor') {
            return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
        }
        // Fallback if role is not admin or repartidor but somehow authenticated
        return NextResponse.redirect(new URL('/login', request.url));
   }


  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
