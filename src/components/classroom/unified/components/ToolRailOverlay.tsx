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
    <div className="fixed inset-y-0 right-0 z-50 w-80 shadow-xl" style={{ 
      backgroundColor: '#FBFBFB', 
      borderLeft: '1px solid rgba(196, 217, 255, 0.5)'
    }}>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(196, 217, 255, 0.4)' }}>
          <h3 className="text-sm font-medium" style={{ color: '#374151' }}>{title}</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8 transition-colors duration-200"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F9FF'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4" style={{ backgroundColor: 'rgba(232, 249, 255, 0.2)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}