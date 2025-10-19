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

      // Final fallback: load the built-in Unit 0 Lesson 1 so teachers can demo immediately
      try {
        const mod = await import('@/data/curriculum/unit-0/lesson-1-new');
        const lesson0_1_new = (mod as any).lesson0_1_new;
        if (lesson0_1_new) {
          const fallback: LessonData = {
            lessonId: 'unit-0-lesson-1',
            title: 'My name is ____. Nice to meet you!',
            slides: lesson0_1_new, // Full LessonSlides object
          };
          localStorage.setItem('currentLesson', JSON.stringify(fallback));
          setLessonData(fallback);
          return;
        }
      } catch (e) {
        console.error('Failed to load fallback lesson:', e);
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

  const handleLoadNew = async () => {
    try {
      const mod = await import('@/data/curriculum/unit-0/lesson-1-new');
      const lesson0_1_new = (mod as any).lesson0_1_new;
      if (lesson0_1_new) {
        const updated: LessonData = {
          lessonId: 'unit-0-lesson-1',
          title: 'My name is ____. Nice to meet you!',
          slides: lesson0_1_new,
        };
        localStorage.setItem('currentLesson', JSON.stringify(updated));
        setLessonData(updated);
      }
    } catch (e) {
      console.error('Failed to reload new lesson:', e);
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
          <Button variant="secondary" size="sm" onClick={handleLoadNew}>
            Load New Lesson
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