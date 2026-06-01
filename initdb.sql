CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(50) NOT NULL UNIQUE,
    permisos VARCHAR(50)[] DEFAULT '{}'
);

CREATE TYPE estadoestudiante AS ENUM ('SIN_ENTREGAS', 'EN_PROCESO', 'PENDIENTE', 'VALIDADO');

CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    carrera VARCHAR(255) NOT NULL,
    semestre_egresado VARCHAR(50) NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    status estadoestudiante DEFAULT 'SIN_ENTREGAS' NOT NULL,
    rol_id INT REFERENCES roles(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,
    nombre_documento VARCHAR(100) NOT NULL,
    url_archivo TEXT,
    estado_documento VARCHAR(30) DEFAULT 'Pendiente',
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE NOT NULL
);

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

INSERT INTO estudiantes (correo, nombre, carrera, semestre_egresado, matricula, status, rol_id)
VALUES (
    'lobg050328@gs.utm.mx',
    'Gael López Bautista',
    'Ingeniería en Computación',
    'Sexto Semestre',
    '2023020305',
    'SIN_ENTREGAS',
    (SELECT id FROM roles WHERE rol = 'Administrador')
) ON CONFLICT (correo) DO NOTHING;