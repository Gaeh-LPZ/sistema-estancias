from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Ajusta estas credenciales según tu docker-compose.yml
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_bd
# Si tu base de datos corre en docker y este backend también, el host suele ser el nombre del servicio en docker (ej: "db")
SQLALCHEMY_DATABASE_URL = "postgresql://admin:umar123@db:5432/estancias"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para inyectar la sesión de base de datos en las rutas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()