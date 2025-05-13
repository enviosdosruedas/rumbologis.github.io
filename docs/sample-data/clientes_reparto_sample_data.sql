-- Asegúrate de que los UUIDs de cliente_id existan en tu tabla "clientes".
-- Puedes obtenerlos ejecutando: SELECT id, nombre FROM clientes;
-- Reemplaza los valores de cliente_id con UUIDs válidos de tu tabla clientes.

-- Ejemplo de cliente_id (reemplazar con IDs reales de tu tabla 'clientes'):
-- Supongamos que tenemos los siguientes clientes:
-- Cliente A con id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1'
-- Cliente B con id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2'

-- Insertar datos de ejemplo en la tabla clientes_reparto
-- Es importante que los UUIDs de cliente_id sean válidos y existan en la tabla 'clientes'.
-- Si tus IDs de clientes son autoincrementales (SERIAL), usa esos números.
-- Dado que el esquema actual de 'clientes' usa UUID, usaremos placeholders de UUID.
-- Por favor, reemplaza 'uuid_cliente_1' y 'uuid_cliente_2' con IDs reales de tu tabla 'clientes'.

INSERT INTO clientes_reparto (codigo, cliente_id, nombre_reparto, direccion_reparto, tarifa, rango_horario)
VALUES
    ('REP-001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Oficina Principal', 'Av. Siempreviva 742, Springfield', 150.50, 'Lunes a Viernes 9:00-18:00'),
    ('REP-002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sucursal Centro', 'Calle Falsa 123, Centro', 120.00, 'Sábados 10:00-14:00'),
    ('REP-003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Residencia Particular', 'Boulevard de los Sueños Rotos 456', 200.75, 'Martes y Jueves 14:00-17:00'),
    ('REP-004', '3c8a7d4a-6f3e-4b2c-9d71-8a4f9e0c1b2a', 'Almacén Industrial', 'Polígono Industrial Sur, Nave 7', 350.00, 'Lunes 8:00-12:00'),
    ('REP-005', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Tienda Minorista', 'Peatonal Central 500', 100.25, 'Miércoles y Viernes 10:00-13:00 y 15:00-18:00');

-- Nota:
-- 1. Los `id` se generarán automáticamente por la secuencia SERIAL.
-- 2. `created_at` y `updated_at` tomarán sus valores por defecto (CURRENT_TIMESTAMP).
-- 3. Asegúrate de que los `cliente_id` ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', etc.)
--    correspondan a IDs existentes en tu tabla `clientes`. Si no existen, estas inserciones fallarán
--    debido a la restricción de clave foránea.
--    Puedes crear clientes de prueba primero si es necesario:
--    INSERT INTO clientes (id, nombre, direccion, telefono, email) VALUES
--        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cliente Ejemplo Uno', 'Dirección Uno 123', '+1234567890', 'cliente1@example.com'),
--        ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Cliente Ejemplo Dos', 'Dirección Dos 456', '+0987654321', 'cliente2@example.com'),
--        ('3c8a7d4a-6f3e-4b2c-9d71-8a4f9e0c1b2a', 'Cliente Ejemplo Tres', 'Dirección Tres 789', '+1122334455', 'cliente3@example.com'),
--        ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Cliente Ejemplo Cuatro', 'Dirección Cuatro 012', '+5544332211', 'cliente4@example.com');
--    Recuerda que si tu tabla `clientes` tiene `id` como `SERIAL`, no necesitas especificar el `id` al insertar.
--    Pero como el script anterior para `clientes_reparto` define `cliente_id INTEGER REFERENCES clientes(id)`
--    y el script para `clientes` define `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`,
--    los `cliente_id` en `clientes_reparto` deben ser UUIDs.
--    Ajusté el script para `clientes_reparto` para que `cliente_id` sea `UUID`.
--    El script original era:
--    CREATE TABLE clientes_reparto (
--        id SERIAL PRIMARY KEY,
--        codigo VARCHAR UNIQUE NOT NULL,
--        cliente_id INTEGER REFERENCES clientes(id) NOT NULL,
--        ...
--    );
--    Debería ser (asumiendo que clientes.id es UUID):
--    CREATE TABLE clientes_reparto (
--        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- o SERIAL si prefieres IDs numéricos para esta tabla
--        codigo VARCHAR UNIQUE NOT NULL,
--        cliente_id UUID REFERENCES clientes(id) NOT NULL,
--        nombre_reparto VARCHAR,
--        direccion_reparto TEXT,
--        tarifa DECIMAL,
--        rango_horario VARCHAR,
--        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Debería actualizarse con un trigger
--    );
--    Este script de inserción asume que cliente_id es UUID y los UUIDs proporcionados existen.
