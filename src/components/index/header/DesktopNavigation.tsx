
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const DesktopNavigation = () => {
  const { t } = useTranslation();
  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
        {t('home', { defaultValue: 'Home' })}
      </Link>
      <Link to="/for-teachers" className="transition-colors hover:text-foreground/80 text-foreground/60">
        {t('forTeachers', { defaultValue: 'For Teachers' })}
      </Link>
      <Link to="/for-parents" className="transition-colors hover:text-foreground/80 text-foreground/60">
        {t('forParents', { defaultValue: 'For Parents' })}
      </Link>
      <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
        {t('aboutUs', { defaultValue: 'About' })}
      </Link>
    </nav>
  );
};

