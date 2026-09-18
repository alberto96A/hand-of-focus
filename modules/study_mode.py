import streamlit as st
import db  # Importamos nuestro gestor de base de datos local

def render_study_mode():
    st.title("📚 Modo Estudio — Ejecución Individual")
    st.write("Entorno diseñado para lectura, preparación y repaso sin distracciones.")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("🎧 Ambiente Auditivo")
        st.selectbox("Tipo de sonido de fondo:", ["Ruido Marrón (Brown Noise)", "Lo-Fi Beats", "Ondas Binaurales", "Silencio"])
        st.caption("El reproductor de audio local se cargará en esta sección.")
        
    with col2:
        st.subheader("⏱️ Temporizador Adaptativo")
        minutos = st.slider("Minutos de foco:", 10, 60, 25)
        
        # Campo para anotar qué vas a estudiar
        tema_estudio = st.text_input("¿Qué vas a estudiar en este bloque?", placeholder="Ej: Repasar tema 3 de AWS...")
        
        if st.button("Iniciar y Registrar Bloque"):
            if tema_estudio.strip() == "":
                st.warning("Escribe una breve nota sobre qué vas a estudiar antes de guardar.")
            else:
                # Llamamos a la función de db.py para guardar en SQLite
                db.guardar_sesion(modo="Modo Estudio", duracion=minutos, notas=tema_estudio)
                st.success(f"¡Sesión de {minutos} min registrada con éxito en tu base de datos!")