
-- Rumbo Envíos - Database Optimization and User-Repartidor Linking Script

-- Ensure the uuid-ossp extension is available if not already.
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 1: Add repartidor_id to usuarios table
-- This column will link a user account to a specific repartidor profile.
-- It's nullable because not all users are repartidores (e.g., admin).
ALTER TABLE public.usuarios
ADD COLUMN IF NOT EXISTS repartidor_id UUID;

-- Step 2: Add a foreign key constraint for repartidor_id
-- This ensures data integrity, linking to the 'id' of the 'repartidores' table.
-- If a repartidor is deleted, the repartidor_id in usuarios will be set to NULL.
-- If a repartidor's id is updated (rare for UUIDs), it cascades.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_usuarios_repartidor'
  ) THEN
    ALTER TABLE public.usuarios
    ADD CONSTRAINT fk_usuarios_repartidor
      FOREIGN KEY (repartidor_id)
      REFERENCES public.repartidores(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END
$$;

COMMENT ON COLUMN public.usuarios.repartidor_id IS 'Foreign key to the repartidores table, linking a user account to a repartidor profile if the user is a repartidor.';

-- Step 3: Remove redundant columns from the repartidores table.
-- User authentication details (username/pass), role, and any direct link to an auth system
-- are now primarily managed by the 'usuarios' table.
ALTER TABLE public.repartidores
DROP COLUMN IF EXISTS usuario,
DROP COLUMN IF EXISTS rol,
DROP COLUMN IF EXISTS auth_user_id;

-- Step 4: Update existing 'repartidor' user accounts to link them to their repartidor profiles.
-- Ensure the UUIDs '37804e1f-8047-49f2-bb2e-7c91a7c32b92' and 'e87b1e04-b4bb-40ed-b1ce-3b9623f7eab4'
-- exist in your 'repartidores' table. If not, you'll need to insert them first or adjust these UUIDs.

-- Example: Ensure repartidores exist (uncomment and modify if needed)
-- INSERT INTO public.repartidores (id, nombre, identificacion, telefono, vehiculo_asignado)
-- VALUES
--   ('37804e1f-8047-49f2-bb2e-7c91a7c32b92', 'Nombre Repartidor Uno', 'ID-UNO', '111111', 'Moto Uno')
-- ON CONFLICT (id) DO NOTHING;

-- INSERT INTO public.repartidores (id, nombre, identificacion, telefono, vehiculo_asignado)
-- VALUES
--   ('e87b1e04-b4bb-40ed-b1ce-3b9623f7eab4', 'Nombre Repartidor Dos', 'ID-DOS', '222222', 'Auto Dos')
-- ON CONFLICT (id) DO NOTHING;


-- Link 'repartidor1' (codigo 2) to repartidor_id '37804e1f-8047-49f2-bb2e-7c91a7c32b92'
UPDATE public.usuarios
SET repartidor_id = '37804e1f-8047-49f2-bb2e-7c91a7c32b92'
WHERE codigo = 2 AND nombre = 'repartidor1' AND rol = 'repartidor';

-- Link 'repartidor2' (codigo 3) to repartidor_id 'e87b1e04-b4bb-40ed-b1ce-3b9623f7eab4'
UPDATE public.usuarios
SET repartidor_id = 'e87b1e04-b4bb-40ed-b1ce-3b9623f7eab4'
WHERE codigo = 3 AND nombre = 'repartidor2' AND rol = 'repartidor';

-- Verification (optional, for checking after running the script)
SELECT codigo, nombre, rol, repartidor_id FROM public.usuarios WHERE rol = 'repartidor';
SELECT id, nombre FROM public.repartidores WHERE id IN ('37804e1f-8047-49f2-bb2e-7c91a7c32b92', 'e87b1e04-b4bb-40ed-b1ce-3b9623f7eab4');

COMMENT ON TABLE public.usuarios IS 'Stores user accounts for login, including roles and a link to a repartidor profile if applicable.';
COMMENT ON TABLE public.repartidores IS 'Stores profile information for repartidores. Linked from the usuarios table if a user is a repartidor.';

SELECT 'Database schema optimization and user-repartidor linking script executed successfully.' AS status;
