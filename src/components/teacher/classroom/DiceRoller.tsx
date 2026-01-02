import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceRollerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export const DiceRoller: React.FC<DiceRollerProps> = ({ open, onOpenChange }) => {
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setResult(null);

    let rollCount = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
        setResult(Math.floor(Math.random() * 6) + 1);
      }
    }, 100);
  };

  useEffect(() => {
    if (open) {
      setResult(null);
    }
  }, [open]);

  const DiceIcon = result ? diceIcons[result - 1] : Dice6;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-xs">
        <DialogHeader>
          <DialogTitle className="text-center">Roll the Dice!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-6 gap-6">
          <div 
            className={`w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg ${
              isRolling ? 'animate-bounce' : ''
            }`}
          >
            <DiceIcon className="w-20 h-20 text-white" />
          </div>
          {result && !isRolling && (
            <div className="text-4xl font-bold text-purple-400">
              You rolled: {result}
            </div>
          )}
          <Button
            onClick={rollDice}
            disabled={isRolling}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
