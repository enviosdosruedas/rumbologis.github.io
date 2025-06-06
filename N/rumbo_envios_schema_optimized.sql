
-- Script para Optimizar y Recrear la Base de Datos de Rumbo Envíos

-- Parte 1: Eliminación de tablas existentes (para recreación limpia)
-- Asegúrate de que el orden sea correcto para evitar errores de dependencia.
DROP TABLE IF EXISTS public.reparto_cliente_reparto;
DROP TABLE IF EXISTS public.clientes_reparto;
DROP TABLE IF EXISTS public.repartos;
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS public.repartidores;
DROP TABLE IF EXISTS public.clientes;

-- Habilitar la extensión pgcrypto si no está habilitada (necesaria para gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Parte 2: Creación de las tablas optimizadas

-- Tabla para los clientes principales de Rumbo Envíos
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Usar gen_random_uuid() para generar UUIDs
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    correo_electronico VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE public.clientes IS 'Tabla para almacenar los clientes principales de Rumbo Envíos.';
COMMENT ON COLUMN public.clientes.updated_at IS 'Timestamp de la última actualización del cliente.';

-- Tabla para los repartidores de Rumbo Envíos
CREATE TABLE public.repartidores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    identificacion VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(50),
    vehiculo_asignado VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE public.repartidores IS 'Tabla para almacenar la información de los repartidores.';
COMMENT ON COLUMN public.repartidores.updated_at IS 'Timestamp de la última actualización del repartidor.';

-- Tabla para los usuarios del sistema (incluyendo repartidores y administradores)
CREATE TABLE public.usuarios (
    codigo SERIAL PRIMARY KEY, -- Identificador único del usuario
    nombre VARCHAR(100) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL, -- Se debe almacenar el hash de la contraseña
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'repartidor')),
    repartidor_id UUID UNIQUE REFERENCES public.repartidores(id) ON DELETE SET NULL, -- FK opcional a repartidores.id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE public.usuarios IS 'Tabla para la autenticación y roles de usuarios del sistema.';
COMMENT ON COLUMN public.usuarios.repartidor_id IS 'Enlace al perfil del repartidor si el rol es repartidor.';
COMMENT ON COLUMN public.usuarios.updated_at IS 'Timestamp de la última actualización del usuario.';

