import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

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

      // For now, we'll create a placeholder lesson to test the import functionality
      const lessonsData = [
        {
          title: 'Pre-Starter Lesson 1',
          topic: 'Basic Introductions',
          cefr_level: 'Pre-A1',
          difficulty_level: 'beginner',
          module_number: 1,
          lesson_number: 1,
          duration_minutes: 30,
          learning_objectives: ['Say hello and goodbye', 'Introduce yourself', 'Listen to simple greetings'],
          slides_content: {
            version: '2.0',
            theme: 'pre-starter',
            slides: [],
            durationMin: 30,
            total_slides: 20,
            metadata: {
              CEFR: 'Pre-A1',
              module: 1,
              lesson: 1,
              targets: ['Say hello and goodbye', 'Introduce yourself', 'Listen to simple greetings'],
              weights: { accuracy: 0.6, fluency: 0.4 }
            }
          },
          is_active: true,
          created_by: user.id
        }
      ];

      const { error } = await supabase
        .from('lessons_content')
        .insert(lessonsData);

      if (error) throw error;

      toast.success('Sample lesson imported successfully!');
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
      {importing ? 'Importing...' : 'Import Sample Lesson'}
    </Button>
  );
};