import React from "react";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export function ToolButton({ icon, label, onClick }: ToolButtonProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 h-12 text-sm rgb-button hover:scale-105 transition-all duration-500 border border-transparent rounded-xl group relative overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      <div className="text-white transition-colors duration-300 relative z-10">
        {icon}
      </div>
      <span className="truncate font-bold relative z-10 text-white">{label}</span>
    </Button>
  );
}