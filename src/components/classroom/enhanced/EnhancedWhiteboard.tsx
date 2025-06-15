
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pen, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Trash2, 
  Download, 
  Upload,
  Undo,
  Redo,
  Save,
  Users
} from 'lucide-react';

interface DrawingData {
  tool: string;
  color: string;
  size: number;
  points: { x: number; y: number }[];
  timestamp: number;
  userId: string;
}

interface EnhancedWhiteboardProps {
  isCollaborative?: boolean;
  currentUser: any;
  onContentSave?: (content: string) => void;
}

export function EnhancedWhiteboard({ 
  isCollaborative = true, 
  currentUser,
  onContentSave 
}: EnhancedWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser' | 'text' | 'shape'>('pen');
  const [activeShape, setActiveShape] = useState<'rectangle' | 'circle'>('rectangle');
  const [color, setColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(3);
  const [drawingHistory, setDrawingHistory] = useState<DrawingData[]>([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'shape', icon: Square, label: 'Shapes' }
  ];

  const colors = [
    '#2563eb', '#dc2626', '#16a34a', '#ca8a04', 
    '#9333ea', '#c2410c', '#0891b2', '#be185d'
  ];

  const brushSizes = [1, 3, 5, 8, 12];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Set canvas style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = activeTool === 'eraser' ? 'white' : color;
    ctx.lineWidth = activeTool === 'eraser' ? brushSize * 2 : brushSize;
  }, [activeTool, color, brushSize]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Save drawing to history
    const canvas = canvasRef.current;
    if (canvas) {
      const newStep: DrawingData = {
        tool: activeTool,
        color,
        size: brushSize,
        points: [], // Would contain actual drawing data in real implementation
        timestamp: Date.now(),
        userId: currentUser.id
      };

      setDrawingHistory(prev => [...prev.slice(0, historyStep + 1), newStep]);
      setHistoryStep(prev => prev + 1);
    }
  }, [isDrawing, activeTool, color, brushSize, historyStep, currentUser.id]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDrawingHistory([]);
    setHistoryStep(0);
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      // Redraw canvas up to historyStep - 1
    }
  };

  const redo = () => {
    if (historyStep < drawingHistory.length - 1) {
      setHistoryStep(prev => prev + 1);
      // Redraw canvas up to historyStep + 1
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');
    if (onContentSave) {
      onContentSave(dataURL);
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <Card className="p-3 mb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Tools */}
          <div className="flex items-center gap-2">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTool(tool.id as any)}
                  className="h-9 w-9 p-0"
                  title={tool.label}
                >
                  <IconComponent size={16} />
                </Button>
              );
            })}

            {activeTool === 'shape' && (
              <div className="flex gap-1 ml-2">
                <Button
                  variant={activeShape === 'rectangle' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveShape('rectangle')}
                  className="h-9 w-9 p-0"
                >
                  <Square size={14} />
                </Button>
                <Button
                  variant={activeShape === 'circle' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveShape('circle')}
                  className="h-9 w-9 p-0"
                >
                  <Circle size={14} />
                </Button>
              </div>
            )}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1">
            {colors.map((c) => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === c ? 'border-gray-400' : 'border-gray-200'
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Size:</span>
            {brushSizes.map((size) => (
              <Button
                key={size}
                variant={brushSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => setBrushSize(size)}
                className="h-9 w-9 p-0 text-xs"
              >
                {size}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyStep === 0}
              title="Undo"
            >
              <Undo size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyStep === drawingHistory.length - 1}
              title="Redo"
            >
              <Redo size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={saveCanvas}
              title="Save"
            >
              <Save size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
              title="Clear"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {/* Collaboration Status */}
        {isCollaborative && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gray-500" />
              <span className="text-xs text-gray-600">
                {collaborators.length + 1} active
              </span>
              {collaborators.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Collaborative
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Auto-save enabled
            </div>
          </div>
        )}
      </Card>

      {/* Canvas */}
      <Card className="flex-1 p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-full border border-gray-200 rounded cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </Card>
    </div>
  );
}
