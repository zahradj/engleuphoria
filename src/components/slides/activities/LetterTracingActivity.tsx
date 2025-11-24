import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas as FabricCanvas, PencilBrush } from 'fabric';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LetterTracingActivityProps {
  letter: string;
  instructions: string;
  onComplete: (xp: number) => void;
  studentId?: string;
  lessonId?: string;
}

export const LetterTracingActivity: React.FC<LetterTracingActivityProps> = ({
  letter,
  instructions,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 500,
      height: 400,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });

    const brush = new PencilBrush(canvas);
    brush.color = '#3b82f6';
    brush.width = 8;
    canvas.freeDrawingBrush = brush;

    canvas.on('path:created', () => {
      setHasDrawn(true);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    setHasDrawn(false);
  };

  const handleDone = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      onComplete(30);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Trace the Letter</h2>
        <p className="text-lg text-center mb-8 text-muted-foreground">{instructions}</p>

        <div className="relative mb-6">
          {/* Letter guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-[200px] font-bold text-gray-200 opacity-50">
              {letter.toUpperCase()}
            </div>
          </div>

          {/* Drawing canvas */}
          <div className="border-4 border-primary rounded-2xl overflow-hidden shadow-lg">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Clear
          </Button>
          <Button
            onClick={handleDone}
            disabled={!hasDrawn}
            size="lg"
            className="gap-2"
          >
            <Check className="w-5 h-5" />
            Done
          </Button>
        </div>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          Use your mouse or finger to trace the letter {letter.toUpperCase()}
        </p>
      </motion.div>
    </div>
  );
};
