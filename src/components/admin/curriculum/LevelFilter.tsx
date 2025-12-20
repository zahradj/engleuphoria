import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface LevelFilterProps {
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}

const levels = [
  { value: 'Pre-A1', label: 'Pre-A1', description: 'Beginner' },
  { value: 'A1', label: 'A1', description: 'Elementary' },
  { value: 'A2', label: 'A2', description: 'Pre-Intermediate' },
  { value: 'B1', label: 'B1', description: 'Intermediate' },
  { value: 'B2', label: 'B2', description: 'Upper-Intermediate' },
];

export const LevelFilter: React.FC<LevelFilterProps> = ({
  selectedLevel,
  onLevelChange,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-foreground">CEFR Level</h3>
      <RadioGroup value={selectedLevel} onValueChange={onLevelChange}>
        {levels.map((level) => (
          <div key={level.value} className="flex items-center space-x-2">
            <RadioGroupItem value={level.value} id={`level-${level.value}`} />
            <Label 
              htmlFor={`level-${level.value}`}
              className="flex flex-col cursor-pointer"
            >
              <span className="font-medium">{level.label}</span>
              <span className="text-xs text-muted-foreground">{level.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
