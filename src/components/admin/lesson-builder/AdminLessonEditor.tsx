import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { LessonHeader } from './LessonHeader';
import { SlideOrganizer } from './SlideOrganizer';
import { EditorCanvas } from './EditorCanvas';
import { TeacherGuide } from './TeacherGuide';
import { Slide, LessonDeck } from './types';
import { AILessonWizard } from './ai-wizard';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

export const AdminLessonEditor: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showAIWizard, setShowAIWizard] = useState(false);
  
  // Lesson metadata
  const [lessonTitle, setLessonTitle] = useState('Untitled Lesson');
  const [level, setLevel] = useState('A1');
  const [ageGroup, setAgeGroup] = useState('6-8');
  
  // Slides state
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: uuidv4(),
      order: 0,
      type: 'image',
      teacherNotes: '',
      keywords: [],
    },
  ]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(slides[0]?.id || null);

  const selectedSlide = slides.find((s) => s.id === selectedSlideId) || null;

  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = {
      id: uuidv4(),
      order: slides.length,
      type: 'image',
      teacherNotes: '',
      keywords: [],
    };
    setSlides((prev) => [...prev, newSlide]);
    setSelectedSlideId(newSlide.id);
  }, [slides.length]);

  const handleDeleteSlide = useCallback((id: string) => {
    setSlides((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      // Reorder remaining slides
      return filtered.map((s, index) => ({ ...s, order: index }));
    });
    if (selectedSlideId === id) {
      setSelectedSlideId(slides[0]?.id !== id ? slides[0]?.id : slides[1]?.id || null);
    }
  }, [selectedSlideId, slides]);

  const handleReorderSlides = useCallback((startIndex: number, endIndex: number) => {
    setSlides((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      // Update order property
      return result.map((s, index) => ({ ...s, order: index }));
    });
  }, []);

  const handleUpdateSlide = useCallback((updates: Partial<Slide>) => {
    if (!selectedSlideId) return;
    setSlides((prev) =>
      prev.map((s) => (s.id === selectedSlideId ? { ...s, ...updates } : s))
    );
  }, [selectedSlideId]);

  const handleSave = async () => {
    setIsSaving(true);
    
    const lessonDeck: LessonDeck = {
      title: lessonTitle,
      level,
      ageGroup,
      slides: slides.map((s) => ({ ...s })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Log to console for now
    console.log('Lesson Saved:', JSON.stringify(lessonDeck, null, 2));

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSaving(false);
    toast({
      title: 'Lesson Saved!',
      description: `"${lessonTitle}" with ${slides.length} slides has been saved.`,
    });
  };

  const handlePreview = () => {
    toast({
      title: 'Preview Mode',
      description: 'Opening lesson preview... (Coming soon)',
    });
  };

  const handleAILessonGenerated = useCallback((
    generatedSlides: Slide[],
    title: string,
    newLevel: string,
    newAgeGroup: string
  ) => {
    setSlides(generatedSlides);
    setLessonTitle(title);
    setLevel(newLevel);
    setAgeGroup(newAgeGroup);
    setSelectedSlideId(generatedSlides[0]?.id || null);
    
    toast({
      title: 'Lesson Generated!',
      description: `Created ${generatedSlides.length} slides using AI wizard.`,
    });
  }, [toast]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <LessonHeader
        title={lessonTitle}
        level={level}
        ageGroup={ageGroup}
        onTitleChange={setLessonTitle}
        onLevelChange={setLevel}
        onAgeGroupChange={setAgeGroup}
        onSave={handleSave}
        onPreview={handlePreview}
        isSaving={isSaving}
      />

      <div className="flex-1 flex min-h-0">
        {/* Left: Slide Organizer */}
        <div className="w-64 shrink-0 relative">
          <SlideOrganizer
            slides={slides}
            selectedSlideId={selectedSlideId}
            onSelectSlide={setSelectedSlideId}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onReorderSlides={handleReorderSlides}
          />
          
          {/* AI Wizard Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={() => setShowAIWizard(true)}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 shadow-lg"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              AI Generate Lesson
            </Button>
          </div>
        </div>

        {/* Center: Editor Canvas */}
        <div className="flex-1 min-w-0">
          <EditorCanvas
            slide={selectedSlide}
            onUpdateSlide={handleUpdateSlide}
          />
        </div>

        {/* Right: Teacher Guide */}
        <div className="w-80 shrink-0">
          <TeacherGuide
            slide={selectedSlide}
            onUpdateSlide={handleUpdateSlide}
          />
        </div>
      </div>

      {/* AI Lesson Wizard Modal */}
      <AILessonWizard
        open={showAIWizard}
        onOpenChange={setShowAIWizard}
        onLessonGenerated={handleAILessonGenerated}
      />
    </div>
  );
};
