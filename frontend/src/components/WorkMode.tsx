'use client';

import React, { useState } from 'react';
import { Briefcase, CheckSquare, Plus, Sparkles, Trash2 } from 'lucide-react';

export default function WorkMode() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([
    { id: 1, text: 'Revisar documentación de endpoints de FastAPI', completed: false },
  ]);

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
    setTaskInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Briefcase className="w-6 h-6 text-sky-400" />
        <h2 className="text-xl font-semibold text-slate-100">
          Modo Trabajo — Desglose Anti-Parálisis
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel principal de tareas / micro-pasos */}
        <div className="md:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h3 className="text-md font-medium text-slate-200 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-sky-400" /> Micro-Pasos Activos
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Escribe un paso diminuto (ej: Abrir el archivo db.py)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={addTask}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  task.completed
                    ? 'bg-slate-950/40 border-slate-900 text-slate-500 line-through'
                    : 'bg-slate-950/80 border-slate-800 text-slate-200'
                }`}
              >
                <div
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="rounded border-slate-700 text-sky-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-sm">{task.text}</span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de ayuda IA Anti-Parálisis */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-md font-medium text-slate-200 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Asistente Anti-Parálisis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ¿Sentimiento de abrumación? Pídele a la IA que desglose cualquier tarea grande en 3 pasos realizables en menos de 5 minutos.
            </p>
          </div>
          <button className="w-full py-2.5 px-4 rounded-lg bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 text-sm font-medium transition-all flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Desglosar Tarea Actual
          </button>
        </div>
      </div>
    </div>
  );
}