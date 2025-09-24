import React from 'react';
import { LessonLibrary } from '@/components/curriculum/LessonLibrary';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CurriculumLibrary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <LessonLibrary />
      </div>
    </div>
  );
}