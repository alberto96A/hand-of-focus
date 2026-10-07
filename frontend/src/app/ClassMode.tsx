'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, BookOpen, Sparkles, Volume2 } from 'lucide-react';

// Declaración de tipos para TypeScript sobre la SpeechRecognition API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function ClassMode() {
    const [isListening, setIsListening] = useState<boolean>(false);
    const [transcript, setTranscript] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Verificar si el navegador soporta el reconocimiento de voz
        const SpeechRecognition =
            typeof window !== 'undefined' &&
            (window.SpeechRecognition || window.webkitSpeechRecognition);

        if (!SpeechRecognition) {
            setErrorMessage(
                'Tu navegador no soporta el reconocimiento de voz por micrófono. Te recomendamos usar Google Chrome, Edge o Safari.'
            );
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'es-ES'; // Idioma español

        recognition.onresult = (event: any) => {
            let currentTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript;
            }
            setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Error en el micrófono:', event.error);
            if (event.error === 'not-allowed') {
                setErrorMessage('Permiso de micrófono denegado. Revisa la barra de direcciones de tu navegador.');
            } else {
                setErrorMessage('Ocurrió un problema con la captura de audio.');
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, []);

    const toggleMic = () => {
        setErrorMessage(null);

        if (!recognitionRef.current) {
            setErrorMessage('Reconocimiento de voz no disponible en este navegador.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error('Error al iniciar el micrófono:', err);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Encabezado adaptado al tono ámbar/dorado para el fondo oscuro */}
            <div className="flex items-center gap-3 border-b border-amber-200/20 pb-4">
                <BookOpen className="w-6 h-6 text-amber-200" />
                <h2 className="text-xl font-semibold text-amber-100/90 tracking-wide">
                    Modo Clase — Escucha Activa & Reenganche
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Panel Izquierdo: Captura de Audio en Vivo */}
                <div className="lg:col-span-2 backdrop-blur-md bg-slate-900/60 border border-slate-700/50 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
                    <h3 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-amber-300" /> Transcripción y Contexto en Vivo
                    </h3>

                    {/* Caja que muestra el texto capturado por el micrófono */}
                    <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl min-h-[140px] max-h-[220px] overflow-y-auto text-slate-200 text-sm font-mono leading-relaxed">
                        {transcript ? (
                            <p className="text-emerald-300/90">{transcript}</p>
                        ) : (
                            <p className="text-slate-500 italic">
                                {isListening
                                    ? 'Escuchando... habla o deja que el altavoz/profesor hable...'
                                    : 'Pulsa el botón inferior para activar el micrófono e ir capturando las explicaciones de la clase.'}
                            </p>
                        )}
                    </div>

                    {/* Botón Principal del Micrófono */}
                    <button
                        type="button"
                        onClick={toggleMic}
                        className={`w-full py-3.5 px-6 font-semibold rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2 ${isListening
                                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            }`}
                    >
                        {isListening ? (
                            <>
                                <MicOff className="w-4 h-4" /> Detener Escucha en Vivo
                            </>
                        ) : (
                            <>
                                <Mic className="w-4 h-4" /> Escuchar Clase en Vivo
                            </>
                        )}
                    </button>

                    {/* Mensaje de Error / Estado de Permisos */}
                    {errorMessage && (
                        <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl text-amber-200 text-xs flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </div>

                {/* Panel Derecho: Notas Rápidas */}
                <div className="backdrop-blur-md bg-slate-900/60 border border-slate-700/50 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-100">
                    <h3 className="text-sm font-bold text-amber-200">Espacio de Notas</h3>
                    <textarea
                        placeholder="Anota tus dudas sin perder la concentración..."
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-300/50 h-36 resize-none"
                    />
                    <button className="w-full py-2.5 bg-amber-300 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all">
                        Guardar Nota
                    </button>
                </div>

            </div>
        </div>
    );
}