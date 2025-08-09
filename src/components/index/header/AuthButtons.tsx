
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface AuthButtonsProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const AuthButtons = ({ onLogin, onSignUp }: AuthButtonsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Button variant="ghost" onClick={onLogin}>
        {t('logIn', { defaultValue: 'Log In' })}
      </Button>
      
      <Button onClick={onSignUp} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
        {t('signUp', { defaultValue: 'Sign Up' })}
      </Button>
    </>
  );
};
