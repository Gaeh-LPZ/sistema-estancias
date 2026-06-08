from pydantic import BaseModel
from datetime import date

class DomicilioUpdate(BaseModel):
    calle: str
    colonia: str
    ciudad: str
    codigo_postal: str
    municipio: str

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
    domicilio: DomicilioUpdate