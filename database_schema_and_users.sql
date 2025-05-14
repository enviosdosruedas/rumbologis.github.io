-- Eliminar tabla existente si es necesario (para desarrollo)
DROP TABLE IF EXISTS usuarios CASCADE;

-- Crear la tabla usuarios
CREATE TABLE usuarios (
    codigo SERIAL PRIMARY KEY,             -- Identificador único del usuario, autoincremental
    nombre VARCHAR(255) NOT NULL UNIQUE,   -- Nombre del usuario (debe ser único para login)
    pass TEXT NOT NULL,                  -- Contraseña del usuario (ADVERTENCIA: Almacenar en texto plano es inseguro)
    rol VARCHAR(50) NOT NULL,            -- Rol del usuario (ej: 'admin', 'repartidor')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentario sobre seguridad de contraseñas:
-- ADVERTENCIA: La columna 'pass' almacena contraseñas en TEXTO PLANO.
-- Esto es una VULNERABILIDAD DE SEGURIDAD MUY GRAVE.
-- En un entorno de producción, las contraseñas SIEMPRE deben ser hasheadas
-- utilizando algoritmos seguros como bcrypt o Argon2.
-- Esta implementación se realiza siguiendo la especificación del prompt "pass 1234".

-- Insertar usuario administrador
-- El código se autoincrementará a 1 si la secuencia está fresca.
INSERT INTO usuarios (nombre, pass, rol) VALUES
('admin', '1234', 'admin');

-- Insertar usuarios repartidores
-- El código se autoincrementará. Los UUIDs proporcionados en el prompt (37804e1f... y e87b1e04...)
-- se refieren a los registros en la tabla 'repartidores' (si existen y necesitan ser asociados),
-- no al 'codigo' en esta tabla 'usuarios'.
-- Aquí se crean usuarios con nombres genéricos "repartidor1" y "repartidor2" según el prompt.
INSERT INTO usuarios (nombre, pass, rol) VALUES
('repartidor1', '1234', 'repartidor');

INSERT INTO usuarios (nombre, pass, rol) VALUES
('repartidor2', '1234', 'repartidor');

-- Opcional: Crear un trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Verificar inserciones (opcional)
SELECT * FROM usuarios;
