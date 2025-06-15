
import React, { createContext, useState, useContext, ReactNode } from "react";
import { translations, LanguageOption } from "../translations";

interface LanguageContextType {
  language: LanguageOption;
  languageText: any;
  setLanguage: (language: LanguageOption) => void;
}

interface LanguageProviderProps {
  children: ReactNode;
}

// Create the language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageOption>("english");

  const value: LanguageContextType = {
    language,
    languageText: translations[language],
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
