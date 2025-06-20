
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Globe, Mail, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/contexts/LanguageContext';

export const Header = () => {
  const navigate = useNavigate();
  const { language, setLanguage, languageText } = useLanguage();

  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = languageText;
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img 
            src="/lovable-uploads/a38a7187-5f12-41aa-bcc6-ef6ffb768fbf.png" 
            alt="EnglEuphoria Logo" 
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EnglEuphoria
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/for-parents" className="text-gray-600 hover:text-purple-600 transition-colors">
            {t('landing.forParents') || 'For Parents'}
          </a>
          <a href="/for-teachers" className="text-gray-600 hover:text-purple-600 transition-colors">
            {t('landing.forTeachers') || 'For Teachers'}
          </a>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <a href="mailto:support@engleuphoria.com" className="hover:text-purple-600 transition-colors">
              support@engleuphoria.com
            </a>
          </div>
        </nav>

        {/* Language Switcher and Auth Buttons */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('english')}>
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('spanish')}>
                🇪🇸 Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('french')}>
                🇫🇷 Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('arabic')}>
                🇸🇦 العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" onClick={handleLogin}>
            {t('landing.logIn') || 'Log In'}
          </Button>
          
          <Button onClick={handleSignUp} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            {t('landing.signUp') || 'Sign Up'}
          </Button>
        </div>
      </div>
    </header>
  );
};
