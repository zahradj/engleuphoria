
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthButtonsProps {
  onLogin: () => void;
  onSignUp: () => void;
}

export const AuthButtons = ({ onLogin, onSignUp }: AuthButtonsProps) => {
  const { languageText } = useLanguage();

  const t = (key: string) => {
    const keys = key.split('.');
    let result: any = languageText;
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  return (
    <>
      <Button variant="ghost" onClick={onLogin}>
        {t('logIn') || 'Log In'}
      </Button>
      
      <Button onClick={onSignUp} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
        {t('signUp') || 'Sign Up'}
      </Button>
    </>
  );
};
