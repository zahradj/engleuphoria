
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pencil, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Trash2, 
  Download,
  Upload,
  Highlighter
} from "lucide-react";

export function OneOnOneWhiteboard() {
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape">("pencil");
  const [color, setColor] = useState("#2563eb");
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  const [activeTab, setActiveTab] = useState("page1");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed", "#000000"];

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Set drawing styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    switch (activeTool) {
      case "pencil":
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        break;
      case "eraser":
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 20;
        break;
      case "highlighter":
        ctx.strokeStyle = `${color}80`;
        ctx.lineWidth = 15;
        break;
    }

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
  };

  const draw = (e: MouseEvent) => {
    const canvas = e.target as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: MouseEvent) => {
    const canvas = e.target as HTMLCanvasElement;
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopDrawing);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTool === "pencil" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("pencil")}
            >
              <Pencil size={16} />
            </Button>
            
            <Button
              variant={activeTool === "highlighter" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("highlighter")}
            >
              <Highlighter size={16} />
            </Button>
            
            <Button
              variant={activeTool === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("text")}
            >
              <Type size={16} />
            </Button>
            
            <Button
              variant={activeTool === "shape" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("shape")}
            >
              {activeShape === "rectangle" ? <Square size={16} /> : <Circle size={16} />}
            </Button>
            
            <Button
              variant={activeTool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("eraser")}
            >
              <Eraser size={16} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash2 size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={16} />
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} />
            </Button>
          </div>
        </div>
        
        {/* Color Palette */}
        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <div
              key={c}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                color === c ? "border-gray-400" : "border-gray-200"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      {/* Canvas Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="mb-2">
          <TabsTrigger value="page1">Page 1</TabsTrigger>
          <TabsTrigger value="page2">Page 2</TabsTrigger>
          <TabsTrigger value="page3">Page 3</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="flex-1 m-0">
          <div className="bg-white rounded-lg border h-full relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              width={800}
              height={600}
              onMouseDown={startDrawing}
            />
            
            <div className="absolute bottom-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              Collaborative Mode
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
