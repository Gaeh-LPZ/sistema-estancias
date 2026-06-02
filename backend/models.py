import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Date
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from database import Base

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

class Estudiante(Base):
    __tablename__ = "estudiantes"
    
    id = Column(Integer, primary_key=True, index=True)
    correo = Column(String, unique=True, index=True, nullable=False)
    nombre = Column(String, nullable=False)
    carrera = Column(String, nullable=False)
    semestre_egresado = Column(String, nullable=False)
    matricula = Column(String, nullable=False)
    grupo = Column(String, nullable=False)
    status = Column(Enum(EstadoEstudiante), default=EstadoEstudiante.SIN_ENTREGAS, nullable=False)
    documentos = relationship("Documento", back_populates="estudiante")
    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=True)

class Documento(Base):
    __tablename__ = "documentos"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre_documento = Column(String(100), nullable=False)
    url_archivo = Column(String, nullable=True)
    estado_documento = Column(String(30), default="Pendiente") 

    estudiante_id = Column(Integer, ForeignKey("estudiantes.id"), nullable=False)
    
    estudiante = relationship("Estudiante", back_populates="documentos")

class DetallesEstancia(Base):
    __tablename__ = "detalles_estancia"
    
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiantes.id", ondelete="CASCADE"), unique=True, nullable=False)
    nombre_empresa = Column(String, nullable=False)
    nombre_proyecto = Column(String, nullable=False)
    nombre_asesor = Column(String, nullable=False)
    cargo_asesor = Column(String, nullable=True)
    correo_asesor = Column(String, nullable=True)
    fecha_inicio = Column(Date, nullable=True)
    fecha_fin = Column(Date, nullable=True)