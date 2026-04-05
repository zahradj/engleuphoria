import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ImmersiveLessonReader } from '@/components/student/lesson-reader/ImmersiveLessonReader';
import LessonPlayerContainer from '@/components/lesson-player/LessonPlayerContainer';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HubType, GeneratedSlide } from '@/components/admin/lesson-builder/ai-wizard/types';

interface LessonData {
  id: string;
  title: string;
  description: string | null;
  content: any;
  difficulty_level: string;
  target_system: string;
  duration_minutes: number | null;
  ai_metadata: any;
}

const LessonReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchLesson = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('curriculum_lessons')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        setError('Lesson not found');
      } else {
        setLesson(data as LessonData);
      }
      setLoading(false);
    };
    fetchLesson();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-lg text-muted-foreground">{error || 'Lesson not found'}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  // ── Detect slide-based (App-Shell) lessons ──
  const slides: GeneratedSlide[] | null = lesson.content?.slides || null;
  const hub: HubType = (lesson.content?.hub || lesson.target_system || 'playground') as HubType;

  if (slides && slides.length > 0) {
    return (
      <LessonPlayerContainer
        slides={slides}
        hub={hub}
        lessonTitle={lesson.title}
        lessonId={lesson.id}
        studentId={user?.id}
        onComplete={(score) => {
          console.log('Lesson completed with score:', score);
        }}
        onExit={() => navigate(-1)}
      />
    );
  }

  // ── Fallback: markdown-based immersive reader ──
  const markdownContent = typeof lesson.content === 'string'
    ? lesson.content
    : lesson.content?.markdown || lesson.content?.text || JSON.stringify(lesson.content, null, 2);

  const track = lesson.target_system === 'kids' ? 'kids'
    : lesson.target_system === 'teen' ? 'teens'
    : 'adults';

  const coverImageUrl = lesson.ai_metadata?.coverImageUrl || null;

  return (
    <ImmersiveLessonReader
      lessonId={lesson.id}
      title={lesson.title}
      content={markdownContent}
      track={track}
      level={lesson.difficulty_level}
      coverImageUrl={coverImageUrl}
      durationMinutes={lesson.duration_minutes}
      onBack={() => navigate(-1)}
    />
  );
};

export default LessonReaderPage;
