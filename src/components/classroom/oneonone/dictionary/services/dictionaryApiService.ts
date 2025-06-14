
// Dictionary API service for definitions
export interface DefinitionResult {
  word: string;
  phonetic?: string;
  definition: string;
  partOfSpeech?: string;
  example?: string;
  synonyms?: string[];
  audioUrl?: string;
}

export async function fetchDefinition(word: string, signal?: AbortSignal): Promise<DefinitionResult | null> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      { signal }
    );
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    const entry = data[0];
    const meaning = entry.meanings?.[0];
    const definitionObj = meaning?.definitions?.[0];
    
    return {
      word: entry.word,
      phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
      definition: definitionObj?.definition || 'No definition available',
      partOfSpeech: meaning?.partOfSpeech,
      example: definitionObj?.example,
      synonyms: definitionObj?.synonyms || meaning?.synonyms,
      audioUrl: entry.phonetics?.find((p: any) => p.audio)?.audio
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    return null;
  }
}

// Fallback definitions for common words
export const fallbackDefinitions: Record<string, DefinitionResult> = {
  hello: {
    word: "hello",
    phonetic: "həˈloʊ",
    definition: "used as a greeting or to begin a phone conversation",
    partOfSpeech: "exclamation",
    example: "Hello, how are you today?",
    synonyms: ["hi", "greetings", "hey"]
  },
  book: {
    word: "book",
    phonetic: "bʊk",
    definition: "a written or printed work consisting of pages glued or sewn together along one side and bound in covers",
    partOfSpeech: "noun",
    example: "I'm reading a fascinating book about history.",
    synonyms: ["volume", "publication", "text"]
  },
  learn: {
    word: "learn",
    phonetic: "lɜːrn",
    definition: "acquire knowledge of or skill in (something) by study, experience, or being taught",
    partOfSpeech: "verb",
    example: "Children learn through play and exploration.",
    synonyms: ["study", "master", "understand"]
  }
};

export function getFallbackDefinition(word: string): DefinitionResult | null {
  return fallbackDefinitions[word.toLowerCase()] || null;
}
