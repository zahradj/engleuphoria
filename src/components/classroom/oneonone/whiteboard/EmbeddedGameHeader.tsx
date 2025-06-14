
import React from "react";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, RefreshCw } from "lucide-react";

interface EmbeddedGameHeaderProps {
  title: string;
  showError: boolean;
  onRetry: () => void;
  onOpenInNewTab: () => void;
  onRemove: () => void;
}

export function EmbeddedGameHeader({
  title,
  showError,
  onRetry,
  onOpenInNewTab,
  onRemove
}: EmbeddedGameHeaderProps) {
  return (
    <div className="flex items-center justify-between p-2 bg-blue-500 text-white text-sm cursor-grab">
      <span className="font-medium truncate">{title}</span>
      <div className="flex items-center gap-1">
        {showError && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-blue-600"
            onClick={onRetry}
            title="Retry loading"
          >
            <RefreshCw size={12} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-blue-600"
          onClick={onOpenInNewTab}
          title="Open in new tab"
        >
          <ExternalLink size={12} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:bg-blue-600"
          onClick={onRemove}
        >
          <X size={12} />
        </Button>
      </div>
    </div>
  );
}
