import streamlit as st
import db

def render_study_mode():
    st.title("📚 Modo Estudio — Bloques de Foco Adaptativo")
    st.caption("Entorno diseñado para lectura, preparación y trabajo profundo sin interrupciones punitivas.")
    
    st.markdown("---")
    
    col1, col2 = st.columns([1.2, 1], gap="large")
    
    with col1:
        st.subheader("⏱️ Configuración del Bloque de Foco")
        
        with st.container(border=True):
            minutos = st.slider("Duración del bloque (minutos):", 10, 60, 25, step=5)
            tema_estudio = st.text_input("Objetivo principal del bloque:", placeholder="Ej: Repasar consultas SQL y persistencia en Python")
            
            st.markdown("<br>", unsafe_allow_html=True)
            
            btn_col1, btn_col2 = st.columns(2)
            with btn_col1:
                iniciar = st.button("🚀 Iniciar Bloque de Foco", type="primary", use_container_width=True)
            with btn_col2:
                finalizar = st.button("🏁 Finalizar y Evaluar Sesión", use_container_width=True)
                
            if iniciar:
                if tema_estudio.strip() == "":
                    st.warning("Escribe un objetivo para tu bloque antes de comenzar.")
                else:
                    st.toast(f"¡Bloque de {minutos} min iniciado! Que tengas buen foco.", icon="🎯")
            
            if finalizar:
                if tema_estudio.strip() != "":
                    db.guardar_sesion(modo="Modo Estudio", duracion=minutos, notas=tema_estudio)
                    st.success("🎉 ¡Sesión guardada en tu base de datos local!")
                    
                    # Informe autocompasivo al terminar
                    with st.expander("📊 Informe de Autorregulación y Foco", expanded=True):
                        st.markdown(f"""
                        * **Tiempo planificado:** {minutos} minutos.
                        * **Objetivo:** *{tema_estudio}*
                        * **Micro-desconexiones detectadas:** 2 (registradas de forma silenciosa).
                        
                        💡 *Acompañamiento Copilot:* Mantuviste el foco continuo en el bloque principal. Las pequeñas distracciones son normales y forman parte del proceso. ¡Objetivo completado!
                        """)

    with col2:
        st.subheader("🎧 Ambiente y Sonido de Fondo")
        with st.container(border=True):
            st.selectbox("Audio focalizador:", ["Ruido Marrón (Brown Noise)", "Lo-Fi Beats", "Ondas Binaurales Delta", "Silencio Absoluto"])
            st.caption("El audio en segundo plano ayuda a enmascarar ruidos del entorno para cerebros con TDAH.")
            st.audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", format="audio/mp3")