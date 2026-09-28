'use client';

import React, { useState } from 'react';
import { Brain, BookOpen, Briefcase, GraduationCap } from 'lucide-react';

interface RadialMenuProps {
  currentMode: string;
  onSelectMode: (mode: string) => void;
}

export default function RadialMenu({ currentMode, onSelectMode }: RadialMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modes = [
    { id: 'clase', label: 'Modo Clase', icon: GraduationCap, color: 'from-sky-500 to-blue-600' },
    { id: 'estudio', label: 'Modo Estudio', icon: BookOpen, color: 'from-indigo-500 to-purple-600' },
    { id: 'trabajo', label: 'Modo Trabajo', icon: Briefcase, color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="fixed top-6 left-6 z-50">
      {/* Botón Circular Principal Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-sky-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
        title="Cambiar Modo de Foco"
      >
        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center group-hover:bg-opacity-80 transition-all">
          <Brain className="w-7 h-7 text-sky-400 animate-pulse" />
        </div>
      </button>

      {/* Menú Radial / Desplegable compacto */}
      {isOpen && (
        <div className="absolute top-16 left-0 bg-slate-900/95 backdrop-blur-md border border-slate-700/60 rounded-2xl p-3 shadow-2xl w-56 flex flex-col gap-2 transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <span className="text-xs font-semibold text-slate-400 px-3 pt-1 uppercase tracking-wider">
            Selecciona Entorno
          </span>
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  onSelectMode(mode.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r ' + mode.color + ' text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}