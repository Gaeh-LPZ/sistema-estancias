interface IDomicilio {
    calle: string;
    colonia: string;
    ciudad: string;
    codigo_postal: string;
    municipio: string;
}

interface IContacto {
    correo_alternativo: string;
    telefono: string;
    telefono_emergencia: string;
}

interface IDatosPersonales {
    fecha_nacimiento: Date;
    genero: string;
    curp: string;
    nss: string;
}

interface IEstudiante {
    nombre: string;
    correo: string;
    matricula: string;
    grupo: string;
    carrera: string;
}

export interface IPerfilCompleto {
    estudiante: IEstudiante
    datos_personales: IDatosPersonales
    contacto: IContacto
    domicilio: IDomicilio
}

export interface EstudianteInfo {
  nombre: string;
  apellidos: string;
  fecha_nacimiento: string;
  genero: string;
  curp: string;
  nss: string;
}

export interface PerfilUIProps {
    correoUsuario: string;
    datosPerfil: any;
}