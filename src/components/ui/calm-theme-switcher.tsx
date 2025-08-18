import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Check } from 'lucide-react';

interface CalmThemeSwitcherProps {
  className?: string;
}

const themes = [
  {
    id: 'mist-blue',
    name: 'Mist Blue',
    description: 'Calming powder blue with slate neutrals',
    preview: {
      primary: 'hsl(210, 30%, 58%)',
      accent: 'hsl(180, 25%, 52%)',
      surface: 'hsl(210, 15%, 96%)'
    }
  },
  {
    id: 'sage-sand',
    name: 'Sage Sand',
    description: 'Warm sage green with sandy neutrals',
    preview: {
      primary: 'hsl(140, 30%, 56%)',
      accent: 'hsl(270, 25%, 52%)',
      surface: 'hsl(30, 20%, 96%)'
    }
  }
];

export function CalmThemeSwitcher({ className = "" }: CalmThemeSwitcherProps) {
  const [selectedTheme, setSelectedTheme] = useState('mist-blue');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('calm-theme') || 'mist-blue';
    setSelectedTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    const root = document.documentElement;
    
    // Remove existing theme data attributes
    root.removeAttribute('data-theme');
    
    // Apply new theme
    if (themeId !== 'mist-blue') {
      root.setAttribute('data-theme', themeId);
    }
    
    // Save preference
    localStorage.setItem('calm-theme', themeId);
    setSelectedTheme(themeId);
  };

  return (
    <Card className={`p-4 border border-muted bg-surface shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-medium text-foreground">Theme</h3>
      </div>
      
      <div className="space-y-3">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant="ghost"
            className={`w-full p-4 h-auto flex items-start gap-3 transition-all duration-200 ${
              selectedTheme === theme.id 
                ? 'bg-primary-50 border border-primary-200 shadow-sm' 
                : 'bg-surface hover:bg-surface-2 border border-transparent'
            }`}
            onClick={() => applyTheme(theme.id)}
          >
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground text-sm">{theme.name}</span>
                {selectedTheme === theme.id && (
                  <Check className="w-3 h-3 text-primary-600" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{theme.description}</p>
              
              {/* Theme preview */}
              <div className="flex gap-1 mt-2">
                <div 
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.preview.primary }}
                />
                <div 
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.preview.accent }}
                />
                <div 
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.preview.surface }}
                />
              </div>
            </div>
          </Button>
        ))}
      </div>
      
      <div className="mt-4 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
        Clean, premium aesthetics with optimal accessibility
      </div>
    </Card>
  );
}