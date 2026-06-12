import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Date
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
from datetime import date

class EstadoEstudiante(enum.Enum):
    SIN_ENTREGAS = "Sin Entregas"
    EN_PROCESO = "En Proceso"
    PENDIENTE = "Pendiente"
    VALIDADO = "Validado"

class Rol(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    rol = Column(String(50), nullable=False, unique=True)
    permisos = Column(ARRAY(String), server_default='{}')

# ===========================================
#           Datos del estudiante
# ===========================================
class Estudiante(Base):
    __tablename__ = "estudiantes"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    correo: Mapped[str] = mapped_column(String, nullable=False)
    nombre: Mapped[str] = mapped_column(String, nullable=False)
    apellidos: Mapped[str] = mapped_column(String, nullable=False)
    carrera: Mapped[str] = mapped_column(String, nullable=False)
    semestre_egresado : Mapped[str] = mapped_column(String, nullable=False)
    matricula: Mapped[str] = mapped_column(String, nullable=False)
    grupo: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[EstadoEstudiante] = mapped_column(Enum(EstadoEstudiante), default=EstadoEstudiante.SIN_ENTREGAS, nullable=False)
    documentos: Mapped[list["Documento"]] = relationship("Documento", back_populates="estudiante")
    rol_id: Mapped[int] = mapped_column(Integer, ForeignKey("roles.id"), nullable=True)

class DomicilioLocal(Base):
    __tablename__ = "domicilio_local"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    calle: Mapped[str] = mapped_column(String, nullable=False)
    colonia: Mapped[str] = mapped_column(String, nullable=False)
    ciudad: Mapped[str] = mapped_column(String, nullable=False)
    municipio: Mapped[str] = mapped_column(String, nullable=False)
    codigo_postal: Mapped[str] = mapped_column(String, nullable=False)
    estudiante_id: Mapped[int] = mapped_column(Integer, ForeignKey("estudiantes.id", ondelete="CASCADE"), unique=True, nullable=False)

class DomicilioProcedencia(Base):
    __tablename__ = "domicilio_procedencia"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    calle: Mapped[str] = mapped_column(String, nullable=False)
    colonia: Mapped[str] = mapped_column(String, nullable=False)
    ciudad: Mapped[str] = mapped_column(String, nullable=False)
    municipio: Mapped[str] = mapped_column(String, nullable=False)
    codigo_postal: Mapped[str] = mapped_column(String, nullable=False)
    estado: Mapped[str] = mapped_column(String, nullable=False)
    estudiante_id: Mapped[int] = mapped_column(Integer, ForeignKey("estudiantes.id", ondelete="CASCADE"), unique=True, nullable=False)

class InformacionSociodemografica(Base):
    __tablename__ = "informacion_sociodemografica"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    discapacidad: Mapped[str] = mapped_column(String, nullable=False)
    lengua_indigena: Mapped[str] = mapped_column(String, nullable=False)
    hijos: Mapped[str] = mapped_column(String, nullable=False)
    estudiante_id: Mapped[int] = mapped_column(Integer, ForeignKey("estudiantes.id", ondelete="CASCADE"), unique=True, nullable=False)

class DetallesEstancia(Base):
    __tablename__ = "detalles_estancia"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    periodo: Mapped[str] = mapped_column(String, nullable=False)
    tipo_estancia: Mapped[str] = mapped_column(String, nullable=False)
    minimo_horas: Mapped[str] = mapped_column(String, nullable=False)
    estudiante_id: Mapped[int] = mapped_column(Integer, ForeignKey("estudiantes.id", ondelete="CASCADE"), nullable=False)

class ContactoEstudiante(Base):
    __tablename__ = "contacto_estudiante"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    correo_alternativo: Mapped[str] = mapped_column(String, nullable=False)
    telefono: Mapped[str] = mapped_column(String, nullable=False)
    telefono_emergencia: Mapped[str] = mapped_column(String, nullable=False)
    estudiante_id: Mapped[int] = mapped_column(Integer, ForeignKey("estudiantes.id", ondelete="CASCADE"), unique=True, nullable=False)

class DatosEstudiante(Base):
    __tablename__ = "datos_estudiante"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    fecha_nacimiento: Mapped[date] = mapped_column(Date, nullable=False)
    genero: Mapped[str] = mapped_column(String, nullable=False)
    curp: Mapped[str] = mapped_column(String, nullable=False)
    nss: Mapped[str] = mapped_column(String, nullable=False)
    estudiante_id: Mapped[int] = mapped_column(Integer, ForeignKey("estudiantes.id", ondelete="CASCADE"), unique=True, nullable=False)

class Documento(Base):
    __tablename__ = "documentos"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre_documento = Column(String(100), nullable=False)
    url_archivo = Column(String, nullable=True)
    estado_documento = Column(String(30), default="Pendiente") 

    estudiante_id = Column(Integer, ForeignKey("estudiantes.id"), nullable=False)
    
    estudiante = relationship("Estudiante", back_populates="documentos")

# ================
#   EMPRESAS
# ================