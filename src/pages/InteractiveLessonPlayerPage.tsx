import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { InteractiveLessonPlayer } from '@/components/lesson/InteractiveLessonPlayer';

export default function InteractiveLessonPlayerPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const mode = (searchParams.get('mode') as 'preview' | 'classroom' | 'student') || 'preview';

  if (!lessonId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Invalid Lesson</h1>
          <p className="text-muted-foreground mt-2">No lesson ID provided.</p>
        </div>
      </div>
    );
  }

  return (
    <InteractiveLessonPlayer
      lessonId={lessonId}
      mode={mode}
      onExit={() => navigate('/teacher')}
    />
  );
}
