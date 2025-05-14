
-- Eliminar tablas existentes en orden inverso de dependencia para evitar errores
DROP TABLE IF EXISTS reparto_cliente_reparto;
DROP TABLE IF EXISTS repartos;
DROP TABLE IF EXISTS clientes_reparto;
DROP TABLE IF EXISTS repartidores;
DROP TABLE IF EXISTS clientes;

-- Crear la tabla "clientes"
-- Almacena información sobre los clientes principales de Rumbo Envíos.
CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Identificador único del cliente
    nombre TEXT NOT NULL, -- Nombre del cliente (obligatorio)
    direccion TEXT, -- Dirección del cliente
    telefono TEXT, -- Número de teléfono del cliente
    email TEXT, -- Dirección de correo electrónico del cliente
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de creación del registro
    updated_at TIMESTAMP WITH TIME ZONE -- Fecha y hora de la última actualización del registro
);

-- Crear la tabla "repartidores"
-- Almacena información sobre los repartidores que trabajan para Rumbo Envíos.
CREATE TABLE repartidores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Identificador único del repartidor
    nombre TEXT NOT NULL, -- Nombre del repartidor (obligatorio)
    identificacion TEXT UNIQUE, -- Número de identificación del repartidor (único)
    telefono TEXT, -- Número de teléfono del repartidor
    vehiculo_asignado TEXT, -- Vehículo asignado al repartidor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de creación del registro
    updated_at TIMESTAMP WITH TIME ZONE -- Fecha y hora de la última actualización del registro
);

-- Crear la tabla "clientes_reparto"
-- Almacena información específica de las sucursales o puntos de entrega de los clientes principales.
CREATE TABLE clientes_reparto (
    id SERIAL PRIMARY KEY, -- Identificador único de la configuración de reparto del cliente (autoincremental)
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE, -- ID del cliente principal al que pertenece esta configuración (clave foránea)
    nombre_reparto VARCHAR(255) NOT NULL, -- Nombre o referencia para esta configuración de reparto (obligatorio)
    direccion_reparto TEXT, -- Dirección específica para los repartos
    telefono_reparto VARCHAR(50), -- Teléfono de contacto para este punto de reparto
    rango_horario VARCHAR(255), -- Rango de horas preferido para los repartos
    tarifa NUMERIC(10, 2), -- Tarifa asociada a los repartos para esta configuración
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de creación del registro
    updated_at TIMESTAMP WITH TIME ZONE -- Fecha y hora de la última actualización del registro
);

-- Crear la tabla "repartos"
-- Almacena información sobre los repartos programados.
CREATE TABLE repartos (
    id SERIAL PRIMARY KEY, -- Identificador único del reparto (autoincremental)
    fecha_reparto DATE NOT NULL, -- Fecha en la que se realizará el reparto (obligatorio)
    repartidor_id UUID NOT NULL REFERENCES repartidores(id) ON DELETE RESTRICT, -- ID del repartidor asignado (clave foránea)
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT, -- ID del cliente principal para el que es el reparto (clave foránea)
    observaciones TEXT, -- Observaciones adicionales sobre el reparto
    estado VARCHAR(50) DEFAULT 'Asignado' NOT NULL CHECK (estado IN ('Asignado', 'En Curso', 'Completo', 'Cancelado')), -- Estado actual del reparto
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de creación del registro
    updated_at TIMESTAMP WITH TIME ZONE -- Fecha y hora de la última actualización del registro
);

-- Crear la tabla "reparto_cliente_reparto" (Tabla de Unión)
-- Relaciona los repartos con los múltiples clientes de reparto (sucursales) que se visitarán en ese reparto.
CREATE TABLE reparto_cliente_reparto (
    reparto_id INTEGER NOT NULL REFERENCES repartos(id) ON DELETE CASCADE, -- ID del reparto (clave foránea)
    cliente_reparto_id INTEGER NOT NULL REFERENCES clientes_reparto(id) ON DELETE CASCADE, -- ID del cliente de reparto (sucursal) (clave foránea)
    PRIMARY KEY (reparto_id, cliente_reparto_id) -- Clave primaria compuesta para asegurar unicidad de la relación
);

