-- 1. Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(50) NOT NULL UNIQUE,
    permisos VARCHAR(50)[] DEFAULT '{}'
);

-- 2. Crear tabla de estudiantes (ahora con relación al rol)
CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    carrera VARCHAR(255) NOT NULL,
    semestre_egresado VARCHAR(50) NOT NULL,
    rol_id INT REFERENCES roles(id) ON DELETE SET NULL -- Llave foránea
);

-- 3. Insertar roles iniciales
INSERT INTO roles (rol, permisos) 
VALUES 
(
    'Administrador', 
    '{"CARGAR_EXCEL", "LEER_ALUMNOS", "EDITAR_ALUMNOS"}'
),
(
    'Estudiante', 
    '{"SUBIR_ARCHIVOS", "DESCARGAR_ARCHIVOS", "ACCEDER_ESTUDIANTES"}'
)
ON CONFLICT (rol) DO NOTHING;

-- 4. Insertar tu usuario inicial asociado al rol de Administrador
INSERT INTO estudiantes (correo, nombre, carrera, semestre_egresado, rol_id)
VALUES (
    'lobg050328@gs.utm.mx',
    'Gael López Bautista',
    'Ingeniería en Computación',
    'Sexto Semestre',
    (SELECT id FROM roles WHERE rol = 'Administrador') -- Asigna el ID automáticamente
) ON CONFLICT (correo) DO NOTHING;