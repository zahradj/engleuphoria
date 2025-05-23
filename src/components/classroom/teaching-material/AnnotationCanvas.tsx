import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnnotationCanvasProps {
  isAnnotationMode: boolean;
  annotationTool: "pen" | "eraser" | "rectangle" | "circle";
  color: string;
  currentPage: number;
  totalPages: number;
}

export function AnnotationCanvas({ 
  isAnnotationMode, 
  annotationTool, 
  color,
  currentPage,
  totalPages 
}: AnnotationCanvasProps) {
  const { languageText } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  // Keep annotations for each page
  const [annotations, setAnnotations] = useState<Record<number, string>>({});
  
  useEffect(() => {
    if (isAnnotationMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = annotationTool === "pen" ? 3 : annotationTool === "eraser" ? 20 : 2;
      }
      
      // Load annotations for current page if they exist
      if (annotations[currentPage]) {
        loadPageAnnotation(currentPage);
      } else {
        clearCanvas();
      }
    }
  }, [isAnnotationMode, annotationTool, currentPage]);

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
    setCurrentPosition({ x: posX, y: posY });
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

    setCurrentPosition({ x: currentX, y: currentY });
    
    // For pen and eraser, draw immediately
    if (annotationTool === "pen" || annotationTool === "eraser") {
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
    }
  };

  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) {
      setIsDrawing(false);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDrawing(false);
      return;
    }
    
    // For shapes, draw only when the mouse is released
    if (annotationTool === "rectangle") {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      const width = currentPosition.x - lastPosition.x;
      const height = currentPosition.y - lastPosition.y;
      ctx.strokeRect(lastPosition.x, lastPosition.y, width, height);
      ctx.stroke();
    } else if (annotationTool === "circle") {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      const radius = Math.sqrt(
        Math.pow(currentPosition.x - lastPosition.x, 2) + 
        Math.pow(currentPosition.y - lastPosition.y, 2)
      );
      ctx.arc(lastPosition.x, lastPosition.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Save annotations for the current page
    saveCurrentAnnotation();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Remove annotations for the current page
      const updatedAnnotations = { ...annotations };
      delete updatedAnnotations[currentPage];
      setAnnotations(updatedAnnotations);
    }
  };
  
  const saveCurrentAnnotation = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setAnnotations(prev => ({
      ...prev,
      [currentPage]: dataUrl
    }));
  };
  
  const loadPageAnnotation = (page: number) => {
    if (!canvasRef.current || !annotations[page]) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = annotations[page];
  };
  
  const saveAnnotations = () => {
    try {
      // Save all annotations to local storage
      localStorage.setItem('esl-classroom-annotations', JSON.stringify(annotations));
      toast(languageText.annotationsSaved || "Annotations saved successfully!");
    } catch (e) {
      toast.error(languageText.errorSavingAnnotations || "Error saving annotations");
      console.error("Error saving annotations:", e);
    }
  };
  
  const loadAnnotations = () => {
    try {
      // Load annotations from local storage
      const savedAnnotations = localStorage.getItem('esl-classroom-annotations');
      if (savedAnnotations) {
        const parsedAnnotations = JSON.parse(savedAnnotations);
        setAnnotations(parsedAnnotations);
        
        // Load current page annotation if it exists
        if (parsedAnnotations[currentPage]) {
          loadPageAnnotation(currentPage);
        }
        
        toast(languageText.annotationsLoaded || "Annotations loaded successfully!");
      } else {
        toast.info(languageText.noSavedAnnotations || "No saved annotations found");
      }
    } catch (e) {
      toast.error(languageText.errorLoadingAnnotations || "Error loading annotations");
      console.error("Error loading annotations:", e);
    }
  };

  return {
    canvasElement: (
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
    ),
    clearCanvas,
    saveAnnotations,
    loadAnnotations
  };
}
