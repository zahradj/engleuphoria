
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSwitcherProps {
  size?: 'sm' | 'default';
}

export const LanguageSwitcher = ({ size = 'default' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size} 
          className={size === 'sm' ? "gap-1" : "gap-2"}
        >
          <Globe className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />
          <span className={size === 'sm' ? "text-xs" : ""}>
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setLanguage('english')}>
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('spanish')}>
          🇪🇸 Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('french')}>
          🇫🇷 Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('arabic')}>
          🇸🇦 العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
