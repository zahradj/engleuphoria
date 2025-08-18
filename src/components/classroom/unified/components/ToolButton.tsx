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
      className="w-full justify-start gap-3 h-12 text-sm bg-gradient-to-r from-neutral-100 to-primary-50 hover:from-primary-100 hover:to-accent-50 text-primary-700 hover:text-primary-800 transition-all duration-200 border border-neutral-200 hover:border-primary-300 rounded-xl group relative overflow-hidden shadow-sm hover:shadow-md"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 via-accent-50/20 to-primary-100/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
      <div className="text-primary-600 group-hover:text-primary-700 transition-colors duration-200 relative z-10">
        {icon}
      </div>
      <span className="truncate font-medium relative z-10 text-primary-700 group-hover:text-primary-800 transition-colors duration-200">{label}</span>
    </Button>
  );
}