'use client';

import React, { useState } from 'react';
import RadialMenu from '@/components/RadialMenu';
import { Sparkles, Save, Clock, Radio } from 'lucide-react';

export default function Home() {
  const [activeMode, setActiveMode] = useState('clase');
  const [transcription] = useState(
    'Profesor: "...por lo tanto, en arquitecturas desacopladas, SQLite garantiza persistencia sin bloquear el frontend en React."'
  );
  const [aiSummary, setAiSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReenganche = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/reenganche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcripcion: transcription }),
      });
      const data = await res.json();
      setAiSummary(data.resumen);
    } catch (err) {
      setAiSummary('Error al conectar con la IA de FastAPI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pl-24 pr-8 py-8 font-sans">
      {/* Botón flotante circular */}
      <RadialMenu currentMode={activeMode} onSelectMode={(m) => setActiveMode(m)} />

      {/* Header General */}
      <header className="mb-8 flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400">
            Hand of Focus
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Copilot de autorregulación y concentración sin interrupciones punitivas.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-xs text-sky-400 font-medium">
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          FastAPI Engine Online
        </div>
      </header>

      {/* Vista según el modo seleccionado */}
      {activeMode === 'clase' && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
            🏫 Modo Clase — Escucha Activa & Reenganche
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tarjeta de Contexto en Vivo */}
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                Contexto de la Explicación en Vivo
              </h3>
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-slate-300 font-mono text-sm mb-4">
                {transcription}
              </div>

              <button
                onClick={handleReenganche}
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? 'IA procesando...' : '🚨 Me he perdido — Reenganche Rápido con IA'}
              </button>

              {aiSummary && (
                <div className="mt-6 bg-slate-950 border border-sky-500/30 rounded-xl p-5 text-sm text-slate-200 animate-in fade-in">
                  <h4 className="font-bold text-sky-400 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Resumen Generado por IA (Groq/Backend)
                  </h4>
                  <div className="whitespace-pre-line text-slate-300">{aiSummary}</div>
                </div>
              )}
            </div>

            {/* Anclas de atención */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">📌 Anclas de Atención</h3>
              <p className="text-xs text-slate-400 mb-4">Anota dudas sin perder la concentración.</p>
              <textarea
                placeholder="Ej: Repasar el endpoint /api/reenganche..."
                className="w-full flex-grow min-h-[160px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-sky-500/50 mb-4"
              />
              <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm flex items-center justify-center gap-2 transition-all">
                <Save className="w-4 h-4" /> Guardar Ancla
              </button>
            </div>
          </div>
        </section>
      )}

      {activeMode !== 'clase' && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <p className="text-lg">Modo {activeMode.toUpperCase()} listo para vincular sus componentes.</p>
        </div>
      )}
    </main>
  );
}