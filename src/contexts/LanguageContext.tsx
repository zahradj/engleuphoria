
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'english' | 'arabic' | 'french';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  languageText: {
    forParents: string;
    forTeachers: string;
    logIn: string;
    signUp: string;
    aboutUs: string;
    contact: string;
  };
}

const translations = {
  english: {
    forParents: 'For Parents',
    forTeachers: 'For Teachers',
    logIn: 'Log In',
    signUp: 'Sign Up',
    aboutUs: 'About Us',
    contact: 'Contact',
  },
  arabic: {
    forParents: 'للآباء',
    forTeachers: 'للمعلمين',
    logIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
  },
  french: {
    forParents: 'Pour les Parents',
    forTeachers: 'Pour les Enseignants',
    logIn: 'Connexion',
    signUp: 'Inscription',
    aboutUs: 'À Propos',
    contact: 'Contact',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('english');
  
  const languageText = translations[language];
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
