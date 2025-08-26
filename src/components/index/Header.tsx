
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderLogo } from './header/HeaderLogo';
import { DesktopNavigation } from './header/DesktopNavigation';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { AuthButtons } from './header/AuthButtons';
import { MobileMenu } from './header/MobileMenu';
import { MobileMenuButton } from './header/MobileMenuButton';
import { DashboardSwitcher } from '@/components/navigation/DashboardSwitcher';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignUp = () => {
    console.log('🚀 Navigate to signup called');
    navigate("/signup");
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    console.log('🔐 Navigate to login called');
    navigate("/login");
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <HeaderLogo />

        <DesktopNavigation />

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <DashboardSwitcher />
          ) : (
            <AuthButtons onLogin={handleLogin} onSignUp={handleSignUp} />
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
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
