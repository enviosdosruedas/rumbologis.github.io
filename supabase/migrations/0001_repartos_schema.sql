
-- Eliminar tablas existentes en orden correcto para evitar errores de dependencia (si se desea recrear)
-- Asegúrate de que esto sea lo que quieres antes de ejecutarlo en una base de datos con datos importantes.
-- DROP TABLE IF EXISTS reparto_cliente_reparto;
-- DROP TABLE IF EXISTS repartos;
-- DROP TABLE IF EXISTS clientes_reparto; -- Si se va a recrear desde cero también
-- DROP TABLE IF EXISTS repartidores; -- Si se va a recrear desde cero también
-- DROP TABLE IF EXISTS clientes; -- Si se va a recrear desde cero también


-- Asegurar que la extensión uuid-ossp esté habilitada si no lo está (Supabase la tiene por defecto)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla "clientes" (asumiendo que ya existe según prompts anteriores)
-- Si no existe, descomentar y ajustar.
-- CREATE TABLE IF NOT EXISTS clientes (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     nombre VARCHAR NOT NULL,
--     direccion TEXT,
--     telefono VARCHAR,
--     correo_electronico VARCHAR,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP
-- );

-- Tabla "repartidores" (asumiendo que ya existe según prompts anteriores)
-- Si no existe, descomentar y ajustar.
-- CREATE TABLE IF NOT EXISTS repartidores (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     nombre VARCHAR NOT NULL,
--     identificacion VARCHAR UNIQUE NOT NULL,
--     telefono VARCHAR,
--     vehiculo_asignado VARCHAR,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP
-- );

-- Tabla "clientes_reparto" (asumiendo que ya existe y que cliente_id es UUID)
-- Si no existe o necesita ajuste, descomentar y modificar.
-- Asegúrate de que clientes_reparto.cliente_id sea UUID si clientes.id es UUID.
-- DROP TABLE IF EXISTS clientes_reparto; 
-- CREATE TABLE IF NOT EXISTS clientes_reparto (
--     id SERIAL PRIMARY KEY,
--     cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE, -- Asegurar que cliente_id sea UUID
--     nombre_reparto VARCHAR NOT NULL,
--     direccion_reparto TEXT,
--     telefono_reparto VARCHAR, -- Agregado en prompts recientes
--     rango_horario VARCHAR,
--     tarifa DECIMAL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP
-- );


