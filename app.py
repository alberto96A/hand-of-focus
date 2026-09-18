import streamlit as st

# Importamos los módulos individuales desde la carpeta /modules
from modules import class_mode, study_mode, work_mode

# Configuración global de la página
st.set_page_config(
    page_title="Hand of Focus — AI Adaptive Workspace",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Navegación en la Barra Lateral
st.sidebar.title("🧠 Hand of Focus")
st.sidebar.caption("Workspace adaptativo para TDAH y Foco")
st.sidebar.markdown("---")

modo_activo = st.sidebar.radio(
    "Selecciona tu entorno:",
    ["🏫 Modo Clase", "📚 Modo Estudio", "💼 Modo Trabajo"]
)

st.sidebar.markdown("---")
st.sidebar.info("💡 **Acompañamiento sin culpa:** Cambia de modo según tu actividad actual sin perder tu progreso.")

# Enrutado de Modos
if modo_activo == "🏫 Modo Clase":
    class_mode.render_class_mode()

elif modo_activo == "📚 Modo Estudio":
    study_mode.render_study_mode()

elif modo_activo == "💼 Modo Trabajo":
    work_mode.render_work_mode()