-- Script to optimize the 'clientes_reparto' table for Rumbo Envíos

-- Drop the existing 'clientes_reparto' table if it exists to apply the new structure.
DROP TABLE IF EXISTS clientes_reparto;

-- Create the 'clientes_reparto' table
-- This table stores specific delivery configurations for each client.
CREATE TABLE clientes_reparto (
    -- id: Unique identifier for the client-delivery configuration record.
    -- Auto-incrementing integer, starting from 1.
    id SERIAL PRIMARY KEY,

    -- cliente_id: Foreign key referencing the 'id' in the 'clientes' table.
    -- Links this delivery configuration to a specific client.
    -- Changed to UUID to match the data type of clientes.id. It cannot be INTEGER if clientes.id is UUID.
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

    -- nombre_reparto: Specific name or identifier for this delivery configuration.
    -- Example: "Entrega Oficina Principal", "Sucursal Centro".
    nombre_reparto VARCHAR(255) NOT NULL,

    -- direccion_reparto: The specific delivery address for this configuration.
    direccion_reparto TEXT,

    -- rango_horario: Preferred delivery time window.
    -- Example: "Lunes a Viernes 9:00-12:00", "Sábados 10:00-14:00".
    rango_horario VARCHAR(255),

    -- tarifa: Specific delivery fee for this configuration.
    tarifa DECIMAL(10, 2), -- Assuming a decimal for currency, e.g., 123.45

    -- created_at: Timestamp of when the record was created.
    -- Defaults to the current timestamp.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- updated_at: Timestamp of the last update to the record.
    -- This can be managed by triggers or application logic.
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Comments on table 'clientes' (structure remains unchanged as per requirements)
-- TABLE clientes: Stores information about the companies using Rumbo Envíos services.
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(): Unique client identifier.
--   nombre TEXT NOT NULL: Name of the client company.
--   direccion TEXT: Address of the client company.
--   telefono TEXT: Phone number of the client company.
--   email TEXT: Email address of the client company.

-- Comments on table 'repartidores' (structure remains unchanged as per requirements)
-- TABLE repartidores: Stores information about the delivery personnel of Rumbo Envíos.
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(): Unique delivery person identifier.
--   nombre TEXT NOT NULL: Name of the delivery person.
--   identificacion TEXT UNIQUE: Identification number (e.g., DNI, CUIT) of the delivery person.
--   telefono TEXT: Phone number of the delivery person.
--   vehiculo TEXT: Vehicle assigned to the delivery person.

-- Add index for frequently queried columns in clientes_reparto
CREATE INDEX IF NOT EXISTS idx_clientes_reparto_cliente_id ON clientes_reparto(cliente_id);

-- Optional: Trigger to automatically update 'updated_at' timestamp
-- This is a common practice but needs to be created as a function and then a trigger.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clientes_reparto_updated_at
BEFORE UPDATE ON clientes_reparto
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE clientes_reparto IS 'Stores specific delivery configurations for each client, linking to the main clientes table.';
COMMENT ON COLUMN clientes_reparto.id IS 'Unique auto-incrementing identifier for the client-delivery configuration.';
COMMENT ON COLUMN clientes_reparto.cliente_id IS 'Foreign key referencing the client in the "clientes" table.';
COMMENT ON COLUMN clientes_reparto.nombre_reparto IS 'Specific name or identifier for this delivery configuration (e.g., "Entrega Oficina Principal").';
COMMENT ON COLUMN clientes_reparto.direccion_reparto IS 'The specific delivery address for this configuration.';
COMMENT ON COLUMN clientes_reparto.rango_horario IS 'Preferred delivery time window (e.g., "L-V 9-12hs").';
COMMENT ON COLUMN clientes_reparto.tarifa IS 'Specific delivery fee for this configuration.';
COMMENT ON COLUMN clientes_reparto.created_at IS 'Timestamp of when the record was created.';
COMMENT ON COLUMN clientes_reparto.updated_at IS 'Timestamp of the last update to the record.';
