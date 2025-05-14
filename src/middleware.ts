
import { type NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createSupabaseMiddlewareClient(req, res);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // If user is trying to access login page but is already authenticated
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboardrepartomobile', req.url));
  }

  // If user is trying to access a protected page and is not authenticated
  if (!session && pathname.startsWith('/dashboardrepartomobile')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // If user is trying to access main app routes like /dashboard, /clientes, etc. and is not authenticated
  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/clientes') || pathname.startsWith('/repartidores') || pathname.startsWith('/clientes-reparto') || pathname.startsWith('/repartos')) && pathname !== '/dashboardrepartomobile') {
     return NextResponse.redirect(new URL('/login', req.url));
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
    '/login',
    '/dashboard',
    '/dashboardrepartomobile',
    '/clientes',
    '/repartidores',
    '/clientes-reparto',
    '/repartos',
  ],
};
