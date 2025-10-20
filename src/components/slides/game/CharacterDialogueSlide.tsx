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
      
      // Enhanced character descriptions for Gemini image generation
      const descriptions: Record<string, string> = {
        'Anna': 'A cheerful 7-year-old girl with shoulder-length brown hair, sparkling blue eyes, and a bright smile. Wearing a blue dress with white details. Happy, helpful personality.',
        'Tom': 'A confident 7-year-old boy with short blonde hair, green eyes, and an athletic build. Wearing a red t-shirt and shorts. Sporty, friendly personality.',
        'Mia': 'An energetic 7-year-old girl with long black hair in pigtails, bright brown eyes, and creative expression. Wearing a purple dress with art-themed accessories. Artistic, imaginative personality.',
        'Leo': 'A curious 7-year-old boy with wavy red hair, freckles, and intelligent eyes. Wearing a green shirt with book motifs. Kind, thoughtful personality.',
        'Teacher Zahra': 'A warm 30-year-old female teacher with dark hair in a bun, kind brown eyes, and stylish glasses. Wearing professional but colorful teaching attire. Patient, encouraging personality.',
        'Parrot Pete': 'A vibrant cartoon parrot with rainbow-colored feathers, large expressive eyes, and a cheerful beak. Playful, talkative personality.',
        'Grandma Rose': 'A sweet elderly woman around 65 with silver-white hair, warm wrinkled smile, and gentle eyes. Wearing a cozy cardigan. Loving, wise personality.',
        'Zookeeper Zara': 'A friendly female zookeeper in her 20s with a ponytail, safari uniform with khaki colors, and adventurous spirit. Caring about animals.',
        'Chef Carlo': 'A cheerful male chef with a traditional white chef hat, apron, and welcoming smile. Holding cooking utensils. Passionate about food.',
        'Clocky': 'A cute anthropomorphic alarm clock character with a round friendly face, cartoon eyes, little arms and legs, and a cheerful expression. Helpful time-keeper.'
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
