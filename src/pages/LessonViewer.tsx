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
    // Get lesson data from localStorage and normalize shape
    const storedLesson = localStorage.getItem('currentLesson');
    if (storedLesson) {
      try {
        const lesson = JSON.parse(storedLesson);

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
        } else {
          console.error('Invalid lesson data structure', { lesson });
        }
      } catch (error) {
        console.error('Error parsing lesson data:', error);
      }
    }
  }, []);

  const handleBack = () => {
    // Clean up localStorage
    localStorage.removeItem('currentLesson');
    navigate('/teacher');
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