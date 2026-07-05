CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    rol VARCHAR(50) NOT NULL UNIQUE,
    permisos VARCHAR(50)[] DEFAULT '{}'
);

CREATE TYPE estadoestudiante AS ENUM ('SIN_ENTREGAS', 'EN_PROCESO', 'PENDIENTE', 'VALIDADO');

-- Tablas de detalles de los estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
    id SERIAL PRIMARY KEY,
    correo VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    carrera VARCHAR(255) NOT NULL,
    semestre_egresado VARCHAR(50) NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    grupo VARCHAR(50) NOT NULL,
    motivo_rechazo VARCHAR(255),
    status estadoestudiante DEFAULT 'SIN_ENTREGAS' NOT NULL,
    rol_id INT REFERENCES roles(id) ON DELETE SET NULL
);

-- Información domiciliaria
CREATE TABLE IF NOT EXISTS domicilio_local (
    id SERIAL PRIMARY KEY,
    calle VARCHAR(255) NOT NULL,
    colonia VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    municipio VARCHAR(255) NOT NULL,
    codigo_postal VARCHAR(255) NOT NULL,
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE  NOT NULL
);

-- Domicilio de procedencia del estudiante
CREATE TABLE IF NOT EXISTS domicilio_procedencia (
    id SERIAL PRIMARY KEY,
    calle VARCHAR(255) NOT NULL,
    colonia VARCHAR(255) NOT NULL,
    ciudad VARCHAR(255) NOT NULL,
    municipio VARCHAR(255) NOT NULL,
    codigo_postal VARCHAR(50) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE NOT NULL
);

-- Información Sociodemográfica
CREATE TABLE IF NOT EXISTS informacion_sociodemografica (
    id SERIAL PRIMARY KEY,
    discapacidad VARCHAR(2) NOT NULL,
    lengua_indigena VARCHAR(2) NOT NULL,
    hijos VARCHAR(2) NOT NULL,
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE NOT NULL
);

-- Detalles de la estancia
CREATE TABLE IF NOT EXISTS detalles_estancia (
    id SERIAL PRIMARY KEY,
    periodo VARCHAR(20) NOT NULL,
    tipo_estancia VARCHAR(20) NOT NULL,
    minimo_horas VARCHAR(20) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    horario VARCHAR(80) NOT NULL,
    proyecto VARCHAR(50) NOT NULL,
    objetivo_general VARCHAR(100) NOT NULL,
    actividades_principales VARCHAR(255) NOT NULL,
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE NOT NULL
);

-- Información del contacto del estudiante
CREATE TABLE IF NOT EXISTS contacto_estudiante (
    id SERIAL PRIMARY KEY,
    correo_alternativo VARCHAR(255) NOT NULL,
    telefono VARCHAR(255) NOT NULL,
    telefono_emergencia VARCHAR(255) NOT NULL,
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE UNIQUE NOT NULL
);

-- Información extra en los datos personales
CREATE TABLE IF NOT EXISTS datos_estudiante (
    id SERIAL PRIMARY KEY,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(50) NOT NULL,
    curp VARCHAR(50) NOT NULL,
    nss VARCHAR(50) NOT NULL,
    lugar_nacimiento VARCHAR(50) NOT NULL,
    creditos VARCHAR(10),
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS documentos (
    id SERIAL PRIMARY KEY,
    nombre_documento VARCHAR(100) NOT NULL,
    url_archivo TEXT,
    estado_documento VARCHAR(30) DEFAULT 'Pendiente',
    motivo_rechazo VARCHAR(255),
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE NOT NULL
);

-- =============================================
--            Datos de la empresa
-- =============================================
CREATE TABLE IF NOT EXISTS empresa (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    area VARCHAR(100),
    sector VARCHAR(10),
    tamanio VARCHAR(10),
    nivel VARCHAR(15),
    telefono VARCHAR(20),
    pagina_web VARCHAR(50),
    calle VARCHAR(100),
    colonia VARCHAR(50),
    ciudad VARCHAR(50),
    municipio VARCHAR(50),
    codigo_postal VARCHAR(20),
    estado VARCHAR(50),
    pais VARCHAR(100),
    nombre_asesor VARCHAR(100),
    cargo_asesor VARCHAR(50),
    correo_asesor VARCHAR(100),
    nombre_titular VARCHAR(100),
    cargo_titular VARCHAR(50),
    correo_titular VARCHAR(100),
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE UNIQUE NOT NULL
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

INSERT INTO estudiantes (correo, nombre, apellidos, carrera, semestre_egresado, matricula, grupo, status, rol_id)
VALUES (
    'lobg050328@gs.utm.mx',
    'Gael',
    'López Bautista',
    'Ingeniería en Computación',
    'Sexto Semestre',
    '2023020305',
    '602-A',
    'SIN_ENTREGAS',
    (SELECT id FROM roles WHERE rol = 'Administrador')
) ON CONFLICT (correo) DO NOTHING;