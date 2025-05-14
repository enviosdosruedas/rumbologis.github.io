
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

interface UserData {
  nombre: string;
  rol: string;
  codigo: number;
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  // Not creating supabase client here anymore as it's not directly used for auth checks in this version
  // const supabase = await createSupabaseMiddlewareClient(request, res);

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Try to get user data from cookie
  const cookie = request.cookies.get('userData');
  let userData: UserData | null = null;
  if (cookie) {
    try {
      userData = JSON.parse(cookie.value);
    } catch (e) {
      console.error("Failed to parse user data from cookie in middleware", e);
      // Invalid cookie, treat as unauthenticated
    }
  }

  // Define public and protected routes
  const publicPaths = ['/login'];
  const adminPaths = ['/dashboard', '/clientes', '/repartidores', '/clientes-reparto', '/repartos'];
  const repartidorPaths = ['/dashboardrepartomobile'];

  // If user is not authenticated (no valid userData cookie)
  if (!userData) {
    if (!publicPaths.includes(pathname)) {
      // If trying to access a protected route, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Allow access to public paths
    return res;
  }

  // User is authenticated (userData cookie exists and is valid)
  if (pathname === '/login') {
    // If authenticated user tries to access login page, redirect based on role
    if (userData.rol === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (userData.rol === 'repartidor') {
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    // Fallback if role is unknown, redirect to a generic home or error page (or login again if preferred)
    // Redirecting to '/' which then redirects to '/dashboard' or appropriate page based on other logic.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role-based access control
  if (userData.rol === 'admin') {
    if (repartidorPaths.includes(pathname)) {
      // Admin trying to access repartidor specific page, redirect to admin dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Allow access to admin paths and other general paths not explicitly restricted
    return res;
  }

  if (userData.rol === 'repartidor') {
    if (adminPaths.includes(pathname)) {
      // Repartidor trying to access admin specific page, redirect to repartidor dashboard
      return NextResponse.redirect(new URL('/dashboardrepartomobile', request.url));
    }
    // Allow access to repartidor paths and other general paths not explicitly restricted
    return res;
  }

  // If role is not recognized or doesn't have access to the requested path
  // (though this should be rare if roles are 'admin' or 'repartidor')
  // Redirect to a default page or show an error. For now, redirect to login as a fallback.
  // Avoid redirect loop if already on a public path (though previous checks should handle this)
  if (!publicPaths.includes(pathname) && !adminPaths.includes(pathname) && !repartidorPaths.includes(pathname) ) {
      return NextResponse.redirect(new URL('/login', request.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
