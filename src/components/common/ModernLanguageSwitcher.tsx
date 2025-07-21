
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
];

interface ModernLanguageSwitcherProps {
  size?: 'sm' | 'default';
  showText?: boolean;
}

export const ModernLanguageSwitcher = ({ size = 'default', showText = true }: ModernLanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size} 
          className={`${size === 'sm' ? 'gap-1' : 'gap-2'} transition-colors hover:bg-accent`}
        >
          <Globe className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />
          <span className={`${size === 'sm' ? 'text-xs' : ''} ${!showText ? 'hidden sm:inline' : ''}`}>
            {currentLanguage.flag} {showText ? currentLanguage.nativeName : ''}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`cursor-pointer transition-colors ${
              i18n.language === language.code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            <span className="flex-1">{language.nativeName}</span>
            {language.nativeName !== language.name && (
              <span className="text-xs text-muted-foreground ml-2">({language.name})</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
