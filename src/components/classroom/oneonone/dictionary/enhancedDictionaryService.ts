
import { useState, useCallback, useRef } from 'react';
import { fetchDefinition, getFallbackDefinition, DefinitionResult } from './services/dictionaryApiService';
import { fetchTranslation, getFallbackTranslation } from './services/translationService';
import { fetchImages, ImageResult } from './services/imageService';
import { playWordAudio } from './services/audioService';

export interface WordDefinition {
  word: string;
  phonetic?: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
  synonyms?: string[];
  audioUrl?: string;
}

export function useEnhancedDictionaryService() {
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchWord = useCallback(async (word: string, targetLanguage: string = 'ar') => {
    if (!word.trim()) return;

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);
    setDefinition(null);
    setTranslation(null);
    setImages([]);
    
    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 8000);
      });

      // Run all API calls in parallel with timeout
      const results = await Promise.race([
        Promise.allSettled([
          fetchDefinition(word, signal),
          fetchTranslation(word, targetLanguage, signal),
          fetchImages(word, signal)
        ]),
        timeoutPromise
      ]) as PromiseSettledResult<any>[];

      // Process definition result
      const definitionResult = results[0];
      let wordDefinition: WordDefinition | null = null;

      if (definitionResult.status === 'fulfilled' && definitionResult.value) {
        wordDefinition = definitionResult.value;
      } else {
        // Try fallback definition
        const fallback = getFallbackDefinition(word);
        if (fallback) {
          wordDefinition = fallback;
        }
      }

      if (wordDefinition) {
        setDefinition(wordDefinition);
      } else {
        throw new Error('Word not found in dictionary');
      }

      // Process translation result
      const translationResult = results[1];
      if (translationResult.status === 'fulfilled' && translationResult.value) {
        setTranslation(translationResult.value);
      } else {
        // Try fallback translation
        const fallbackTrans = getFallbackTranslation(word, targetLanguage);
        if (fallbackTrans) {
          setTranslation(fallbackTrans);
        }
      }

      // Process images result
      const imagesResult = results[2];
      if (imagesResult.status === 'fulfilled' && imagesResult.value) {
        setImages(imagesResult.value);
      }

      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [word, ...prev.filter(w => w.toLowerCase() !== word.toLowerCase())];
        return updated.slice(0, 10);
      });
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }
      
      console.error('Dictionary search error:', err);
      
      // Try to provide fallback data even on error
      const fallbackDef = getFallbackDefinition(word);
      const fallbackTrans = getFallbackTranslation(word, targetLanguage);
      
      if (fallbackDef) {
        setDefinition(fallbackDef);
        if (fallbackTrans) {
          setTranslation(fallbackTrans);
        }
        setError('Using offline dictionary data');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch word information');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const playPronunciation = useCallback((word: string) => {
    playWordAudio(word, definition?.audioUrl);
  }, [definition]);

  // Cleanup function to cancel ongoing requests
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return {
    definition,
    translation,
    images,
    isLoading,
    error,
    recentSearches,
    searchWord,
    playPronunciation,
    cancelRequest
  };
}
