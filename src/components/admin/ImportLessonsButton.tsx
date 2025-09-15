import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
// Import lesson data directly
const unit1Lesson1GreetingsNames = {
  version: '2.0',
  theme: 'mist-blue',
  durationMin: 30,
  total_slides: 20,
  metadata: {
    CEFR: 'A1',
    module: 1,
    lesson: 1,
    targets: [
      'Use hello/hi/bye vocabulary correctly',
      'Say "Hello, I am ___" with confidence',
      'Recognize and write letter Aa',
      'Participate in interactive name games'
    ]
  }
};

const unit1Lesson2YesNoThankYou = {
  version: '2.0',
  theme: 'mist-blue',
  durationMin: 30,
  total_slides: 22,
  metadata: {
    CEFR: 'A1',
    module: 1,
    lesson: 2,
    targets: [
      'Use yes/no/thank you vocabulary correctly',
      'Say "Yes, please" and "No, thank you"',
      'Recognize and write letter Bb',
      'Participate in yes/no games and role-play'
    ]
  }
};

const unit1Lesson3ReviewRoleplay = {
  version: '2.0',
  theme: 'mist-blue',
  durationMin: 30,
  total_slides: 20,
  metadata: {
    CEFR: 'A1',
    module: 1,
    lesson: 3,
    targets: [
      'Review all Unit 1 greetings and polite words',
      'Demonstrate phonics Aa-Bb knowledge',
      'Complete self-introduction confidently',
      'Participate in interactive review games'
    ]
  }
};

interface ImportLessonsButtonProps {
  onImportComplete: () => void;
}

export const ImportLessonsButton: React.FC<ImportLessonsButtonProps> = ({ onImportComplete }) => {
  const [importing, setImporting] = useState(false);

  const importLessons = async () => {
    setImporting(true);
    try {
      const lessonsData = [
        {
          title: 'Greetings & Names',
          topic: 'Basic Greetings and Introductions',
          cefr_level: 'A1',
          difficulty_level: 'beginner',
          module_number: 1,
          lesson_number: 1,
          duration_minutes: 30,
          learning_objectives: unit1Lesson1GreetingsNames.metadata.targets,
          slides_content: unit1Lesson1GreetingsNames,
          is_active: true
        },
        {
          title: 'Yes, No, Thank You',
          topic: 'Basic Responses and Politeness',
          cefr_level: 'A1',
          difficulty_level: 'beginner',
          module_number: 1,
          lesson_number: 2,
          duration_minutes: 30,
          learning_objectives: unit1Lesson2YesNoThankYou.metadata.targets,
          slides_content: unit1Lesson2YesNoThankYou,
          is_active: true
        },
        {
          title: 'Review Role-Play',
          topic: 'Unit 1 Review and Practice',
          cefr_level: 'A1',
          difficulty_level: 'beginner',
          module_number: 1,
          lesson_number: 3,
          duration_minutes: 30,
          learning_objectives: unit1Lesson3ReviewRoleplay.metadata.targets,
          slides_content: unit1Lesson3ReviewRoleplay,
          is_active: true
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