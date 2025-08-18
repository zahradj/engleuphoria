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
      className="w-full justify-start gap-3 h-10 text-sm bg-surface-2 hover:bg-primary-50 text-foreground hover:text-primary-600 transition-all duration-200 border border-muted/50 hover:border-primary-200 rounded-xl group"
      onClick={onClick}
    >
      <div className="text-muted-foreground group-hover:text-primary-500 transition-colors duration-200">
        {icon}
      </div>
      <span className="truncate font-medium">{label}</span>
    </Button>
  );
}