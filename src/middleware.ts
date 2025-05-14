
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
      console.error("Failed to parse user data from cookie in middleware. Cookie value:", cookie.value, "Error:", e);
      // Delete the malformed cookie to prevent persistent issues.
      res.cookies.delete('userData', { path: '/' });
    }
  }

  const publicPaths = ['/login', '/test-login'];
  const adminPaths = ['/', '/dashboard', '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  const repartidorPaths = ['/dashboardrepartomobile'];

  // Handle access to admin paths
  if (adminPaths.includes(pathname)) {
    // If an authenticated 'repartidor' tries to access an admin path, redirect them to their dashboard.
    if (userData && userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    // Otherwise (unauthenticated, or admin, or other roles), allow access to admin path.
    return res; 
  }

  // Handle access to repartidor paths
  if (repartidorPaths.includes(pathname)) {
    if (!userData) { // Unauthenticated trying to access repartidor path
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userData.rol === 'admin') { // Admin trying to access repartidor path
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (userData.rol === 'repartidor') { // Repartidor accessing their path
      return res;
    }
    // Any other authenticated role trying to access repartidor path without specific allowance
    console.warn(`User "${userData.nombre}" (role: "${userData.rol}") attempted to access repartidor path "${pathname}". Redirecting to login.`);
    res.cookies.delete('userData', { path: '/' });
    return NextResponse.redirect(new URL('/login', request.url), { headers: res.headers });
  }
  
  // For non-admin and non-repartidor paths (i.e., public paths or others if they exist)
  // Handle unauthenticated users
  if (!userData) {
    // If not an admin path or repartidor path (already handled) and not a public path, redirect to login
    if (!publicPaths.includes(pathname)) { 
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to public paths
    return res;
  }

  // At this point, userData exists.
  // Handle authenticated users trying to access login/test-login
  if (pathname === '/login' || pathname === '/test-login') {
    if (userData.rol === 'admin') { // This admin might be from a previous session or test-login
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    // Default redirect for other authenticated roles or if role logic is extended
    return NextResponse.redirect(new URL('/dashboard', request.url)); 
  }
  
  // Fallback for any other authenticated user scenario not covered by specific role path checks
  // e.g. an unknown role trying to access a path that isn't explicitly public or defined for them.
  if (userData.rol !== 'admin' && userData.rol !== 'repartidor' && !publicPaths.includes(pathname)) {
    console.warn(`Authenticated user "${userData.nombre}" (role: "${userData.rol}") on an unhandled path "${pathname}". Redirecting to login.`);
    res.cookies.delete('userData', { path: '/' });
    return NextResponse.redirect(new URL('/login', request.url), { headers: res.headers });
  }

  // If all checks pass, allow the request
  return res;
}

export const config = {
  matcher: [
    // Match all routes except for static files, images, and specific assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
