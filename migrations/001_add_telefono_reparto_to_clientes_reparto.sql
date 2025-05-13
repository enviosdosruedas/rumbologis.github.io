
ALTER TABLE clientes_reparto
ADD COLUMN telefono_reparto VARCHAR(20);

COMMENT ON COLUMN clientes_reparto.telefono_reparto IS 'Teléfono de contacto del cliente de reparto específico.';

-- Ejemplo de cómo podría ser la tabla después de la alteración (esto es solo un comentario descriptivo):
-- CREATE TABLE clientes_reparto (
--     id SERIAL PRIMARY KEY,
--     cliente_id UUID NOT NULL REFERENCES clientes(id), -- Assuming clientes.id is UUID
--     nombre_reparto VARCHAR NOT NULL,
--     direccion_reparto TEXT,
--     telefono_reparto VARCHAR(20), -- Nueva columna
--     rango_horario VARCHAR,
--     tarifa DECIMAL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP
-- );
-- Nota: Si cliente_id en la tabla clientes_reparto es INTEGER y clientes.id es UUID,
-- la definición de la clave foránea debe coincidir.
-- El script SQL de creación de tablas anterior (000_initial_schema.sql) ya usa UUID para clientes.id.
-- Si clientes_reparto.cliente_id es INTEGER, debe cambiarse a UUID o la FK no funcionará.
-- Basado en `src/schemas/cliente-reparto-schema.ts`, cliente_id es string().uuid(),
-- por lo que la tabla clientes_reparto debe usar UUID para cliente_id.
-- El archivo 000_initial_schema.sql usa INTEGER para clientes_reparto.cliente_id.
-- This needs to be consistent. Assuming cliente_id in clientes_reparto table should be UUID.

-- If `clientes_reparto.cliente_id` is currently INTEGER, it needs to be changed to UUID.
-- This migration script assumes `telefono_reparto` is added to an existing structure.
-- Consistency check: The `000_initial_schema.sql` uses `cliente_id INTEGER NOT NULL REFERENCES clientes(id)`.
-- If `clientes.id` is UUID, then `clientes_reparto.cliente_id` should also be UUID.
-- For the purpose of this specific request (adding telefono_reparto), I will only add the column.
-- Broader schema consistency (INTEGER vs UUID for cliente_id FK) should be addressed if it's an issue.
-- The current provided schema for clientes_reparto uses `SERIAL` for its `id`, and `INTEGER` for `cliente_id`.
-- The `clientes` table uses `UUID` for its `id`. This is a mismatch for the Foreign Key.
-- I will assume that the user intends `clientes_reparto.cliente_id` to be compatible with `clientes.id` (UUID).
-- The previous SQL script `000_initial_schema.sql` should be:
-- CREATE TABLE clientes_reparto (
--     id SERIAL PRIMARY KEY,
--     cliente_id UUID NOT NULL REFERENCES clientes(id), -- Changed to UUID
--     nombre_reparto VARCHAR NOT NULL,
--     direccion_reparto TEXT,
--     rango_horario VARCHAR,
--     tarifa DECIMAL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP
-- );
-- And then this migration adds telefono_reparto.
