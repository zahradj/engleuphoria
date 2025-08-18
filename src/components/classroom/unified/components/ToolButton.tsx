import React from "react";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function ToolButton({ icon, label, onClick }: ToolButtonProps) {
  return (
    <div className="relative group">
      {/* Ambient glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-200/40 via-accent-100/30 to-primary-200/40 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <Button
        variant="ghost"
        className="relative w-full justify-start gap-3 h-12 text-sm bg-gradient-to-r from-neutral-100/80 to-primary-50/60 hover:from-primary-100/80 hover:to-accent-50/70 text-primary-700 hover:text-primary-800 transition-all duration-300 border border-neutral-200/80 hover:border-primary-300/60 rounded-xl group overflow-hidden shadow-sm hover:shadow-lg backdrop-blur-sm"
        onClick={onClick}
      >
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1 right-2 w-1 h-1 bg-primary-300/40 rounded-full opacity-0 group-hover:opacity-100 animate-float transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-4 w-0.5 h-0.5 bg-accent-300/50 rounded-full opacity-0 group-hover:opacity-100 animate-float animation-delay-300 transition-opacity duration-300"></div>
        
        <div className="text-primary-600 group-hover:text-primary-700 transition-all duration-300 relative z-10 group-hover:scale-110">
          {icon}
        </div>
        <span className="truncate font-medium relative z-10 text-primary-700 group-hover:text-primary-800 transition-all duration-300 group-hover:translate-x-1">{label}</span>
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-primary-300/30 to-transparent rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Button>
    </div>
  );
}