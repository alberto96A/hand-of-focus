'use client';

import React, { useState, useRef } from 'react';
import RadialMenu from '@/components/RadialMenu';
import StudyMode from '@/components/StudyMode';
import WorkMode from '@/components/WorkMode';
import { BookOpen, Pin, RefreshCw, Mic, Square } from 'lucide-react';


export default function Home() {
  const [currentMode, setCurrentMode] = useState<'clase' | 'estudio' | 'trabajo'>('clase');
  const [anchors, setAnchors] = useState<string[]>([]);
  const [anchorInput, setAnchorInput] = useState('');
  const [reengagement, setReengagement] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para grabación de audio en vivo
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Base URL de la API configurable desde .env.local / Vercel
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleSaveAnchor = () => {
    if (anchorInput.trim()) {
      setAnchors([...anchors, anchorInput.trim()]);
      setAnchorInput('');
    }
  };

  // Iniciar grabación de audio desde el micrófono
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch {
      alert('No se pudo acceder al micrófono.');
    }
  };

  // Detener grabación y enviar a Whisper + LLM
  const stopRecordingAndSend = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;

    setLoading(true);
    setIsRecording(false);

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
    });

    recorder.stream.getTracks().forEach((track) => track.stop());

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

    if (audioBlob.size === 0) {
      alert('No se capturó ningún audio.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioBlob, 'grabacion_clase.webm');

    try {
      const response = await fetch(`${API_URL}/api/reenganche-audio`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setTranscription(data.transcripcion);
        setReengagement(data.respuesta);
      } else {
        setReengagement(data.detail || 'Error al procesar el audio.');
      }
    } catch {
      setReengagement('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-slate-900 p-8 relative font-sans overflow-x-hidden">
      <RadialMenu
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode as 'clase' | 'estudio' | 'trabajo')}
      />

      {/* Header compacto (reducido ~25% a cada lado y centrado) */}
      <header className="max-w-xl mx-auto backdrop-blur-md bg-white/60 border border-white/70 rounded-3xl p-6 text-center shadow-xl mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2"
          style={{ fontFamily: 'Garamond, "EB Garamond", Georgia, serif' }}
        >
          Hand of Focus
        </h1>
        <p className="text-slate-700 text-sm md:text-base font-medium">
          Copilot de autorregulación y concentración
        </p>
      </header>

      <section className="max-w-5xl mx-auto mt-29">
        {currentMode === 'clase' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-900/10 pb-4">
              <BookOpen className="w-6 h-6 text-black" />
              <h2 className="text-slate-900 font-bold text-2xl tracking-tight">
                Modo Clase — Escucha Activa & Reenganche
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 backdrop-blur-md bg-white/60 border border-white/70 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-md font-semibold text-slate-900">
                  Contexto de la Explicación en Vivo
                </h3>

                {transcription ? (
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 text-sm text-slate-200 font-mono shadow-inner">
                    <span className="text-emerald-400 font-semibold">[Transcripción Whisper]:</span> "{transcription}"
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 text-sm text-slate-200 font-mono shadow-inner">
                    Profesor: "...por lo tanto, en arquitecturas desacopladas, SQLite garantiza persistencia sin bloquear el frontend en React."
                  </div>
                )}

                <div className="flex gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={loading}
                      className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      Escuchar Clase en Vivo
                    </button>
                  ) : (
                    <button
                      onClick={stopRecordingAndSend}
                      className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2 animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      Detener y Reenganchar
                    </button>
                  )}
                </div>

                {loading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-700 font-medium py-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#2C524B]" />
                    Transcribiendo audio con Whisper y generando resumen...
                  </div>
                )}

                {reengagement && !loading && (
                  <div className="p-4 bg-[#FCE282]/30 border border-amber-300/60 rounded-xl text-sm text-slate-900 backdrop-blur-sm">
                    <strong>Resumen del punto clave:</strong>
                    <p className="mt-1 leading-relaxed">{reengagement}</p>
                  </div>
                )}
              </div>

              <div className="backdrop-blur-md bg-white/60 border border-white/70 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-md font-semibold text-slate-900 flex items-center gap-2">
                  <Pin className="w-4 h-4 text-slate-900" /> Espacio de Notas
                </h3>
                <textarea
                  value={anchorInput}
                  onChange={(e) => setAnchorInput(e.target.value)}
                  placeholder="Anota dudas sin perder la concentración..."
                  className="w-full h-24 bg-white/80 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7FB3AA]"
                />
                <button
                  onClick={handleSaveAnchor}
                  className="w-full py-2 bg-[#FCE282] hover:bg-amber-300 text-slate-900 font-semibold text-sm rounded-xl border border-amber-300 transition-all shadow-sm"
                >
                  Guardar Nota
                </button>

                {anchors.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-semibold text-slate-600">Anclas guardadas:</span>
                    <ul className="space-y-1">
                      {anchors.map((a, i) => (
                        <li key={i} className="text-xs bg-white/80 p-2 rounded-lg border border-slate-200 text-slate-800 shadow-sm">
                          • {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentMode === 'estudio' && <StudyMode />}
        {currentMode === 'trabajo' && <WorkMode />}
      </section>

    </main>
  );
}