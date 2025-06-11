
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

export function useDictionaryService() {
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchWord = useCallback(async (word: string) => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Using Free Dictionary API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }
      
      const data = await response.json();
      const entry = data[0];
      const meaning = entry.meanings?.[0];
      const definition = meaning?.definitions?.[0];
      
      const wordData: WordDefinition = {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
        definition: definition?.definition || 'No definition available',
        partOfSpeech: meaning?.partOfSpeech,
        example: definition?.example,
        synonyms: definition?.synonyms || meaning?.synonyms,
        audioUrl: entry.phonetics?.find((p: any) => p.audio)?.audio
      };
      
      setDefinition(wordData);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [word, ...prev.filter(w => w.toLowerCase() !== word.toLowerCase())];
        return updated.slice(0, 10); // Keep only 10 recent searches
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch definition');
      setDefinition(null);
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
    isLoading,
    error,
    recentSearches,
    searchWord,
    playPronunciation
  };
}
