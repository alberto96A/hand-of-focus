import sqlite3
from datetime import datetime

DB_NAME = "hand_of_focus.db"

def init_db():
    """Crea las tablas iniciales en la base de datos si no existen."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Tabla para registrar sesiones de los 3 modos
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sesiones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            modo TEXT NOT NULL,
            duracion_minutos INTEGER,
            notas TEXT,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Tabla para el Brain Dump / Cajón de ideas
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS brain_dump (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idea TEXT NOT NULL,
            estado TEXT DEFAULT 'pendiente',
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()

def guardar_sesion(modo: str, duracion: int, notas: str = ""):
    """Guarda un registro de sesión completada."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO sesiones (modo, duracion_minutos, notas) VALUES (?, ?, ?)",
        (modo, duracion, notas)
    )
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Base de datos local inicializada con éxito.")