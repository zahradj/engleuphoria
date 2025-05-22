
import { useState } from "react";
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

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const handlePrevPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
        <h3 className="font-medium">{languageText.lessonMaterial}</h3>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut size={16} />
          </Button>
          
          <span className="text-sm w-12 text-center">{zoom}%</span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn size={16} />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Upload size={16} />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Download size={16} />
          </Button>
          
          {allowAnnotation && (
            <Button 
              variant={isAnnotationMode ? "default" : "ghost"} 
              size="sm"
              onClick={() => setIsAnnotationMode(!isAnnotationMode)}
            >
              {isAnnotationMode ? languageText.exitAnnotation : languageText.annotate}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 relative overflow-auto bg-muted/20">
        <div 
          className="min-h-full flex items-center justify-center p-4 max-w-full"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {materialType === "pdf" && (
            <div className="bg-white aspect-[3/4] w-full max-w-5xl shadow-md">
              {/* In a real app, this would be a PDF viewer component */}
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">{languageText.pdfPreview} - {source}</p>
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
            <div className="bg-white aspect-video w-full max-w-6xl shadow-md">
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
        <div className="p-3 border-t flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={16} className="mr-1" />
            {languageText.previous}
          </Button>
          
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            {languageText.next}
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
