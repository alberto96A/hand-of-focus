import ai_service
import db
import os
import tempfile
from pathlib import Path
from dotenv import load_dotenv
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Forzar la carga del archivo .env que está en la misma carpeta que main.py (backend/.env)
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError(
        f"No se pudo cargar GROQ_API_KEY desde {env_path}. "
        "Asegúrate de que el archivo se llama exactamente .env y contiene GROQ_API_KEY=gsk_..."
    )

# Inicializar cliente de Groq pasando la clave de forma explícita
groq_client = Groq(api_key=api_key)

app = FastAPI(
    title="Hand of Focus API",
    description="Backend para el copilot de autorregulación y foco TDAH",
    version="1.0.0"
)

# Permitir conexiones desde el Frontend de Next.js (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001"
    ],
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


class ReengagementResponse(BaseModel):
    transcripcion: str
    respuesta: str


# Endpoints de la API

@app.get("/")
def read_root():
    return {"status": "online", "app": "Hand of Focus API"}


@app.post("/api/sesiones")
def guardar_sesion_endpoint(data: SesionRequest):
    db.guardar_sesion(modo=data.modo, duracion=data.duracion, notas=data.notas)
    return {"status": "success", "message": "Sesión registrada correctamente en SQLite"}


# ENDPOINT MULTIMODAL (WHISPER + LLAMA 3 EN GROQ)
@app.post("/api/reenganche-audio", response_model=ReengagementResponse)
def procesar_reenganche_audio(
    audio: UploadFile = File(...),
    pregunta_usuario: Optional[str] = Form(None)
):
    print("---> [1] Petición recibida en el backend")

    if not audio.filename:
        raise HTTPException(
            status_code=400, detail="No se envió ningún archivo.")

    tmp_path = None
    try:
        print("---> [2] Leyendo bytes del archivo de audio...")
        audio_bytes = audio.file.read()
        print(f"---> [3] Tamaño del audio recibido: {len(audio_bytes)} bytes")

        if not audio_bytes or len(audio_bytes) == 0:
            raise HTTPException(
                status_code=400, detail="El archivo está vacío.")

        suffix = os.path.splitext(audio.filename)[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            tmp_file.write(audio_bytes)
            tmp_path = tmp_file.name

        print(f"---> [4] Archivo temporal guardado en: {tmp_path}")
        print("---> [5] Enviando audio a Groq (Whisper)...")

        with open(tmp_path, "rb") as file_to_transcribe:
            transcription = groq_client.audio.transcriptions.create(
                file=(audio.filename, file_to_transcribe),
                model="whisper-large-v3",
                language="es",
                response_format="json"
            )

        texto_transcrito = transcription.text if hasattr(
            transcription, 'text') else transcription.get('text', '')
        print(f"---> [6] Transcripción recibida de Groq: {texto_transcrito}")

        print("---> [7] Enviando texto a Groq (Llama 3)...")
        prompt = f"El usuario se ha distraído. Resume este fragmento de clase en 2 o 3 frases para reengancharlo: {texto_transcrito}"

        completion = groq_client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=[
                {"role": "system", "content": "Eres un tutor conciso y amigable."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )

        respuesta_llama = completion.choices[0].message.content
        print("---> [8] Respuesta recibida de Llama 3 con éxito.")

        return ReengagementResponse(
            transcripcion=texto_transcrito,
            respuesta=respuesta_llama
        )

    except Exception as e:
        print(f"---> [ERROR EN BACKEND]: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
