'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Briefcase, Sparkles, Clock, CheckCircle2, Plus, Trash2, Brain, AlertCircle } from 'lucide-react';

export default function WorkMode() {
  // Estado para la tarea principal y el micro-paso inicial
  const [mainTask, setMainTask] = useState<string>('');
  const [microStep, setMicroStep] = useState<string>('');

  // Gestión de tiempo
  const [customMinutes, setCustomMinutes] = useState<number | ''>(30);
  const [isFreeFlow, setIsFreeFlow] = useState<boolean>(false); // Modo sin cuenta atrás visible

  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(30 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Depósito mental (Braindump) para notas rápidas/distracciones
  const [brainDumpList, setBrainDumpList] = useState<string[]>([]);
  const [newBrainDumpItem, setNewBrainDumpItem] = useState<string>('');

  // Mensaje de soporte emocional / reenfoque
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  // Lógica del temporizador
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        if (!isFreeFlow && secondsLeft > 0) {
          setSecondsLeft((prev) => prev - 1);
        } else if (!isFreeFlow && secondsLeft === 0) {
          setIsRunning(false);
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, isFreeFlow]);

  const handleStartWork = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validMinutes = typeof customMinutes === 'number' && customMinutes > 0 ? customMinutes : 30;

    if (mainTask.trim()) {
      setSecondsLeft(validMinutes * 60);
      setElapsedSeconds(0);
      setIsSessionActive(true);
      setIsRunning(true);
      setSupportMessage(null);
    }
  };

  const toggleTimer = (): void => setIsRunning(!isRunning);

  const handleStopSession = (): void => {
    setIsRunning(false);
    setIsSessionActive(false);
  };

  const handleAddBrainDump = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newBrainDumpItem.trim()) {
      setBrainDumpList([...brainDumpList, newBrainDumpItem.trim()]);
      setNewBrainDumpItem('');
    }
  };

  const handleRemoveBrainDump = (index: number): void => {
    setBrainDumpList(brainDumpList.filter((_, i) => i !== index));
  };

  const handleSelfCompassionCheck = (): void => {
    setSupportMessage(
      "Recuerda: Avanzar un 10% es infinitamente mejor que el 0%. Si te has bloqueado, cambia de postura, bebe agua y reduce aún más el tamaño del siguiente paso."
    );
  };

  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="w-5 h-5 text-black" />
        <h2 className="text-xl font-bold text-black tracking-wide">
          Modo Trabajo — Bloques Adaptativos
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Panel Principal */}
        <div className="lg:col-span-2 backdrop-blur-md bg-white/60 border border-white/70 rounded-3xl p-8 shadow-xl space-y-6">
          {!isSessionActive ? (
            <form onSubmit={handleStartWork} className="space-y-6">

              {/* Meta General */}
              <div className="space-y-2">
                <label className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-700" /> ¿En qué tarea/proyecto quieres avanzar?
                </label>
                <input
                  type="text"
                  value={mainTask}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMainTask(e.target.value)}
                  placeholder="Ej. Preparar el informe mensual de datos..."
                  className="w-full bg-white/80 border border-slate-300 rounded-2xl p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                  required
                />
              </div>

              {/* Micro-paso de inicio (Superación de la Inercia) */}
              <div className="space-y-2 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
                <label className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Micro-paso inicial (Acción de 2 a 5 minutos)
                </label>
                <p className="text-xs text-indigo-700/80">
                  Reduce la tarea a algo ridículamente pequeño para romper la parálisis de inicio.
                </p>
                <input
                  type="text"
                  value={microStep}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMicroStep(e.target.value)}
                  placeholder="Ej. Abrir el documento y poner el título principal"
                  className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>

              {/* Ajuste de Tiempo o Modo Fluido */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-700" /> Tiempo estimado
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="1"
                        max="300"
                        disabled={isFreeFlow}
                        value={customMinutes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const val = e.target.value;
                          setCustomMinutes(val === '' ? '' : Math.max(1, parseInt(val, 10) || 1));
                        }}
                        className={`w-28 bg-white/80 border border-slate-300 rounded-2xl p-3 text-slate-800 font-mono text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isFreeFlow ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                      />
                      <span className="text-slate-600 font-medium text-sm">minutos</span>
                    </div>
                  </div>

                  {/* Interruptor Modo Libre */}
                  <label className="flex items-center gap-3 cursor-pointer bg-white/50 p-3 rounded-2xl border border-slate-200/80 hover:bg-white/80 transition-all">
                    <input
                      type="checkbox"
                      checked={isFreeFlow}
                      onChange={(e) => setIsFreeFlow(e.target.checked)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 block">Modo Flujo Libre</span>
                      <span className="text-slate-500">Sin reloj marcha atrás (mide tiempo transcurrido)</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-800 hover:bg-indigo-900 text-white font-semibold rounded-2xl shadow-md transition-all text-base flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" /> Comenzar Bloque de Trabajo
              </button>
            </form>
          ) : (
            /* Vista de Trabajo Activo */
            <div className="space-y-6 text-center">

              {/* Contexto de la Tarea */}
              <div className="space-y-2">
                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-900 text-sm font-semibold">
                  {mainTask}
                </div>
                {microStep && (
                  <div className="text-xs text-slate-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paso inicial: {microStep}</span>
                  </div>
                )}
              </div>

              {/* Reloj o Contador Transcurrido */}
              <div className="py-2">
                <div className="text-6xl font-extrabold tracking-tight text-slate-800 font-mono">
                  {isFreeFlow ? formatTime(elapsedSeconds) : formatTime(secondsLeft)}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {isFreeFlow ? 'Tiempo en flujo continuo' : `Tiempo restante (de ${customMinutes} min)`}
                </div>
              </div>

              {/* Botones de Control */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={toggleTimer}
                  className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-md transition-all flex items-center gap-2 text-sm"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? 'Pausar' : 'Continuar'}
                </button>
                <button
                  onClick={handleStopSession}
                  className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-xl shadow-sm transition-all text-sm"
                >
                  Finalizar Bloque
                </button>
              </div>

              {/* Reducción de Ansiedad y Reenfoque */}
              <div className="pt-4 border-t border-slate-200/60">
                <button
                  onClick={handleSelfCompassionCheck}
                  className="w-full py-3 px-4 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-900 font-medium rounded-2xl border border-indigo-200/80 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  <AlertCircle className="w-4 h-4 text-indigo-600" />
                  ¿Sientes bloqueo o frustración? Haz clic aquí
                </button>

                {supportMessage && (
                  <div className="mt-3 p-4 bg-white border border-indigo-200 rounded-2xl text-xs text-slate-800 text-left shadow-sm">
                    {supportMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Depósito Mental (Braindump) */}
        <div className="backdrop-blur-md bg-white/60 border border-white/70 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-indigo-700" />
              <h3 className="text-sm font-bold text-slate-800">Depósito Mental</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              ¿Te vino una idea o tarea pendiente a la cabeza? Anótala aquí para liberarla de tu mente y revisarla después.
            </p>

            <form onSubmit={handleAddBrainDump} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newBrainDumpItem}
                onChange={(e) => setNewBrainDumpItem(e.target.value)}
                placeholder="Escribir distracción/idea..."
                className="w-full bg-white/80 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl transition-all"
                title="Añadir nota"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {brainDumpList.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  Tu mente está despejada.
                </div>
              ) : (
                brainDumpList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 bg-white/80 border border-slate-200 rounded-xl text-xs text-slate-700 shadow-sm"
                  >
                    <span className="truncate pr-2">{item}</span>
                    <button
                      onClick={() => handleRemoveBrainDump(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {brainDumpList.length > 0 && (
            <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-200/60">
              {brainDumpList.length} {brainDumpList.length === 1 ? 'idea guardada' : 'ideas guardadas'} para más tarde.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}