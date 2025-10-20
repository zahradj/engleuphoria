import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CharacterSprite } from '@/components/game/CharacterSprite';
import { AudioButton } from '@/components/lessons/slides/AudioButton';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CharacterDialogueSlideProps {
  character: {
    name: string;
    dialogue: string;
  };
  onNext: () => void;
}

export function CharacterDialogueSlide({ character, onNext }: CharacterDialogueSlideProps) {
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateCharacterImage();
  }, [character.name]);

  const generateCharacterImage = async () => {
    try {
      setIsLoading(true);
      
      // Character descriptions
      const descriptions: Record<string, string> = {
        'Anna': 'A cheerful girl character with brown hair and blue eyes, wearing a blue dress',
        'Tom': 'A friendly boy character with blonde hair and green eyes, wearing a red t-shirt',
        'Mia': 'An energetic girl character with black hair and brown eyes, wearing a purple dress',
        'Leo': 'A happy boy character with red hair and freckles, wearing a green shirt',
        'Teacher Zahra': 'A kind female teacher with glasses, wearing professional attire',
        'Parrot Pete': 'A colorful cartoon parrot with bright feathers',
        'Grandma Rose': 'A sweet elderly woman with gray hair and warm smile',
        'Zookeeper Zara': 'A friendly female zookeeper in safari outfit',
        'Chef Carlo': 'A cheerful chef with chef hat and apron',
        'Clocky': 'A cute anthropomorphic clock character with a friendly face'
      };

      const { data, error } = await supabase.functions.invoke('generate-character-image', {
        body: {
          characterName: character.name,
          characterDescription: descriptions[character.name] || 'A friendly cartoon character'
        }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setCharacterImage(data.imageUrl);
      }
    } catch (error) {
      console.error('Failed to generate character image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-8 p-8">
      {/* Character Image with Bounce Animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: [0, -10, 0]
        }}
        transition={{ 
          scale: { duration: 0.5 },
          opacity: { duration: 0.5 },
          y: { 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative"
      >
        {isLoading ? (
          <div className="w-64 h-64 bg-muted rounded-full animate-pulse flex items-center justify-center">
            <span className="text-6xl">⏳</span>
          </div>
        ) : characterImage ? (
          <img 
            src={characterImage} 
            alt={character.name}
            className="w-64 h-64 object-cover rounded-full border-4 border-primary shadow-xl"
          />
        ) : (
          <div className="w-64 h-64 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-8xl">👤</span>
          </div>
        )}
      </motion.div>

      {/* Character Name */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold text-primary"
      >
        {character.name}
      </motion.h2>

      {/* Dialogue Box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-card border-2 border-primary rounded-2xl p-6 max-w-2xl shadow-lg"
      >
        <div className="flex items-center gap-4">
          <p className="text-2xl flex-1 text-center">{character.dialogue}</p>
          <AudioButton text={character.dialogue} autoPlay />
        </div>
      </motion.div>

      {/* Next Button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Button size="lg" onClick={onNext} className="text-xl px-8 py-6">
          Next <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
