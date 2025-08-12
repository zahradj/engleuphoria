import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ToolRailOverlayProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ToolRailOverlay({ title, onClose, children }: ToolRailOverlayProps) {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-background border-l border-border shadow-xl">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}