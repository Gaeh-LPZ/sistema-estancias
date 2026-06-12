from pydantic import BaseModel
from datetime import date

class DomicilioLocalUpdate(BaseModel):
    calle: str
    colonia: str
    ciudad: str
    codigo_postal: str
    municipio: str

class DomicilioProcedenciaUpdate(BaseModel):
    calle: str
    colonia: str
    ciudad: str
    codigo_postal: str
    estado: str
    municipio: str

class InformacionSDemograficaUpdate(BaseModel):
    discapacidad: str
    lengua_indigena: str
    hijos: str

class DetallesEstanciaUpdate(BaseModel):
    periodo: str
    tipo_estancia: str
    minimo_horas: str

class ContactoUpdate(BaseModel):
    correo_alternativo: str
    telefono: str
    telefono_emergencia: str

class DatosPersonalesUpdate(BaseModel):
    fecha_nacimiento: date
    genero: str
    curp: str
    nss: str

class EstudianteUpdate(BaseModel):
    nombre: str
    apellidos: str
    correo: str
    matricula: str
    grupo: str
    carrera: str

class PerfilCompletoUpdate(BaseModel):
    estudiante: EstudianteUpdate
    datos_personales: DatosPersonalesUpdate
    contacto: ContactoUpdate