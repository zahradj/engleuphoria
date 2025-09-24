import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Clock, Target } from 'lucide-react';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';
import { lesson1_1 } from '@/data/curriculum/starters/module1/lesson1';

interface LessonLibraryProps {}

export const LessonLibrary: React.FC<LessonLibraryProps> = () => {
  const [showLocalLesson, setShowLocalLesson] = useState(false);

  const handleStartLesson = () => {
    setShowLocalLesson(true);
  };

  if (showLocalLesson) {
    return (
      <LessonPlayer 
        lessonData={lesson1_1}
        onComplete={() => setShowLocalLesson(false)}
        onExit={() => setShowLocalLesson(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            English Curriculum Library
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Module 1 - Direct Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Module 1 - Basic Greetings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Learn fundamental greetings and introductions</p>
            </div>
            <Badge variant="secondary">A1</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Lesson 1.1 Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Lesson 1.1</Badge>
                      <Badge variant="secondary">A1</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Greetings & Self-Introduction</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn basic greetings like "Hello", "Hi", "Good morning" and how to introduce yourself with name and age.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{lesson1_1.durationMin} minutes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{lesson1_1.total_slides} slides</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Learning Objectives:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {lesson1_1.metadata.targets.map((target, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                            {target}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleStartLesson} 
                  className="w-full"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Lesson
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};