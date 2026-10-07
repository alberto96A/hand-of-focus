'use client';

import React, { useEffect, useRef } from 'react';

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const DIM = 30; // Tamaño del patrón
    let rows: number, cols: number, offset_x: number, offset_y: number;
    let astro: Astroid[] = [];
    let t = 0;
    const k = 1.7;

    class Astroid {
      pos: { x: number; y: number };
      r: number;
      d: number;
      a: number = 0;
      b: number = 0;
      offsetX: number = 0;
      offsetY: number = 0;

      constructor(pos: { x: number; y: number }, r?: number) {
        this.pos = pos;
        this.r = r || 0.88 * DIM;
        const dx = w / 2 - this.pos.x;
        const dy = h / 2 - this.pos.y;
        this.d = Math.sqrt(dx * dx + dy * dy);
      }

      squish(v: number) {
        // --- RÁFAGA DE VIENTO VERTICAL ---
        // La onda de viento recorre la pantalla verticalmente impulsada por (v * 2.5 - pos.y * 0.008)
        const verticalWindWave = Math.sin(v * 2.5 - this.pos.y * 0.008 + this.pos.x * 0.003);
        
        // Amplitud del vaivén impulsado por el viento (de izquierda a derecha y bamboleo)
        const breezeForce = verticalWindWave * 6.5; 

        const alpha = -v * 1.5 + this.d / DIM / 1.1 + verticalWindWave * 0.6;

        this.a = Math.floor(
          (this.r * (k + Math.max(-k, Math.min(k, Math.pow(Math.cos(alpha), 1))))) / k / 2.0
        );
        this.b = Math.floor(
          (this.r * (k + Math.max(-k, Math.min(k, Math.pow(Math.cos(alpha + Math.PI), 4))))) / k / 1.25
        );

        // Desplazamiento de balanceo provocado por la ráfaga
        this.offsetX = breezeForce + Math.sin(v * 1.2 + this.pos.y * 0.01) * 2;
        this.offsetY = Math.cos(v * 1.5 + this.pos.x * 0.01) * 2;
      }

      draw(context: CanvasRenderingContext2D) {
        const x = this.pos.x + this.offsetX;
        const y = this.pos.y + this.offsetY;

        context.moveTo(x, y - this.b + 4 * this.a);
        for (let i = 0; i < 5; i++) {
          const qa = (i * Math.PI) / 5;
          context.quadraticCurveTo(
            x,
            y,
            x + this.b * Math.cos(qa),
            y + this.b * Math.sin(qa)
          );
        }
      }
    }

    const initGrid = () => {
      rows = Math.round(h / DIM + 1);
      cols = Math.round(w / DIM + 1);
      offset_x = (w - cols * DIM) / 2;
      offset_y = (h - rows * DIM) / 2;
      astro = [];

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          astro.push(
            new Astroid({
              x: offset_x + j * DIM,
              y: offset_y + i * DIM,
            })
          );
        }
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initGrid();
    };

    window.addEventListener('resize', handleResize);
    initGrid();

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const innerRadius = 20;
      const outerRadius = Math.max(w, h) * 0.48;

      const grd = ctx.createRadialGradient(
        centerX,
        centerY,
        innerRadius,
        centerX,
        centerY,
        outerRadius
      );
      grd.addColorStop(0, 'rgba(0,0,0,0)');
      grd.addColorStop(0.1, 'gold');
      grd.addColorStop(0.45, 'orangered');
      grd.addColorStop(0.6, 'cyan');
      grd.addColorStop(0.72, 'red');
      grd.addColorStop(0.85, 'teal');

      ctx.strokeStyle = grd;
      ctx.lineWidth = 0.95;

      ctx.beginPath();
      // Velocidad del tiempo fluida
      const v = t / 110;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const idx = i * cols + j;
          if (astro[idx]) {
            astro[idx].squish(v);
            astro[idx].draw(ctx);
          }
        }
      }
      ctx.closePath();
      ctx.stroke();

      t++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full overflow-hidden"
      style={{
        backgroundColor: 'hsla(69, 88.4%, 62.9%, 0.9)',
        backgroundImage: `
          linear-gradient(1deg, hsla(180, 41.9%, 55.7%, 0.7) 40%, hsla(60, 100%, 90%, 0.9) 55%),
          linear-gradient(190deg, hsla(70, 30.8%, 54.7%, 0.8) 100%, transparent 50%)
        `,
        backgroundSize: 'cover',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          filter: 'invert(1)',
          mixBlendMode: 'difference',
        }}
      />
    </div>
  );
}