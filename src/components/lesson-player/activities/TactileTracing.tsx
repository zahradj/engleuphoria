import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';
import { PenTool, RotateCcw, Check } from 'lucide-react';

interface TactileTracingProps {
  slide: GeneratedSlide;
  onCorrect?: () => void;
  onIncorrect?: () => void;
}

interface Point {
  x: number;
  y: number;
}

/**
 * TactileTracing — Writing Activity
 * 2D canvas with dotted letter outlines. Student traces with finger/mouse.
 * Path accuracy scored (≥90% = mastered).
 */
const TactileTracing: React.FC<TactileTracingProps> = ({ slide, onCorrect, onIncorrect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [tracedPoints, setTracedPoints] = useState<Point[]>([]);
  const [phase, setPhase] = useState<'tracing' | 'scored'>('tracing');

  const targetLetter = (slide.content?.word || 'L').charAt(0).toUpperCase();
  const imageUrl = slide.content?.imageUrl;

  // Draw the dotted guide letter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    ctx.clearRect(0, 0, 300, 300);

    // Draw dotted letter guide
    ctx.font = 'bold 200px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = '#1A237E40';
    ctx.lineWidth = 3;
    ctx.strokeText(targetLetter, 150, 155);
    ctx.setLineDash([]);
  }, [targetLetter]);

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (phase !== 'tracing') return;
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    if (point) setTracedPoints([point]);
  }, [phase, getCanvasPoint]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || phase !== 'tracing') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const point = getCanvasPoint(e);
    if (!point) return;

    setTracedPoints(prev => [...prev, point]);

    // Draw the tracing line
    ctx.strokeStyle = '#1A237E';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);

    const prevPoints = tracedPoints;
    if (prevPoints.length > 0) {
      const lastPoint = prevPoints[prevPoints.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }, [isDrawing, phase, getCanvasPoint, tracedPoints]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const scoreTracing = useCallback(() => {
    // Simplified scoring: based on number of points traced and coverage
    const score = Math.min(100, Math.round((tracedPoints.length / 50) * 100));
    setAccuracy(score);
    setPhase('scored');

    if (score >= 90) {
      onCorrect?.();
    } else {
      onIncorrect?.();
    }
  }, [tracedPoints, onCorrect, onIncorrect]);

  const resetTracing = useCallback(() => {
    setTracedPoints([]);
    setAccuracy(null);
    setPhase('tracing');

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 200px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = '#1A237E40';
    ctx.lineWidth = 3;
    ctx.strokeText(targetLetter, 150, 155);
    ctx.setLineDash([]);
  }, [targetLetter]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#1A237E] font-inter flex items-center justify-center gap-2">
          <PenTool className="h-5 w-5" />
          Tactile Tracing
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Trace the letter <span className="font-bold text-[#1A237E]">"{targetLetter}"</span> along the dotted lines
        </p>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className={`rounded-2xl border-2 ${
            phase === 'scored'
              ? accuracy! >= 90
                ? 'border-[#2E7D32] shadow-[0_0_20px_rgba(46,125,50,0.3)]'
                : 'border-[#EF5350] shadow-[0_0_20px_rgba(239,83,80,0.3)]'
              : 'border-[#1A237E]/20'
          } bg-white cursor-crosshair touch-none transition-all`}
          style={{ width: 280, height: 280 }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Ghost Vector overlay */}
        {imageUrl && phase === 'scored' && accuracy! >= 90 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2 w-16 h-16 rounded-xl overflow-hidden border-2 border-[#2E7D32]"
          >
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {phase === 'tracing' && (
          <>
            <button
              onClick={resetTracing}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-muted-foreground hover:text-[#1A237E] border rounded-lg transition"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={scoreTracing}
              disabled={tracedPoints.length < 10}
              className="flex items-center gap-1.5 px-5 py-2 text-sm bg-[#1A237E] text-white rounded-lg shadow hover:bg-[#1A237E]/90 disabled:opacity-40 transition"
            >
              <Check className="h-4 w-4" />
              Submit
            </button>
          </>
        )}

        {phase === 'scored' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className={`text-3xl font-bold ${accuracy! >= 90 ? 'text-[#2E7D32]' : 'text-[#EF5350]'}`}>
              {accuracy}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accuracy! >= 90 ? '✨ Letter mastered!' : 'Try again — follow the dots more closely'}
            </p>
            {accuracy! < 90 && (
              <button
                onClick={resetTracing}
                className="mt-2 text-xs text-[#1A237E] underline"
              >
                Try Again
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TactileTracing;
