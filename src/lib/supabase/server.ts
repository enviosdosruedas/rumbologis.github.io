
import type { Database } from '@/types/supabase';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bselwjnzgqziizczqzxp.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZWx3am56Z3F6aWl6Y3pxenhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjMyMDAsImV4cCI6MjA2MjU5OTIwMH0.2ilrqJ2ZeL-PF6eQ8YrsmUgp-qLeNnNF9T7MxeJEWL0";
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // This case should ideally not be reached if defaults are provided.
    // Log an error or handle as appropriate for your application.
    console.error("Supabase URL or Anon Key is missing in server client despite fallbacks.");
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

