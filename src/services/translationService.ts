
import { supabase } from '@/lib/supabase';

export const generateMissingTranslations = async (
  sourceText: string, 
  targetLanguage: string, 
  context?: string
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-translate', {
      body: {
        text: sourceText,
        targetLanguage,
        context: context || 'Educational content for ESL learners'
      }
    });

    if (error) {
      console.error('Translation error:', error);
      return sourceText; // Fallback to original text
    }

    return data?.translatedText || sourceText;
  } catch (error) {
    console.error('Translation service error:', error);
    return sourceText; // Fallback to original text
  }
};

export const generateTranslationFile = async (
  englishTranslations: Record<string, string>,
  targetLanguage: string
): Promise<Record<string, string>> => {
  const translations: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(englishTranslations)) {
    try {
      translations[key] = await generateMissingTranslations(
        value, 
        targetLanguage,
        'Educational platform for English language learners'
      );
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error translating ${key}:`, error);
      translations[key] = value; // Keep original if translation fails
    }
  }
  
  return translations;
};
