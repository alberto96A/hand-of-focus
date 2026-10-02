'use client';

import React from 'react';

export default function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#84B2A8] via-[#6FA398] to-[#2C524B] transition-all duration-700">
      {/* Luz cálida en la esquina superior que simula el sol/arena */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FCE282]/30 blur-3xl pointer-events-none animate-pulse" />
      
      {/* Contenedor SVG de olas del mar */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-[200%] h-48 md:h-64 animate-[wave_12s_ease-in-out_infinite]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,60 L1200,120 L0,120 Z"
            fill="#FCE282"
            fillOpacity="0.25"
          />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-[200%] h-40 md:h-56 animate-[wave_8s_ease-in-out_infinite_reverse]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C200,100 450,0 700,70 C950,140 1100,20 1200,50 L1200,120 L0,120 Z"
            fill="#FCE282"
            fillOpacity="0.4"
          />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-[200%] h-32 md:h-44 animate-[wave_15s_linear_infinite]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C300,10 600,80 900,30 C1050,5 1150,60 1200,40 L1200,120 L0,120 Z"
            fill="#FCE282"
            fillOpacity="0.85"
          />
        </svg>
      </div>
    </div>
  );
}