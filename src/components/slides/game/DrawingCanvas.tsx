import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Palette, Download, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DrawingCanvasProps {
  onSave?: (imageData: string) => void;
  prompt?: string;
}

const colors = [
  '#FF6B35', '#4ECDC4', '#95E1D3', '#FFE66D', 
  '#FF85A2', '#A8E6CF', '#FFD93D', '#6C5CE7'
];

export function DrawingCanvas({ onSave, prompt = "Draw yourself!" }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : currentColor;
    ctx.lineWidth = isEraser ? 20 : 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imageData = canvas.toDataURL('image/png');
    onSave?.(imageData);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-3xl font-bold text-foreground">{prompt}</h2>
      
      {/* Color Palette */}
      <div className="flex gap-2">
        {colors.map((color) => (
          <motion.button
            key={color}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentColor(color);
              setIsEraser(false);
            }}
            className="w-12 h-12 rounded-full border-4 transition-all"
            style={{
              backgroundColor: color,
              borderColor: currentColor === color && !isEraser ? '#000' : 'transparent'
            }}
          />
        ))}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEraser(!isEraser)}
          className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-background transition-all ${
            isEraser ? 'border-foreground' : 'border-transparent'
          }`}
        >
          <Eraser className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-4 border-primary rounded-lg cursor-crosshair bg-white shadow-lg"
      />

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={clearCanvas}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Trash2 className="h-5 w-5" />
          Clear
        </Button>
        <Button
          onClick={downloadDrawing}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Download className="h-5 w-5" />
          Download
        </Button>
        <Button
          onClick={saveDrawing}
          size="lg"
          className="gap-2"
        >
          <Palette className="h-5 w-5" />
          Save Drawing
        </Button>
      </div>
    </div>
  );
}
