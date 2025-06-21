
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Globe, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const navigate = useNavigate();
  const { language, setLanguage, languageText } = useLanguage();
  
  return (
    <footer className="bg-muted py-6">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <Logo size="large" />
          </div>
          
          {/* Mobile Footer Links */}
          <div className="flex flex-col md:hidden gap-4 text-center">
            <Link to="#" className="text-muted-foreground hover:text-foreground">
              {languageText.aboutUs}
            </Link>
            <Link to="/for-parents" className="text-muted-foreground hover:text-foreground">
              {languageText.forParents}
            </Link>
            <Link to="/for-teachers" className="text-muted-foreground hover:text-foreground">
              {languageText.forTeachers}
            </Link>
            
            {/* Updated Contact Info */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:contact@engleuphoria.com" className="hover:text-foreground transition-colors">
                contact@engleuphoria.com
              </a>
            </div>
            
            {/* Language Selector for Mobile */}
            <div className="flex justify-center gap-2 mt-2">
              <Button 
                size="sm"
                variant="ghost"
                className={language === 'english' ? 'underline' : ''}
                onClick={() => setLanguage('english')}
              >
                English
              </Button>
              <Button 
                size="sm"
                variant="ghost"
                className={language === 'arabic' ? 'underline' : ''}
                onClick={() => setLanguage('arabic')}
              >
                العربية
              </Button>
              <Button 
                size="sm"
                variant="ghost"
                className={language === 'french' ? 'underline' : ''}
                onClick={() => setLanguage('french')}
              >
                Français
              </Button>
            </div>
          </div>
          
          {/* Desktop Footer Links */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="#" className="text-muted-foreground hover:text-foreground">
              {languageText.aboutUs}
            </Link>
            <Link to="/for-parents" className="text-muted-foreground hover:text-foreground">
              {languageText.forParents}
            </Link>
            <Link to="/for-teachers" className="text-muted-foreground hover:text-foreground">
              {languageText.forTeachers}
            </Link>
            
            {/* Updated Contact Info */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:contact@engleuphoria.com" className="hover:text-foreground transition-colors">
                contact@engleuphoria.com
              </a>
            </div>
            
            {/* Language Selector for Desktop */}
            <div className="ml-4 flex items-center gap-1">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="mx-1 text-muted-foreground">|</span>
              <Button 
                size="sm"
                variant="ghost"
                className={`px-2 py-1 h-auto ${language === 'english' ? 'text-foreground underline' : 'text-muted-foreground'}`}
                onClick={() => setLanguage('english')}
              >
                EN
              </Button>
              <Button 
                size="sm"
                variant="ghost"
                className={`px-2 py-1 h-auto ${language === 'arabic' ? 'text-foreground underline' : 'text-muted-foreground'}`}
                onClick={() => setLanguage('arabic')}
              >
                AR
              </Button>
              <Button 
                size="sm"
                variant="ghost"
                className={`px-2 py-1 h-auto ${language === 'french' ? 'text-foreground underline' : 'text-muted-foreground'}`}
                onClick={() => setLanguage('french')}
              >
                FR
              </Button>
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
