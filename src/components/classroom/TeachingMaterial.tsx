
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Upload, 
  Download, 
  PenLine,
  Eraser,
  Trash2
} from "lucide-react";

interface TeachingMaterialProps {
  materialType: "pdf" | "image" | "video" | "interactive";
  source: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  allowAnnotation?: boolean;
}

export function TeachingMaterial({
  materialType,
  source,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  allowAnnotation = true,
}: TeachingMaterialProps) {
  const { languageText } = useLanguage();
  const [zoom, setZoom] = useState(100);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
  const [annotationTool, setAnnotationTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#9B87F5"); // Default purple color
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (isAnnotationMode && canvasRef.current && canvasContainerRef.current) {
      const container = canvasContainerRef.current;
      const canvas = canvasRef.current;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = annotationTool === "pen" ? 3 : 20;
      }
    }
  }, [isAnnotationMode, annotationTool]);

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const handlePrevPage = () => {
    if (localCurrentPage > 1) {
      const newPage = localCurrentPage - 1;
      setLocalCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  const handleNextPage = () => {
    if (localCurrentPage < totalPages) {
      const newPage = localCurrentPage + 1;
      setLocalCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isAnnotationMode || !canvasRef.current) return;
    
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let posX, posY;
    if ('touches' in e) {
      posX = e.touches[0].clientX - rect.left;
      posY = e.touches[0].clientY - rect.top;
    } else {
      posX = e.nativeEvent.offsetX;
      posY = e.nativeEvent.offsetY;
    }
    
    setLastPosition({ x: posX, y: posY });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isAnnotationMode || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    
    let currentX, currentY;
    if ('touches' in e) {
      currentX = e.touches[0].clientX - rect.left;
      currentY = e.touches[0].clientY - rect.top;
    } else {
      currentX = e.nativeEvent.offsetX;
      currentY = e.nativeEvent.offsetY;
    }
    
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(currentX, currentY);
    
    if (annotationTool === "pen") {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
    } else { // eraser
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 20;
    }
    
    ctx.stroke();
    setLastPosition({ x: currentX, y: currentY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearAnnotations = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-sm border">
      <div className="p-2 bg-muted/30 border-b flex items-center justify-between">
        <h3 className="font-medium text-sm">{languageText.lessonMaterial}</h3>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut size={14} />
          </Button>
          
          <span className="text-xs w-10 text-center">{zoom}%</span>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn size={14} />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Upload size={14} />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Download size={14} />
          </Button>
          
          {allowAnnotation && (
            <Button 
              variant={isAnnotationMode ? "default" : "ghost"} 
              size="sm"
              className="text-xs px-2 py-1 h-7"
              onClick={() => setIsAnnotationMode(!isAnnotationMode)}
            >
              {isAnnotationMode ? languageText.exitAnnotation : languageText.annotate}
            </Button>
          )}
        </div>
      </div>

      {isAnnotationMode && (
        <div className="flex items-center gap-2 p-2 bg-muted/20 border-b">
          <Button 
            variant={annotationTool === "pen" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setAnnotationTool("pen")}
            className="h-8 px-2"
          >
            <PenLine size={14} className="mr-1" />
            {languageText.draw}
          </Button>
          <Button 
            variant={annotationTool === "eraser" ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setAnnotationTool("eraser")}
            className="h-8 px-2"
          >
            <Eraser size={14} className="mr-1" />
            {languageText.erase}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAnnotations}
            className="h-8 px-2"
          >
            <Trash2 size={14} className="mr-1" />
            {languageText.clear}
          </Button>
          
          {annotationTool === "pen" && (
            <div className="flex items-center gap-1 ml-auto">
              {["#9B87F5", "#14B8A6", "#F97316", "#FACC15", "#000000"].map((c) => (
                <div
                  key={c}
                  className={`w-5 h-5 rounded-full cursor-pointer ${
                    color === c ? "ring-2 ring-offset-1 ring-gray-400" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 relative overflow-auto bg-muted/20">
        <div 
          className="min-h-full flex items-center justify-center p-2 relative"
          style={{ transform: `scale(${zoom / 100})` }}
          ref={canvasContainerRef}
        >
          {materialType === "pdf" && (
            <div className="bg-white aspect-[3/4] w-full max-w-3xl shadow-md">
              {/* In a real app, this would be a PDF viewer component */}
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">{languageText.pdfPreview} - {source} (Page {localCurrentPage})</p>
              </div>
            </div>
          )}
          
          {materialType === "image" && (
            <img 
              src={source} 
              alt="Teaching material" 
              className="max-w-full max-h-full object-contain"
            />
          )}
          
          {materialType === "video" && (
            <video 
              src={source}
              controls
              className="max-w-full max-h-full"
            />
          )}
          
          {materialType === "interactive" && (
            <div className="bg-white aspect-video w-full max-w-4xl shadow-md">
              <iframe 
                src={source}
                className="w-full h-full border-0"
                title="Interactive content"
              />
            </div>
          )}
          
          {isAnnotationMode && (
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full z-10 touch-none"
              style={{ pointerEvents: 'all' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="p-2 border-t flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handlePrevPage}
            disabled={localCurrentPage <= 1}
          >
            <ChevronLeft size={14} className="mr-1" />
            {languageText.previous}
          </Button>
          
          <span className="text-xs">
            {localCurrentPage} / {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleNextPage}
            disabled={localCurrentPage >= totalPages}
          >
            {languageText.next}
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
