
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslationManager } from '@/hooks/useTranslationManager';
import { englishTranslations } from '@/translations/english';
import { spanishTranslations } from '@/translations/spanish';
import { arabicTranslations } from '@/translations/arabic';
import { frenchTranslations } from '@/translations/french';
import { useToast } from '@/hooks/use-toast';
import { Languages, Download, Upload } from 'lucide-react';

export const TranslationManager = () => {
  const { translateMissingKeys, isTranslating } = useTranslationManager();
  const { toast } = useToast();
  const [translationResults, setTranslationResults] = useState<Record<string, any>>({});

  const languages = [
    { code: 'es', name: 'Spanish', translations: spanishTranslations },
    { code: 'ar', name: 'Arabic', translations: arabicTranslations },
    { code: 'fr', name: 'French', translations: frenchTranslations },
  ];

  const getMissingKeys = (targetTranslations: Record<string, string>) => {
    const englishKeys = Object.keys(englishTranslations);
    const targetKeys = Object.keys(targetTranslations);
    return englishKeys.filter(key => !targetKeys.includes(key));
  };

  const generateTranslations = async (languageCode: string) => {
    try {
      const missingKeys = getMissingKeys(languages.find(l => l.code === languageCode)?.translations || {});
      
      if (missingKeys.length === 0) {
        toast({
          title: 'No Missing Translations',
          description: `All translations are complete for ${languages.find(l => l.code === languageCode)?.name}`,
        });
        return;
      }

      const missingTexts: Record<string, string> = {};
      for (const key of missingKeys) {
        const value = (englishTranslations as any)[key];
        if (typeof value === 'string') {
          missingTexts[key] = value;
        }
      }

      const translated = await translateMissingKeys(missingTexts, languageCode);
      
      setTranslationResults(prev => ({
        ...prev,
        [languageCode]: translated
      }));

      toast({
        title: 'Translations Generated',
        description: `Generated ${Object.keys(translated).length} translations for ${languages.find(l => l.code === languageCode)?.name}`,
      });
    } catch (error) {
      console.error('Translation generation failed:', error);
    }
  };

  const downloadTranslations = (languageCode: string) => {
    const data = translationResults[languageCode];
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${languageCode}-translations.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Translation Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate missing translations using AI for a better multilingual experience.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            {languages.map((language) => {
              const missingCount = getMissingKeys(language.translations).length;
              const totalKeys = Object.keys(englishTranslations).length;
              const completionPercentage = Math.round(((totalKeys - missingCount) / totalKeys) * 100);
              
              return (
                <Card key={language.code} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{language.name}</CardTitle>
                      <Badge variant={missingCount === 0 ? "default" : "secondary"}>
                        {completionPercentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Missing: {missingCount} / {totalKeys}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => generateTranslations(language.code)}
                        disabled={isTranslating || missingCount === 0}
                        size="sm"
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                      
                      {translationResults[language.code] && (
                        <Button
                          onClick={() => downloadTranslations(language.code)}
                          variant="outline"
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
