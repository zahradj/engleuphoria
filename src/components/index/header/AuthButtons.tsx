
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface AuthButtonsProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const AuthButtons = ({ onLogin, onSignUp }: AuthButtonsProps) => {
  const { t } = useTranslation();

  const handleLoginClick = () => {
    console.log('🔑 Login button clicked');
    onLogin();
  };

  const handleSignUpClick = () => {
    console.log('📝 Sign Up button clicked');
    onSignUp();
  };

  return (
    <>
      <Link to="/login" onClick={handleLoginClick} className="pointer-events-auto relative z-10">
        <Button 
          variant="ghost" 
          className="cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          {t('logIn', { defaultValue: 'Log In' })}
        </Button>
      </Link>
      
      <Link to="/signup" onClick={handleSignUpClick} className="pointer-events-auto relative z-10">
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          {t('signUp', { defaultValue: 'Sign Up' })}
        </Button>
      </Link>
    </>
  );
};
