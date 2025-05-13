-- Asegúrate de tener la extensión uuid-ossp habilitada si aún no lo está.
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insertar dos repartidores de prueba en la tabla "repartidores"
INSERT INTO repartidores (nombre, identificacion, telefono, vehiculo) VALUES
('Juan Pérez', 'DNI12345678A', '+54 9 11 55551234', 'Moto Honda Wave Patente A001BCD'),
('Ana Gómez', 'DNI87654321B', '+54 9 11 55555678', 'Bicicleta Mountain Bike Rodado 29');

-- Insertar dos clientes de prueba en la tabla "clientes" (opcional, si también se desea poblar esta tabla)
INSERT INTO clientes (nombre, direccion, telefono, email) VALUES
('Carlos López', 'Av. Siempre Viva 742', '+54 9 11 33334444', 'carlos.lopez@example.com'),
('Laura Fernández', 'Calle Falsa 123, Springfield', '+54 9 11 22221111', 'laura.f@example.net');
