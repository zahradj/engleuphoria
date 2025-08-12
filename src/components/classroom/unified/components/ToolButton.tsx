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
      className="w-full justify-start gap-2 h-10 text-sm hover:bg-accent hover:text-accent-foreground"
      onClick={onClick}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Button>
  );
}