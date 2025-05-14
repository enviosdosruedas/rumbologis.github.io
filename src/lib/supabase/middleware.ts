
import type { Database } from '@/types/supabase';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

export async function createSupabaseMiddlewareClient(
  req: NextRequest,
  res: NextResponse
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bselwjnzgqziizczqzxp.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZWx3am56Z3F6aWl6Y3pxenhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjMyMDAsImV4cCI6MjA2MjU5OTIwMH0.2ilrqJ2ZeL-PF6eQ8YrsmUgp-qLeNnNF9T7MxeJEWL0";

  if (!supabaseUrl || !supabaseAnonKey) {
    // This case should ideally not be reached if defaults are provided
    // but it's a good practice to handle it.
    // In a real scenario, you might throw an error or log a critical warning.
    // For now, we'll proceed, and createServerClient will likely throw if they are still truly missing.
    console.error("Supabase URL or Anon Key is missing in middleware despite fallbacks.");
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          // @ts-ignore // todo: remove this
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          // @ts-ignore // todo: remove this
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
}

