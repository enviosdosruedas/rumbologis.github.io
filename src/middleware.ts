
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// createSupabaseMiddlewareClient is available but not directly used for the custom 'userData' cookie check.
// It would be used if Supabase's session management (e.g., getSession()) was integrated into this middleware.
// import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'; 

interface UserData {
  nombre: string;
  rol: string;
  codigo: number;
  repartidor_id?: string;
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next(); // Response object that can be modified (e.g., for setting/deleting cookies)

  const { pathname } = request.nextUrl;

  const cookie = request.cookies.get('userData');
  let userData: UserData | null = null;
  
  if (cookie) {
    try {
      userData = JSON.parse(cookie.value);
    } catch (e) {
      console.error("Failed to parse user data from cookie in middleware. Cookie value:", cookie.value, "Error:", e);
      // userData remains null.
      // Delete the malformed cookie to prevent persistent issues.
      res.cookies.delete('userData', { path: '/' });
    }
  }

  const publicPaths = ['/login', '/test-login'];
  // Ensure '/' for admin resolves to '/dashboard' due to page.tsx redirect
  const adminPaths = ['/', '/dashboard', '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  const repartidorPaths = ['/dashboardrepartomobile'];

  // Handle unauthenticated users
  if (!userData) {
    if (!publicPaths.includes(pathname)) {
      // If trying to access a protected path without being authenticated, redirect to login.
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to public paths for unauthenticated users.
    return res;
  }

  // Handle authenticated users trying to access login/test-login pages
  if (pathname === '/login' || pathname === '/test-login') {
    if (userData.rol === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url)); // Admin dashboard
    } else if (userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url)); // Repartidor dashboard
    }
    // Default redirect for other authenticated roles or if role logic is extended
    return NextResponse.redirect(new URL('/dashboard', request.url)); 
  }

  // Authorization for authenticated users based on role
  if (userData.rol === 'admin') {
    if (repartidorPaths.includes(pathname) && !adminPaths.includes(pathname)) {
      // Admin trying to access a repartidor-only path that isn't also an admin path
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If it's an admin path, allow. If not (and not public, not repartidor-only), it will be caught by the final fallback.
  } else if (userData.rol === 'repartidor') {
    if (adminPaths.includes(pathname) && !repartidorPaths.includes(pathname)) {
      // Repartidor trying to access an admin-only path that isn't also a repartidor path
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    // If it's a repartidor path, allow. If not (and not public, not admin-only), it will be caught by the final fallback.
  } else {
    // Unknown role for an authenticated user
    if (!publicPaths.includes(pathname)) {
        console.warn(`Unknown role "${userData.rol}" for user "${userData.nombre}" attempting to access "${pathname}". Redirecting to login.`);
        res.cookies.delete('userData', { path: '/' }); // Clear cookie
        return NextResponse.redirect(new URL('/login', request.url), { headers: res.headers });
    }
  }
  
  // Final authorization check: if authenticated user is trying to access a non-public path
  // that doesn't match their role's allowed paths.
   if (!publicPaths.includes(pathname) &&
       ((userData.rol === 'admin' && !adminPaths.includes(pathname)) ||
        (userData.rol === 'repartidor' && !repartidorPaths.includes(pathname)))
      ) {
        console.warn(`User "${userData.nombre}" (role: "${userData.rol}") attempted to access restricted path "${pathname}". Redirecting.`);
        // Redirect to their respective dashboards or login if dashboard is somehow restricted
        if (userData.rol === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else if (userData.rol === 'repartidor') {
            return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
        }
        // Fallback for any other role not matching, clear cookie and send to login
        res.cookies.delete('userData', { path: '/' });
        return NextResponse.redirect(new URL('/login', request.url), { headers: res.headers });
   }

  return res; // Allow access if all checks pass
}

export const config = {
  matcher: [
    // Match all routes except for static files, images, and specific assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
