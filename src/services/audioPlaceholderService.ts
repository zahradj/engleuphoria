// Audio Placeholder Service - Centralized audio management for lessons

export interface AudioPlaceholder {
  id: string;
  filename: string;
  text: string;
  type: 'vocabulary' | 'sentence' | 'dialogue' | 'feedback' | 'ui' | 'phonics';
  speed?: 'slow' | 'normal' | 'fast';
}

export interface AudioManifest {
  lessonId: string;
  totalAudioFiles: number;
  audioFiles: AudioPlaceholder[];
}

class AudioPlaceholderService {
  private audioCache: Map<string, string> = new Map();
  private currentManifest: AudioManifest | null = null;

  /**
   * Generate audio placeholder reference
   * @param filename - The audio filename (e.g., "vocab-apple.mp3")
   * @returns Audio placeholder string
   */
  audio(filename: string): string {
    return `audio("${filename}")`;
  }

  /**
   * Register an audio file in the current lesson manifest
   */
  registerAudio(audio: Omit<AudioPlaceholder, 'id'>): string {
    const id = `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const placeholder: AudioPlaceholder = { id, ...audio };
    
    if (this.currentManifest) {
      this.currentManifest.audioFiles.push(placeholder);
      this.currentManifest.totalAudioFiles++;
    }
    
    return this.audio(audio.filename);
  }

  /**
   * Initialize a new audio manifest for a lesson
   */
  initManifest(lessonId: string): void {
    this.currentManifest = {
      lessonId,
      totalAudioFiles: 0,
      audioFiles: []
    };
  }

  /**
   * Get the current audio manifest
   */
  getManifest(): AudioManifest | null {
    return this.currentManifest;
  }

  /**
   * Generate audio filenames for vocabulary
   */
  generateVocabAudio(word: string): {
    normal: string;
    slow: string;
    fast: string;
  } {
    const sanitized = word.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return {
      normal: `vocab-${sanitized}.mp3`,
      slow: `vocab-${sanitized}-slow.mp3`,
      fast: `vocab-${sanitized}-fast.mp3`
    };
  }

  /**
   * Generate audio filename for sentence
   */
  generateSentenceAudio(sentenceIndex: number, slideId: string): string {
    return `sentence-${slideId}-${sentenceIndex}.mp3`;
  }

  /**
   * Generate audio filename for dialogue line
   */
  generateDialogueAudio(characterName: string, lineIndex: number): string {
    const sanitized = characterName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `dialogue-${sanitized}-${lineIndex}.mp3`;
  }

  /**
   * Generate audio filename for phonics sound
   */
  generatePhonicsAudio(sound: string): string {
    const sanitized = sound.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `phonics-${sanitized}.mp3`;
  }

  /**
   * Feedback audio constants
   */
  readonly feedbackAudio = {
    correct: 'feedback-correct.mp3',
    incorrect: 'feedback-incorrect.mp3',
    tryAgain: 'feedback-try-again.mp3',
    excellent: 'feedback-excellent.mp3',
    goodJob: 'feedback-good-job.mp3',
    almostThere: 'feedback-almost.mp3'
  };

  /**
   * UI audio constants
   */
  readonly uiAudio = {
    buttonClick: 'ui-button-click.mp3',
    slideTransition: 'ui-slide-transition.mp3',
    starEarned: 'ui-star-earned.mp3',
    levelUp: 'ui-level-up.mp3',
    badgeUnlock: 'ui-badge-unlock.mp3',
    celebration: 'ui-celebration.mp3'
  };

  /**
   * Play audio in browser (placeholder for actual TTS integration)
   */
  async playAudio(filename: string): Promise<void> {
    console.log(`[Audio] Playing: ${filename}`);
    // TODO: Integrate with actual TTS service or audio files
    // For now, this is a placeholder that can be connected to:
    // - ElevenLabs API
    // - Google Text-to-Speech
    // - Azure Speech Services
    // - Local audio files
  }

  /**
   * Generate audio manifest for batch processing
   */
  exportManifest(): string {
    if (!this.currentManifest) {
      throw new Error('No manifest initialized');
    }
    return JSON.stringify(this.currentManifest, null, 2);
  }

  /**
   * Clear the current manifest
   */
  clearManifest(): void {
    this.currentManifest = null;
  }
}

// Export singleton instance
export const audioService = new AudioPlaceholderService();

// Export utility functions
export const audio = (filename: string) => audioService.audio(filename);
export const generateVocabAudio = (word: string) => audioService.generateVocabAudio(word);
export const generateSentenceAudio = (index: number, slideId: string) => audioService.generateSentenceAudio(index, slideId);
export const generateDialogueAudio = (character: string, line: number) => audioService.generateDialogueAudio(character, line);
