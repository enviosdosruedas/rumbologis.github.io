
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
      // Clear malformed cookie by setting it with an immediate expiration
      const newHeaders = new Headers(res.headers);
      newHeaders.append('Set-Cookie', `userData=; Path=/; HttpOnly; Max-Age=0`);
      return NextResponse.next({
        request: {
            headers: newHeaders,
        },
      });
    }
  }

  const publicPaths = ['/login', '/test-login'];
  const adminDashboardPath = '/dashboard';
  const repartidorDashboardPath = '/dashboardrepartomobile';

  // Define protected admin paths (excluding root '/' which might be public or handled differently)
  const protectedAdminPaths = [adminDashboardPath, '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  // The root path '/' is also considered protected and for admins by default here.
  const allProtectedAdminPaths = ['/', ...protectedAdminPaths];


  // If user is authenticated
  if (userData) {
    // If on a public path (like /login or /test-login) but already logged in, redirect to appropriate dashboard
    if (publicPaths.includes(pathname)) {
      if (userData.rol === 'admin') {
        return NextResponse.redirect(new URL(adminDashboardPath, request.url));
      } else if (userData.rol === 'repartidor') {
        return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));
      }
      // Fallback for other authenticated roles if any, or if logic is missing for a role
      return NextResponse.redirect(new URL(adminDashboardPath, request.url)); // Default to admin dashboard
    }

    // Role-based access control for protected paths
    if (userData.rol === 'admin') {
      // Admin trying to access repartidor's dashboard
      if (pathname === repartidorDashboardPath) {
        return NextResponse.redirect(new URL(adminDashboardPath, request.url));
      }
      // Admin can access admin paths
      if (allProtectedAdminPaths.includes(pathname)) {
        return res; // Allow access
      }
      // Admin on an unknown/unauthorized path, redirect to their dashboard
      console.warn(`Admin "${userData.nombre}" on unhandled/unauthorized path "${pathname}". Redirecting to admin dashboard.`);
      return NextResponse.redirect(new URL(adminDashboardPath, request.url));

    } else if (userData.rol === 'repartidor') {
      // Repartidor trying to access admin paths
      if (allProtectedAdminPaths.includes(pathname)) {
        return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));
      }
      // Repartidor can access their dashboard
      if (pathname === repartidorDashboardPath) {
        return res; // Allow access
      }
      // Repartidor on an unknown/unauthorized path, redirect to their dashboard
      console.warn(`Repartidor "${userData.nombre}" on unhandled/unauthorized path "${pathname}". Redirecting to repartidor dashboard.`);
      return NextResponse.redirect(new URL(repartidorDashboardPath, request.url));

    } else {
      // Authenticated user with an unknown/unhandled role
      console.warn(`Authenticated user "${userData.nombre}" with unknown role "${userData.rol}" accessing "${pathname}". Redirecting to login.`);
      const newHeaders = new Headers(res.headers);
      newHeaders.append('Set-Cookie', `userData=; Path=/; HttpOnly; Max-Age=0`); // Clear cookie
      return NextResponse.redirect(new URL('/login', request.url),{ headers: newHeaders });
    }
  } else { // User is NOT authenticated
    // If trying to access a protected path (any path not in publicPaths)
    if (!publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to public paths for unauthenticated users (e.g. /login, /test-login)
    return res;
  }
}

export const config = {
  matcher: [
    // Match all routes except for static files, images, and specific assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
