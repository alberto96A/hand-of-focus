import streamlit as st

def render_work_mode():
    st.title("💼 Modo Trabajo — Deep Work & Async")
    st.write("Herramientas para la función ejecutiva, desglose de tareas y manejo de interrupciones.")
    
    st.subheader("🧩 Desglose de Tareas (Micro-tasking)")
    tarea = st.text_input("¿Qué tarea compleja necesitas abordar?", placeholder="Ej: Redactar la documentación del proyecto...")
    
    if st.button("Desglosar Tarea en Micro-pasos"):
        st.markdown("""
        **Pasos sugeridos:**
        1. 🟩 Crear el archivo de borrador y escribir el título.
        2. 🟩 Definir los 3 puntos principales en viñetas.
        3. 🟩 Revisar la primera sección durante 5 minutos.
        """)
        
    st.markdown("---")
    st.subheader("🧠 Brain Dump (Cajón de Ideas Fuga)")
    st.text_input("Apunta pensamientos intrusivos para no perder el foco:", placeholder="Ej: Comprar café, responder correo...")