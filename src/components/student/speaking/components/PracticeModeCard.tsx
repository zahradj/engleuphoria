
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SpeakingScenario } from '@/types/speaking';
import { PlayCircle, LucideIcon } from 'lucide-react';

interface PracticeModeCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  scenarios: SpeakingScenario[];
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  titleColor: string;
  onStartPractice: (scenario: SpeakingScenario) => void;
}

export const PracticeModeCard: React.FC<PracticeModeCardProps> = ({
  title,
  icon: Icon,
  description,
  scenarios,
  borderColor,
  iconBgColor,
  iconColor,
  titleColor,
  onStartPractice
}) => {
  return (
    <Card className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-2 ${borderColor}`}>
      <CardHeader className="text-center pb-4">
        <div className={`mx-auto w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mb-4`}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <CardTitle className={`text-xl ${titleColor}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-center">
          {description}
        </p>
        <div className="space-y-2">
          {scenarios.slice(0, 3).map((scenario) => (
            <Button
              key={scenario.id}
              variant="outline"
              className="w-full justify-between text-left"
              onClick={() => onStartPractice(scenario)}
            >
              <span>{scenario.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{scenario.cefr_level}</Badge>
                <PlayCircle className="h-4 w-4" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
