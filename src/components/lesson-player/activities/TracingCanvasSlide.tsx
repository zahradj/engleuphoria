import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface ActivityData {
  instruction?: string;
  target_letters: string[];
  font_style?: 'print' | 'cursive';
}

interface Props {
  slide: any;
  hub?: 'playground' | 'academy' | 'success';
  onCorrect?: () => void;
  onIncorrect?: () => void;
  onComplete?: () => void;
}

const TracingCanvasSlide: React.FC<Props> = ({ slide, hub = 'playground', onCorrect, onComplete }) => {
  const data: ActivityData = (slide?.activity_data ?? slide?.interactive_data) || { target_letters: [] };
  const fontFamily = data.font_style === 'cursive' ? '"Comic Sans MS", cursive' : '"Arial Black", sans-serif';
  const [idx, setIdx] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const letter = data.target_letters[idx] ?? '';

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx?.clearRect(0, 0, c.width, c.height);
    setCoverage(0);
  }, [idx]);

  const point = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  const start = (e: React.PointerEvent) => {
    drawing.current = true;
    const c = canvasRef.current!; const ctx = c.getContext('2d')!;
    const p = point(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
    ctx.strokeStyle = 'hsl(var(--primary))'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current!; const ctx = c.getContext('2d')!;
    const p = point(e);
    ctx.lineTo(p.x, p.y); ctx.stroke();
    setCoverage((cv) => Math.min(100, cv + 0.6));
  };
  const end = () => {
    drawing.current = false;
    if (coverage > 55) {
      onCorrect?.();
      if (idx === data.target_letters.length - 1) onComplete?.();
    }
  };

  const reset = () => {
    const c = canvasRef.current; if (!c) return;
    c.getContext('2d')?.clearRect(0, 0, c.width, c.height);
    setCoverage(0);
  };

  const next = () => idx < data.target_letters.length - 1 && setIdx(idx + 1);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-4 text-center">
      <h2 className="text-2xl font-bold text-foreground">{slide.title || 'Trace the letter'}</h2>
      {data.instruction && <p className="text-muted-foreground">{data.instruction}</p>}
      <p className="text-sm text-muted-foreground">Letter {idx + 1} of {data.target_letters.length}</p>

      <div className="relative mx-auto rounded-3xl border-4 border-amber-300 bg-amber-50 overflow-hidden" style={{ width: 360, height: 360 }}>
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-amber-300/60 select-none pointer-events-none"
          style={{ fontFamily, fontSize: 280, lineHeight: 1 }}
        >
          {letter}
        </span>
        <canvas
          ref={canvasRef}
          width={720}
          height={720}
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>

      <div className="h-2 w-full max-w-xs mx-auto rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${Math.min(100, coverage)}%` }} />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4" /> Clear
        </button>
        {coverage > 55 && idx < data.target_letters.length - 1 && (
          <button onClick={next} className="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="w-4 h-4" /> Next letter
          </button>
        )}
      </div>
    </div>
  );
};

export default TracingCanvasSlide;
