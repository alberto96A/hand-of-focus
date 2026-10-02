import os
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(
    prefix="/api",
    tags=["Modo Clase"]
)

# Inicializar cliente de Groq (requiere GROQ_API_KEY en tu archivo .env)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class ReengagementResponse(BaseModel):
    transcripcion: str
    respuesta: str


@router.post("/reenganche-audio", response_model=ReengagementResponse)
async def procesar_reenganche_audio(
    audio: UploadFile = File(...),
    pregunta_usuario: Optional[str] = Form(None)
):
    """
    Endpoint que recibe un archivo de audio del micrófono,
    1. Transcribe el audio con Whisper (whisper-large-v3)
    2. Sintetiza la explicación con Llama 3 (llama-3.3-70b-versatile)
    """
    if not audio.filename:
        raise HTTPException(status_code=400, detail="No se ha enviado ningún archivo de audio.")

    # Guardar temporalmente el archivo de audio recibido
    try:
        suffix = os.path.splitext(audio.filename)[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            content = await audio.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        # STEP 1: Transcripción de Audio con Whisper
        with open(tmp_path, "rb") as file_to_transcribe:
            transcription = client.audio.transcriptions.create(
                file=(audio.filename, file_to_transcribe.read()),
                model="whisper-large-v3",
                language="es",
                response_format="json"
            )

        transcription_text = transcription.text.strip()

        if not transcription_text:
            raise HTTPException(
                status_code=400,
                detail="No se pudo capturar texto claro en el audio recibido."
            )

        # STEP 2: Síntesis y Reenganche con Llama 3
        system_prompt = (
            "Eres el asistente de autorregulación de 'Hand of Focus'. "
            "Tu objetivo es ayudar a un estudiante que se ha distraído durante una clase en vivo. "
            "Analiza el fragmento transcrito de la clase y responde de forma extremadamente concisa "
            "(máximo 2 o 3 frases). "
            "Explica claramente qué se está explicando en este momento para que el estudiante "
            "pueda reengancharse a la explicación sin perder el hilo."
        )

        user_prompt = f"Transcripción reciente de la clase:\n\"{transcription_text}\"\n"
        if pregunta_usuario:
            user_prompt += f"\nDuda del estudiante: {pregunta_usuario}"

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=150
        )

        respuesta_llm = completion.choices[0].message.content.strip()

        return ReengagementResponse(
            transcripcion=transcription_text,
            respuesta=respuesta_llm
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en el procesamiento de audio/reenganche: {str(e)}"
        )
    finally:
        # Limpieza del archivo temporal
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.remove(tmp_path)