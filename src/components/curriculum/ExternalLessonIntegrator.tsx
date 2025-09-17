import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Plus, Globe, Import, Check } from 'lucide-react';
import { LessonSlides } from '@/types/slides';

interface ExternalLessonIntegration {
  url: string;
  title: string;
  description: string;
  slides: number;
  duration: number;
  level: string;
  topic: string;
}

interface ExternalLessonIntegratorProps {
  onLessonImported?: () => void;
}

export function ExternalLessonIntegrator({ onLessonImported }: ExternalLessonIntegratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lessonUrl, setLessonUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<ExternalLessonIntegration | null>(null);
  const { toast } = useToast();

  // Pre-configured lesson from Hello Adventures project
  const helloAdventuresLesson: ExternalLessonIntegration = {
    url: 'https://preview--hello-a-names-adventures.lovable.app/lesson',
    title: '🎵 Welcome to English - Hello Adventures',
    description: 'Interactive lesson with songs, greetings, and phonics. Perfect for young learners starting their English journey.',
    slides: 34,
    duration: 30,
    level: 'A1',
    topic: 'greetings and introductions'
  };

  const handlePreviewLesson = () => {
    if (lessonUrl.includes('hello-a-names-adventures') || lessonUrl.includes('3ad1c0d6-0d3d-47a9-b320-b09d2745911e')) {
      setPreviewData(helloAdventuresLesson);
    } else {
      // For other URLs, we'd need to fetch and analyze the content
      setPreviewData({
        url: lessonUrl,
        title: 'External Lesson',
        description: 'Imported lesson from external source',
        slides: 20,
        duration: 25,
        level: 'A1',
        topic: 'various'
      });
    }
  };

  const createHelloAdventuresLessonSlides = (): LessonSlides => {
    return {
      version: '2.0',
      theme: 'mist-blue',
      durationMin: 30,
      total_slides: 34,
      metadata: {
        CEFR: 'A1',
        module: 1,
        lesson: 1,
        targets: ['greetings', 'introductions', 'phonics', 'hello song'],
        weights: { accuracy: 40, fluency: 60 }
      },
      slides: [
        {
          id: 'hello-welcome',
          type: 'warmup',
          prompt: '🎵 Welcome to English!',
          instructions: '👋\n\nLet\'s start with a fun Hello song!\n\nPlay "Hello, Hello, How Are You?"\n\nWave your hand when you hear "hello"!',
          media: {
            type: 'audio',
            url: '',
            alt: 'Hello song for greetings',
            imagePrompt: 'Cheerful cartoon character waving hello with musical notes around, colorful and child-friendly'
          },
          accessibility: {
            screenReaderText: 'Welcome to English lesson with hello song',
            highContrast: false,
            largeText: true
          },
          orderIndex: 1
        },
        {
          id: 'learning-objectives',
          type: 'target_language',
          prompt: '🎯 Learning Objectives:',
          instructions: '• Say basic greetings (Hello, Hi, Bye)\n• Ask and answer names: "What\'s your name? My name is ___"\n• Recognize and pronounce the sounds of Aa (phonics)',
          accessibility: {
            screenReaderText: 'Learning objectives for greetings and introductions',
            highContrast: false,
            largeText: true
          },
          orderIndex: 2
        },
        {
          id: 'greetings-practice',
          type: 'vocabulary_preview',
          prompt: '👋 Greetings Time!',
          instructions: 'Learn to say hello in different ways!',
          vocabulary: ['hello', 'hi', 'good morning', 'goodbye', 'bye'],
          media: {
            type: 'image',
            url: '',
            alt: 'Various greeting gestures and expressions',
            imagePrompt: 'Children waving and greeting each other in different ways, diverse and friendly scene'
          },
          accessibility: {
            screenReaderText: 'Practice different greetings and farewells',
            highContrast: false,
            largeText: true
          },
          orderIndex: 3
        },
        {
          id: 'name-introductions',
          type: 'communicative_task',
          prompt: '🏷️ What\'s Your Name?',
          instructions: 'Practice introducing yourself!\n\n"Hello! My name is ___"\n"What\'s your name?"\n"Nice to meet you!"',
          vocabulary: ['my name is', 'what is your name', 'nice to meet you'],
          accessibility: {
            screenReaderText: 'Practice name introductions and meeting people',
            highContrast: false,
            largeText: true
          },
          orderIndex: 4
        },
        {
          id: 'phonics-aa',
          type: 'tpr_phonics',
          prompt: '🔤 Letter Aa Adventures',
          instructions: 'Let\'s learn the sound of letter Aa!\n\nAa says "ah" like in "apple"\n\nCan you say "ah, ah, apple"?',
          vocabulary: ['apple', 'ant', 'alligator', 'airplane'],
          media: {
            type: 'image',
            url: '',
            alt: 'Letter A with apple and other A words',
            imagePrompt: 'Large letter A with colorful illustrations of apple, ant, alligator, and airplane around it'
          },
          accessibility: {
            screenReaderText: 'Phonics practice for letter A sound',
            highContrast: false,
            largeText: true
          },
          orderIndex: 5
        },
        {
          id: 'interactive-drawing',
          type: 'picture_description',
          prompt: '✏️ Draw and Share',
          instructions: 'Draw yourself saying hello!\n\nThen tell us: "Hello! My name is ___"',
          media: {
            type: 'image',
            url: '',
            alt: 'Children drawing and sharing their artwork',
            imagePrompt: 'Happy children drawing pictures of themselves waving hello, creative and engaging scene'
          },
          accessibility: {
            screenReaderText: 'Creative drawing activity with self-introduction',
            highContrast: false,
            largeText: true
          },
          orderIndex: 6
        },
        {
          id: 'next-adventure',
          type: 'exit_check',
          prompt: '🎉 Amazing Work!',
          instructions: 'You did fantastic!\n\nYou can now:\n✅ Say hello and goodbye\n✅ Tell people your name\n✅ Recognize the Aa sound\n\nReady for your next adventure? 🌟',
          media: {
            type: 'image',
            url: '',
            alt: 'Celebration with achievements unlocked',
            imagePrompt: 'Celebration scene with confetti, stars, and achievement badges for completing the hello lesson'
          },
          accessibility: {
            screenReaderText: 'Lesson completion celebration and achievement summary',
            highContrast: false,
            largeText: true
          },
          orderIndex: 7
        }
      ],
      slideOrder: ['hello-welcome', 'learning-objectives', 'greetings-practice', 'name-introductions', 'phonics-aa', 'interactive-drawing', 'next-adventure']
    };
  };

  const handleImportLesson = async () => {
    if (!previewData) return;

    setIsImporting(true);
    try {
      let lessonSlides: LessonSlides;

      // Create specific lesson content based on the source
      if (previewData.url.includes('hello-a-names-adventures')) {
        lessonSlides = createHelloAdventuresLessonSlides();
      } else {
        // Generic lesson template for other sources
        lessonSlides = {
          version: '2.0',
          theme: 'mist-blue',
          durationMin: previewData.duration,
          total_slides: previewData.slides,
          metadata: {
            CEFR: previewData.level as any,
            module: 1,
            lesson: 1,
            targets: [previewData.topic],
            weights: { accuracy: 50, fluency: 50 }
          },
          slides: [],
          slideOrder: []
        };
      }

      // Create lesson content record
      const lessonContent = {
        title: previewData.title,
        topic: previewData.topic,
        cefr_level: previewData.level,
        module_number: 1,
        lesson_number: 1,
        duration_minutes: previewData.duration,
        learning_objectives: [
          'Practice greetings and introductions',
          'Learn basic vocabulary',
          'Develop speaking confidence'
        ],
        vocabulary_focus: lessonSlides.metadata.targets,
        grammar_focus: ['Basic greetings', 'Simple introductions', 'Question and answer patterns'],
        slides_content: lessonSlides,
        is_active: true,
        difficulty_level: 'beginner',
        metadata: {
          source: 'external_import',
          original_url: previewData.url,
          import_date: new Date().toISOString(),
          lesson_type: 'imported'
        }
      };

      // Save to database
      const { data, error } = await supabase
        .from('lessons_content')
        .insert(lessonContent)
        .select()
        .single();

      if (error) {
        console.error('Failed to import lesson:', error);
        toast({
          title: "Import Failed",
          description: "Failed to import the lesson. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Lesson Imported Successfully! 🎉",
          description: `"${previewData.title}" has been added to your library`
        });
        
        setIsOpen(false);
        setPreviewData(null);
        setLessonUrl('');
        onLessonImported?.();
      }
    } catch (error) {
      console.error('Error importing lesson:', error);
      toast({
        title: "Import Error",
        description: "An error occurred while importing the lesson.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleQuickImportHelloAdventures = async () => {
    setPreviewData(helloAdventuresLesson);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for state update
    handleImportLesson();
  };

  return (
    <div className="space-y-4">
      {/* Quick Import Button for Hello Adventures */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Hello Adventures - Ready to Import</h3>
                <p className="text-sm text-blue-700">
                  🎵 Welcome to English lesson with 34 interactive slides
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(helloAdventuresLesson.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleQuickImportHelloAdventures}
                disabled={isImporting}
                size="sm"
              >
                <Import className="h-4 w-4 mr-2" />
                {isImporting ? 'Importing...' : 'Import Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Import Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Import External Lesson
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Import className="h-5 w-5" />
              Import External Lesson
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Lesson URL</label>
              <Input
                placeholder="https://your-lesson-url.com"
                value={lessonUrl}
                onChange={(e) => setLessonUrl(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the URL of the lesson you want to import
              </p>
            </div>

            <Button 
              onClick={handlePreviewLesson}
              disabled={!lessonUrl}
              variant="outline"
              className="w-full"
            >
              <Globe className="h-4 w-4 mr-2" />
              Preview Lesson
            </Button>

            {previewData && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Lesson Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{previewData.title}</h3>
                    <p className="text-sm text-muted-foreground">{previewData.description}</p>
                  </div>
                  
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{previewData.level}</Badge>
                      <span className="text-muted-foreground">{previewData.slides} slides</span>
                      <span className="text-muted-foreground">{previewData.duration} min</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => window.open(previewData.url, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Original
                    </Button>
                    <Button 
                      onClick={handleImportLesson}
                      disabled={isImporting}
                      size="sm"
                    >
                      <Import className="h-4 w-4 mr-2" />
                      {isImporting ? 'Importing...' : 'Import to Library'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}