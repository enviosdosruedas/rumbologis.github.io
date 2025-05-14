
import { type NextRequest, NextResponse } from 'next/server';
// createSupabaseMiddlewareClient might not be needed if we fully switch from Supabase Auth sessions
// For now, keeping it in case other parts of the app still rely on it, but auth checks will use cookie.

interface UserSession {
  nombre: string;
  rol: string;
  codigo: number;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  const userDataCookie = req.cookies.get('userData');
  let userSession: UserSession | null = null;

  if (userDataCookie) {
    try {
      userSession = JSON.parse(userDataCookie.value);
    } catch (error) {
      // Invalid cookie, treat as not logged in
      console.error('Error parsing user cookie:', error);
      // Optionally, delete the malformed cookie
      res.cookies.delete('userData');
    }
  }

  const isAdminRoute = pathname.startsWith('/dashboard') || 
                       pathname.startsWith('/clientes') || 
                       pathname.startsWith('/repartidores') || 
                       pathname.startsWith('/clientes-reparto') || 
                       pathname.startsWith('/repartos');
  
  const isRepartidorRoute = pathname.startsWith('/dashboardrepartomobile');

  // Not logged in
  if (!userSession) {
    if (pathname === '/login') {
      return res; // Allow access to login page
    }
    if (isAdminRoute || isRepartidorRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (pathname === '/') { // Root path protection
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }

  // Logged in
  if (userSession) {
    if (pathname === '/login') {
      // If logged in and trying to access login, redirect to their respective dashboard
      if (userSession.rol === 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } else if (userSession.rol === 'repartidor') {
        return NextResponse.redirect(new URL('/dashboardrepartomobile', req.url));
      }
    }

    if (userSession.rol === 'admin') {
      if (isRepartidorRoute) {
        // Admin trying to access repartidor-specific dashboard, redirect to admin dashboard
        // Or allow if admin should also see this: return res;
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      // Allow access to admin routes
      return res;
    }

    if (userSession.rol === 'repartidor') {
      if (isAdminRoute) {
        // Repartidor trying to access admin routes, redirect to their dashboard
        return NextResponse.redirect(new URL('/dashboardrepartomobile', req.url));
      }
      // Allow access to repartidor routes
      return res;
    }
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
    '/', // Match root to protect it or redirect
    '/login',
    '/dashboard',
    '/dashboardrepartomobile',
    '/clientes',
    '/repartidores',
    '/clientes-reparto',
    '/repartos',
  ],
};
