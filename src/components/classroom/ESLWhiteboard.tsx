
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Pencil, 
  Eraser, 
  Trash2, 
  Download, 
  Image, 
  TextCursor, 
  Square, 
  Circle as CircleIcon, 
  Highlighter 
} from "lucide-react";

interface ESLWhiteboardProps {
  className?: string;
  isCollaborative?: boolean;
}

export function ESLWhiteboard({ className = "", isCollaborative = true }: ESLWhiteboardProps) {
  const { languageText } = useLanguage();
  const [activeTab, setActiveTab] = useState("page1");
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser" | "text" | "highlighter" | "shape">("pencil");
  const [activeShape, setActiveShape] = useState<"rectangle" | "circle">("rectangle");
  const [color, setColor] = useState("#9B87F5"); // Default purple color
  const [pageCount, setPageCount] = useState(3);
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({
    page1: null,
    page2: null,
    page3: null,
  });
  
  const colors = ["#9B87F5", "#14B8A6", "#F97316", "#FACC15", "#000000"];
  
  useEffect(() => {
    // Initialize the current tab canvas
    const canvas = canvasRefs.current[activeTab];
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Fill with white background if it's empty
    if (!canvas.hasAttribute("data-initialized")) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.setAttribute("data-initialized", "true");
    }
    
    // Handle resize
    const handleResize = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.putImageData(imageData, 0, 0);
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeTab]);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRefs.current[activeTab];
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.beginPath();
    
    // Set drawing styles based on active tool
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
        ctx.strokeStyle = `${color}80`; // Add transparency
        ctx.lineWidth = 15;
        break;
      case "text":
        // Handle text input (in a real app, would open a text input at click position)
        return;
      case "shape":
        // Handle shape drawing (in a real app, would start shape at click position)
        return;
    }
    
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
    
    // Set drawing state
    canvas.setAttribute("data-drawing", "true");
    canvas.setAttribute("data-last-x", posX.toString());
    canvas.setAttribute("data-last-y", posY.toString());
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRefs.current[activeTab];
    if (!canvas || canvas.getAttribute("data-drawing") !== "true") return;
    
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
    
    const lastX = parseFloat(canvas.getAttribute("data-last-x") || "0");
    const lastY = parseFloat(canvas.getAttribute("data-last-y") || "0");
    
    ctx.lineTo(posX, posY);
    ctx.stroke();
    
    canvas.setAttribute("data-last-x", posX.toString());
    canvas.setAttribute("data-last-y", posY.toString());
  };
  
  const stopDrawing = () => {
    const canvas = canvasRefs.current[activeTab];
    if (!canvas) return;
    
    canvas.removeAttribute("data-drawing");
  };
  
  const clearCanvas = () => {
    const canvas = canvasRefs.current[activeTab];
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  const downloadCanvas = () => {
    const canvas = canvasRefs.current[activeTab];
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `esl-lesson-${activeTab}.png`;
    link.href = dataURL;
    link.click();
  };
  
  const addNewPage = () => {
    const newPageNum = pageCount + 1;
    const newPageId = `page${newPageNum}`;
    
    // Update refs object
    canvasRefs.current[newPageId] = null;
    
    // Update page count
    setPageCount(newPageNum);
    
    // Switch to new page
    setActiveTab(newPageId);
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-2">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Button
              variant={activeTool === "pencil" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("pencil")}
            >
              <Pencil size={16} className="mr-1" />
              {languageText.draw}
            </Button>
            
            <Button
              variant={activeTool === "highlighter" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("highlighter")}
            >
              <Highlighter size={16} className="mr-1" />
              {languageText.highlight}
            </Button>
            
            <Button
              variant={activeTool === "text" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("text")}
            >
              <TextCursor size={16} className="mr-1" />
              {languageText.text}
            </Button>
            
            <Button
              variant={activeTool === "shape" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("shape")}
            >
              {activeShape === "rectangle" ? 
                <Square size={16} className="mr-1" /> : 
                <CircleIcon size={16} className="mr-1" />
              }
              {languageText.shapes}
            </Button>
            
            <Button
              variant={activeTool === "eraser" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTool("eraser")}
            >
              <Eraser size={16} className="mr-1" />
              {languageText.erase}
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            {colors.map((c) => (
              <div
                key={c}
                className={`w-6 h-6 rounded-full cursor-pointer ${
                  color === c && activeTool !== "eraser" ? "ring-2 ring-offset-2 ring-gray-400" : ""
                }`}
                style={{ backgroundColor: c }}
                onClick={() => {
                  setColor(c);
                  if (activeTool === "eraser") setActiveTool("pencil");
                }}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash2 size={16} className="mr-1" />
              {languageText.clear}
            </Button>
            
            <Button variant="outline" size="sm" onClick={downloadCanvas}>
              <Download size={16} className="mr-1" />
              {languageText.save}
            </Button>
            
            <Button variant="outline" size="sm" disabled>
              <Image size={16} className="mr-1" />
              {languageText.addImage}
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-2">
            <TabsList>
              {Array.from({ length: pageCount }, (_, i) => {
                const pageId = `page${i + 1}`;
                return (
                  <TabsTrigger key={pageId} value={pageId} className="px-3 py-1">
                    {i + 1}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <Button variant="ghost" size="sm" onClick={addNewPage}>
              + {languageText.addPage}
            </Button>
          </div>
          
          {Array.from({ length: pageCount }, (_, i) => {
            const pageId = `page${i + 1}`;
            return (
              <TabsContent key={pageId} value={pageId} className="m-0">
                <div className="relative bg-white rounded-lg border overflow-hidden aspect-video">
                  <canvas
                    ref={(el) => (canvasRefs.current[pageId] = el)}
                    className="w-full h-full touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  
                  {isCollaborative && (
                    <Badge 
                      variant="secondary" 
                      className="absolute bottom-2 right-2"
                    >
                      {languageText.collaborative}
                    </Badge>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
