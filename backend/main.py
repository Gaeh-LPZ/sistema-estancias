from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware # 1. Importar el middleware de CORS
from sqlalchemy.orm import Session
import pandas as pd
import io
from fastapi.responses import StreamingResponse
import schemas
from datetime import date
import numpy as np

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