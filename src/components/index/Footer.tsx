
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher as CommonLanguageSwitcher } from '@/components/common/LanguageSwitcher';

export const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <footer className="bg-muted py-6">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <Logo size="large" />
          </div>
          
          {/* Mobile Footer Links */}
          <div className="flex flex-col md:hidden gap-4 text-center">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              {t('aboutUs', { defaultValue: 'About Us' })}
            </Link>
            <Link to="/for-parents" className="text-muted-foreground hover:text-foreground">
              {t('forParents', { defaultValue: 'For Parents' })}
            </Link>
            <Link to="/for-teachers" className="text-muted-foreground hover:text-foreground">
              {t('forTeachers', { defaultValue: 'For Teachers' })}
            </Link>
            
            {/* Updated Contact Info */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:contact@engleuphoria.com" className="hover:text-foreground transition-colors">
                contact@engleuphoria.com
              </a>
            </div>
            
          {/* Language Switcher for Mobile */}
          <div className="flex justify-center mt-2">
            <CommonLanguageSwitcher />
          </div>
          </div>
          
          {/* Desktop Footer Links */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              {t('aboutUs', { defaultValue: 'About Us' })}
            </Link>
            <Link to="/for-parents" className="text-muted-foreground hover:text-foreground">
              {t('forParents', { defaultValue: 'For Parents' })}
            </Link>
            <Link to="/for-teachers" className="text-muted-foreground hover:text-foreground">
              {t('forTeachers', { defaultValue: 'For Teachers' })}
            </Link>
            
            {/* Updated Contact Info */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:contact@engleuphoria.com" className="hover:text-foreground transition-colors">
                contact@engleuphoria.com
              </a>
            </div>
            
          {/* Language Switcher for Desktop */}
          <div className="ml-4 flex items-center gap-2">
            <CommonLanguageSwitcher />
          </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Engleuphoria. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
