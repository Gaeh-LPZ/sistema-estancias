export interface Documento {
    id: number;
    nombre_documento: string;
    url_archivo: string | null;
    estado_documento: string;
    estudiante_id: number;
}

export interface Estudiantes {
    id: number;
    correo: string;
    nombre: string;
    carrera: string;
    semestre_egresado: string;
    matricula: string;
    rol_id: number | null;
    status: string; 
    documentos: Documento[];
}