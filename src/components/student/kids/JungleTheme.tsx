import React from 'react';
import { MagicForestWorld } from './MagicForestWorld';

interface JungleThemeProps {
  children?: React.ReactNode;
}

export const JungleTheme: React.FC<JungleThemeProps> = ({ children }) => {
  return (
    <MagicForestWorld>
      {children}
    </MagicForestWorld>
  );
};
