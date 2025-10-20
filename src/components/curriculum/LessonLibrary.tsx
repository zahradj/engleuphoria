import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Play, Clock, Target, Wand2 } from 'lucide-react';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';
import { GameLessonGenerator } from '@/components/curriculum/GameLessonGenerator';
import { lesson1_1 } from '@/data/curriculum/starters/module1/lesson1';
import { lesson0_1 } from '@/data/curriculum/unit-0/lesson-1';
import { lesson0_1_new } from '@/data/curriculum/unit-0/lesson-1-new';
import { lesson0_1_enhanced } from '@/data/curriculum/unit-0/lesson-1-enhanced';
import { lesson0_1_ultraInteractive } from '@/data/curriculum/unit-0/lesson-1-ultra-interactive';
import { lesson1GameIntro } from '@/data/curriculum/unit-0/lesson-1-game-intro';

interface LessonLibraryProps {}

export const LessonLibrary: React.FC<LessonLibraryProps> = () => {
  const [showLocalLesson, setShowLocalLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const handleStartLesson = (lessonData: any) => {
    // Format lesson data for the viewer - store the entire v2.0 lesson object
    const formattedLesson = {
      lessonId: 'lesson-0-1-ultra',
      title: '🎮 Ultra-Interactive: Greetings & Introductions',
      slides: lessonData // Store the entire v2.0 lesson object
    };

    // Reset and store in localStorage, then open viewer in new tab
    try {
      localStorage.removeItem('currentLesson');
      localStorage.setItem('currentLesson', JSON.stringify(formattedLesson));
      window.open('/lesson-viewer', '_blank');
    } catch (err) {
      console.error('Failed to open lesson viewer:', err);
    }
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

      {/* Tabs for Library and AI Generator */}
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library">
            <BookOpen className="h-4 w-4 mr-2" />
            Lesson Library
          </TabsTrigger>
          <TabsTrigger value="generator">
            <Wand2 className="h-4 w-4 mr-2" />
            🎮 AI Game Generator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6 mt-6">

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
            {/* NEW: Game-Based Lesson 0.1 */}
            <Card className="hover:shadow-md transition-shadow border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline">Lesson 0.1</Badge>
                      <Badge variant="secondary">Pre-A1</Badge>
                      <Badge className="bg-purple-500 text-white">🎮 Game Lesson</Badge>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">🎯 AI Voice</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">🎮 Game: My name is ___. Nice to meet you!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Interactive pygame-style lesson with Panda teacher, text input, feelings matching game, listen & repeat activities, and quiz challenges! Features AI character voices!
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{lesson1GameIntro.durationMin} minutes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{lesson1GameIntro.slides.length} slides | 5 ⭐</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">🎯 What You'll Learn:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {lesson1GameIntro.metadata.targets.slice(0, 3).map((target, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                            {target}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        ✨ Game Features: Name input, feelings match, listen & repeat, quiz, star rewards!
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleStartLesson(lesson1GameIntro)} 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  🚀 Start Game Lesson!
                </Button>
              </CardContent>
            </Card>

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
                    <h3 className="text-lg font-semibold mb-2">🎮 Ultra-Interactive: Greetings & Introductions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Experience the ULTIMATE interactive English lesson! Features beautiful Gemini-generated images, bubble pop games, character animations, and PPP methodology. NovaKid-inspired teaching!
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{lesson0_1_ultraInteractive.durationMin} minutes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{lesson0_1_ultraInteractive.slides.length} slides | 350 XP</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">🎯 What You'll Learn:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {lesson0_1_ultraInteractive.metadata.targets.slice(0, 3).map((target, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            {target}
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        ✨ Features: Bubble pop, character intros, celebration screens, Gemini images!
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleStartLesson(lesson0_1_ultraInteractive)} 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2" />
                  🚀 Start Adventure!
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

        </TabsContent>

        <TabsContent value="generator" className="mt-6">
          <GameLessonGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};