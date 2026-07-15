from typing import Optional

from pydantic import BaseModel, EmailStr
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

class EmpresaUpdate(BaseModel):
    nombre: Optional[str] = None
    area: Optional[str] = None
    sector: Optional[str] = None
    tamanio: Optional[str] = None
    nivel: Optional[str] = None
    telefono: Optional[str] = None
    pagina_web: Optional[str] = None
    calle: Optional[str] = None
    colonia: Optional[str] = None
    ciudad: Optional[str] = None
    municipio: Optional[str] = None
    codigo_postal: Optional[str] = None
    estado: Optional[str] = None
    pais: Optional[str] = None
    nombre_asesor: Optional[str] = None
    cargo_asesor: Optional[str] = None
    correo_asesor: Optional[str] = None
    nombre_titular: Optional[str] = None
    cargo_titular: Optional[str] = None
    correo_titular: Optional[str] = None

class AdministradorBase(BaseModel):
    nombre: str
    correo: EmailStr
    estado: bool = True
    rol_id: Optional[int] = None

class AdministradorCreate(AdministradorBase):
    contrasena: str # Requerida al crear, debe ser encriptada antes de guardar

class AdministradorUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    contrasena: Optional[str] = None
    estado: Optional[bool] = None
    rol_id: Optional[int] = None

class AdministradorResponse(AdministradorBase):
    id: int

    class Config:
        from_attributes = True