-- Tabla para los puntos de entrega específicos de un cliente principal (clientes_reparto)
CREATE TABLE public.clientes_reparto (
    id SERIAL PRIMARY KEY,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE, -- Clave foránea a clientes
    nombre_reparto VARCHAR(255) NOT NULL,
    direccion_reparto TEXT,
    telefono_reparto VARCHAR(50), -- Columna agregada para el teléfono del cliente de reparto
    rango_horario VARCHAR(255),
    tarifa DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE public.clientes_reparto IS 'Puntos de entrega específicos o sucursales de un cliente principal.';
COMMENT ON COLUMN public.clientes_reparto.updated_at IS 'Timestamp de la última actualización del cliente de reparto.';


-- Tabla para los repartos programados
CREATE TABLE public.repartos (
    id SERIAL PRIMARY KEY,
    fecha_reparto DATE NOT NULL,
    repartidor_id UUID NOT NULL REFERENCES public.repartidores(id) ON DELETE RESTRICT, -- Evitar eliminar repartidores con repartos asignados
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    observaciones TEXT,
    estado VARCHAR(50) NOT NULL DEFAULT 'Asignado' CHECK (estado IN ('Asignado', 'En Curso', 'Completo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE public.repartos IS 'Tabla para programar y gestionar los repartos diarios.';
COMMENT ON COLUMN public.repartos.updated_at IS 'Timestamp de la última actualización del reparto.';

-- Tabla de unión para la relación muchos a muchos entre repartos y clientes_reparto
CREATE TABLE public.reparto_cliente_reparto (
    reparto_id INTEGER NOT NULL REFERENCES public.repartos(id) ON DELETE CASCADE,
    cliente_reparto_id INTEGER NOT NULL REFERENCES public.clientes_reparto(id) ON DELETE CASCADE,
    PRIMARY KEY (reparto_id, cliente_reparto_id)
);
COMMENT ON TABLE public.reparto_cliente_reparto IS 'Tabla de unión para asociar múltiples clientes de reparto a un reparto.';

-- Parte 3: Ejemplos de inserción de datos (para pruebas)

-- Inserción en clientes
INSERT INTO public.clientes (id, nombre, direccion, telefono, correo_electronico) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Cliente Mayorista A', 'Calle Falsa 123, Ciudad Capital', '1122334455', 'contacto@clientea.com'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'Comercio B', 'Avenida Siempre Viva 742, Springfield', '0303456', 'info@comerciob.com'),
('c1d2e3f4-a5b6-1234-cdef-0123456789ab', 'Andapez', 'Av. Luro 3322', '2235000001', 'andapez@example.com'),
('d1e2f3a4-b5c6-7890-def0-1234567890bc', 'Hierro Metal', 'Independencia 2550', '2235000002', 'hierrometal@example.com'),
('e1f2a3b4-c5d6-8901-ef01-2345678901cd', 'Drogueria Azcuenaga', 'Formosa 1221', '2235000003', 'drogazcuenaga@example.com'),
('f1a2b3c4-d5e6-9012-f012-3456789012de', 'Wanchese', '12 de Octubre 3333', '2235000004', 'wanchese@example.com'),
('a2b3c4d5-e6f7-0123-0123-456789abcdef', 'Noelia Lescar', 'Av. Libertad 5050', '2235000005', 'noelescar@example.com'),
('b3c4d5e6-f7a8-1234-1234-56789abcdef0', 'Ezequiel Donsion', 'Castelli 2201', '2236846708', 'ezequieldonsion@example.com'),
('c4d5e6f7-a8b9-2345-2345-6789abcdef12', 'Garcia, Ruiz y Cardoso', 'San Martin 2888', '2235000006', 'grc@example.com'),
('d5e6f7a8-b9ca-3456-3456-789abcdef234', 'Silvina Doval', 'Rivadavia 3030', '2235000007', 'silvinadoval@example.com'),
('e6f7a8b9-cad0-4567-4567-89abcdef3456', 'Juan Manuel Salas', 'Belgrano 2211', '2235000008', 'jmsalas@example.com'),
('f7a8b9ca-d0e1-5678-5678-9abcdef45678', 'Sergio Bejanele', 'Moreno 3500', '2235000009', 'sergiobejanele@example.com'),
('a8b9cad0-e1f2-6789-6789-abcdef567890', 'Simini y Alonso', 'Peatonal 2050', '2235000010', 'siminiyalonso@example.com');

-- Inserción en repartidores
INSERT INTO public.repartidores (id, nombre, identificacion, telefono, vehiculo_asignado) VALUES
('37804e1f-8047-49f2-bb2e-7c91a7c32b92', 'Carlos Rodriguez', 'DNI25123456', '2235111222', 'Moto Honda Wave Patente AA123BB'),
('e87b1e04-b4bb-40ed-b1ce-3b9623f7eab4', 'Laura Gómez', 'DNI30987654', '2236333444', 'Auto Fiat Cronos Patente AD456CC');

-- Inserción en usuarios
-- Nota: Las contraseñas deben ser hashes generados por la aplicación (ej: bcrypt)
-- Para este ejemplo, se usa '1234' como placeholder, pero NO ES SEGURO.
INSERT INTO public.usuarios (codigo, nombre, pass, rol, repartidor_id) VALUES
(1, 'admin', '1234', 'admin', NULL), -- Contraseña '1234' (Debería ser hash)
(2, 'repartidor1', '1234', 'repartidor', '37804e1f-8047-49f2-bb2e-7c91a7c32b92'), -- Contraseña '1234' (Debería ser hash)
(3, 'repartidor2', '1234', 'repartidor', 'e87b1e04-b4bb-40ed-b1ce-3b9623f7eab4'); -- Contraseña '1234' (Debería ser hash)


-- Inserción en clientes_reparto
INSERT INTO public.clientes_reparto (cliente_id, nombre_reparto, direccion_reparto, telefono_reparto, rango_horario, tarifa) VALUES
('c1d2e3f4-a5b6-1234-cdef-0123456789ab', 'Andapez - Vertiz', 'Vertiz 3250 porton gris', '2235000001', 'L-V 9-17hs', 100.00),
('d1e2f3a4-b5c6-7890-def0-1234567890bc', 'Hierro Metal - Solis', 'Solis 4565', '2235000002', 'L-V 8-16hs', 120.50),
('e1f2a3b4-c5d6-8901-ef01-2345678901cd', 'Drogueria Azcuenaga - Juramento', 'Juramento 46 (bolsa)', '2235000003', 'L-V 10-18hs', 90.00),
('f1a2b3c4-d5e6-9012-f012-3456789012de', 'Wanchese - JB Justo', 'Juan B Justo 50 ENCARGADO', '2235000004', 'L-S 9-13hs', 110.00),
('a2b3c4d5-e6f7-0123-0123-456789abcdef', 'Noelia Lescar - Ortiz', 'Ortiz de Zarate 801', '2235000005', 'L-V 14-18hs', 80.75),
('b3c4d5e6-f7a8-1234-1234-56789abcdef0', 'Ezequiel Donsion - Azopardo', 'Azopardo 3455 Chiarmar Llamar 2236846708', '2236846708', 'L-V 9-12 y 15-18hs', 150.00),
('c4d5e6f7-a8b9-2345-2345-6789abcdef12', 'Garcia, Ruiz y Cardoso - Laprida', 'Laprida 4650 Plantel', '2235000006', 'L-V 9-17hs', 130.20),
('d5e6f7a8-b9ca-3456-3456-789abcdef234', 'Silvina Doval - Polonia', 'Polonia 607 Oficina', '2235000007', 'L-V 10-15hs', 95.00),
('e6f7a8b9-cad0-4567-4567-89abcdef3456', 'Juan Manuel Salas - Solis', 'Solis 8151 porton verde', '2235000008', 'L-S 8-14hs', 115.50),
('f7a8b9ca-d0e1-5678-5678-9abcdef45678', 'Sergio Bejanele - Namuncura', 'Namuncura 267', '2235000009', 'L-V 9-18hs', 105.00),
('a8b9cad0-e1f2-6789-6789-abcdef567890', 'Simini y Alonso - JB Justo Facultad', 'Juan B Justo 4302 FACULTAD INGENIERIA', '2235000010', 'L-V 8-12hs', 70.00);

-- Inserción en repartos (con IDs reales de la tabla clientes_reparto después de su inserción)
-- Supongamos que los IDs generados para clientes_reparto son 1, 2, 3, ... 11
INSERT INTO public.repartos (fecha_reparto, repartidor_id, cliente_id, observaciones, estado) VALUES
(CURRENT_DATE, '37804e1f-8047-49f2-bb2e-7c91a7c32b92', 'c1d2e3f4-a5b6-1234-cdef-0123456789ab', 'Entregar a recepción de Andapez.', 'Asignado'), -- Reparto 1
(CURRENT_DATE, 'e87b1e04-b4bb-40ed-b1ce-3b9623f7eab4', 'd1e2f3a4-b5c6-7890-def0-1234567890bc', 'Dejar en portería si no hay nadie.', 'En Curso'), -- Reparto 2
(CURRENT_DATE - INTERVAL '1 day', '37804e1f-8047-49f2-bb2e-7c91a7c32b92', 'e1f2a3b4-c5d6-8901-ef01-2345678901cd', 'Entregado OK.', 'Completo'); -- Reparto 3

-- Inserción en reparto_cliente_reparto
-- Asumiendo que los IDs de repartos son 1, 2, 3 y los de clientes_reparto son 1, 2, 3
INSERT INTO public.reparto_cliente_reparto (reparto_id, cliente_reparto_id) VALUES
(1, 1), -- Reparto 1 (Andapez) -> Andapez - Vertiz (ID 1 de clientes_reparto)
(2, 2), -- Reparto 2 (Hierro Metal) -> Hierro Metal - Solis (ID 2 de clientes_reparto)
(3, 3); -- Reparto 3 (Drogueria Azcuenaga) -> Drogueria Azcuenaga - Juramento (ID 3 de clientes_reparto)


-- Actualizar secuencias para las tablas con SERIAL PKs después de inserciones manuales si es necesario
SELECT setval(pg_get_serial_sequence('public.usuarios', 'codigo'), COALESCE(MAX(codigo), 1), MAX(codigo) IS NOT NULL) FROM public.usuarios;
SELECT setval(pg_get_serial_sequence('public.clientes_reparto', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM public.clientes_reparto;
SELECT setval(pg_get_serial_sequence('public.repartos', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM public.repartos;
```