
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Import the generated Database type

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bselwjnzgqziizczqzxp.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZWx3am56Z3F6aWl6Y3pxenhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjMyMDAsImV4cCI6MjA2MjU5OTIwMH0.2ilrqJ2ZeL-PF6eQ8YrsmUgp-qLeNnNF9T7MxeJEWL0";

// Initialize the Supabase client with the Database type
export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey);
