from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from . import db
from . import ai_service

app = FastAPI(
    title="Hand of Focus API",
    description="Backend para el copilot de autorregulación y foco TDAH",
    version="1.0.0"
)

# Permitir conexiones desde el Frontend de Next.js (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar la base de datos al arrancar
@app.on_event("startup")
def startup_event():
    db.init_db()

# Schemas de validación para Pydantic
class SesionRequest(BaseModel):
    modo: str
    duracion: int
    notas: Optional[str] = ""

class ReengancheRequest(BaseModel):
    transcripcion: str

# Endpoints de la API

@app.get("/")
def read_root():
    return {"status": "online", "app": "Hand of Focus API"}

@app.post("/api/sesiones")
def guardar_sesion_endpoint(data: SesionRequest):
    db.guardar_sesion(modo=data.modo, duracion=data.duracion, notas=data.notas)
    return {"status": "success", "message": "Sesión registrada correctamente en SQLite"}

@app.post("/api/reenganche")
def reenganche_ia_endpoint(data: ReengancheRequest):
    resumen = ai_service.obtener_respuesta_ia(data.transcripcion)
    return {"status": "success", "resumen": resumen}