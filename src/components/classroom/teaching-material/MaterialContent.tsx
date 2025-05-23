
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  
  return (
    <>
      {materialType === "pdf" && (
        <div className="bg-white aspect-[3/4] w-full max-w-3xl shadow-md">
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              {languageText.pdfPreview} - {source} (Page {currentPage})
            </p>
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
    </>
  );
}
