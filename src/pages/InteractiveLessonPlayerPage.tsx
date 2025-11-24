import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { InteractiveLessonPlayer } from '@/components/lesson/InteractiveLessonPlayer';
import { StudentDetailDialog } from '@/components/teacher/StudentDetailDialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function InteractiveLessonPlayerPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  
  const mode = (searchParams.get('mode') as 'preview' | 'classroom' | 'student') || 'preview';
  const studentId = searchParams.get('studentId') || undefined;
  const studentName = searchParams.get('studentName') || 'Student';

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
    <>
      <InteractiveLessonPlayer
        lessonId={lessonId}
        studentId={studentId}
        mode={mode}
        onExit={() => navigate(mode === 'student' ? '/student' : '/teacher')}
      />

      {mode === 'classroom' && studentId && (
        <>
          <Button
            className="fixed bottom-6 right-6 rounded-full shadow-lg"
            size="lg"
            onClick={() => setShowStudentDialog(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Student Controls
          </Button>

          {showStudentDialog && (
            <StudentDetailDialog
              studentId={studentId}
              studentName={studentName}
              onClose={() => setShowStudentDialog(false)}
            />
          )}
        </>
      )}
    </>
  );
}
