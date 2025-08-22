import { useEffect } from 'react';

export function useTheme() {
  useEffect(() => {
    const root = document.documentElement;
    // Always use pastel-sky theme
    root.setAttribute('data-theme', 'pastel-sky');
  }, []);

  return { theme: 'pastel-sky', setTheme: () => {} };
}