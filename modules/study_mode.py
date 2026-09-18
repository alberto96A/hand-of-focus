import streamlit as st

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
        if st.button("Iniciar Bloque de Foco"):
            st.success(f"Sesión iniciada: {minutos} minutos. ¡Mucho ánimo!")