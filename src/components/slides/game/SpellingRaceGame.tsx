import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GameHUD } from './GameHUD';
import { audioService } from '@/services/audioService';
import { Keyboard, Zap, CheckCircle, XCircle } from 'lucide-react';

interface SpellingRaceGameProps {
  words: string[];
  onComplete: (correct: boolean, attempts: number, score?: number) => void;
  theme?: 'space' | 'ocean' | 'forest' | 'playground' | 'fantasy';
  timeLimit?: number;
}

interface WordState {
  word: string;
  completed: boolean;
  attempts: number;
  timeSpent: number;
}

export function SpellingRaceGame({ 
  words, 
  onComplete, 
  theme = 'playground',
  timeLimit = 120 
}: SpellingRaceGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [currentWordStartTime, setCurrentWordStartTime] = useState(0);

  // Initialize word states
  useEffect(() => {
    setWordStates(words.map(word => ({
      word,
      completed: false,
      attempts: 0,
      timeSpent: 0
    })));
  }, [words]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentWordStartTime(Date.now());
    if (!isMuted) audioService.playSuccessSound();
  };

  const endGame = useCallback(() => {
    if (gameEnded) return;
    
    setGameEnded(true);
    const completedWords = wordStates.filter(w => w.completed).length;
    const accuracy = totalAttempts > 0 ? (completedWords / totalAttempts) * 100 : 0;
    const finalScore = score + (completedWords === words.length ? 500 : 0); // Completion bonus
    
    if (completedWords === words.length) {
      if (!isMuted) audioService.playCelebrationSound();
      onComplete(true, totalAttempts, finalScore);
    } else {
      onComplete(false, totalAttempts, score);
    }
  }, [gameEnded, wordStates, totalAttempts, score, words.length, onComplete, isMuted]);

  const checkSpelling = () => {
    const currentWord = wordStates[currentWordIndex];
    if (!currentWord || gameEnded) return;

    const isCorrect = input.toLowerCase().trim() === currentWord.word.toLowerCase();
    const timeSpent = Date.now() - currentWordStartTime;
    
    setTotalAttempts(prev => prev + 1);
    
    setWordStates(prev => prev.map((state, index) => 
      index === currentWordIndex 
        ? { ...state, attempts: state.attempts + 1, timeSpent: timeSpent }
        : state
    ));

    if (isCorrect) {
      // Correct spelling!
      const timeBonus = Math.max(50 - Math.floor(timeSpent / 1000), 10);
      const streakBonus = streak * 25;
      const points = 100 + timeBonus + streakBonus;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      setWordStates(prev => prev.map((state, index) => 
        index === currentWordIndex 
          ? { ...state, completed: true }
          : state
      ));
      
      if (!isMuted) audioService.playRewardSound(points);
      
      // Move to next word or end game
      if (currentWordIndex + 1 >= words.length) {
        setTimeout(endGame, 1000);
      } else {
        setTimeout(() => {
          setCurrentWordIndex(prev => prev + 1);
          setInput('');
          setCurrentWordStartTime(Date.now());
        }, 1000);
      }
    } else {
      // Wrong spelling
      setStreak(0);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(endGame, 500);
        }
        return newLives;
      });
      
      if (!isMuted) audioService.playErrorSound();
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      checkSpelling();
    }
  };

  const currentWord = wordStates[currentWordIndex];
  const completedCount = wordStates.filter(w => w.completed).length;

  if (!gameStarted) {
    return (
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Keyboard className="h-16 w-16 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold">Spelling Race!</h2>
          <p className="text-muted-foreground">
            Spell each word correctly as fast as you can! You have {timeLimit} seconds and 3 lives.
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>{words.length} words to spell</span>
            </div>
          </div>
        </div>
        <Button onClick={startGame} size="lg" className="text-lg px-8">
          Start Spelling Race!
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <GameHUD
        score={score}
        lives={lives}
        maxLives={3}
        timeLeft={timeLeft}
        level={1}
        streakCount={streak}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        theme={theme}
      />
      
      {/* Progress Bar */}
      <div className="flex items-center gap-2 px-4">
        <span className="text-sm font-medium">Progress:</span>
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(completedCount / words.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{words.length}
        </span>
      </div>

      {/* Current Word */}
      {currentWord && !gameEnded && (
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-muted-foreground">
              Word {currentWordIndex + 1} of {words.length}
            </h3>
            <div className="text-4xl font-bold text-primary">
              {currentWord.word.split('').map((char, index) => (
                <span 
                  key={index}
                  className={cn(
                    "inline-block mx-1 p-2 border-2 rounded-lg min-w-[3rem]",
                    input[index]?.toLowerCase() === char.toLowerCase() 
                      ? "bg-success-soft border-success text-success-on"
                      : input[index] 
                        ? "bg-error-soft border-error text-error-on"
                        : "bg-muted border-border"
                  )}
                >
                  {input[index]?.toUpperCase() || char.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="space-y-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type the word..."
                className="text-2xl text-center py-6"
                maxLength={currentWord.word.length}
                autoFocus
              />
              <Button 
                onClick={checkSpelling} 
                disabled={!input.trim()}
                size="lg"
                className="px-8"
              >
                Check Spelling
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Word List Progress */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4">
        {wordStates.map((wordState, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg border text-center transition-all duration-200",
              wordState.completed 
                ? "bg-success-soft border-success text-success-on"
                : index === currentWordIndex
                  ? "bg-primary-soft border-primary text-primary-on"
                  : "bg-muted border-border text-muted-foreground"
            )}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              {wordState.completed && <CheckCircle className="h-4 w-4" />}
              {index === currentWordIndex && !wordState.completed && <Zap className="h-4 w-4" />}
              <span className="text-sm font-medium">{wordState.word}</span>
            </div>
            {wordState.attempts > 0 && (
              <div className="text-xs opacity-75">
                {wordState.attempts} attempt{wordState.attempts !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {gameEnded && (
        <Card className="p-6 text-center space-y-4">
          <h3 className="text-xl font-bold">
            {completedCount === words.length ? '🏆 Perfect Spelling!' : '📝 Good Effort!'}
          </h3>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary">Score: {score}</Badge>
            <Badge variant="secondary">Words: {completedCount}/{words.length}</Badge>
            <Badge variant="secondary">Total Attempts: {totalAttempts}</Badge>
            <Badge variant="secondary">
              Accuracy: {totalAttempts > 0 ? Math.round((completedCount / totalAttempts) * 100) : 0}%
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
}