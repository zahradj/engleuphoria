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
          <Button variant="default" size="sm" onClick={handleLoadGameIntro} className="bg-gradient-to-r from-green-500 to-blue-500">
            🎮 Greetings
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