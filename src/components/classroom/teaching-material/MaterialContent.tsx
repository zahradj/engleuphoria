
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, Play, FileText, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MaterialContentProps {
  materialType: "pdf" | "image" | "video" | "interactive";
  source: string;
  currentPage: number;
}

export function MaterialContent({
  materialType,
  source,
  currentPage
}: MaterialContentProps) {
  const { languageText } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {materialType === "pdf" && (
        <div className="bg-white aspect-[3/4] w-full max-w-3xl shadow-md rounded-lg border">
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <FileText size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg font-medium mb-2">
              {languageText.pdfPreview}
            </p>
            <p className="text-sm text-muted-foreground">
              {source} (Page {currentPage})
            </p>
          </div>
        </div>
      )}
      
      {materialType === "image" && (
        <div className="w-full h-full flex items-center justify-center">
          {imageError ? (
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load image. Please check the file path or upload a new image.
              </AlertDescription>
            </Alert>
          ) : (
            <img 
              src={source} 
              alt="Teaching material" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              onError={handleImageError}
            />
          )}
        </div>
      )}
      
      {materialType === "video" && (
        <div className="w-full h-full flex items-center justify-center">
          {videoError ? (
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load video. Please check the URL or upload a new video file.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              {source.includes('youtube.com') || source.includes('youtu.be') ? (
                <iframe
                  src={source.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full border-0"
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={handleVideoError}
                />
              ) : (
                <video 
                  src={source}
                  controls
                  className="w-full h-full"
                  onError={handleVideoError}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
        </div>
      )}
      
      {materialType === "interactive" && (
        <div className="w-full h-full flex items-center justify-center">
          {iframeError ? (
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load interactive content. Please check the URL or try a different source.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="w-full max-w-6xl aspect-video bg-white shadow-lg rounded-lg overflow-hidden border">
              <iframe 
                src={source}
                className="w-full h-full border-0"
                title="Interactive content"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onError={handleIframeError}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
