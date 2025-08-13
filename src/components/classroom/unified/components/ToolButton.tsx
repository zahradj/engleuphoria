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
      className="w-full justify-start gap-3 h-12 text-sm hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-foreground transition-all duration-300 border border-transparent hover:border-primary/20 rounded-xl group"
      onClick={onClick}
    >
      <div className="text-primary group-hover:text-secondary transition-colors duration-300">
        {icon}
      </div>
      <span className="truncate font-medium">{label}</span>
    </Button>
  );
}