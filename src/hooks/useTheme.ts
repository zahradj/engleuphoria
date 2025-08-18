import { useState, useEffect } from 'react';

export type Theme = 'default' | 'mist-blue' | 'sage-sand';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('k12-theme');
    return (stored as Theme) || 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.removeAttribute('data-theme');
    
    // Apply the selected theme
    if (theme !== 'default') {
      root.setAttribute('data-theme', theme);
    }
    
    // Persist the theme
    localStorage.setItem('k12-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}