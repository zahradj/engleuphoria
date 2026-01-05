import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeMode } from '@/hooks/useThemeMode';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeModeToggleProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

export function ThemeModeToggle({ className = '', variant = 'ghost' }: ThemeModeToggleProps) {
  const { resolvedTheme, toggleTheme } = useThemeMode();

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`relative w-9 h-9 ${className}`}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
