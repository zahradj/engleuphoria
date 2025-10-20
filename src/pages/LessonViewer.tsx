import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LessonSlideViewer } from '@/components/classroom/content/LessonSlideViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface LessonData {
  lessonId: string;
  title: string;
  slides: any;
}

export default function LessonViewer() {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLesson = async () => {
      // Try primary key
      let stored = localStorage.getItem('currentLesson');

      // Fallback to alternate key used elsewhere in the app
      if (!stored) {
        stored = localStorage.getItem('currentLessonContent');
      }

      if (stored) {
        try {
          const lesson = JSON.parse(stored);

          // Normalize slides: accept Array, full LessonSlides object, or slides_content
          let normalizedSlides: any = null;
          const s = lesson?.slides;
          if (Array.isArray(s)) {
            normalizedSlides = s;
          } else if (s && typeof s === 'object' && (Array.isArray(s.slides) || s.version)) {
            normalizedSlides = s; // Full LessonSlides object
          } else if (lesson?.slides_content && Array.isArray(lesson.slides_content.slides)) {
            normalizedSlides = lesson.slides_content;
          }

          if (lesson && (lesson.lessonId || lesson.id) && lesson.title && normalizedSlides) {
            const normalizedLesson: LessonData = {
              lessonId: lesson.lessonId || lesson.id,
              title: lesson.title,
              slides: normalizedSlides,
            };

            // Persist normalized shape for consistency
            localStorage.setItem('currentLesson', JSON.stringify(normalizedLesson));
            setLessonData(normalizedLesson);
            return;
          }
        } catch (error) {
          console.error('Error parsing lesson data:', error);
        }
      }

      // Final fallback: try ultra-interactive first, then enhanced
      try {
        const mod = await import('@/data/curriculum/unit-0/lesson-1-ultra-interactive');
        const lesson0_1_ultraInteractive = (mod as any).lesson0_1_ultraInteractive;
        if (lesson0_1_ultraInteractive) {
          const fallback: LessonData = {
            lessonId: 'lesson-0-1-ultra',
            title: '🎮 Ultra-Interactive: Greetings & Introductions',
            slides: lesson0_1_ultraInteractive, // Full LessonSlides object
          };
          localStorage.setItem('currentLesson', JSON.stringify(fallback));
          setLessonData(fallback);
          return;
        }
      } catch (e) {
        console.error('Failed to load ultra-interactive lesson, trying enhanced:', e);
        try {
          const mod = await import('@/data/curriculum/unit-0/lesson-1-enhanced');
          const lesson0_1_enhanced = (mod as any).lesson0_1_enhanced;
          if (lesson0_1_enhanced) {
            const fallback: LessonData = {
              lessonId: 'unit-0-lesson-1-enhanced',
              title: '🌟 English Adventure: Greetings & Introductions',
              slides: lesson0_1_enhanced,
            };
            localStorage.setItem('currentLesson', JSON.stringify(fallback));
            setLessonData(fallback);
            return;
          }
        } catch (e2) {
          console.error('Failed to load fallback lesson:', e2);
        }
      }

      console.error('Invalid or missing lesson data');
    };

    // Invoke loader
    loadLesson();
  }, []);

  const handleBack = () => {
    // Clean up localStorage
    localStorage.removeItem('currentLesson');
    navigate('/teacher');
  };

  const handleLoadEnhanced = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-1-enhanced');
      const lesson0_1_enhanced = (mod as any).lesson0_1_enhanced;
      if (lesson0_1_enhanced) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-1-enhanced',
          title: '🌟 English Adventure: Greetings & Introductions',
          slides: lesson0_1_enhanced,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to reload enhanced lesson:', e);
    }
  };

  const handleLoadUltra = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-1-ultra-interactive');
      const lesson0_1_ultraInteractive = (mod as any).lesson0_1_ultraInteractive;
      if (lesson0_1_ultraInteractive) {
        const updated: LessonData = {
          lessonId: 'lesson-0-1-ultra',
          title: '🎮 Ultra-Interactive: Greetings & Introductions',
          slides: lesson0_1_ultraInteractive,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to reload ultra-interactive lesson:', e);
    }
  };

  const handleLoadGameIntro = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-1-game-intro');
      const lesson1GameIntro = (mod as any).lesson1GameIntro;
      if (lesson1GameIntro) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-1-game',
          title: '🎮 Game Lesson: My name is ____. Nice to meet you!',
          slides: lesson1GameIntro,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to reload game intro lesson:', e);
    }
  };

  const handleLoadGreetingsEnhanced = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-1-greetings-enhanced');
      const lesson1GreetingsEnhanced = (mod as any).lesson1GreetingsEnhanced;
      if (lesson1GreetingsEnhanced) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-1-greetings',
          title: '👋 Complete Greetings Lesson: Hello! My Name is...',
          slides: lesson1GreetingsEnhanced,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load greetings enhanced lesson:', e);
    }
  };

  const handleLoadGreetingsPerfect = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-1-greetings-perfect');
      const lesson1GreetingsPerfect = (mod as any).lesson1GreetingsPerfect;
      if (lesson1GreetingsPerfect) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-1-perfect',
          title: '🌟 Perfect Greetings (PPP Method): Hello! My Name is...',
          slides: lesson1GreetingsPerfect,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load perfect greetings lesson:', e);
    }
  };

  const handleLoadNumbers = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-2-numbers');
      const lesson2Numbers = (mod as any).lesson2Numbers;
      if (lesson2Numbers) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-2',
          title: '🔢 Numbers: How old are you?',
          slides: lesson2Numbers,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load numbers lesson:', e);
    }
  };

  const handleLoadColors = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-3-colors');
      const lesson3Colors = (mod as any).lesson3Colors;
      if (lesson3Colors) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-3',
          title: '🌈 Colors: My favorite color',
          slides: lesson3Colors,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load colors lesson:', e);
    }
  };

  const handleLoadLesson4 = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-4-colors');
      const lesson4Colors = (mod as any).lesson4Colors;
      if (lesson4Colors) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-4',
          title: '🎨 Colors Adventure: Rainbow Island',
          slides: lesson4Colors,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load lesson 4:', e);
    }
  };

  const handleLoadLesson5 = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-5-family');
      const lesson5Family = (mod as any).lesson5Family;
      if (lesson5Family) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-5',
          title: '👨‍👩‍👧‍👦 Family: Photo Album Story',
          slides: lesson5Family,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load lesson 5:', e);
    }
  };

  const handleLoadLesson6 = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-6-animals');
      const lesson6Animals = (mod as any).lesson6Animals;
      if (lesson6Animals) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-6',
          title: '🦁 Animals: Zoo Adventure',
          slides: lesson6Animals,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load lesson 6:', e);
    }
  };

  const handleLoadLesson7 = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-7-food');
      const lesson7Food = (mod as any).lesson7Food;
      if (lesson7Food) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-7',
          title: '🍕 Food: Restaurant Kitchen',
          slides: lesson7Food,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load lesson 7:', e);
    }
  };

  const handleLoadLesson8 = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-8-routines');
      const lesson8Routines = (mod as any).lesson8Routines;
      if (lesson8Routines) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-8',
          title: '⏰ Daily Routines: A Day in the Life',
          slides: lesson8Routines,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to load lesson 8:', e);
    }
  };
  if (!lessonData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle>No Lesson Data</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              No lesson data found. Please select a lesson from the library.
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <Button variant="default" size="sm" onClick={handleLoadGreetingsPerfect} className="bg-gradient-to-r from-green-500 to-blue-500">
            🌟 Greetings Perfect (PPP)
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadGreetingsEnhanced}>
            👋 Greetings (Enhanced)
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadGameIntro}>
            🎮 Greetings (Quick)
          </Button>
          <Button variant="default" size="sm" onClick={handleLoadNumbers} className="bg-gradient-to-r from-purple-500 to-pink-500">
            🔢 Numbers
          </Button>
          <Button variant="default" size="sm" onClick={handleLoadColors} className="bg-gradient-to-r from-orange-500 to-yellow-500">
            🌈 Colors
          </Button>
          <Button variant="secondary" size="sm" onClick={handleLoadUltra}>
            Ultra-Interactive
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadEnhanced}>
            Enhanced
          </Button>
          <Button variant="default" size="sm" onClick={handleLoadLesson4} className="bg-gradient-to-r from-pink-500 to-red-500">
            🎨 Colors Adventure
          </Button>
          <Button variant="default" size="sm" onClick={handleLoadLesson5} className="bg-gradient-to-r from-blue-400 to-purple-400">
            👨‍👩‍👧‍👦 Family
          </Button>
          <Button variant="default" size="sm" onClick={handleLoadLesson6} className="bg-gradient-to-r from-yellow-500 to-orange-500">
            🦁 Animals
          </Button>
          <Button variant="default" size="sm" onClick={handleLoadLesson7} className="bg-gradient-to-r from-red-400 to-pink-400">
            🍕 Food
          </Button>
          <Button variant="default" size="sm" onClick={handleLoadLesson8} className="bg-gradient-to-r from-cyan-400 to-blue-400">
            ⏰ Routines
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{lessonData.title}</h1>
            <p className="text-sm text-muted-foreground">
              Interactive Lesson Viewer
            </p>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="container mx-auto px-4 py-6">
        <LessonSlideViewer
          slides={lessonData.slides}
          title={lessonData.title}
          lessonId={lessonData.lessonId}
          studentId="demo-student"
          isTeacher={true}
          className="max-w-4xl mx-auto"
        />
      </div>
    </div>
  );
}