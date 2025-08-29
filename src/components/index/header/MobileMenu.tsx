
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
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
          {t('aboutUs', { defaultValue: 'About Us' })}
        </Link>
        <Link 
          to="/for-parents" 
          className="block text-gray-600 hover:text-purple-600 transition-colors py-2"
          onClick={onClose}
        >
          {t('forParents', { defaultValue: 'For Parents' })}
        </Link>
        <Link 
          to="/for-teachers" 
          className="block text-gray-600 hover:text-purple-600 transition-colors py-2"
          onClick={onClose}
        >
          {t('forTeachers', { defaultValue: 'For Teachers' })}
        </Link>
        
        <div className="pt-4 border-t space-y-3">
          <Link to="/login" onClick={onClose} className="block">
            <Button 
              variant="outline" 
              className="w-full pointer-events-auto cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              {t('logIn', { defaultValue: 'Log In' })}
            </Button>
          </Link>
          <Link to="/signup" onClick={onClose} className="block">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 pointer-events-auto cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              {t('signUp', { defaultValue: 'Sign Up' })}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
