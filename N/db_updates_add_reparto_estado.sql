
-- Modificar la tabla "repartos" para agregar la columna "estado"
ALTER TABLE repartos
ADD COLUMN estado VARCHAR(20) DEFAULT 'Asignado';

-- Comentario para la nueva columna
COMMENT ON COLUMN repartos.estado IS 'Estado del reparto (Asignado, En Curso, Completo)';

-- Actualizar registros existentes al estado 'Asignado' si es necesario (opcional)
-- UPDATE repartos SET estado = 'Asignado' WHERE estado IS NULL;

-- Ejemplo de inserción de un nuevo reparto con el campo "estado"
-- Asegúrate de que los UUIDs para repartidor_id y cliente_id existan en tus tablas 'repartidores' y 'clientes'
-- y que los IDs para cliente_reparto_id existan en 'clientes_reparto'.

-- INSERT INTO repartos (fecha_reparto, repartidor_id, cliente_id, observaciones, estado)
-- VALUES 
--   ('2024-08-01', 'c3d4e5f6-a7b8-9012-3456-7890abcdef2', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Entrega urgente por la mañana.', 'Asignado');

-- Suponiendo que el insert anterior generó el ID 1 para el reparto:
-- INSERT INTO reparto_cliente_reparto (reparto_id, cliente_reparto_id)
-- VALUES
--   (1, 1), -- Suponiendo que el cliente_reparto con ID 1 existe
--   (1, 2); -- Suponiendo que el cliente_reparto con ID 2 existe


-- Ejemplo de actualización del estado de un reparto existente
-- UPDATE repartos
-- SET estado = 'En Curso'
-- WHERE id = 1; -- Reemplaza 1 con el ID del reparto que quieres actualizar

-- UPDATE repartos
-- SET estado = 'Completo'
-- WHERE id = 1; -- Reemplaza 1 con el ID del reparto que quieres actualizar

-- Verifica los cambios
SELECT id, fecha_reparto, repartidor_id, cliente_id, estado, observaciones
FROM repartos
ORDER BY fecha_reparto DESC;
