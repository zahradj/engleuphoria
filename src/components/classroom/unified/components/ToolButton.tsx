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
      className="w-full justify-start gap-3 h-12 text-sm hover:bg-gradient-to-r hover:from-primary/15 hover:via-accent/10 hover:to-secondary/15 hover:text-foreground transition-all duration-500 border border-transparent hover:border-accent/30 rounded-xl group relative overflow-hidden"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      <div className="text-primary group-hover:text-accent transition-colors duration-300 relative z-10">
        {icon}
      </div>
      <span className="truncate font-medium relative z-10 group-hover:text-secondary transition-colors duration-300">{label}</span>
    </Button>
  );
}