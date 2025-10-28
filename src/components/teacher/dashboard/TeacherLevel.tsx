import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award } from 'lucide-react';

export const TeacherLevel = () => {
  const currentLevel = "Major";
  const ratePerLesson = 20;
  const nextLevel = "Master";
  const progress = 65;

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Award className="h-4 w-4 text-purple-600" />
          Your level
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Level</span>
            <span className="text-lg font-bold text-purple-600">{currentLevel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Rate per lesson</span>
            <span className="text-base font-semibold text-gray-900">${ratePerLesson}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progress to {nextLevel}</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
