'use client';

import React, { useState } from 'react';
import { BookOpen, Clock, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react';

export default function StudyMode() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [microInterruptions, setMicroInterruptions] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <BookOpen className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-slate-100">
          Modo Estudio — Foco Profundo y Registro Pasivo
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temporizador No Punitivo */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock className="w-4 h-4" /> Tiempo Acumulado de Foco
          </div>
          <div className="text-5xl font-mono font-bold text-emerald-400 tracking-wider">
            {formatTime(seconds)}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isActive ? 'Pausar' : 'Iniciar Foco'}
            </button>
            <button
              onClick={() => {
                setIsActive(false);
                setSeconds(0);
              }}
              className="p-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Micro-interrupciones diferidas */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-medium text-slate-200 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Registro Pasivo de Micro-interrupciones
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Si te has distraído un momento, regístralo sin culpa. No afectará a tu racha ni bloqueará tu pantalla.
            </p>
          </div>
          <div className="my-4 flex items-center justify-between bg-slate-950/50 p-4 rounded-lg border border-slate-800/80">
            <span className="text-sm text-slate-300">Pausas / Desvíos detectados:</span>
            <span className="text-2xl font-bold text-amber-400">{microInterruptions}</span>
          </div>
          <button
            onClick={() => setMicroInterruptions((prev) => prev + 1)}
            className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition-all"
          >
            + Registrar Desvío Rápido (Sin Culpa)
          </button>
        </div>
      </div>
    </div>
  );
}