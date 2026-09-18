import streamlit as st

def render_class_mode():
    st.title("🏫 Modo Clase — Escucha Activa")
    st.write("Asistente en vivo para procesamiento de explicaciones y reenganche rápido sin culpa.")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("🎙️ Transcripción en Vivo")
        st.info("El módulo de captura de audio y procesamiento de voz (Whisper) se integrará aquí.")
        
        # Botón de reenganche de emergencia
        if st.button("🚨 Me he perdido (Reenganche Rápido)", type="primary"):
            st.warning("Analizando el contexto reciente de la clase...")
            st.markdown("""
            **Resumen de emergencia:**
            - **Tema actual:** Introducción a la arquitectura del proyecto.
            - **Idea principal:** Separación de responsabilidades entre la interfaz (Streamlit) y los módulos de lógica.
            - **Siguiente paso:** Configurar la persistencia de datos local.
            """)

    with col2:
        st.subheader("📌 Anclas de Atención")
        st.text_area(
            "Notas breves y dudas rápidas:",
            height=220,
            placeholder="Apunta aquí conceptos que no entiendas para consultar después..."
        )