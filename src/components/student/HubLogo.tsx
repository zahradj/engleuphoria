import React from 'react';
import logoBlack from '@/assets/logo-black.png';
import logoWhite from '@/assets/logo-white.png';
import { useThemeMode } from '@/hooks/useThemeMode';

interface HubLogoProps {
  hubId: 'playground' | 'academy' | 'professional';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const HUB_COLORS: Record<string, { light: string; dark: string }> = {
  playground: { light: 'bg-orange-400', dark: 'bg-amber-700' },
  academy: { light: 'bg-indigo-600', dark: 'bg-indigo-800' },
  professional: { light: 'bg-emerald-600', dark: 'bg-emerald-800' },
};

const HUB_LABELS: Record<string, string> = {
  playground: 'Playground',
  academy: 'Academy',
  professional: 'Success Hub',
};

const SIZE_MAP = {
  sm: { circle: 'w-9 h-9', img: 'w-5 h-5', text: 'text-lg' },
  md: { circle: 'w-11 h-11', img: 'w-6 h-6', text: 'text-xl' },
  lg: { circle: 'w-14 h-14', img: 'w-8 h-8', text: 'text-2xl' },
};

export const HubLogo: React.FC<HubLogoProps> = ({ hubId, size = 'md', className = '' }) => {
  const { resolvedTheme } = useThemeMode();
  const isDark = resolvedTheme === 'dark';
  const colors = HUB_COLORS[hubId];
  const s = SIZE_MAP[size];

  // Light mode → white logo (on colored bg). Dark mode → black logo (on colored bg).
  const logoSrc = isDark ? logoBlack : logoWhite;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.circle} rounded-xl ${isDark ? colors.dark : colors.light} flex items-center justify-center shadow-md`}>
        <img src={logoSrc} alt="EnglEuphoria" className={`${s.img} object-contain`} />
      </div>
      <span className={`${s.text} font-bold tracking-tight ${isDark ? 'text-white' : 'text-foreground'}`}>
        {HUB_LABELS[hubId]}
      </span>
    </div>
  );
};
