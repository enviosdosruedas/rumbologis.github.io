-- No changes are strictly necessary for the "clientes" table for this specific request,
-- as it already has a UUID primary key (id) suitable for the foreign key relationship.
-- The foreign key constraint will be defined in the "clientes_reparto" table.

-- Ensure the uuid-ossp extension is available if not already.
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the "clientes_reparto" table
CREATE TABLE clientes_reparto (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(255) UNIQUE NOT NULL,
    cliente_id UUID NOT NULL,
    nombre_reparto VARCHAR(255),
    direccion_reparto TEXT,
    tarifa DECIMAL(10, 2), -- Example: Supports values up to 99,999,999.99
    rango_horario VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cliente
        FOREIGN KEY(cliente_id)
        REFERENCES clientes(id)
        ON DELETE CASCADE -- If a client is deleted, their reparto configurations are also deleted.
                         -- Consider ON DELETE SET NULL or ON DELETE RESTRICT based on requirements.
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_clientes_reparto_codigo ON clientes_reparto(codigo);
CREATE INDEX idx_clientes_reparto_cliente_id ON clientes_reparto(cliente_id);

-- Optional: Create a trigger function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Optional: Create a trigger that calls the function before any update on the clientes_reparto table
CREATE TRIGGER update_clientes_reparto_modtime
BEFORE UPDATE ON clientes_reparto
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add comments for clarity on table and columns
COMMENT ON TABLE clientes_reparto IS 'Stores specific delivery configurations for clients.';

COMMENT ON COLUMN clientes_reparto.id IS 'Identificador único del registro de reparto (autoincremental).';
COMMENT ON COLUMN clientes_reparto.codigo IS 'Código único para esta configuración de reparto.';
COMMENT ON COLUMN clientes_reparto.cliente_id IS 'Referencia al ID del cliente en la tabla "clientes".';
COMMENT ON COLUMN clientes_reparto.nombre_reparto IS 'Nombre o referencia específica para esta configuración de reparto (e.g., "Oficina Principal", "Almacén Sur").';
COMMENT ON COLUMN clientes_reparto.direccion_reparto IS 'Dirección específica para los repartos de esta configuración.';
COMMENT ON COLUMN clientes_reparto.tarifa IS 'Tarifa asociada a los repartos para esta configuración específica.';
COMMENT ON COLUMN clientes_reparto.rango_horario IS 'Rango horario preferido para los repartos (e.g., "Lunes a Viernes 9:00-12:00").';
COMMENT ON COLUMN clientes_reparto.created_at IS 'Fecha y hora de creación del registro.';
COMMENT ON COLUMN clientes_reparto.updated_at IS 'Fecha y hora de la última actualización del registro.';
