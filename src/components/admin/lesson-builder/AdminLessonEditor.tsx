import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LessonHeader } from './LessonHeader';
import { SlideOrganizer } from './SlideOrganizer';
import { EditorCanvas } from './EditorCanvas';
import { TeacherGuide } from './TeacherGuide';
import { CurriculumBrowser } from './CurriculumBrowser';
import { LessonPreviewDialog } from './LessonPreviewDialog';
import { LessonBlueprint } from './LessonBlueprint';
import { Slide, LessonDeck, CanvasElementData } from './types';
import { AILessonWizard } from './ai-wizard';
import { AIActivityGenerator } from './AIActivityGenerator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, HelpCircle, ArrowLeft, ArrowRight, CheckCircle, BookOpen, ClipboardList } from 'lucide-react';
import { QuizGenerator } from '@/components/content-creator/QuizGenerator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useQueryClient } from '@tanstack/react-query';

interface AdminLessonEditorProps {
  onFinish?: () => void;
  onBack?: () => void;
}

export const AdminLessonEditor: React.FC<AdminLessonEditorProps> = ({ onFinish, onBack }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [showAIWizard, setShowAIWizard] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  
  const [lessonTitle, setLessonTitle] = useState('Untitled Lesson');
  const [level, setLevel] = useState('A1');
  const [ageGroup, setAgeGroup] = useState('6-8');
  
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

  const handleSelectLesson = useCallback((lesson: any) => {
    setActiveLessonId(lesson.id);
    setLessonTitle(lesson.title || 'Untitled Lesson');
    setLevel(lesson.difficulty_level || 'A1');

    if (lesson.content && Array.isArray(lesson.content)) {
      const loadedSlides: Slide[] = lesson.content.map((s: any, idx: number) => ({
        id: s.id || uuidv4(),
        order: s.order ?? idx,
        type: s.type || 'image',
        imageUrl: s.imageUrl,
        videoUrl: s.videoUrl,
        quizQuestion: s.quizQuestion,
        quizOptions: s.quizOptions,
        pollQuestion: s.pollQuestion,
        pollOptions: s.pollOptions,
        teacherNotes: s.teacherNotes || '',
        keywords: s.keywords || [],
        title: s.title,
        canvasElements: s.canvasElements,
      }));
      setSlides(loadedSlides);
      setSelectedSlideId(loadedSlides[0]?.id || null);
    } else {
      const firstSlide: Slide = {
        id: uuidv4(),
        order: 0,
        type: 'image',
        teacherNotes: '',
        keywords: [],
      };
      setSlides([firstSlide]);
      setSelectedSlideId(firstSlide.id);
    }

    toast({
      title: 'Lesson Loaded',
      description: `Editing "${lesson.title}"`,
    });
  }, [toast]);

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
      return result.map((s, index) => ({ ...s, order: index }));
    });
  }, []);

  const handleUpdateSlide = useCallback((updates: Partial<Slide>) => {
    if (!selectedSlideId) return;
    setSlides((prev) =>
      prev.map((s) => (s.id === selectedSlideId ? { ...s, ...updates } : s))
    );
  }, [selectedSlideId]);

  const handleImageUploaded = useCallback((slideId: string, imageUrl: string) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === slideId ? { ...s, imageUrl } : s))
    );
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeLessonId) {
        const slidesJson = slides.map((s) => ({ ...s }));
        const { error } = await supabase
          .from('curriculum_lessons')
          .update({
            content: slidesJson as any,
            updated_at: new Date().toISOString(),
          })
          .eq('id', activeLessonId);

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['curriculum-browser-units'] });

        toast({
          title: 'Lesson Saved!',
          description: `"${lessonTitle}" with ${slides.length} slides saved to database.`,
        });
      } else {
        toast({
          title: 'No Lesson Selected',
          description: 'Select a curriculum lesson from the browser to save.',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'Save Failed',
        description: err.message || 'Could not save lesson.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!activeLessonId) {
      toast({ title: 'No lesson selected', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const slidesJson = slides.map((s) => ({ ...s }));
      const { error } = await supabase
        .from('curriculum_lessons')
        .update({
          content: slidesJson as any,
          is_published: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activeLessonId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['curriculum-browser-units'] });

      toast({
        title: 'Lesson Published! 🎉',
        description: `"${lessonTitle}" is now in the library.`,
      });

      onFinish?.();
    } catch (err: any) {
      toast({
        title: 'Publish Failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
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
    <div className="h-full flex flex-col bg-background" style={{ minHeight: 'calc(100vh - 8rem)' }}>
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
        {/* Left: Curriculum Browser */}
        <div className="w-56 shrink-0">
          <CurriculumBrowser
            activeLessonId={activeLessonId}
            onSelectLesson={handleSelectLesson}
          />
        </div>

        {/* Slide Organizer */}
        <div className="w-56 shrink-0 relative">
          <SlideOrganizer
            slides={slides}
            selectedSlideId={selectedSlideId}
            onSelectSlide={setSelectedSlideId}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onReorderSlides={handleReorderSlides}
            onImageUploaded={handleImageUploaded}
          />
          
          {/* AI Buttons */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <AIActivityGenerator
              lessonContent={slides.map(s => s.title || '').join(' ')}
              level={level}
              onActivitiesGenerated={(newElements) => {
                if (selectedSlide) {
                  handleUpdateSlide({
                    canvasElements: [...(selectedSlide.canvasElements || []), ...newElements]
                  });
                }
              }}
            />

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Generate Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <QuizGenerator />
              </DialogContent>
            </Dialog>

            <Button
              onClick={() => setShowAIWizard(true)}
              className="w-full bg-gradient-to-r from-primary to-primary/80 shadow-lg"
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

        {/* Right: Teacher Guide + Blueprint Tabs */}
        <div className="w-72 shrink-0 border-l border-border flex flex-col">
          <Tabs defaultValue="blueprint" className="flex flex-col h-full">
            <TabsList className="w-full rounded-none border-b border-border bg-card shrink-0">
              <TabsTrigger value="blueprint" className="flex-1 gap-1.5 text-xs">
                <ClipboardList className="h-3.5 w-3.5" />
                Blueprint
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex-1 gap-1.5 text-xs">
                <BookOpen className="h-3.5 w-3.5" />
                Guide
              </TabsTrigger>
            </TabsList>
            <TabsContent value="blueprint" className="flex-1 min-h-0 mt-0">
              <LessonBlueprint
                slides={slides}
                selectedSlideIndex={slides.findIndex(s => s.id === selectedSlideId)}
                onSelectSlide={(idx) => setSelectedSlideId(slides[idx]?.id || null)}
              />
            </TabsContent>
            <TabsContent value="guide" className="flex-1 min-h-0 mt-0">
              <TeacherGuide
                slide={selectedSlide}
                onUpdateSlide={handleUpdateSlide}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Navigation buttons for pipeline */}
      {(onBack || onFinish) && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-card shrink-0">
          {onBack ? (
            <Button variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back: Lesson Generation
            </Button>
          ) : <div />}
          {onFinish && (
            <Button onClick={handlePublish} size="lg" className="gap-2" disabled={isSaving || !activeLessonId}>
              <CheckCircle className="h-4 w-4" />
              Finish & Publish to Library
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* AI Lesson Wizard Modal */}
      <AILessonWizard
        open={showAIWizard}
        onOpenChange={setShowAIWizard}
        onLessonGenerated={handleAILessonGenerated}
      />

      {/* Preview Dialog */}
      <LessonPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        slides={slides}
        lessonTitle={lessonTitle}
      />
    </div>
  );
};
