
import React from 'react';
import { Link } from 'react-router-dom';

export const DesktopNavigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
        Home
      </Link>
      <Link to="/for-teachers" className="transition-colors hover:text-foreground/80 text-foreground/60">
        For Teachers
      </Link>
      <Link to="/for-parents" className="transition-colors hover:text-foreground/80 text-foreground/60">
        For Parents
      </Link>
      <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
        About
      </Link>
    </nav>
  );
};
