
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export const MobileMenu = ({ isOpen, onClose, onLogin, onSignUp }: MobileMenuProps) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 space-y-4">
        <Link 
          to="/about" 
          className="block text-gray-600 hover:text-purple-600 transition-colors py-2"
          onClick={onClose}
        >
          {t('navigation.aboutUs')}
        </Link>
        <Link 
          to="/for-parents" 
          className="block text-gray-600 hover:text-purple-600 transition-colors py-2"
          onClick={onClose}
        >
          {t('navigation.forParents')}
        </Link>
        <Link 
          to="/for-teachers" 
          className="block text-gray-600 hover:text-purple-600 transition-colors py-2"
          onClick={onClose}
        >
          {t('navigation.forTeachers')}
        </Link>
        
        <div className="pt-4 border-t space-y-3">
          <Button 
            variant="outline" 
            onClick={onLogin}
            className="w-full"
          >
            {t('logIn')}
          </Button>
          <Button 
            onClick={onSignUp} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {t('signUp')}
          </Button>
        </div>
      </div>
    </div>
  );
};
