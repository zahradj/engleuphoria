
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface SimpleWhiteboardCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  tool: "pencil" | "eraser" | "text";
  color: string;
  handleCanvasClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  isAddingText?: boolean;
  textPosition?: { x: number; y: number };
  textContent?: string;
  setTextContent?: (text: string) => void;
  textInputRef?: React.RefObject<HTMLTextAreaElement>;
  addTextToCanvas?: () => void;
}

export function SimpleWhiteboardCanvas({
  canvasRef,
  isDrawing,
  setIsDrawing,
  tool,
  color,
  handleCanvasClick,
  isAddingText = false,
  textPosition = { x: 0, y: 0 },
  textContent = "",
  setTextContent = () => {},
  textInputRef,
  addTextToCanvas = () => {}
}: SimpleWhiteboardCanvasProps) {
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (tool === "text") return; // Don't start drawing if text tool is selected
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Set drawing styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? 20 : 5;
    
    // Get position
    let posX, posY;
    if ("touches" in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      posX = e.touches[0].clientX - rect.left;
      posY = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      posX = e.nativeEvent.offsetX;
      posY = e.nativeEvent.offsetY;
    }
    
    ctx.beginPath();
    ctx.moveTo(posX, posY);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === "text") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Get position
    let posX, posY;
    if ("touches" in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      posX = e.touches[0].clientX - rect.left;
      posY = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      posX = e.nativeEvent.offsetX;
      posY = e.nativeEvent.offsetY;
    }
    
    ctx.lineTo(posX, posY);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  return (
    <div className="relative border rounded-lg overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        className="w-full h-[400px] touch-none"
        onMouseDown={tool === "text" ? handleCanvasClick : startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {isAddingText && (
        <div
          className="absolute"
          style={{
            left: `${textPosition.x}px`,
            top: `${textPosition.y - 20}px`,
          }}
        >
          <Textarea
            ref={textInputRef}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-h-[20px] resize-none"
            placeholder="Type here..."
            onBlur={addTextToCanvas}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addTextToCanvas();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
