from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware # 1. Importar el middleware de CORS
from sqlalchemy.orm import Session
import pandas as pd

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
    
    if tu_usuario and tu_usuario.rol_id:
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
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="Formato no soportado.")
    
    try:
        rol_estudiante = db.query(models.Rol).filter(models.Rol.rol == "Estudiante").first()
        if not rol_estudiante:
            raise HTTPException(status_code=500, detail="El rol 'Estudiante' no está inicializado en la BD.")

        df = pd.read_excel(file.file, engine='openpyxl')
        df.columns = df.columns.str.lower()
        
        columnas_esperadas = ['correo', 'nombre', 'carrera', 'semestre']
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
                    carrera=row['carrera'],
                    semestre_egresado=str(row['semestre']),
                    rol_id=rol_estudiante.id
                )
                db.add(nuevo_estudiante)
                nuevos_registros += 1
            
        db.commit()

        return {
            "mensaje": f"Se insertaron {nuevos_registros} estudiantes con el rol de Estudiante.",
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