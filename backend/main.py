# Librerias utilizadas
import pandas as pd
import io
import schemas
import models
import os
import boto3

# Funciones especificas de cada libreria
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware 
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from datetime import date
from pydantic import BaseModel
from database import get_db
from fpdf import FPDF
from dotenv import load_dotenv
from botocore.client import Config
from typing import Optional
from sqlalchemy import func
from passlib.context import CryptContext

load_dotenv()

S3_ENDPOINT = os.getenv("S3_ENDPOINT", "http://localhost:3900")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME", "expedientes-estudiantes")

# 3. Inicializar el cliente de S3 (boto3)
s3_client = boto3.client(
    's3',
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name='garage'
)

s3_client_public = boto3.client(
    's3',
    endpoint_url="http://localhost:3900", # Dominio exacto que usa el navegador
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name='garage',
    config=Config(signature_version='s3v4') # Forzamos la firma correcta
)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://horario.utm.mx"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginSchema(BaseModel):
    correo: str
    password: str

class ActualizarEstadoDoc(BaseModel):
    estado: str
    motivo: Optional[str] = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password[:72])

def formatear_fecha(fecha: date):
    meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
    return f"{fecha.day} de {meses[fecha.month - 1]} de {fecha.year}"

def obtener_usuario_actual(db: Session = Depends(get_db)):
    tu_usuario = db.query(models.Estudiante).filter(models.Estudiante.correo == "lobg050328@gs.utm.mx").first()
    
    if tu_usuario is not None and tu_usuario.rol_id is not None:
        rol_real = db.query(models.Rol).filter(models.Rol.id == tu_usuario.rol_id).first()
        class UsuarioReal:
            nombre = tu_usuario.nombre
            rol = rol_real
        return UsuarioReal()

    class RolFalso:
        permisos = ["CARGAR_EXCEL"]
    class UsuarioFalso:
        nombre = "Admin temporal"
        rol = RolFalso()
    return UsuarioFalso()

def requerir_permiso(permiso_necesario: str):
    def verificador(usuario = Depends(obtener_usuario_actual)):
        if permiso_necesario not in usuario.rol.permisos:
            raise HTTPException(
                status_code=403, 
                detail=f"Acceso denegado. Se requiere el permiso: {permiso_necesario}"
            )
        return usuario
    return verificador

@app.post("/api/estudiantes/cargar-excel")
async def cargar_estudiantes_excel(
    file: UploadFile = File(...),
    usuario_verificado = Depends(requerir_permiso("CARGAR_EXCEL")),
    db: Session = Depends(get_db)
):
    if file.filename is None or not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="Formato no soportado o archivo sin nombre.")
    
    DOCUMENTOS_REQUERIDOS = [
        "Doc 1", "Doc 2", "Doc 3", "Doc 4", "Doc 5", "Doc 6",
        "Reporte Semanal 1", "Reporte Semanal 2", "Reporte Semanal 3",
        "Reporte Semanal 4", "Reporte Semanal 5", "Reporte Semanal 6",
        "Reporte Semanal 7"
    ]

    try:
        rol_estudiante = db.query(models.Rol).filter(models.Rol.rol == "Estudiante").first()
        if not rol_estudiante:
            raise HTTPException(status_code=500, detail="El rol 'Estudiante' no está inicializado en la BD.")

        df = pd.read_excel(file.file, engine='openpyxl')
        df.columns = df.columns.str.lower()

        columnas_esperadas = ['correo', 'nombre', 'apellidos', 'carrera', 'matricula', 'grupo', 'semestre']
        for col in columnas_esperadas:
            if col not in df.columns:
                 raise HTTPException(status_code=400, detail=f"Falta la columna: {col}")

        df = df.dropna(how='all')

        df['correo'] = df['correo'].astype(str).str.strip()

        df = df[df['correo'].str.len() > 3]
        df = df[df['correo'].str.lower() != 'nan']

        df = df.drop_duplicates(subset=['correo'], keep='first')
        
        df['matricula'] = df['matricula'].astype(str).str.replace('.0', '', regex=False)
        df['matricula'] = df['matricula'].replace(["nan", "NaN", ""], None)

        df['grupo'] = df['grupo'].fillna("Sin asignar")
        df['grupo'] = df['grupo'].replace(["nan", "NaN", "", None], "Sin asignar") # type: ignore

        df = df.fillna("")

        nuevos_registros = 0
        for index, row in df.iterrows():
            existe = db.query(models.Estudiante).filter(models.Estudiante.correo == row['correo']).first()
            
            if not existe:
                nuevo_estudiante = models.Estudiante(
                    correo=row['correo'],
                    nombre=row['nombre'],
                    apellidos=row['apellidos'],
                    carrera=row['carrera'],
                    matricula=row['matricula'],
                    grupo=row['grupo'],
                    semestre_egresado=str(row['semestre']),
                    rol_id=rol_estudiante.id
                )
                
                for nom_doc in DOCUMENTOS_REQUERIDOS:
                    nuevo_doc = models.Documento(
                        nombre_documento=nom_doc,
                        estado_documento="Pendiente" 
                    )
                    nuevo_estudiante.documentos.append(nuevo_doc)

                db.add(nuevo_estudiante)
                nuevos_registros += 1
            
        db.commit()

        return {
            "mensaje": f"Se insertaron {nuevos_registros} estudiantes y se generaron sus expedientes vacíos.",
            "usuario_responsable": usuario_verificado.nombre
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al procesar: {str(e)}")
    
@app.get('/api/estudiantes/obtener-estudiantes')
async def get_nombre_estudiantes(db: Session = Depends(get_db)):
    try:
        estudiantes = db.query(models.Estudiante).all()
        return estudiantes

    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al consultar la base de datos: {str(e)}"
        )
    
