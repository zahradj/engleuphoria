
import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Image, Video, Gamepad2 } from "lucide-react";
import { ContentItem } from "./types";

interface ContentLibraryProps {
  contentItems: ContentItem[];
  selectedContent: ContentItem | null;
  onSelectContent: (content: ContentItem) => void;
}

export function ContentLibrary({ 
  contentItems, 
  selectedContent, 
  onSelectContent 
}: ContentLibraryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contentItems.map((item) => (
        <Card 
          key={item.id} 
          className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
            selectedContent?.id === item.id ? 'bg-muted' : ''
          }`}
          onClick={() => onSelectContent(item)}
        >
          <div className="flex items-center gap-2 mb-2">
            {item.type === 'pdf' && <FileText size={16} />}
            {item.type === 'image' && <Image size={16} />}
            {item.type === 'video' && <Video size={16} />}
            {(item.type === 'game' || item.type === 'interactive') && <Gamepad2 size={16} />}
            <span className="font-medium truncate">{item.title}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            By {item.uploadedBy} • {item.timestamp.toLocaleDateString()}
          </div>
          <div className="text-xs text-blue-600 mt-1 capitalize">
            {item.type}
          </div>
        </Card>
      ))}
    </div>
  );
}
