'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Target, Sparkles, Volume2, VolumeX, Music, Clock, BookOpen } from 'lucide-react';

interface AmbientPreset {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

// Lista de paisajes sonoros (sin la opción de cafetería)
const AMBIENT_PRESETS: AmbientPreset[] = [
  { id: 'brown-noise', name: 'Ruido Marrón', desc: 'Frecuencias graves para acallar pensamientos', icon: '🌊' },
  { id: 'rain', name: 'Lluvia Suave', desc: 'Sonido constante de gotas de agua', icon: '🌧️' },
  { id: 'binaural', name: 'Ondas Alfa (10Hz)', desc: 'Estimulación auditiva para foco profundo', icon: '🎧' },
  { id: 'forest', name: 'Bosque / Naturaleza', desc: 'Viento suave y hojas', icon: '🌲' },
];

export default function StudyMode() {
  const [targetTask, setTargetTask] = useState<string>('');

  // Ahora el usuario escribe directamente los minutos que desee (por defecto 25)
  const [customMinutes, setCustomMinutes] = useState<number | ''>(25);

  const [isTaskSet, setIsTaskSet] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Estado del Reproductor de Audio
  const [selectedAmbient, setSelectedAmbient] = useState<string>(AMBIENT_PRESETS[0].id);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  const [reengagementPrompt, setReengagementPrompt] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const toggleTimer = (): void => setIsActive(!isActive);

  const resetTimer = (): void => {
    setIsActive(false);
    const mins = typeof customMinutes === 'number' && customMinutes > 0 ? customMinutes : 25;
    setSecondsLeft(mins * 60);
  };

  const handleStartFocus = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validMinutes = typeof customMinutes === 'number' && customMinutes > 0 ? customMinutes : 25;

    if (targetTask.trim()) {
      setSecondsLeft(validMinutes * 60);
      setIsTaskSet(true);
      setIsActive(true);
      setIsPlayingAudio(true);
    }
  };

  const handleQuickReengage = (): void => {
    setReengagementPrompt(
      `Sin culpa. Tu única meta ahora es: "${targetTask}". Respira profundo y escribe la primera palabra.`
    );
  };

  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del Modo Estudio */}
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-black" />
        <h2 className="text-xl font-bold text-black tracking-wide">
          Modo Estudio — Foco Inmersivo
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Panel Principal */}
        <div className="md:col-span-2 backdrop-blur-md bg-white/60 border border-white/70 rounded-3xl p-8 shadow-xl space-y-6">
          {!isTaskSet ? (
            <form onSubmit={handleStartFocus} className="space-y-6">

              {/* Campo 1: Objetivo Único */}
              <div className="space-y-2">
                <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" /> ¿En qué única cosa vas a trabajar?
                </label>
                <input
                  type="text"
                  value={targetTask}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetTask(e.target.value)}
                  placeholder="Ej. Leer las páginas 20 a la 35 de Economía..."
                  className="w-full bg-white/80 border border-slate-300 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7FB3AA] text-base"
                  required
                />
              </div>

              {/* Campo 2: Entrada libre de tiempo (sin parálisis de decisión) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" /> ¿Cuántos minutos quieres dedicarle?
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={customMinutes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value;
                      setCustomMinutes(val === '' ? '' : Math.max(1, parseInt(val, 10) || 1));
                    }}
                    placeholder="25"
                    className="w-32 bg-white/80 border border-slate-300 rounded-2xl p-3 text-slate-800 font-mono text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#7FB3AA]"
                    required
                  />
                  <span className="text-slate-600 font-medium">minutos</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-2xl shadow-md transition-all text-base flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" /> Iniciar Sesión ({customMinutes || 0} min)
              </button>
            </form>
          ) : (
            /* Estado Activo durante la Sesión */
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div className="px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-sm font-medium">
                  Objetivo: {targetTask}
                </div>
                <div className="px-3 py-1.5 rounded-full bg-slate-200/80 text-slate-800 text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Tiempo total: {customMinutes} min
                </div>
              </div>

              <div className="text-6xl font-extrabold tracking-tight text-slate-800 font-mono my-2">
                {formatTime(secondsLeft)}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={toggleTimer}
                  className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isActive ? 'Pausar' : 'Reanudar'}
                </button>
                <button
                  onClick={resetTimer}
                  className="py-3 px-4 bg-white/80 hover:bg-white text-slate-700 border border-slate-300 font-medium rounded-xl shadow-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Botón de Reenganche Amable */}
              <div className="pt-4 border-t border-slate-200/60">
                <button
                  onClick={handleQuickReengage}
                  className="w-full py-3 px-4 bg-[#FCE282]/40 hover:bg-[#FCE282]/70 text-slate-900 font-medium rounded-2xl border border-amber-300/80 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  ¿Te has despistado? Pulsa para reenganchar sin culpa
                </button>

                {reengagementPrompt && (
                  <div className="mt-3 p-4 bg-white/90 border border-amber-200 rounded-2xl text-sm text-slate-800 text-left shadow-sm">
                    {reengagementPrompt}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Paisaje Sonoro */}
        <div className="backdrop-blur-md bg-white/60 border border-white/70 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Music className="w-4 h-4 text-emerald-700" /> Paisaje Sonoro
              </h3>
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`p-2 rounded-xl transition-all ${isPlayingAudio ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
              >
                {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2">
              {AMBIENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedAmbient(preset.id);
                    setIsPlayingAudio(true);
                  }}
                  className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${selectedAmbient === preset.id
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                    : 'bg-white/40 border-transparent hover:bg-white/80'
                    }`}
                >
                  <span className="text-xl">{preset.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{preset.name}</div>
                    <div className="text-[11px] text-slate-500">{preset.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-slate-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>
        </div>

      </div>
    </div>
  );
}