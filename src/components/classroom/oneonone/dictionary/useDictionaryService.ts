
import { useState, useCallback } from 'react';

export interface WordDefinition {
  word: string;
  phonetic?: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
  synonyms?: string[];
  audioUrl?: string;
}

export interface ImageResult {
  url: string;
  description: string;
}

export function useDictionaryService() {
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchWord = useCallback(async (word: string, targetLanguage: string = 'ar') => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError(null);
    setTranslation(null);
    setImages([]);
    
    try {
      // Get word definition from Free Dictionary API
      const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      
      if (!definitionResponse.ok) {
        throw new Error('Word not found');
      }
      
      const definitionData = await definitionResponse.json();
      const entry = definitionData[0];
      const meaning = entry.meanings?.[0];
      const definitionObj = meaning?.definitions?.[0];
      
      const wordData: WordDefinition = {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
        definition: definitionObj?.definition || 'No definition available',
        partOfSpeech: meaning?.partOfSpeech,
        example: definitionObj?.example,
        synonyms: definitionObj?.synonyms || meaning?.synonyms,
        audioUrl: entry.phonetics?.find((p: any) => p.audio)?.audio
      };
      
      setDefinition(wordData);

      // Get translation using a simple translation service
      try {
        const translationResponse = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${targetLanguage}`
        );
        const translationData = await translationResponse.json();
        
        if (translationData.responseData && translationData.responseData.translatedText) {
          setTranslation(translationData.responseData.translatedText);
        }
      } catch (translationError) {
        console.log('Translation service unavailable');
      }

      // Get images using Unsplash API (free tier)
      try {
        const imageResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(word)}&per_page=4&client_id=demo`
        );
        
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          if (imageData.results) {
            const imageResults: ImageResult[] = imageData.results.map((img: any) => ({
              url: img.urls.small,
              description: img.alt_description || word
            }));
            setImages(imageResults);
          }
        }
      } catch (imageError) {
        console.log('Image service unavailable');
        // Fallback to placeholder images
        setImages([
          {
            url: `https://via.placeholder.com/150x100/e3e3e3/666666?text=${encodeURIComponent(word)}`,
            description: word
          }
        ]);
      }
      
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [word, ...prev.filter(w => w.toLowerCase() !== word.toLowerCase())];
        return updated.slice(0, 10);
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch definition');
      setDefinition(null);
      setTranslation(null);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playPronunciation = useCallback((word: string) => {
    if (definition?.audioUrl) {
      const audio = new Audio(definition.audioUrl);
      audio.play().catch(() => {
        // Fallback to speech synthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(word);
          utterance.lang = 'en-US';
          utterance.rate = 0.8;
          speechSynthesis.speak(utterance);
        }
      });
    } else {
      // Use speech synthesis as fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
      }
    }
  }, [definition]);

  return {
    definition,
    translation,
    images,
    isLoading,
    error,
    recentSearches,
    searchWord,
    playPronunciation
  };
}
