
import React, { createContext, useState, useContext } from "react";
import { translations, LanguageOption } from "../translations";
import { LanguageContextType, LanguageProviderProps } from "./LanguageContextTypes";

// Create the language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider component
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<LanguageOption>("english");

  const value = {
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
