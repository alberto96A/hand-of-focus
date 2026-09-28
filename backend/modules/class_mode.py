import streamlit as st
import time

def render_class_mode():
    st.title("🏫 Modo Clase — Escucha Activa & Reenganche")
    st.caption("Captura de contexto continuo y asistencia sin culpa para no perder el hilo.")
    
    st.markdown("---")
    
    # Grid superior de métricas visuales
    col_m1, col_m2, col_m3 = st.columns(3)
    with col_m1:
        st.metric(label="Estado del Audio", value="🎙️ Activo", delta="Whisper Stream")
    with col_m2:
        st.metric(label="Anclas Registradas", value="3 notas", delta="Última hace 2 min")
    with col_m3:
        st.metric(label="Atención Estimada", value="Alta 🎯", delta_color="normal")

    st.markdown("<br>", unsafe_allow_html=True)
    
    col1, col2 = st.columns([1.6, 1], gap="medium")
    
    with col1:
        st.subheader("📋 Contexto de la Explicación en Vivo")
        
        # Simulador de transcripción en tiempo real en un contenedor estilizado
        with st.container(border=True):
            st.markdown("""
            **[10:15] Profesor:** *"...por lo tanto, cuando diseñamos la arquitectura de software, es vital separar la capa de persistencia de la interfaz de usuario para garantizar la modularidad."*
            
            **[10:17] Profesor:** *"...en bases de datos relacionales como SQLite, esto nos permite modificar las tablas sin romper la vista del cliente."*
            """)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        # Botón destacado de reenganche
        if st.button("🚨 Me he perdido — Reenganche Rápido con IA", type="primary", use_container_width=True):
            with st.status("🧠 IA procesando el contexto de los últimos minutos...", expanded=True) as status:
                st.write("Analizando transcripción de audio...")
                time.sleep(0.6)
                st.write("Extrayendo entidades clave y tema actual...")
                time.sleep(0.6)
                status.update(label="¡Reenganche generado con éxito!", state="complete", expanded=True)
                
                st.info("""
                **📌 ¿Dónde estamos ahora mismo?**
                - **Tema principal:** Separación de arquitecturas (UI vs Base de Datos).
                - **Concepto clave:** SQLite actúa como motor persistente aislado para evitar fallos en la interfaz.
                - **Siguiente punto:** El profesor está explicando el uso de sentencias SQL para modificar esquemas.
                """)

    with col2:
        st.subheader("📌 Anclas de Atención")
        st.caption("Escribe dudas o pensamientos fugaces para despejar tu mente.")
        
        with st.container(border=True):
            notas = st.text_area(
                "Tus notas breves:",
                height=220,
                placeholder="Ej: Revisar cómo funciona ALTER TABLE en SQLite...",
                key="class_notes"
            )
            if st.button("💾 Guardar Ancla localmente", use_container_width=True):
                st.toast("Ancla guardada en la base de datos local", icon="✅")