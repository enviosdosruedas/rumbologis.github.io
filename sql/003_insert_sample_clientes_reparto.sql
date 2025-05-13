-- Sample data for clientes_reparto table
-- This script assumes that a client with id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef' 
-- (Empresa A from the previous sample data script 002_initial_data_optimized.sql) 
-- exists in the 'clientes' table.
-- If you are using a different client_id, please replace 
-- 'a1b2c3d4-e5f6-7890-1234-567890abcdef' with a valid client_id UUID from your 'clientes' table.
--
-- The parsing of free-form text into structured fields (direccion_reparto, telefono_reparto, rango_horario)
-- is based on common patterns found in the provided examples. Adjust as needed for accuracy.
-- Tarifa is set to NULL for all entries as it was not provided in the examples.

INSERT INTO clientes_reparto (cliente_id, nombre_reparto, direccion_reparto, telefono_reparto, rango_horario, tarifa) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Andapez', 'vertiz 3250 porton gris', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Hierro metal', 'Solis 4565', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Drogueria Azcuenaga', 'juramento 46 bolsa', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'wanchese', 'Juan b justo 50 ENCARGADO', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Noelia Lescar', 'Ortiz de zarate 801', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Ezeiquel Donsion', 'Azopardo 3455 Chiarmar', '2236846708', NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Garcia, Ruiz y Cardoso', 'laprida 4650 Plantel', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Silvina Doval', 'Polonia 607 Oficina', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Juan Manuel salas', 'Solis 8151 porton verde', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Sergio bejanele', 'Namuncura 267', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Simini y Alonso', 'Juan b justo 4302 FACULTAD INGENIERIA', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Andrea Almejun', 'F. Sanchez 2034 porton negro', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Mariana Dominguez', 'Talcahuano 1731', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Maxi castillo', 'Elcano 6131', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Emmanuel Fernandez', '12 octubre 4420 KIOSCO', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Denisse Ulrich', 'Juan b justo 1252 CAMARON BRUJO', NULL, 'DESDE 10hs Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Osvaldo Leguizamon', 'Solis y korn pesquera esquina Tocar timbre y dejar apenas entras', NULL, 'desde 10hs Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Alejandra fornasier', 'jose hernandez 220', NULL, 'desde 10hs Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Javier giacone', 'Bernardo irigoyen 3918 1er piso timbre recepcion', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Haydee knebel', 'Bv Maritimo 3119 5E', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Martin Caparros', 'Avellaneda 1034', NULL, 'Antes 11:30hs Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Claudia Nuñez', 'Cordoba 3432', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Candela Cerato', 'Cordoba 3251 2L', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Juanola y Agustina patuto', 'Alvarado 3195 "MERCANTIL ANDINA"', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Fernanda Padula', 'San lorenzo 3193 LLAMAR O ENVIAR MENSAJE', '1164077994', NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Nahuel panziera', 'Independencia y Matheu "URBANIA"', NULL, 'Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Colomer', 'Independencia 3999 LA SEGUNDA DEJAR EN LA ENTRADA', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Nahuel etcheverregaray', 'Laprida 3478', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Nelly caccave', 'Casildo Villar 1127', NULL, '11 A 12HS Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Claudia Lopez grillo', 'Irala 6249 dejar atras de la reja y tocar timbre', NULL, 'DESDE 11HS Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Graciela croci', 'J B Justo 2936 "RIZZO"', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Adelia giffoni', 'Entre rios 1808 13J ENTREGAR EN MANO SI O SI', NULL, '12 A 13HS Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'ALberto roque neffe', 'Cordoba 1915 2A', NULL, '11 a 12:30hs Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'old trade', 'Córdoba 1777 bolsa', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Paula ceser', 'Cordoba 1760 BANCO NACION ENTRADA PERSONAL PUERTA DE ALUMINIO DEJAR A POLICIA, NO DEJAR EN COCINA', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Virginia Correa', '3 DE FEBRERO 2788 PB A', NULL, 'ANTES 13HS Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Maria Fernando huerta', '25 mayo e H yrigoyen FACULTADO DERECHO DEJAR EN RECEPCION', NULL, 'Desde 11hs Entrega', NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Andrea dentone', '25 Mayo 3334', NULL, NULL, NULL),
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Cecilia spinelli', 'Colon 6130 CAFE DE ESTACION DE SERVICIO GNC', NULL, 'DESDE 11HS Entrega', NULL);

-- You can add more INSERT statements here if needed,
-- potentially associating them with 'Empresa B' (cliente_id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1')
-- or other clients you have in your 'clientes' table.
