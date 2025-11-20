import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface SongSlideProps {
  song: {
    id: string;
    title: string;
    purpose: string;
    melody: string;
    lyrics: string;
    actions: string[];
    audioScript: string;
    visualPrompt: string;
    repetitionStrategy: string;
  };
  onComplete?: () => void;
}

export const SongSlide = ({ song, onComplete }: SongSlideProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(0);
  
  const verses = song.lyrics.split('\n\n').filter(v => v.trim());
  const actionsPerVerse = Math.ceil(song.actions.length / verses.length);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && onComplete) {
      // Auto-complete after playing
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Music className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-primary">{song.title}</h2>
        </div>
        <p className="text-muted-foreground text-lg">{song.purpose}</p>
        <p className="text-sm text-muted-foreground italic">Melody: {song.melody}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Lyrics Section */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Lyrics
          </h3>
          <div className="space-y-4 font-medium text-lg leading-relaxed">
            {verses.map((verse, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg transition-all ${
                  currentVerse === index
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-background/50'
                }`}
              >
                {verse.split('\n').map((line, lineIdx) => (
                  <p key={lineIdx} className="my-1">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Actions Section */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5">
          <h3 className="text-xl font-semibold mb-4">Actions & Gestures</h3>
          <div className="space-y-3">
            {song.actions.map((action, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-accent/10 transition-colors"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="text-sm flex-1 pt-1">{action}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Repetition Strategy */}
      <Card className="p-4 bg-accent/5">
        <p className="text-sm text-muted-foreground">
          <strong>Practice Strategy:</strong> {song.repetitionStrategy}
        </p>
      </Card>

      {/* Play Controls */}
      <div className="flex justify-center gap-4">
        <Button
          size="lg"
          onClick={handlePlayPause}
          className="gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5" />
              Pause Song
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Play Song
            </>
          )}
        </Button>
        
        {verses.length > 1 && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentVerse((prev) => (prev + 1) % verses.length)}
          >
            Next Verse ({currentVerse + 1}/{verses.length})
          </Button>
        )}
      </div>

      {/* Audio Script (hidden, for TTS) */}
      <div className="sr-only">{song.audioScript}</div>
    </div>
  );
};
