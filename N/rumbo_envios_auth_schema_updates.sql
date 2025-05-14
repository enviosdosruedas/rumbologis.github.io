
-- Script for PostgreSQL to update 'repartidores' table for authentication with Supabase Auth

-- Step 1: Add 'auth_user_id' column to 'repartidores' table.
-- This column will store the UUID from Supabase's 'auth.users' table,
-- effectively linking a repartidor profile to an authenticated user.
-- It's set to UNIQUE because one auth user should correspond to one repartidor profile.
-- ON DELETE SET NULL: If an auth user is deleted, the link is severed but the repartidor profile can remain (or be handled by app logic).
-- ON UPDATE CASCADE: If an auth user's ID changes (rare), it cascades.
ALTER TABLE public.repartidores
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- Add foreign key constraint after the column is added and potentially populated
-- Ensure that 'auth.users' table is accessible for this constraint.
-- This might need to be run after repartidores are linked to existing auth users if data migration is involved.
-- For a new setup, this establishes the link.
ALTER TABLE public.repartidores
ADD CONSTRAINT fk_repartidores_auth_user_id
FOREIGN KEY (auth_user_id)
REFERENCES auth.users(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Step 2: Add 'rol' column to 'repartidores' table.
-- This column can be used for role-based access control within the application.
-- For example, 'repartidor', 'admin', etc.
ALTER TABLE public.repartidores
ADD COLUMN IF NOT EXISTS rol VARCHAR(255);

-- Example: Update existing repartidores to have a default role if they are all 'repartidor'.
-- UPDATE public.repartidores SET rol = 'repartidor' WHERE rol IS NULL;

-- Step 3: Add 'usuario' column to 'repartidores' table.
-- This can store a username or a display name for login purposes.
-- While Supabase Auth uses email for signInWithPassword, this 'usuario' field
-- can be what the user types into a "Username" field in the UI.
-- It's marked UNIQUE if usernames must be distinct.
ALTER TABLE public.repartidores
ADD COLUMN IF NOT EXISTS usuario VARCHAR(255) UNIQUE;

-- Note on 'contrasena' (password) column:
-- It is NOT recommended to add a 'contrasena' column to your 'repartidores' table
-- if you are using Supabase Authentication. Supabase Auth handles password
-- hashing and secure storage within its own 'auth.users' table.
-- Attempting to manage passwords manually introduces significant security risks.

COMMENT ON COLUMN public.repartidores.auth_user_id IS 'Foreign key linking to the id in Supabase auth.users table.';
COMMENT ON COLUMN public.repartidores.rol IS 'Role of the repartidor, e.g., repartidor, admin.';
COMMENT ON COLUMN public.repartidores.usuario IS 'Username for the repartidor, can be used for display or login identity.';

-- Ensure RLS (Row Level Security) is enabled on your tables, especially if they contain sensitive data.
-- Check and enable RLS for 'repartidores' if not already done:
-- ALTER TABLE public.repartidores ENABLE ROW LEVEL SECURITY;

-- Example policies (adjust according to your app's needs):
-- Allow authenticated users to read their own repartidor profile
-- CREATE POLICY "Repartidores can view their own profile"
-- ON public.repartidores
-- FOR SELECT
-- USING (auth.uid() = auth_user_id);

-- Allow service_role or admins to manage all repartidor profiles
-- CREATE POLICY "Admins can manage all repartidor profiles"
-- ON public.repartidores
-- FOR ALL
-- USING (true) -- Or a more specific check like auth.role() = 'admin_role_from_custom_claims'
-- WITH CHECK (true);

SELECT 'Migration script for repartidores table completed.';
