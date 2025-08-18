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
      className="w-full justify-start gap-3 h-12 text-sm bg-gradient-to-r from-brand-100 to-brand-200 hover:from-brand-200 hover:to-brand-300 text-brand-700 hover:text-brand-800 transition-all duration-300 border-2 border-brand-200 hover:border-brand-400 rounded-2xl group relative overflow-hidden shadow-sm hover:shadow-md"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand-300/20 via-brand-400/10 to-brand-300/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      <div className="text-brand-600 group-hover:text-brand-700 transition-colors duration-300 relative z-10">
        {icon}
      </div>
      <span className="truncate font-medium relative z-10 text-brand-700 group-hover:text-brand-800 transition-colors duration-300">{label}</span>
    </Button>
  );
}