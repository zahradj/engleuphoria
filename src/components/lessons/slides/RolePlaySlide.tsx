import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slide } from '@/types/slides';
import { motion } from 'framer-motion';

interface RolePlaySlideProps {
  slide: Slide;
  onComplete?: () => void;
  onNext?: () => void;
}

export function RolePlaySlide({ slide, onComplete, onNext }: RolePlaySlideProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [dialogueStep, setDialogueStep] = useState(0);

  const dialogue = [
    { speaker: 'Ed', text: 'Hello! My name is Ed.' },
    { speaker: 'Anna', text: 'Hi, Ed. My name is Anna. Nice to meet you.' },
    { speaker: 'Ed', text: 'Nice to meet you too!' }
  ];

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
  };

  const nextDialogue = () => {
    if (dialogueStep < dialogue.length - 1) {
      setDialogueStep(prev => prev + 1);
    } else {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">{slide.prompt}</h2>
        <p className="text-lg text-muted-foreground">{slide.instructions}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {!selectedCharacter ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slide.options?.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className="cursor-pointer hover:border-primary"
                  onClick={() => handleCharacterSelect(option.id)}
                >
                  <CardContent className="p-6 text-center">
                    <img 
                      src={option.image} 
                      alt={option.text}
                      className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover"
                    />
                    <h3 className="text-xl font-bold">Play as {option.text}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                    Playing as: {selectedCharacter === 'ed' ? 'Ed' : 'Anna'}
                  </span>
                </div>
                
                <div className="bg-secondary/20 p-4 rounded-lg mb-4">
                  <div className="font-semibold text-primary mb-2">
                    {dialogue[dialogueStep].speaker}:
                  </div>
                  <div className="text-lg">
                    {dialogue[dialogueStep].text}
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={nextDialogue}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {dialogueStep < dialogue.length - 1 ? 'Continue' : 'Finish Role-Play'} 🎭
                  </Button>
                </div>
              </CardContent>
            </Card>

            {dialogueStep === dialogue.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="text-lg font-semibold text-green-700">
                      🎉 Excellent role-play! You've practiced the conversation perfectly!
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}