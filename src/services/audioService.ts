
class AudioService {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isMuted: boolean = false;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }

  private createTone(frequency: number, duration: number, volume: number = 0.3): void {
    if (!this.audioContext || this.isMuted) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playButtonClick() {
    this.createTone(800, 0.1, 0.2);
  }

  playRewardSound(points: number = 10) {
    if (points <= 15) {
      // Simple chime for small rewards
      this.createTone(523, 0.15); // C
      setTimeout(() => this.createTone(659, 0.15), 100); // E
    } else if (points <= 35) {
      // Rising melody for medium rewards
      this.createTone(523, 0.12); // C
      setTimeout(() => this.createTone(659, 0.12), 80); // E
      setTimeout(() => this.createTone(784, 0.15), 160); // G
      setTimeout(() => this.createTone(1047, 0.2), 240); // High C
    } else {
      // Triumphant fanfare for large rewards
      this.createTone(523, 0.1); // C
      setTimeout(() => this.createTone(659, 0.1), 60); // E
      setTimeout(() => this.createTone(784, 0.1), 120); // G
      setTimeout(() => this.createTone(1047, 0.15), 180); // High C
      setTimeout(() => this.createTone(1319, 0.15), 240); // High E
      setTimeout(() => this.createTone(1568, 0.2), 300); // High G
    }
  }

  playErrorSound() {
    this.createTone(200, 0.3, 0.1);
  }

  playSuccessSound() {
    this.createTone(698, 0.15); // F#
    setTimeout(() => this.createTone(831, 0.15), 100); // G#
    setTimeout(() => this.createTone(988, 0.2), 200); // B
  }

  playPronunciation(text: string) {
    if ('speechSynthesis' in window && !this.isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }
}

export const audioService = new AudioService();
