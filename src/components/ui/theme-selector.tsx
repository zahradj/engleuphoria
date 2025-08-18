import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';
import { useTheme, type Theme } from '@/hooks/useTheme';

const themes: { id: Theme; name: string; description: string }[] = [
  { id: 'default', name: 'Default', description: 'Modern slate blue' },
  { id: 'mist-blue', name: 'Mist Blue', description: 'Calm powder blue for kids' },
  { id: 'sage-sand', name: 'Sage Sand', description: 'Warm sage green for kids' }
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={theme === themeOption.id ? 'bg-accent' : ''}
          >
            <div>
              <div className="font-medium">{themeOption.name}</div>
              <div className="text-xs text-muted-foreground">{themeOption.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}