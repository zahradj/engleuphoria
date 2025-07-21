
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderLogo } from './header/HeaderLogo';
import { DesktopNavigation } from './header/DesktopNavigation';
import { ModernLanguageSwitcher } from '@/components/common/ModernLanguageSwitcher';
import { AuthButtons } from './header/AuthButtons';
import { MobileMenu } from './header/MobileMenu';
import { MobileMenuButton } from './header/MobileMenuButton';

export const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignUp = () => {
    navigate("/signup");
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <HeaderLogo />

        <DesktopNavigation />

        {/* Desktop Language Switcher and Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <ModernLanguageSwitcher />
          <AuthButtons onLogin={handleLogin} onSignUp={handleSignUp} />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <ModernLanguageSwitcher size="sm" />
          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          />
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    </header>
  );
};
