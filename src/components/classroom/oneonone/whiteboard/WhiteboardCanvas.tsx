
import React, { useRef } from "react";

interface WhiteboardCanvasProps {
  activeTool: "pencil" | "eraser" | "text" | "highlighter" | "shape" | "game";
  color: string;
  onCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onStartDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  children?: React.ReactNode;
}

export function WhiteboardCanvas({ 
  activeTool, 
  color, 
  onCanvasClick, 
  onStartDrawing,
  children 
}: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="bg-white rounded-lg border h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        width={800}
        height={600}
        onMouseDown={onStartDrawing}
        onClick={onCanvasClick}
      />
      
      {children}
      
      <div className="absolute bottom-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
        Collaborative Mode
      </div>
    </div>
  );
}
