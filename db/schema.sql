-- Script para crear la tabla clientes
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Script para crear la tabla repartidores
CREATE TABLE repartidores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    identificacion TEXT UNIQUE,
    telefono TEXT,
    vehiculo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Script para crear la tabla clientes_reparto
CREATE TABLE clientes_reparto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR UNIQUE NOT NULL,
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL, -- Asegura que si se borra un cliente, se borran sus registros de reparto
    nombre_reparto VARCHAR,
    direccion_reparto TEXT,
    tarifa DECIMAL,
    rango_horario VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Opcional: Trigger para actualizar automáticamente updated_at en las tablas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clientes_updated_at
BEFORE UPDATE ON clientes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repartidores_updated_at
BEFORE UPDATE ON repartidores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_reparto_updated_at
BEFORE UPDATE ON clientes_reparto
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos clientes de ejemplo si la tabla está vacía
-- INSERT INTO clientes (id, nombre, direccion, telefono, email)
-- SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cliente Alfa', 'Calle Falsa 123, Ciudad A', '+111111111', 'alfa@example.com'
-- WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- INSERT INTO clientes (id, nombre, direccion, telefono, email)
-- SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Cliente Beta', 'Avenida Siempre Viva 742, Ciudad B', '+222222222', 'beta@example.com'
-- WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12');

-- INSERT INTO clientes (id, nombre, direccion, telefono, email)
-- SELECT '3c8a7d4a-6f3e-4b2c-9d71-8a4f9e0c1b2a', 'Cliente Gamma', 'Plaza Mayor 1, Ciudad C', '+333333333', 'gamma@example.com'
-- WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE id = '3c8a7d4a-6f3e-4b2c-9d71-8a4f9e0c1b2a');

-- INSERT INTO clientes (id, nombre, direccion, telefono, email)
-- SELECT 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Cliente Delta', 'Camino Largo s/n, Ciudad D', '+444444444', 'delta@example.com'
-- WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479');


-- Insertar algunos repartidores de ejemplo si la tabla está vacía
-- INSERT INTO repartidores (nombre, identificacion, telefono, vehiculo)
-- SELECT 'Juan Perez', '12345678A', '+5491123456789', 'Moto Honda Wave'
-- WHERE NOT EXISTS (SELECT 1 FROM repartidores WHERE identificacion = '12345678A');

-- INSERT INTO repartidores (nombre, identificacion, telefono, vehiculo)
-- SELECT 'Maria Gomez', '87654321B', '+5491198765432', 'Bicicleta Mountain Bike'
-- WHERE NOT EXISTS (SELECT 1 FROM repartidores WHERE identificacion = '87654321B');
