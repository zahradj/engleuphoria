
// Translation service
export async function fetchTranslation(word: string, targetLanguage: string, signal?: AbortSignal): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${targetLanguage}`,
      { signal }
    );
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }
    
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    
    return null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    return null;
  }
}

// Fallback translations for common words
export const fallbackTranslations: Record<string, Record<string, string>> = {
  hello: {
    ar: "مرحبا",
    es: "hola",
    fr: "bonjour",
    de: "hallo"
  },
  book: {
    ar: "كتاب",
    es: "libro",
    fr: "livre",
    de: "buch"
  },
  learn: {
    ar: "يتعلم",
    es: "aprender",
    fr: "apprendre",
    de: "lernen"
  },
  teacher: {
    ar: "معلم",
    es: "profesor",
    fr: "professeur",
    de: "lehrer"
  },
  student: {
    ar: "طالب",
    es: "estudiante",
    fr: "étudiant",
    de: "schüler"
  }
};

export function getFallbackTranslation(word: string, targetLanguage: string): string | null {
  const wordTranslations = fallbackTranslations[word.toLowerCase()];
  return wordTranslations?.[targetLanguage] || null;
}
