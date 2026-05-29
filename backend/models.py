from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from database import Base

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
    rol_id = Column(Integer, ForeignKey("roles.id"), nullable=True)