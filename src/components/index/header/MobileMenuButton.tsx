
import React from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuButton = ({ isOpen, onToggle }: MobileMenuButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="p-2"
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );
};
