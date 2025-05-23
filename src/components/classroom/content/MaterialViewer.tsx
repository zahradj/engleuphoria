
import React, { useState, useEffect } from "react";
import { MaterialContent } from "@/components/classroom/teaching-material/MaterialContent";
import { ContentItem } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface MaterialViewerProps {
  selectedContent: ContentItem | null;
}

export function MaterialViewer({ selectedContent }: MaterialViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (selectedContent) {
      setIsLoading(true);
      setLoadError(false);
      // Simulate loading time - in real app this would be when content is actually loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [selectedContent]);

  if (!selectedContent) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No content selected. Upload or select content from the library.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full">
        <div className="mb-2">
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="h-[calc(100%-2rem)] border rounded-lg overflow-hidden p-4">
          <div className="flex items-center justify-center h-full">
            <div className="space-y-4 w-full max-w-md">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if the source is a valid URL or path
  const validateSource = (source: string): string => {
    if (!source) return "";
    
    // If it's already a blob URL from File API
    if (source.startsWith("blob:")) {
      return source;
    }
    
    // Check if it's already a valid URL
    try {
      new URL(source);
      return source;
    } catch (e) {
      // For embedded content that might be just domain paths
      if (source.includes('youtube.com') || source.includes('youtu.be')) {
        return source.startsWith('http') ? source : `https://${source}`;
      }
      
      // For local files, make sure the path is correct
      return source.startsWith('/') ? source : `/${source}`;
    }
  };

  return (
    <div className="h-full">
      <div className="mb-2 text-sm text-muted-foreground">
        {selectedContent.title} - uploaded by {selectedContent.uploadedBy}
      </div>
      <div className="h-[calc(100%-2rem)] border rounded-lg overflow-hidden">
        <MaterialContent
          materialType={selectedContent.type === "game" ? "interactive" : selectedContent.type}
          source={validateSource(selectedContent.source)}
          currentPage={1}
        />
      </div>
    </div>
  );
}