-- Nueva tabla "repartos"
CREATE TABLE IF NOT EXISTS repartos (
    id SERIAL PRIMARY KEY,
    fecha_reparto DATE NOT NULL,
    repartidor_id UUID NOT NULL REFERENCES repartidores(id) ON DELETE SET NULL, -- o ON DELETE CASCADE si se prefiere
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
COMMENT ON TABLE repartos IS 'Almacena la información de cada reparto planificado.';
COMMENT ON COLUMN repartos.id IS 'Identificador único del reparto.';
COMMENT ON COLUMN repartos.fecha_reparto IS 'Fecha en la que se realiza el reparto.';
COMMENT ON COLUMN repartos.repartidor_id IS 'ID del repartidor asignado (referencia a la tabla repartidores).';
COMMENT ON COLUMN repartos.cliente_id IS 'ID del cliente principal para este reparto (referencia a la tabla clientes).';
COMMENT ON COLUMN repartos.observaciones IS 'Notas o comentarios adicionales sobre el reparto.';


-- Nueva tabla "reparto_cliente_reparto" (tabla de unión)
CREATE TABLE IF NOT EXISTS reparto_cliente_reparto (
    reparto_id INTEGER NOT NULL REFERENCES repartos(id) ON DELETE CASCADE,
    cliente_reparto_id INTEGER NOT NULL REFERENCES clientes_reparto(id) ON DELETE CASCADE,
    PRIMARY KEY (reparto_id, cliente_reparto_id)
);
COMMENT ON TABLE reparto_cliente_reparto IS 'Tabla de unión para la relación muchos a muchos entre repartos y clientes_reparto.';
COMMENT ON COLUMN reparto_cliente_reparto.reparto_id IS 'ID del reparto (referencia a la tabla repartos).';
COMMENT ON COLUMN reparto_cliente_reparto.cliente_reparto_id IS 'ID del cliente de reparto específico (referencia a la tabla clientes_reparto).';


-- Inserts de ejemplo (asegúrate que los UUIDs y IDs referenciados existan)

-- Asumimos que ya existen clientes y repartidores con los siguientes UUIDs.
-- Si no es así, crea estos registros primero o ajusta los UUIDs.
-- Ejemplo Cliente 1 (UUID debe existir en tabla 'clientes')
-- INSERT INTO clientes (id, nombre, direccion, telefono, correo_electronico) 
-- VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Cliente Principal Alfa', 'Calle Alfa 123', '555-0101', 'alfa@example.com') ON CONFLICT (id) DO NOTHING;

-- Ejemplo Cliente 2 (UUID debe existir en tabla 'clientes')
-- INSERT INTO clientes (id, nombre, direccion, telefono, correo_electronico) 
-- VALUES ('b2c3d4e5-f6a7-8901-2345-67890abcfedc', 'Cliente Principal Beta', 'Avenida Beta 456', '555-0202', 'beta@example.com') ON CONFLICT (id) DO NOTHING;

-- Ejemplo Repartidor 1 (UUID debe existir en tabla 'repartidores')
-- INSERT INTO repartidores (id, nombre, identificacion, telefono, vehiculo_asignado) 
-- VALUES ('c1d2e3f4-a5b6-c7d8-e9f0-123456abcdef', 'Repartidor Uno', 'ID-001', '555-0011', 'Moto R1') ON CONFLICT (id) DO NOTHING;

-- Ejemplo Repartidor 2 (UUID debe existir en tabla 'repartidores')
-- INSERT INTO repartidores (id, nombre, identificacion, telefono, vehiculo_asignado) 
-- VALUES ('d2e3f4a5-b6c7-d8e9-f0a1-234567bcdef0', 'Repartidora Dos', 'ID-002', '555-0022', 'Auto R2') ON CONFLICT (id) DO NOTHING;


-- Ejemplo Clientes Reparto (asumiendo que cliente_id 'a1b2c3d4-e5f6-7890-1234-567890abcdef' y 'b2c3d4e5-f6a7-8901-2345-67890abcfedc' existen)
-- INSERT INTO clientes_reparto (cliente_id, nombre_reparto, direccion_reparto, telefono_reparto, rango_horario, tarifa) VALUES 
-- ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Sucursal Centro Alfa', 'Centro 1', '555-1111', '9-12hs', 10.50) RETURNING id; -- id = 1 (ejemplo)
-- INSERT INTO clientes_reparto (cliente_id, nombre_reparto, direccion_reparto, telefono_reparto, rango_horario, tarifa) VALUES 
-- ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Sucursal Norte Alfa', 'Norte 2', '555-2222', '14-17hs', 12.00) RETURNING id; -- id = 2 (ejemplo)
-- INSERT INTO clientes_reparto (cliente_id, nombre_reparto, direccion_reparto, telefono_reparto, rango_horario, tarifa) VALUES 
-- ('b2c3d4e5-f6a7-8901-2345-67890abcfedc', 'Deposito Beta', 'Industrial 5', '555-3333', '10-18hs', 15.75) RETURNING id; -- id = 3 (ejemplo)
-- INSERT INTO clientes_reparto (cliente_id, nombre_reparto, direccion_reparto, telefono_reparto, rango_horario, tarifa) VALUES 
-- ('b2c3d4e5-f6a7-8901-2345-67890abcfedc', 'Oficina Beta', 'Comercial 7', '555-4444', '9-17hs', 11.20) RETURNING id; -- id = 4 (ejemplo)


-- Ejemplo Repartos (asumiendo que los IDs de repartidor y cliente existen)
-- INSERT INTO repartos (fecha_reparto, repartidor_id, cliente_id, observaciones) VALUES
-- (CURRENT_DATE, 'c1d2e3f4-a5b6-c7d8-e9f0-123456abcdef', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Primer reparto para Cliente Alfa.') RETURNING id; -- id = 1 (ejemplo)
-- INSERT INTO repartos (fecha_reparto, repartidor_id, cliente_id, observaciones) VALUES
-- (CURRENT_DATE + INTERVAL '1 day', 'd2e3f4a5-b6c7-d8e9-f0a1-234567bcdef0', 'b2c3d4e5-f6a7-8901-2345-67890abcfedc', 'Reparto para Cliente Beta, verificar horario.') RETURNING id; -- id = 2 (ejemplo)


-- Ejemplo Reparto Cliente Reparto (asumiendo que los IDs de reparto y cliente_reparto existen y corresponden a los ejemplos anteriores)
-- Para Reparto 1 (ID=1), asignamos Cliente Reparto 1 (ID=1) y Cliente Reparto 2 (ID=2)
-- INSERT INTO reparto_cliente_reparto (reparto_id, cliente_reparto_id) VALUES
-- (1, 1), -- Reparto 1 -> Sucursal Centro Alfa
-- (1, 2); -- Reparto 1 -> Sucursal Norte Alfa

-- Para Reparto 2 (ID=2), asignamos Cliente Reparto 3 (ID=3)
-- INSERT INTO reparto_cliente_reparto (reparto_id, cliente_reparto_id) VALUES
-- (2, 3); -- Reparto 2 -> Deposito Beta
-- (2, 4); -- Reparto 2 -> Oficina Beta


-- Para verificar, puedes usar:
-- SELECT * FROM clientes;
-- SELECT * FROM repartidores;
-- SELECT * FROM clientes_reparto;
-- SELECT * FROM repartos;
-- SELECT * FROM reparto_cliente_reparto;

-- SELECT 
--     r.id as reparto_id,
--     r.fecha_reparto,
--     rp.nombre as repartidor_nombre,
--     c.nombre as cliente_principal_nombre,
--     r.observaciones,
--     (SELECT COUNT(*) FROM reparto_cliente_reparto rcr WHERE rcr.reparto_id = r.id) as cantidad_clientes_reparto,
--     array_agg(cr.nombre_reparto) as clientes_reparto_asignados
-- FROM repartos r
-- JOIN repartidores rp ON r.repartidor_id = rp.id
-- JOIN clientes c ON r.cliente_id = c.id
-- LEFT JOIN reparto_cliente_reparto rcr_join ON r.id = rcr_join.reparto_id
-- LEFT JOIN clientes_reparto cr ON rcr_join.cliente_reparto_id = cr.id
-- GROUP BY r.id, rp.nombre, c.nombre
-- ORDER BY r.fecha_reparto, r.id;

