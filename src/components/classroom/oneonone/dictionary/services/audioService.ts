
// Audio service for pronunciation
export function playWordAudio(word: string, audioUrl?: string): void {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
      // Fallback to speech synthesis
      useSpeechSynthesis(word);
    });
  } else {
    // Use speech synthesis directly
    useSpeechSynthesis(word);
  }
}

function useSpeechSynthesis(word: string): void {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.volume = 0.8;
    
    speechSynthesis.speak(utterance);
  }
}