-- Índices para mejorar el rendimiento de las búsquedas en claves foráneas
CREATE INDEX idx_clientes_reparto_cliente_id ON clientes_reparto(cliente_id);
CREATE INDEX idx_repartos_repartidor_id ON repartos(repartidor_id);
CREATE INDEX idx_repartos_cliente_id ON repartos(cliente_id);
CREATE INDEX idx_repartos_fecha_reparto ON repartos(fecha_reparto);
CREATE INDEX idx_reparto_cliente_reparto_reparto_id ON reparto_cliente_reparto(reparto_id);
CREATE INDEX idx_reparto_cliente_reparto_cliente_reparto_id ON reparto_cliente_reparto(cliente_reparto_id);

-- Comentarios adicionales
COMMENT ON TABLE clientes IS 'Almacena información sobre los clientes principales que contratan los servicios de Rumbo Envíos.';
COMMENT ON COLUMN clientes.id IS 'Identificador único UUID del cliente.';
COMMENT ON COLUMN clientes.nombre IS 'Nombre comercial o legal del cliente.';

COMMENT ON TABLE repartidores IS 'Contiene los datos de los repartidores de Rumbo Envíos.';
COMMENT ON COLUMN repartidores.id IS 'Identificador único UUID del repartidor.';
COMMENT ON COLUMN repartidores.identificacion IS 'Número de identificación fiscal o personal del repartidor, debe ser único.';

COMMENT ON TABLE clientes_reparto IS 'Detalla las diferentes direcciones o puntos de entrega específicos para cada cliente principal.';
COMMENT ON COLUMN clientes_reparto.id IS 'Identificador numérico autoincremental del punto de reparto.';
COMMENT ON COLUMN clientes_reparto.cliente_id IS 'Referencia al cliente principal dueño de este punto de reparto.';
COMMENT ON COLUMN clientes_reparto.nombre_reparto IS 'Nombre descriptivo del punto de reparto (Ej: Sucursal Centro).';

COMMENT ON TABLE repartos IS 'Registra cada uno de los servicios de reparto programados.';
COMMENT ON COLUMN repartos.id IS 'Identificador numérico autoincremental del reparto.';
COMMENT ON COLUMN repartos.fecha_reparto IS 'Fecha programada para el reparto.';
COMMENT ON COLUMN repartos.estado IS 'Estado actual del reparto: Asignado, En Curso, Completo, Cancelado.';

COMMENT ON TABLE reparto_cliente_reparto IS 'Tabla de unión para la relación muchos-a-muchos entre repartos y los puntos de entrega (clientes_reparto).';
COMMENT ON COLUMN reparto_cliente_reparto.reparto_id IS 'Referencia al reparto.';
COMMENT ON COLUMN reparto_cliente_reparto.cliente_reparto_id IS 'Referencia al punto de entrega específico incluido en el reparto.';

-- Ejemplo de función para actualizar automáticamente 'updated_at' (opcional, Supabase podría tener manejadores automáticos o se puede manejar en la app)
-- CREATE OR REPLACE FUNCTION trigger_set_timestamp()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- Ejemplo de cómo aplicar el trigger a una tabla (descomentar y adaptar si es necesario)
-- CREATE TRIGGER set_timestamp_clientes
-- BEFORE UPDATE ON clientes
-- FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_timestamp();

-- CREATE TRIGGER set_timestamp_repartidores
-- BEFORE UPDATE ON repartidores
-- FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_timestamp();

-- CREATE TRIGGER set_timestamp_clientes_reparto
-- BEFORE UPDATE ON clientes_reparto
-- FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_timestamp();

-- CREATE TRIGGER set_timestamp_repartos
-- BEFORE UPDATE ON repartos
-- FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_timestamp();

-- Nota: Para usar uuid_generate_v4(), la extensión "uuid-ossp" debe estar habilitada en la base de datos.
-- En Supabase, esto suele estar habilitado por defecto. Si no, ejecutar:
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Asegúrate de que la extensión "uuid-ossp" esté habilitada en tu instancia de Supabase.
-- Puedes verificarlo y habilitarlo desde el dashboard de Supabase en Database > Extensions.
