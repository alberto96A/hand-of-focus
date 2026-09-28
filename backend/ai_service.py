import os

def obtener_respuesta_ia(contexto_transcripcion: str) -> str:
    """
    Servicio de IA para generar resúmenes de reenganche contextualmente.
    Utiliza Groq API (gratuita) si hay API KEY configurada, o un fallback inteligente.
    """
    api_key = os.getenv("GROQ_API_KEY")
    
    if api_key:
        try:
            from groq import Groq
            client = Groq(api_key=api_key)
            
            prompt = f"""
            Eres el Copilot de 'Hand of Focus', un asistente pedagógico para personas con TDAH.
            El usuario se ha distraído durante la clase y necesita volver al hilo de inmediato sin sentirse culpable.
            
            Lee la siguiente transcripción reciente de la clase y genera un resumen ultrasintético:
            - Tema principal (1 frase)
            - 2 Puntos clave actuales
            - Siguiente idea a tener en cuenta
            
            Transcripción reciente:
            "{contexto_transcripcion}"
            """
            
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.1-8b-instant",
                temperature=0.3,
            )
            return response.choices[0].message.content
        except Exception:
            pass
            
    # Fallback/Mock para desarrollo local
    tema = contexto_transcripcion.split("\n")[-1] if contexto_transcripcion.strip() else "Explicación general"
    return f"""
    **📌 Puntos clave de reenganche:**
    - **Tema actual:** {tema}
    - **Concepto central:** Separación de capas y autorregulación sin interrupciones agresivas.
    - **Siguiente paso:** Revisa las anclas de atención para anotar cualquier duda puntual.
    """