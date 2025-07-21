
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TranslationRequest {
  texts: Record<string, string>;
  targetLanguage: string;
  context?: string;
}

export const useTranslationManager = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const translateTexts = useCallback(async ({ texts, targetLanguage, context }: TranslationRequest) => {
    setIsTranslating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-translate', {
        body: { texts, targetLanguage, context }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.translations;
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate content. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  const translateMissingKeys = useCallback(async (englishTranslations: Record<string, string>, targetLanguage: string) => {
    // Split translations into smaller batches to avoid API limits
    const batchSize = 50;
    const entries = Object.entries(englishTranslations);
    const batches = [];

    for (let i = 0; i < entries.length; i += batchSize) {
      batches.push(Object.fromEntries(entries.slice(i, i + batchSize)));
    }

    const results = {};
    
    for (const batch of batches) {
      const translated = await translateTexts({
        texts: batch,
        targetLanguage,
        context: 'Educational ESL platform interface'
      });
      
      Object.assign(results, translated);
    }

    return results;
  }, [translateTexts]);

  return {
    translateTexts,
    translateMissingKeys,
    isTranslating
  };
};
