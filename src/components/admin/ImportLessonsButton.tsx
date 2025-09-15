import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { unit1Lesson1GreetingsNames } from '@/data/lessons/unit1-lesson1-greetings-names';
import { unit1Lesson2YesNoThankYou } from '@/data/lessons/unit1-lesson2-yes-no-thank-you';
import { unit1Lesson3ReviewRoleplay } from '@/data/lessons/unit1-lesson3-review-roleplay';

interface ImportLessonsButtonProps {
  onImportComplete: () => void;
}

export const ImportLessonsButton: React.FC<ImportLessonsButtonProps> = ({ onImportComplete }) => {
  const [importing, setImporting] = useState(false);

  const importLessons = async () => {
    setImporting(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error('Please sign in to import lessons.');
        setImporting(false);
        return;
      }

      const lessonsData = [
        {
          title: 'Greetings & Names',
          topic: 'Basic Greetings and Introductions',
          cefr_level: 'A1',
          difficulty_level: 'beginner',
          module_number: unit1Lesson1GreetingsNames.metadata.module,
          lesson_number: unit1Lesson1GreetingsNames.metadata.lesson,
          duration_minutes: unit1Lesson1GreetingsNames.durationMin ?? 30,
          learning_objectives: unit1Lesson1GreetingsNames.metadata.targets,
          slides_content: unit1Lesson1GreetingsNames,
          is_active: true,
          created_by: user.id
        },
        {
          title: 'Yes, No, Thank You',
          topic: 'Basic Responses and Politeness',
          cefr_level: 'A1',
          difficulty_level: 'beginner',
          module_number: unit1Lesson2YesNoThankYou.metadata.module,
          lesson_number: unit1Lesson2YesNoThankYou.metadata.lesson,
          duration_minutes: unit1Lesson2YesNoThankYou.durationMin ?? 30,
          learning_objectives: unit1Lesson2YesNoThankYou.metadata.targets,
          slides_content: unit1Lesson2YesNoThankYou,
          is_active: true,
          created_by: user.id
        },
        {
          title: 'Review Role-Play',
          topic: 'Unit 1 Review and Practice',
          cefr_level: 'A1',
          difficulty_level: 'beginner',
          module_number: unit1Lesson3ReviewRoleplay.metadata.module,
          lesson_number: unit1Lesson3ReviewRoleplay.metadata.lesson,
          duration_minutes: unit1Lesson3ReviewRoleplay.durationMin ?? 30,
          learning_objectives: unit1Lesson3ReviewRoleplay.metadata.targets,
          slides_content: unit1Lesson3ReviewRoleplay,
          is_active: true,
          created_by: user.id
        }
      ];

      const { error } = await supabase
        .from('lessons_content')
        .insert(lessonsData);

      if (error) throw error;

      toast.success('All Unit 1 lessons imported successfully!');
      onImportComplete();
    } catch (error) {
      console.error('Error importing lessons:', error);
      toast.error('Failed to import lessons');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Button 
      onClick={importLessons} 
      disabled={importing}
      className="gap-2"
    >
      <Upload className="h-4 w-4" />
      {importing ? 'Importing...' : 'Import Unit 1 Lessons'}
    </Button>
  );
};