@app.get('/api/estudiantes/exportar-excel')
async def exportar_estudiantes_excel(db: Session = Depends(get_db)):
    try:
        estudiantes = db.query(models.Estudiante).all()
        
        datos_excel = []
        for est in estudiantes:
            docs_entregados = [doc.nombre_documento for doc in est.documentos if doc.url_archivo is not None]
            
            nombres_docs = ", ".join(docs_entregados) if docs_entregados else "Ninguno" # type: ignore
            
            datos_excel.append({
                "Nombre": est.nombre,
                "Apellidos": est.apellidos,
                "Correo": est.correo,
                "Matrícula": est.matricula,
                "Carrera": est.carrera,
                "Semestre": est.semestre_egresado,
                "Estado Global": est.status,
                "Documentos Entregados": nombres_docs
            })
            
        df = pd.DataFrame(datos_excel)
        
        stream = io.BytesIO()
        with pd.ExcelWriter(stream, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Estudiantes')
        
        stream.seek(0) 
        
        headers = {
            'Content-Disposition': 'attachment; filename="reporte_estudiantes.xlsx"'
        }
        return StreamingResponse(
            stream, 
            headers=headers, 
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar: {str(e)}")
    
@app.get('/api/usuarios/rol')
async def obtener_rol_usuario(correo: str, db: Session = Depends(get_db)):
    # 1. Buscar en estudiantes
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if estudiante and estudiante.rol_id:
        rol = db.query(models.Rol).filter(models.Rol.id == estudiante.rol_id).first()
        return {"rol": rol.rol}
        
    # 2. Buscar en administradores (¡ESTO ES LO QUE FALTA SI DA 404!)
    admin = db.query(models.Administrador).filter(models.Administrador.correo == correo).first()
    if admin and admin.rol_id:
        rol = db.query(models.Rol).filter(models.Rol.id == admin.rol_id).first()
        return {"rol": rol.rol}
        
    raise HTTPException(status_code=404, detail="Usuario no encontrado o sin rol")

@app.patch('/api/estudiantes/perfil/{correo}')
async def actualizar_perfil(correo: str, datos_parciales: dict, db: Session = Depends(get_db)):
    # 1. Buscamos al estudiante principal
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    contacto = db.query(models.ContactoEstudiante).filter(models.ContactoEstudiante.estudiante_id == estudiante.id).first()
    datos = db.query(models.DatosEstudiante).filter(models.DatosEstudiante.estudiante_id == estudiante.id).first()

    campos_principal = ["nombre", "apellidos", "matricula", "grupo", "carrera"]
    campos_contacto = ["correo_alternativo", "telefono", "telefono_emergencia"]
    campos_datos = ["fecha_nacimiento", "genero", "curp", "nss", "lugar_nacimiento", "creditos"]

    try:
        for clave, valor in datos_parciales.items():
            # --- Tabla: Estudiante ---
            if clave in campos_principal:
                setattr(estudiante, clave, valor)

            # --- Tabla: Contacto ---
            elif clave in campos_contacto:
                if contacto:
                    setattr(contacto, clave, valor)
                else:
                    # Sobrescribimos la variable 'contacto' original en lugar de crear una nueva variable
                    contacto = models.ContactoEstudiante(
                        estudiante_id=estudiante.id,
                        correo_alternativo="",
                        telefono="",
                        telefono_emergencia=""
                    )
                    setattr(contacto, clave, valor)
                    db.add(contacto)

            # --- Tabla: Datos Personales ---
            elif clave in campos_datos:
                
                if datos:
                    setattr(datos, clave, valor)
                else:
                    # Sobrescribimos la variable 'datos' original
                    datos = models.DatosEstudiante(
                        estudiante_id=estudiante.id,
                        fecha_nacimiento=date(2000, 1, 1), 
                        genero="",
                        curp="",
                        nss="",
                        lugar_nacimiento="",
                        creditos=""
                    )
                    setattr(datos, clave, valor)
                    db.add(datos)

        # Guardamos todo (AQUÍ YA SOLO INTENTARÁ GUARDAR UN OBJETO)
        db.commit()
        return {"status": "success", "mensaje": "Campo actualizado correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
    
@app.get('/api/estudiantes/perfil/{correo}')
async def obtener_perfil(correo: str, db: Session = Depends(get_db)):
    # 1. Buscamos al estudiante principal
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    # 2. Buscamos los registros asociados usando el ID del estudiante
    contacto = db.query(models.ContactoEstudiante).filter(models.ContactoEstudiante.estudiante_id == estudiante.id).first()
    domicilio = db.query(models.DomicilioLocal).filter(models.DomicilioLocal.estudiante_id == estudiante.id).first()
    datos = db.query(models.DatosEstudiante).filter(models.DatosEstudiante.estudiante_id == estudiante.id).first()

    # 3. Empaquetamos todo en un solo diccionario (JSON) para que el frontend lo lea fácil
    return {
        "estudiante": {
            "nombre": estudiante.nombre,
            "apellidos": estudiante.apellidos,
            "matricula": estudiante.matricula,
            "grupo": estudiante.grupo,
            "carrera": estudiante.carrera,
            "status": estudiante.status.value if estudiante.status else None
        },
        "contacto": contacto,
        "domicilio": domicilio,
        "datos_personales": datos
    }

@app.patch('/api/estudiantes/estancias/{correo}')
async def actualizar_estancia_estudiantes(correo: str, datos: dict, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    datos_personales = ['nombre', 'apellidos', "matricula", "grupo", "carrera"]
    datos_contacto = ['correo_alternativo', 'telefono', 'telefono_emergencia']
    datos_domicilio_local = ["calle", "colonia", "ciudad", "municipio", "codigo_postal"]
    datos_domicilio_procedencia = [
        'procedencia_calle', 'procedencia_colonia', 'procedencia_ciudad', 
        'procedencia_codigo_postal', 'procedencia_municipio', 'procedencia_estado'
    ]
    datos_sociodemograficos = ['discapacidad', 'lengua_indigena', 'hijos']
    datos_estancia = ['periodo', 'tipo_estancia', 'minimo_horas', 'fecha_inicio', 'fecha_fin', 'horario', 'proyecto', 'objetivo_general', 'actividades_principales']
    campos_datos_estudiante = ['fecha_nacimiento', 'nss', 'curp', 'genero', "lugar_nacimiento", "creditos"]

    try:
        for clave, valor in datos.items():
            # Datos personales
            if clave in datos_personales:
                setattr(estudiante, clave, valor)

            # Contacto
            elif clave in datos_contacto:
                contacto = db.query(models.ContactoEstudiante).filter(models.ContactoEstudiante.estudiante_id == estudiante.id).first()
                if (contacto):
                    setattr(contacto, clave, valor)
                else:
                    nuevo_contacto = models.ContactoEstudiante(
                        estudiante_id=estudiante.id,
                        correo_alternativo="",
                        telefono="",
                        telefono_emergencia=""
                    )
                    setattr(nuevo_contacto, clave, valor)
                    db.add(nuevo_contacto)

            # Domicilio Local
            elif clave in datos_domicilio_local:
                domicilio_local = db.query(models.DomicilioLocal).filter(models.DomicilioLocal.estudiante_id == estudiante.id).first()
                if domicilio_local:
                    setattr(domicilio_local, clave, valor)
                else:
                    nuevo_domicilio_local = models.DomicilioLocal(
                        estudiante_id=estudiante.id,
                        calle="",
                        colonia="",
                        ciudad="",
                        municipio="",
                        codigo_postal=""
                    )
                    setattr(nuevo_domicilio_local, clave, valor)
                    db.add(nuevo_domicilio_local)

            # Domicilio de Procedencia
            elif clave in datos_domicilio_procedencia:
                columna_real = clave.replace("procedencia_", "")
                domicilio_procedencia = db.query(models.DomicilioProcedencia).filter(models.DomicilioProcedencia.estudiante_id == estudiante.id).first()
                if domicilio_procedencia:
                    setattr(domicilio_procedencia, columna_real, valor)
                else:
                    nuevo_domicilio_procedencia = models.DomicilioProcedencia(
                        estudiante_id=estudiante.id,
                        calle="",
                        colonia="",
                        ciudad="",
                        municipio="",
                        codigo_postal="",
                        estado=""
                    )
                    setattr(nuevo_domicilio_procedencia, columna_real, valor)
                    db.add(nuevo_domicilio_procedencia)
            
            # Información sociodemográfica
            elif clave in datos_sociodemograficos:
                informacion_sd = db.query(models.InformacionSociodemografica).filter(models.InformacionSociodemografica.estudiante_id == estudiante.id).first()
                if informacion_sd:
                    setattr(informacion_sd, clave, valor)
                else:
                    nueva_informacion_sd = models.InformacionSociodemografica(
                        estudiante_id=estudiante.id,
                        discapacidad="",
                        lengua_indigena="",
                        hijos=""
                    )
                    setattr(nueva_informacion_sd, clave, valor)
                    db.add(nueva_informacion_sd)
            # Información de la estancia
            elif clave in datos_estancia:
                detalles_estancia = db.query(models.DetallesEstancia).filter(models.DetallesEstancia.estudiante_id == estudiante.id).first()
                if detalles_estancia:
                    setattr(detalles_estancia, clave, valor)
                else:
                    nueva_estancia = models.DetallesEstancia(
                        estudiante_id=estudiante.id,
                        periodo="",
                        tipo_estancia="",
                        minimo_horas="",
                        fecha_inicio=date(2000, 1, 1),
                        fecha_fin=date(2000, 1, 2),
                        horario="",
                        proyecto="",
                        objetivo_general="",
                        actividades_principales=""
                    )
                    setattr(nueva_estancia, clave, valor)
                    db.add(nueva_estancia)

            elif clave in campos_datos_estudiante:
                datos_extra = db.query(models.DatosEstudiante).filter(models.DatosEstudiante.estudiante_id == estudiante.id).first()
                if datos_extra:
                    setattr(datos_extra, clave, valor)
                else:
                    nuevo_dato_extra = models.DatosEstudiante(
                        estudiante_id=estudiante.id,
                        fecha_nacimiento=date(2000, 1, 1), 
                        genero="",
                        curp="",
                        nss="",
                        lugar_nacimiento="",
                        creditos=""
                    )
                    setattr(nuevo_dato_extra, clave, valor)
                    db.add(nuevo_dato_extra)
        db.commit()
        return {"status": "success", "mensaje": "Campo actualizado correctamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
    
@app.get('/api/estudiantes/estancias/{correo}')
async def obtener_formulario(correo: str, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()

    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    contacto = db.query(models.ContactoEstudiante).filter(models.ContactoEstudiante.estudiante_id == estudiante.id).first()
    domicilio_local = db.query(models.DomicilioLocal).filter(models.DomicilioLocal.estudiante_id == estudiante.id).first()
    domicilio_procedencia = db.query(models.DomicilioProcedencia).filter(models.DomicilioProcedencia.estudiante_id == estudiante.id).first()
    informacion_demografica = db.query(models.InformacionSociodemografica).filter(models.InformacionSociodemografica.estudiante_id == estudiante.id).first()
    detalles_estancia = db.query(models.DetallesEstancia).filter(models.DetallesEstancia.estudiante_id == estudiante.id).first()
    datos_personales = db.query(models.DatosEstudiante).filter(models.DatosEstudiante.estudiante_id == estudiante.id).first()

    return {
        "estudiante": {
            "nombre": estudiante.nombre,
            "apellidos": estudiante.apellidos,
            "matricula": estudiante.matricula,
            "grupo": estudiante.grupo,
            "carrera": estudiante.carrera,
            "status": estudiante.status.value if estudiante.status else None
        },
        "contacto": contacto,
        "domicilio_local": domicilio_local,
        "domicilio_procedencia": domicilio_procedencia,
        "informacion_demografica": informacion_demografica,
        "detalles_estancia": detalles_estancia,
        "datos_personales": datos_personales
    }

@app.get('/api/estudiantes/empresa/{correo}')
async def obtener_empresa(correo: str, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()

    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    empresa = db.query(models.Empresa).filter(models.Empresa.estudiante_id == estudiante.id).first()

    return empresa if empresa else {}


@app.patch('/api/estudiantes/empresa/{correo}')
async def actualizar_empresa(correo: str, datos: schemas.EmpresaUpdate, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    empresa = db.query(models.Empresa).filter(models.Empresa.estudiante_id == estudiante.id).first()
    
    if not empresa:
        empresa = models.Empresa(estudiante_id=estudiante.id)
        db.add(empresa)
        db.commit()
        db.refresh(empresa)

    datos_actualizar = datos.dict(exclude_unset=True)

    try:
        for clave, valor in datos_actualizar.items():
            setattr(empresa, clave, valor)
            
        db.commit()
        db.refresh(empresa)
        
        return {"mensaje": "Datos de la empresa actualizados", "empresa": empresa}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al guardar: {str(e)}")

@app.get('/api/estudiantes/detalles/{correo}')
async def obtener_detalles_resumen(correo: str, db: Session = Depends(get_db)):
    # 1. Buscar al estudiante base
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    # 2. Consultar las tablas relacionadas
    contacto = db.query(models.ContactoEstudiante).filter(models.ContactoEstudiante.estudiante_id == estudiante.id).first()
    empresa = db.query(models.Empresa).filter(models.Empresa.estudiante_id == estudiante.id).first()
    estancia = db.query(models.DetallesEstancia).filter(models.DetallesEstancia.estudiante_id == estudiante.id).first()

    # 3. Construir la ubicación concatenada de la empresa (si existe)
    ubicacion_empresa = "Sin asignar"
    if empresa:
        # Filtramos campos nulos o vacíos para armar la dirección
        partes = [empresa.calle, empresa.colonia, empresa.ciudad, empresa.estado]
        partes_validas = [p for p in partes if p and p.strip() != ""]
        if partes_validas:
            ubicacion_empresa = ", ".join(partes_validas)
            if empresa.codigo_postal:
                ubicacion_empresa += f", C.P. {empresa.codigo_postal}"

    # 4. Retornar el JSON estructurado exactamente como lo necesita tu vista Detalles.tsx
    return {
        "estudiante": {
            "nombre_completo": f"{estudiante.nombre} {estudiante.apellidos}",
            "matricula": estudiante.matricula,
            "carrera": estudiante.carrera,
            "semestre": estudiante.semestre_egresado,
            "correo": estudiante.correo,
            "telefono": contacto.telefono if contacto else "Sin registrar"
        },
        "empresa": {
            "nombre": empresa.nombre if empresa else "Sin registrar",
            "sector": empresa.sector if empresa else "Sin registrar",
            "ubicacion": ubicacion_empresa,
            "tutor_nombre": empresa.nombre_asesor if empresa else "Sin registrar",
            "tutor_cargo": empresa.cargo_asesor if empresa else "Sin registrar",
            "tutor_correo": empresa.correo_asesor if empresa else "Sin registrar",
            "telefono": empresa.telefono if empresa else "Sin registrar"
        },
        "estancia": {
            "tipo": estancia.tipo_estancia if estancia else "Sin registrar",
            "proyecto": estancia.proyecto if estancia else "Sin registrar",
            "objetivo": estancia.objetivo_general if estancia else "Sin registrar",
            "actividades": estancia.actividades_principales if estancia else "Sin registrar",
            "fecha_inicio": estancia.fecha_inicio if estancia else None,
            "fecha_fin": estancia.fecha_fin if estancia else None,
            "total_horas": estancia.minimo_horas if estancia else "Sin registrar",
            "horario": estancia.horario if estancia else "Sin registrar"  # Puedes usar este campo para la "Modalidad" del UI
        }
    }

@app.patch('/api/estudiantes/estancias/{correo}/enviar')
async def enviar_estancia_a_validacion(correo: str, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
        
    # Cambiamos el estado de 'En Proceso' a 'Pendiente'
    estudiante.status = models.EstadoEstudiante.PENDIENTE
    
    db.commit()
    return {"status": "success", "mensaje": "Solicitud enviada a validación correctamente"}

# Esquema para recibir la acción desde el frontend
class ValidacionRequest(BaseModel):
    accion: str

@app.patch('/api/admin/estudiantes/{correo}/validar')
async def validar_estancia(correo: str, datos: ValidacionRequest, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    if datos.accion == "aprobar":
        # 1. Cambiar estado
        estudiante.status = models.EstadoEstudiante.VALIDADO
        
        # 2. Agregar el documento de "formulario_estancia"
        doc_existente = db.query(models.Documento).filter(
            models.Documento.estudiante_id == estudiante.id,
            models.Documento.nombre_documento == "formulario_estancia"
        ).first()

        if doc_existente:
            doc_existente.estado_documento = "Aprobado"
        else:
            nuevo_doc = models.Documento(
                nombre_documento="formulario_estancia",
                estado_documento="Aprobado",
                estudiante_id=estudiante.id
            )
            db.add(nuevo_doc)

        mensaje = "Expediente aprobado correctamente."
        # Simulación de notificación (Aquí puedes usar fastapi-mail a futuro)
        print(f"📧 NOTIFICACIÓN ENVIADA: Hola {estudiante.nombre}, tu solicitud de estancia ha sido APROBADA.")

    elif datos.accion == "rechazar":
        # 1. Cambiar estado a revisión
        estudiante.status = models.EstadoEstudiante.EN_PROCESO
        mensaje = "Expediente rechazado y enviado a revisión."
        # Simulación de notificación
        print(f"📧 NOTIFICACIÓN ENVIADA: Hola {estudiante.nombre}, tu solicitud fue RECHAZADA. Inicia sesión para corregirla.")
        
    else:
        raise HTTPException(status_code=400, detail="Acción no válida")

    db.commit()
    return {"status": "success", "mensaje": mensaje}

@app.get('/api/estudiantes/carta-presentacion/{correo}')
async def generar_carta_presentacion(correo: str, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    datos_personales = db.query(models.DatosEstudiante).filter(models.DatosEstudiante.estudiante_id == estudiante.id).first()
    empresa = db.query(models.Empresa).filter(models.Empresa.estudiante_id == estudiante.id).first()
    estancia = db.query(models.DetallesEstancia).filter(models.DetallesEstancia.estudiante_id == estudiante.id).first()

    if not empresa or not estancia or not datos_personales:
        raise HTTPException(status_code=400, detail="Faltan datos en el expediente para generar la carta.")

    pdf = FPDF()
    pdf.add_page()
    pdf.set_margins(25, 25, 25)
    
    pdf.set_font("Helvetica", style="B", size=10)
    
    # 3. Encabezado usando new_x y new_y en lugar de ln=True
    pdf.cell(0, 5, "ASUNTO: OFICIO DE PRESENTACIÓN", new_x="LMARGIN", new_y="NEXT", align="R")
    pdf.cell(0, 5, "OFICIO No. 043 VAC/CEPH/UMAR/26", new_x="LMARGIN", new_y="NEXT", align="R")
    pdf.cell(0, 5, "BAHÍAS DE HUATULCO, OAXACA", new_x="LMARGIN", new_y="NEXT", align="R")
    pdf.ln(15)

    # 4. Datos del Titular de la Empresa
    nombre_titular = empresa.nombre_titular.upper() if empresa.nombre_titular else "A QUIEN CORRESPONDA"
    cargo_titular = empresa.cargo_titular.upper() if empresa.cargo_titular else ""
    nombre_empresa = empresa.nombre.upper() if empresa.nombre else ""
    
    pdf.cell(0, 5, nombre_titular, new_x="LMARGIN", new_y="NEXT", align="L")
    pdf.cell(0, 5, cargo_titular, new_x="LMARGIN", new_y="NEXT", align="L")
    pdf.cell(0, 5, nombre_empresa, new_x="LMARGIN", new_y="NEXT", align="L")
    pdf.cell(0, 5, "PRESENTE", new_x="LMARGIN", new_y="NEXT", align="L")
    pdf.ln(10)

    # 5. Cuerpo del documento
    pdf.set_font("Helvetica", size=11)
    
    fecha_inicio_str = formatear_fecha(estancia.fecha_inicio) if estancia.fecha_inicio else "N/A"
    fecha_fin_str = formatear_fecha(estancia.fecha_fin) if estancia.fecha_fin else "N/A"
    
    texto_parrafo_1 = (
        f"La Universidad del Mar, a través de la Coordinación de Estancias Profesionales, "
        f"presenta a la C. {estudiante.nombre} {estudiante.apellidos}, egresada de la licenciatura en "
        f"{estudiante.carrera} con número de matrícula {estudiante.matricula}, número de Seguro "
        f"Social: {datos_personales.nss}, con la finalidad de realizar su Estancia Profesional en el área "
        f"de {empresa.area} del {fecha_inicio_str} al {fecha_fin_str}, para cubrir un total "
        f"de {estancia.minimo_horas} horas."
    )
    
    texto_parrafo_2 = (
        "Atentos a cualquier observación, agradecemos su valiosa colaboración, la cual "
        "contribuye al logro de una mejor formación profesional de nuestros educandos."
    )

    pdf.multi_cell(0, 6, texto_parrafo_1, align="J")
    pdf.ln(5)
    pdf.multi_cell(0, 6, texto_parrafo_2, align="J")
    pdf.ln(20)

    # 6. Despedida y Firmas
    pdf.set_font("Helvetica", style="B", size=11)
    pdf.cell(0, 5, "Atentamente", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.ln(20)
    pdf.cell(0, 5, "Mtra. Jessica Margarita García Hernández", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.set_font("Helvetica", size=10)
    pdf.cell(0, 5, "Coordinadora de Estancias Profesionales", new_x="LMARGIN", new_y="NEXT", align="C")
    pdf.cell(0, 5, "Universidad del Mar, Campus Huatulco", new_x="LMARGIN", new_y="NEXT", align="C")

    # 7. Convertir directamente a bytes
    pdf_bytes = bytes(pdf.output()) 
    
    return StreamingResponse(
        io.BytesIO(pdf_bytes), 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"inline; filename=Carta_Presentacion_{estudiante.matricula}.pdf"}
    )

@app.post("/api/estudiantes/documentos/{correo}/{id_documento}")
async def subir_documento(
    correo: str, 
    id_documento: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    # 1. Validar que el estudiante exista
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    # 2. Procesar el nombre y extensión del archivo
    extension = file.filename.split('.')[-1] if '.' in file.filename else 'pdf'
    
    # 3. Crear la ruta dentro del bucket (Ej: "2020040102/cv.pdf")
    s3_key = f"{estudiante.matricula}/{id_documento}.{extension}"

    try:
        # 4. Subir el archivo a Garage S3
        s3_client.upload_fileobj(file.file, BUCKET_NAME, s3_key)
        
        # 5. Generar la URL pública del archivo
        url_archivo = f"{S3_ENDPOINT}/{BUCKET_NAME}/{s3_key}"

        # 6. Actualizar o crear el registro en la base de datos
        doc = db.query(models.Documento).filter(
            models.Documento.estudiante_id == estudiante.id,
            models.Documento.nombre_documento == id_documento
        ).first()

        if doc:
            doc.url_archivo = url_archivo
            doc.estado_documento = "Cargado"
        else:
            nuevo_doc = models.Documento(
                nombre_documento=id_documento,
                url_archivo=url_archivo,
                estado_documento="Cargado",
                estudiante_id=estudiante.id
            )
            db.add(nuevo_doc)

        estudiante.status = "PENDIENTE"

        db.commit()

        return {
            "status": "success",
            "mensaje": "Archivo subido correctamente", 
            "url": url_archivo
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno al subir el archivo: {str(e)}")
    

@app.get("/api/estudiantes/documentos/{correo}/{id_documento}")
async def ver_documento(correo: str, id_documento: str, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    doc = db.query(models.Documento).filter(
        models.Documento.estudiante_id == estudiante.id,
        models.Documento.nombre_documento == id_documento
    ).first()

    if not doc or not doc.url_archivo:
        raise HTTPException(status_code=404, detail="El documento no ha sido cargado")

    s3_key = doc.url_archivo.split(f"{BUCKET_NAME}/")[-1]

    try:
        # USAMOS EL CLIENTE PÚBLICO AQUÍ
        presigned_url = s3_client_public.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': s3_key},
            ExpiresIn=3600
        )
        
        # Ya no necesitamos el replace, la URL ya viene con localhost
        return RedirectResponse(url=presigned_url)

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al generar el enlace seguro de S3")
    
@app.get("/api/estudiantes/{correo}/documentos/estados")
async def obtener_estados_documentos(correo: str, db: Session = Depends(get_db)):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")
    
    # Buscamos todos los documentos asociados al estudiante
    documentos = db.query(models.Documento).filter(models.Documento.estudiante_id == estudiante.id).all()
    
    # Formateamos la respuesta como un diccionario fácil de leer para React:
    # { "cv": { "estado": "Cargado", "url": "..." }, "credencial": { "estado": "Validado", "url": "..." } }
    resultado = {}
    for doc in documentos:
        resultado[doc.nombre_documento] = {
            "estado": doc.estado_documento,
            "url": doc.url_archivo
        }
        
    return resultado

@app.put("/api/admin/documentos/{correo}/{id_documento}/estado")
async def cambiar_estado_documento(
    correo: str, 
    id_documento: str, 
    datos: ActualizarEstadoDoc, 
    db: Session = Depends(get_db)
):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    doc = db.query(models.Documento).filter(
        models.Documento.estudiante_id == estudiante.id,
        models.Documento.nombre_documento == id_documento
    ).first()

    # MAGIA AQUÍ: Si el documento no existe, lo creamos
    if not doc:
        doc = models.Documento(
            estudiante_id=estudiante.id,
            nombre_documento=id_documento,
            estado_documento=datos.estado,
            url_archivo=None
        )
        db.add(doc)
    else:
        doc.estado_documento = datos.estado

    # Manejo del motivo de rechazo
    if datos.estado == "En Revisión":
        doc.motivo_rechazo = datos.motivo
    else:
        doc.motivo_rechazo = None
        
    db.commit()

    return {"status": "success", "mensaje": f"Estado actualizado a {datos.estado}"}

@app.post("/api/admin/documentos/{correo}/{id_documento}")
async def admin_subir_documento(
    correo: str, 
    id_documento: str, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    doc = db.query(models.Documento).filter(
        models.Documento.estudiante_id == estudiante.id,
        models.Documento.nombre_documento == id_documento
    ).first()

    # MAGIA AQUÍ: Si el documento no existe, lo pre-creamos antes de subir a S3
    if not doc:
        doc = models.Documento(
            estudiante_id=estudiante.id,
            nombre_documento=id_documento,
            estado_documento="Pendiente",
            url_archivo=None
        )
        db.add(doc)
        db.flush() # Guarda temporalmente para poder actualizarlo abajo

    file_extension = file.filename.split('.')[-1]
    s3_key = f"{estudiante.matricula}/{id_documento}.{file_extension}"

    try:
        s3_client.upload_fileobj(
            file.file,
            BUCKET_NAME,
            s3_key,
            ExtraArgs={'ContentType': file.content_type}
        )
        url_archivo = f"http://localhost:3900/{BUCKET_NAME}/{s3_key}"
        
        # Actualizamos la base de datos
        doc.url_archivo = url_archivo
        doc.estado_documento = "Aprobado" # Se aprueba automáticamente
        doc.motivo_rechazo = None
        db.commit()

        return {"status": "success", "url": url_archivo}
    except Exception as e:
        db.rollback() # Revertimos si S3 falla
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/api/admin/estadisticas/progreso')
def obtener_progreso_documentos(db: Session = Depends(get_db)):
    # Definimos los documentos clave en el ciclo de vida de la estancia
    documentos_clave = [
        "Solicitud Recibida", 
        "Plan de Trabajo", 
        "Reporte Parcial 1", 
        "Informe Final", 
        "Oficio de Terminación"
    ]
    
    resultados = []
    for doc in documentos_clave:
        # Consideramos que un alumno pasó la etapa si su documento ya tiene un archivo subido
        cantidad = db.query(models.Documento).filter(
            models.Documento.nombre_documento == doc,
            models.Documento.url_archivo != None
        ).count()
        resultados.append({"etapa": doc, "alumnos": cantidad})
        
    return resultados

@app.get('/api/admin/estadisticas/sectores')
def obtener_sectores_empresa(db: Session = Depends(get_db)):
    # Agrupamos las empresas por su sector y contamos cuántas hay de cada uno
    sectores = db.query(
        models.Empresa.sector, 
        func.count(models.Empresa.id)
    ).group_by(models.Empresa.sector).all()
    
    # Formateamos directo para Recharts: [{name: 'Privado', value: 10}, ...]
    return [{"name": sector, "value": total} for sector, total in sectores if sector]

@app.get('/api/admin/estadisticas/demografia')
def obtener_demografia(db: Session = Depends(get_db)):
    # Hacemos un JOIN entre estudiantes y datos_estudiante para cruzar Carrera y Género
    resultados = db.query(
        models.Estudiante.carrera,
        models.DatosEstudiante.genero,
        func.count(models.Estudiante.id)
    ).join(
        models.DatosEstudiante, 
        models.Estudiante.id == models.DatosEstudiante.estudiante_id
    ).group_by(models.Estudiante.carrera, models.DatosEstudiante.genero).all()
    
    data_dict = {}
    for carrera, genero, total in resultados:
        if carrera not in data_dict:
            data_dict[carrera] = {"carrera": carrera, "Mujeres": 0, "Hombres": 0}
            
        # Agrupamos dependiendo de cómo se esté guardando en la BD
        if genero and genero.lower() in ["mujer", "femenino", "f"]:
            data_dict[carrera]["Mujeres"] = total
        else:
            data_dict[carrera]["Hombres"] = total
            
    return list(data_dict.values())

@app.post(
    "/api/admin/administradores", 
    response_model=schemas.AdministradorResponse, 
    status_code=status.HTTP_201_CREATED,
    tags=["Administradores"]
)
def crear_administrador(
    admin_data: schemas.AdministradorCreate, 
    db: Session = Depends(get_db)
    # Puedes descomentar la siguiente línea si deseas proteger la ruta con tus permisos:
    # usuario_verificado = Depends(requerir_permiso("CREAR_ADMIN"))
):
    # 1. Validar que el correo no esté en uso
    admin_existente = db.query(models.Administrador).filter(
        models.Administrador.correo == admin_data.correo
    ).first()
    
    if admin_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El correo electrónico ya está registrado."
        )
    
    # 2. Generar el hash de la contraseña
    hashed_password = get_password_hash(admin_data.contrasena)
    
    # 3. Crear el nuevo registro usando el modelo
    nuevo_admin = models.Administrador(
        nombre=admin_data.nombre,
        correo=admin_data.correo,
        contrasena=hashed_password,
        estado=admin_data.estado,
        rol_id=admin_data.rol_id
    )
    
    # 4. Insertar y confirmar en la base de datos
    db.add(nuevo_admin)
    db.commit()
    db.refresh(nuevo_admin)
    
    # Al retornar la instancia, FastAPI y Pydantic filtrarán la contraseña 
    # gracias a que especificamos response_model=schemas.AdministradorResponse
    return nuevo_admin

@app.get("/api/admin/administradores", response_model=list[schemas.AdministradorResponse], tags=["Administradores"])
def listar_administradores(db: Session = Depends(get_db)):
    # Traemos todos los registros de la tabla administradores
    return db.query(models.Administrador).all()

@app.post("/api/admin/login", tags=["Administradores"])
def login_administrador(data: LoginSchema, db: Session = Depends(get_db)):
    # Buscamos al administrador por correo
    admin = db.query(models.Administrador).filter(models.Administrador.correo == data.correo).first()
    if not admin:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
        
    # Verificamos la contraseña (recuerda truncar a 72 por consistencia con bcrypt)
    if not pwd_context.verify(data.password[:72], admin.contrasena):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
        
    if not admin.estado:
        raise HTTPException(status_code=400, detail="El administrador se encuentra inactivo")
        
    # Retornamos las propiedades estándar que NextAuth espera (id, name, email)
    return {"id": str(admin.id), "name": admin.nombre, "email": admin.correo}