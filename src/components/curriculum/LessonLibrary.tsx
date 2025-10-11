import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Clock, Target } from 'lucide-react';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';
import { lesson1_1 } from '@/data/curriculum/starters/module1/lesson1';
import { lesson0_1 } from '@/data/curriculum/unit-0/lesson-1';

interface LessonLibraryProps {}

export const LessonLibrary: React.FC<LessonLibraryProps> = () => {
  const [showLocalLesson, setShowLocalLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const handleStartLesson = (lessonData: any) => {
    setSelectedLesson(lessonData);
    setShowLocalLesson(true);
  };

  if (showLocalLesson && selectedLesson) {
    return (
      <LessonPlayer 
        lessonData={selectedLesson}
        onComplete={() => {
          setShowLocalLesson(false);
          setSelectedLesson(null);
        }}
        onExit={() => {
          setShowLocalLesson(false);
          setSelectedLesson(null);
        }}
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

      {/* Unit 0 - Getting Started */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Unit 0 - Getting Started with English</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Pre-Starter foundations for complete beginners</p>
            </div>
            <Badge variant="secondary">Pre-A1</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Lesson 0.1 Card */}
            <Card className="hover:shadow-md transition-shadow border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline">Lesson 0.1</Badge>
                      <Badge variant="secondary">Pre-A1</Badge>
                      <Badge className="bg-primary/10 text-primary border-primary/20">✨ New</Badge>
                      <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">🎮 Gamified</Badge>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">🎯 Interactive</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">My name is ____. Nice to meet you!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn basic greetings like "Hello", "Hi", "Goodbye" and introduce yourself with "My name is...". Features fun characters like SpongeBob and Spider-Man!
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{lesson0_1.durationMin} minutes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{lesson0_1.total_slides} slides</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Learning Objectives:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {lesson0_1.metadata.targets.map((target, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            {target}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleStartLesson(lesson0_1)} 
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

      {/* Module 1 - Basic Greetings */}
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
                  onClick={() => handleStartLesson(lesson1_1)} 
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