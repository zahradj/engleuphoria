
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ZoomIn, ZoomOut, Move, RotateCcw, Download, Type } from "lucide-react";

interface EnhancedWhiteboardCanvasProps {
  activeTool: "pencil" | "eraser" | "text" | "highlighter" | "shape" | "move";
  color: string;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function EnhancedWhiteboardCanvas({ 
  activeTool, 
  color, 
  strokeWidth = 3,
  children 
}: EnhancedWhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, value: "" });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 800;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasPosition = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  const startDrawing = useCallback((e: React.MouseEvent) => {
    if (activeTool === 'text') {
      const pos = getCanvasPosition(e);
      setTextInput({ show: true, x: pos.x, y: pos.y, value: "" });
      return;
    }

    if (activeTool === 'move' || e.button === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getCanvasPosition(e);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidth;

    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = strokeWidth * 3;
    } else if (activeTool === "highlighter") {
      ctx.globalCompositeOperation = "multiply";
      ctx.strokeStyle = color + "40"; // Add transparency
      ctx.lineWidth = strokeWidth * 2;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [activeTool, color, strokeWidth, getCanvasPosition]);

  const draw = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDrawing || activeTool === 'text' || activeTool === 'move') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getCanvasPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, isPanning, activeTool, lastPanPoint, getCanvasPosition]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setIsPanning(false);
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 1.2 : 0.8;
    const newZoom = Math.min(Math.max(zoom * factor, 0.2), 3);
    setZoom(newZoom);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "whiteboard-export.png";
    link.href = dataURL;
    link.click();
  };

  const addText = () => {
    const canvas = canvasRef.current;
    if (!canvas || !textInput.value) {
      setTextInput({ show: false, x: 0, y: 0, value: "" });
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText(textInput.value, textInput.x, textInput.y);
    
    setTextInput({ show: false, x: 0, y: 0, value: "" });
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Zoom and Pan Controls */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('out')}
          >
            <ZoomOut size={14} />
          </Button>
          <Badge variant="secondary" className="px-2 py-1 text-xs">
            {Math.round(zoom * 100)}%
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('in')}
          >
            <ZoomIn size={14} />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            title="Reset zoom and position"
          >
            <RotateCcw size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
          >
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCanvas}
          >
            <Download size={14} />
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden relative bg-gray-100"
        style={{ cursor: activeTool === 'move' ? 'grab' : 'default' }}
      >
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(#000 1px, transparent 1px),
              linear-gradient(90deg, #000 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            transform: `translate(${pan.x}px, ${pan.y}px)`
          }}
        />
        
        {/* Main Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute border border-gray-200 bg-white"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            cursor: activeTool === 'pencil' ? 'crosshair' : 
                   activeTool === 'eraser' ? 'grab' :
                   activeTool === 'text' ? 'text' :
                   activeTool === 'move' ? 'grab' : 'default'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        {/* Text Input */}
        {textInput.show && (
          <div 
            className="absolute z-10"
            style={{
              left: `${textInput.x * zoom + pan.x}px`,
              top: `${textInput.y * zoom + pan.y}px`,
            }}
          >
            <Input
              value={textInput.value}
              onChange={(e) => setTextInput(prev => ({ ...prev, value: e.target.value }))}
              onBlur={addText}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addText();
                }
              }}
              className="text-sm"
              placeholder="Type here..."
              autoFocus
            />
          </div>
        )}
        
        {/* Embedded content container */}
        <div 
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {children}
        </div>
      </div>
      
      {/* Status indicators */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-t text-xs text-gray-600">
        <span>Tool: {activeTool} | Color: {color}</span>
        <Badge className="bg-blue-100 text-blue-700">
          Enhanced Canvas
        </Badge>
      </div>
    </Card>
  );
}
