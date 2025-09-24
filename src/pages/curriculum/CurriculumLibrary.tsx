import React from 'react';
import { LessonLibrary } from '@/components/curriculum/LessonLibrary';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CurriculumLibrary() {
  const navigate = useNavigate();

  const handleCreateLesson = (level: string, module: number, lesson: number) => {
    // Navigate to lesson creation interface
    navigate('/curriculum-generation', {
      state: {
        level,
        module,
        lesson,
        mode: 'create'
      }
    });
    toast.info(`Creating ${level} - Module ${module}, Lesson ${lesson}`);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <LessonLibrary onCreateLesson={handleCreateLesson} />
      </div>
    </div>
  );
}