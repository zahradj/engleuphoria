
import React, { useState, useEffect } from "react";
import { MaterialContent } from "@/components/classroom/teaching-material/MaterialContent";
import { ContentItem } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface MaterialViewerProps {
  selectedContent: ContentItem | null;
}

export function MaterialViewer({ selectedContent }: MaterialViewerProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedContent) {
      setIsLoading(true);
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

  return (
    <div className="h-full">
      <div className="mb-2 text-sm text-muted-foreground">
        {selectedContent.title} - uploaded by {selectedContent.uploadedBy}
      </div>
      <div className="h-[calc(100%-2rem)] border rounded-lg overflow-hidden">
        <MaterialContent
          materialType={selectedContent.type === "game" ? "interactive" : selectedContent.type}
          source={selectedContent.source}
          currentPage={1}
        />
      </div>
    </div>
  );
}
