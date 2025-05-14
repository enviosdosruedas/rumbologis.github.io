
-- Parte 1: Eliminación de tablas existentes (para recreación limpia)
-- Elimina las tablas existentes (si existen) en el orden correcto para evitar errores de dependencia:
DROP TABLE IF EXISTS clientes_reparto;
DROP TABLE IF EXISTS repartidores;
DROP TABLE IF EXISTS clientes;

-- Parte 2: Creación de las tablas optimizadas
-- Crea la tabla "clientes":
CREATE TABLE clientes (
    id UUID PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    direccion TEXT,
    telefono VARCHAR,
    correo_electronico VARCHAR, -- Consistent with user's SQL DDL
    --  Puedes agregar otras columnas si es necesario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Crea la tabla "repartidores":
CREATE TABLE repartidores (
    id UUID PRIMARY KEY,
    nombre VARCHAR NOT NULL,
    identificacion VARCHAR UNIQUE NOT NULL,
    telefono VARCHAR,
    vehiculo_asignado VARCHAR, -- Consistent with user's SQL DDL
    --   Puedes agregar otras columnas si es necesario
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Crea la tabla "clientes_reparto" (Optimización Crítica):
CREATE TABLE clientes_reparto (
    id SERIAL PRIMARY KEY,
    -- Nota importante: La columna cliente_id es una clave foránea que referencia la columna id de la tabla clientes.
    -- Corregido: cliente_id debe ser UUID para coincidir con el tipo de clientes.id
    cliente_id UUID NOT NULL REFERENCES clientes(id),
    nombre_reparto VARCHAR NOT NULL, -- Consistent with user's SQL DDL
    direccion_reparto TEXT, -- Consistent with user's SQL DDL
    rango_horario VARCHAR, -- Consistent with user's SQL DDL
    tarifa DECIMAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Parte 3: Ejemplos de inserción de datos (para pruebas)
-- Inserta ejemplos en la tabla "clientes":
INSERT INTO clientes (id, nombre, direccion, telefono, correo_electronico) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Empresa A', 'Calle 123, Ciudad', '123-456-7890', 'empresaA@email.com'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'Empresa B', 'Avenida XYZ, Pueblo', '987-654-3210', 'empresaB@email.com');

-- Inserta ejemplos en la tabla "repartidores":
INSERT INTO repartidores (id, nombre, identificacion, telefono, vehiculo_asignado) VALUES
('c3d4e5f6-a7b8-9012-3456-7890abcdef2', 'Juan Pérez', '12345678', '555-123-4567', 'Moto XYZ-123'),
('d4e5f6a7-b8c9-0123-4567-890abcdef3', 'María García', '87654321', '555-987-6543', 'Coche ABC-456');

-- Inserta ejemplos en la tabla "clientes_reparto":
-- Nota: Los cliente_id deben coincidir con los id UUID de la tabla clientes.
INSERT INTO clientes_reparto (cliente_id, nombre_reparto, direccion_reparto, rango_horario, tarifa) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Sucursal Centro', 'Centro Comercial, Local 10', 'Lunes a Viernes 9-18', 25.50),
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'Almacén Principal', 'Polígono Industrial, Nave 5', 'Martes y Jueves 10-16', 30.00);

-- Comentarios adicionales:
-- Este script primero elimina las tablas para asegurar una recreación limpia.
-- Las tablas se crean con las columnas y tipos de datos especificados.
-- Se definen claves primarias y foráneas para mantener la integridad referencial.
-- Se incluyen ejemplos de inserción de datos para facilitar las pruebas iniciales.
-- Las columnas 'created_at' y 'updated_at' ayudan a rastrear cambios en los registros.
-- Los UUIDs deben ser únicos y generados idealmente por la aplicación o funciones de base de datos (ej. uuid_generate_v4() si la extensión está habilitada y se usa como DEFAULT).
-- Para 'correo_electronico', 'vehiculo_asignado', 'nombre_reparto', 'direccion_reparto', 'rango_horario':
-- Si la aplicación cliente ya utiliza nombres de columna diferentes (ej. 'email' en lugar de 'correo_electronico'),
-- será necesario actualizar el código de la aplicación para que coincida con estos nombres de columna de la base de datos
-- o modificar este script SQL para que use los nombres de columna existentes en la aplicación.
