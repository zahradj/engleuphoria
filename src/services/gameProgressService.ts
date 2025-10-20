type GameProgress = {
  score: number;
  stars: number;
  lives: number;
  maxLives: number;
  level: number;
  streakCount: number;
};

class GameProgressService {
  private progress: GameProgress = {
    score: 0,
    stars: 0,
    lives: 3,
    maxLives: 3,
    level: 1,
    streakCount: 0
  };

  private listeners: Set<(progress: GameProgress) => void> = new Set();

  getProgress(): GameProgress {
    return { ...this.progress };
  }

  addScore(points: number) {
    this.progress.score += points;
    this.notifyListeners();
  }

  addStar() {
    this.progress.stars = Math.min(5, this.progress.stars + 1);
    this.notifyListeners();
  }

  loseLife() {
    this.progress.lives = Math.max(0, this.progress.lives - 1);
    this.notifyListeners();
  }

  gainLife() {
    this.progress.lives = Math.min(this.progress.maxLives, this.progress.lives + 1);
    this.notifyListeners();
  }

  incrementStreak() {
    this.progress.streakCount++;
    this.notifyListeners();
  }

  resetStreak() {
    this.progress.streakCount = 0;
    this.notifyListeners();
  }

  reset() {
    this.progress = {
      score: 0,
      stars: 0,
      lives: 3,
      maxLives: 3,
      level: 1,
      streakCount: 0
    };
    this.notifyListeners();
  }

  subscribe(callback: (progress: GameProgress) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getProgress()));
  }

  // Award points based on performance
  awardPoints(type: 'correct' | 'perfect' | 'fast' | 'streak') {
    switch (type) {
      case 'correct':
        this.addScore(50);
        break;
      case 'perfect':
        this.addScore(100);
        this.addStar();
        break;
      case 'fast':
        this.addScore(25);
        break;
      case 'streak':
        this.addScore(this.progress.streakCount * 10);
        break;
    }
  }
}

export const gameProgressService = new GameProgressService();
