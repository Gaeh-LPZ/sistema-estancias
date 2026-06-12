interface IDomicilio {
    calle: string;
    colonia: string;
    ciudad: string;
    codigo_postal: string;
    municipio: string;
}

export interface IContacto {
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
    apellido: string;
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

export interface IFormEstudiantes {
    // Datos Personales
    estudiante: {
        nombre: string;
        apellidos: string;
        fecha_nacimiento: string;
        nss: string;
        matricula: string;
        grupo: string;
        creditos: string;
    }

    // Datos Estudiante
    datos_personales: {
        fecha_nacimiento: string;
        genero: string;
        curp: string;
        nss: string;
    }

    // Contacto
    contacto: {
        correo_alternativo: string;
        telefono: string;
        telefono_emergencia: string;
    }

    // Domicilio Local
    domicilio_local: {
        calle: string;
        colonia: string;
        ciudad: string;
        codigo_postal: string;
        municipio: string;
    }

    // Domicilio Procedencia
    domicilio_procedencia: {
        calle: string;
        colonia: string;
        ciudad: string;
        codigo_postal: string;
        municipio: string;
        estado: string;
    }

    // Información sociodemográfica
    informacion_demografica: {
        discapacidad: string;
        lengua_indigena: string;
        hijos: string;
    }

    // Detalles de la estancia
    detalles_estancia: {
        periodo: string;
        tipo_estancia: string;
        minimo_horas: string;
    }

}