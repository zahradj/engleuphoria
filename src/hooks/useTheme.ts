import { useEffect } from 'react';

export function useTheme() {
  useEffect(() => {
    const root = document.documentElement;
    // Use professional theme for clean dashboards
    root.setAttribute('data-theme', 'professional');
  }, []);

  return { theme: 'professional', setTheme: () => {} };
}