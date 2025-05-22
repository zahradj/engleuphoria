
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Upload, 
  Download, 
  RotateCcw 
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
  
  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

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

      <div className="flex-1 relative overflow-auto bg-muted/20">
        <div 
          className="min-h-full flex items-center justify-center p-2"
          style={{ transform: `scale(${zoom / 100})` }}
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
