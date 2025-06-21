
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/contexts/LanguageContext';

export const Header = () => {
  const navigate = useNavigate();
  const { language, setLanguage, languageText } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handlePricing = () => {
    navigate("/payment");
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
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
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EnglEuphoria
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <a href="/about-us" className="text-gray-600 hover:text-purple-600 transition-colors">
            {t('aboutUs') || 'About Us'}
          </a>
          <a href="/for-parents" className="text-gray-600 hover:text-purple-600 transition-colors">
            {t('forParents') || 'For Parents'}
          </a>
          <a href="/for-teachers" className="text-gray-600 hover:text-purple-600 transition-colors">
            {t('forTeachers') || 'For Teachers'}
          </a>
          <Button
            variant="ghost"
            onClick={handlePricing}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            Pricing
          </Button>
        </nav>

        {/* Desktop Language Switcher and Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
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
            {t('logIn') || 'Log In'}
          </Button>
          
          <Button onClick={handleSignUp} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            {t('signUp') || 'Sign Up'}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Globe className="h-3 w-3" />
                <span className="text-xs">{language.toUpperCase()}</span>
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
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <a 
              href="/about-us" 
              className="block text-gray-600 hover:text-purple-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('aboutUs') || 'About Us'}
            </a>
            <a 
              href="/for-parents" 
              className="block text-gray-600 hover:text-purple-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('forParents') || 'For Parents'}
            </a>
            <a 
              href="/for-teachers" 
              className="block text-gray-600 hover:text-purple-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('forTeachers') || 'For Teachers'}
            </a>
            <Button
              variant="ghost"
              onClick={handlePricing}
              className="w-full justify-start text-gray-600 hover:text-purple-600 transition-colors px-0"
            >
              Pricing
            </Button>
            
            <div className="pt-4 border-t space-y-3">
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="w-full"
              >
                {t('logIn') || 'Log In'}
              </Button>
              <Button 
                onClick={handleSignUp} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {t('signUp') || 'Sign Up'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
