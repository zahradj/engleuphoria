
import React from "react";
import { MaterialContent } from "@/components/classroom/teaching-material/MaterialContent";
import { ContentItem } from "./types";

interface MaterialViewerProps {
  selectedContent: ContentItem | null;
}

export function MaterialViewer({ selectedContent }: MaterialViewerProps) {
  if (!selectedContent) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No content selected. Upload or select content from the library.
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
