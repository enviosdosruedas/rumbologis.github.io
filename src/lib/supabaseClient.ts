import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Cliente } from '@/types/cliente'; // Assuming your Cliente type is here

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bselwjnzgqziizczqzxp.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZWx3am56Z3F6aWl6Y3pxenhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjMyMDAsImV4cCI6MjA2MjU5OTIwMH0.2ilrqJ2ZeL-PF6eQ8YrsmUgp-qLeNnNF9T7MxeJEWL0";

// Define a type for your database schema if you have one
// interface Database {
//   public: {
//     Tables: {
//       clientes: {
//         Row: Cliente; // Assuming Cliente is your row type
//         Insert: Omit<Cliente, 'id'>; // Assuming id is auto-generated
//         Update: Partial<Omit<Cliente, 'id'>>;
//       };
//       // ... other tables
//     };
//     // ... other schemas
//   };
// }

// Initialize the Supabase client
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
// Using generic SupabaseClient as Database schema definition is not explicitly requested for this step.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
