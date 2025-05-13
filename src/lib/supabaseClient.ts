import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bselwjnzgqziizczqzxp.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZWx3am56Z3F6aWl6Y3pxenhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjMyMDAsImV4cCI6MjA2MjU5OTIwMH0.2ilrqJ2ZeL-PF6eQ8YrsmUgp-qLeNnNF9T7MxeJEWL0";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Commented out as per instructions not to actually connect for now.
// This file serves as a placeholder for future integration.
// If Supabase is to be used, uncomment the line above and ensure
// environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.

// Mock client for type consistency if needed elsewhere, or simply don't export.
export const supabase = null;
