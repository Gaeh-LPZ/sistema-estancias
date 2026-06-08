from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware # 1. Importar el middleware de CORS
from sqlalchemy.orm import Session
import pandas as pd
import io
from fastapi.responses import StreamingResponse
from schemas import PerfilCompletoUpdate
from datetime import date

from database import engine, Base, get_db
import models

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante or not estudiante.rol_id:
        raise HTTPException(status_code=404, detail="Usuario no encontrado o sin rol")
        
    rol = db.query(models.Rol).filter(models.Rol.id == estudiante.rol_id).first()
    return {"rol": rol.rol} # type: ignore

@app.patch('/api/estudiantes/perfil/{correo}')
async def actualizar_perfil(correo: str, datos_parciales: dict, db: Session = Depends(get_db)):
    # 1. Buscamos al estudiante principal
    estudiante = db.query(models.Estudiante).filter(models.Estudiante.correo == correo).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    campos_principal = ["nombre", "apellidos", "matricula", "grupo", "carrera"]
    campos_contacto = ["correo_alternativo", "telefono", "telefono_emergencia"]
    campos_domicilio = ["calle", "colonia", "ciudad", "municipio", "codigo_postal"]
    campos_datos = ["fecha_nacimiento", "genero", "curp", "nss"]

    try:
        for clave, valor in datos_parciales.items():
            
            # --- Tabla: Estudiante ---
            if clave in campos_principal:
                setattr(estudiante, clave, valor)

            # --- Tabla: Contacto ---
            elif clave in campos_contacto:
                contacto = db.query(models.ContactoEstudiante).filter(models.ContactoEstudiante.estudiante_id == estudiante.id).first()
                if contacto:
                    setattr(contacto, clave, valor)
                else:
                    # Rellenamos los campos obligatorios con strings vacíos
                    nuevo_contacto = models.ContactoEstudiante(
                        estudiante_id=estudiante.id,
                        correo_alternativo="",
                        telefono="",
                        telefono_emergencia=""
                    )
                    setattr(nuevo_contacto, clave, valor)
                    db.add(nuevo_contacto)

            # --- Tabla: Domicilio ---
            elif clave in campos_domicilio:
                domicilio = db.query(models.DomicilioEstudiante).filter(models.DomicilioEstudiante.estudiante_id == estudiante.id).first()
                if domicilio:
                    setattr(domicilio, clave, valor)
                else:
                    # Rellenamos los campos obligatorios con strings vacíos
                    nuevo_domicilio = models.DomicilioEstudiante(
                        estudiante_id=estudiante.id,
                        calle="", colonia="", ciudad="", municipio="", codigo_postal=""
                    )
                    setattr(nuevo_domicilio, clave, valor)
                    db.add(nuevo_domicilio)

            # --- Tabla: Datos Personales ---
            elif clave in campos_datos:
                datos = db.query(models.DatosEstudiante).filter(models.DatosEstudiante.estudiante_id == estudiante.id).first()
                if datos:
                    setattr(datos, clave, valor)
                else:
                    # Rellenamos los campos obligatorios. 
                    # Usamos una fecha por defecto (ej. 2000-01-01) para que Postgres no rechace el Date
                    nuevo_datos = models.DatosEstudiante(
                        estudiante_id=estudiante.id,
                        fecha_nacimiento=date(2000, 1, 1), 
                        genero="",
                        curp="",
                        nss=""
                    )
                    setattr(nuevo_datos, clave, valor)
                    db.add(nuevo_datos)

        # Guardamos todo
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
    domicilio = db.query(models.DomicilioEstudiante).filter(models.DomicilioEstudiante.estudiante_id == estudiante.id).first()
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