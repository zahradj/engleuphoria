import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SlideFilmstrip } from './SlideFilmstrip';
import { EditorCanvas } from './EditorCanvas';
import { TeacherGuide } from './TeacherGuide';
import { CurriculumBrowser } from './CurriculumBrowser';
import { LessonPreviewDialog } from './LessonPreviewDialog';
import { LessonBlueprint } from './LessonBlueprint';
import { Slide, LessonDeck, CanvasElementData, CanvasElementType } from './types';
import { AILessonWizard } from './ai-wizard';
import { AIActivityGenerator } from './AIActivityGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wand2, HelpCircle, ArrowLeft, ArrowRight, CheckCircle,
  BookOpen, ClipboardList, Save, Eye, FolderOpen, LayoutList,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { QuizGenerator } from '@/components/content-creator/QuizGenerator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useQueryClient } from '@tanstack/react-query';
import type { CurriculumContext } from '@/components/content-creator/CurriculumStep';

interface AdminLessonEditorProps {
  onFinish?: () => void;
  onBack?: () => void;
  curriculumContext?: CurriculumContext | null;
}

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const ageGroups = ['3-5', '6-8', '9-12', '13-17', '18+'];

export const AdminLessonEditor: React.FC<AdminLessonEditorProps> = ({ onFinish, onBack, curriculumContext }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [showAIWizard, setShowAIWizard] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [filmstripCollapsed, setFilmstripCollapsed] = useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const [lessonTitle, setLessonTitle] = useState('Untitled Lesson');
  const [level, setLevel] = useState('A1');
  const [ageGroup, setAgeGroup] = useState('6-8');

  const [slides, setSlides] = useState<Slide[]>([
    { id: uuidv4(), order: 0, type: 'image', teacherNotes: '', keywords: [] },
  ]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(slides[0]?.id || null);
  const selectedSlide = slides.find((s) => s.id === selectedSlideId) || null;

  // Auto-load first lesson when curriculum context is provided
  useEffect(() => {
    if (!curriculumContext) return;
    
    const loadFirstLesson = async () => {
      try {
        let query = supabase
          .from('curriculum_lessons')
          .select('*')
          .eq('target_system', curriculumContext.system)
          .order('sequence_order', { ascending: true })
          .limit(1);
        
        if (curriculumContext.levelId) {
          query = query.eq('level_id', curriculumContext.levelId);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (data && data.length > 0) {
          handleSelectLesson(data[0]);
        }
        // Set level/ageGroup from context
        if (curriculumContext.level) setLevel(curriculumContext.level);
        if (curriculumContext.ageGroup) setAgeGroup(curriculumContext.ageGroup);
      } catch (err) {
        console.error('Auto-load lesson failed:', err);
      }
    };

    loadFirstLesson();
  }, [curriculumContext]);

  const handleSelectLesson = useCallback((lesson: any) => {
    setActiveLessonId(lesson.id);
    setLessonTitle(lesson.title || 'Untitled Lesson');
    setLevel(lesson.difficulty_level || 'A1');
    if (lesson.content && Array.isArray(lesson.content)) {
      const loadedSlides: Slide[] = lesson.content.map((s: any, idx: number) => ({
        id: s.id || uuidv4(), order: s.order ?? idx, type: s.type || 'image',
        imageUrl: s.imageUrl, videoUrl: s.videoUrl, quizQuestion: s.quizQuestion,
        quizOptions: s.quizOptions, pollQuestion: s.pollQuestion, pollOptions: s.pollOptions,
        teacherNotes: s.teacherNotes || '', keywords: s.keywords || [],
        title: s.title, canvasElements: s.canvasElements,
      }));
      setSlides(loadedSlides);
      setSelectedSlideId(loadedSlides[0]?.id || null);
    } else {
      const firstSlide: Slide = { id: uuidv4(), order: 0, type: 'image', teacherNotes: '', keywords: [] };
      setSlides([firstSlide]);
      setSelectedSlideId(firstSlide.id);
    }
    toast({ title: 'Lesson Loaded', description: `Editing "${lesson.title}"` });
  }, [toast]);

  const handleAddSlide = useCallback(() => {
    const newSlide: Slide = { id: uuidv4(), order: slides.length, type: 'image', teacherNotes: '', keywords: [] };
    setSlides((prev) => [...prev, newSlide]);
    setSelectedSlideId(newSlide.id);
  }, [slides.length]);

  const handleDeleteSlide = useCallback((id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
    if (selectedSlideId === id) setSelectedSlideId(slides[0]?.id !== id ? slides[0]?.id : slides[1]?.id || null);
  }, [selectedSlideId, slides]);

  const handleReorderSlides = useCallback((startIndex: number, endIndex: number) => {
    setSlides((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((s, i) => ({ ...s, order: i }));
    });
  }, []);

  const handleUpdateSlide = useCallback((updates: Partial<Slide>) => {
    if (!selectedSlideId) return;
    setSlides((prev) => prev.map((s) => (s.id === selectedSlideId ? { ...s, ...updates } : s)));
  }, [selectedSlideId]);

  const handleImageUploaded = useCallback((slideId: string, imageUrl: string) => {
    setSlides((prev) => prev.map((s) => (s.id === slideId ? { ...s, imageUrl } : s)));
  }, []);

  const handleAddElement = useCallback((type: CanvasElementType) => {
    const el = document.querySelector('[data-canvas-editor]') as any;
    if (el?.__addElement) el.__addElement(type);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeLessonId) {
        const { error } = await supabase.from('curriculum_lessons')
          .update({ content: slides.map(s => ({ ...s })) as any, updated_at: new Date().toISOString() })
          .eq('id', activeLessonId);
        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['curriculum-browser-units'] });
        toast({ title: 'Lesson Saved!', description: `"${lessonTitle}" with ${slides.length} slides saved.` });
      } else {
        toast({ title: 'No Lesson Selected', description: 'Select a lesson from curriculum browser.', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Save Failed', description: err.message, variant: 'destructive' });
    } finally { setIsSaving(false); }
  };

  const handlePublish = async () => {
    if (!activeLessonId) { toast({ title: 'No lesson selected', variant: 'destructive' }); return; }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('curriculum_lessons')
        .update({ content: slides.map(s => ({ ...s })) as any, is_published: true, updated_at: new Date().toISOString() })
        .eq('id', activeLessonId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['curriculum-browser-units'] });
      toast({ title: 'Lesson Published! 🎉', description: `"${lessonTitle}" is now in the library.` });
      onFinish?.();
    } catch (err: any) {
      toast({ title: 'Publish Failed', description: err.message, variant: 'destructive' });
    } finally { setIsSaving(false); }
  };

  const handleAILessonGenerated = useCallback((generatedSlides: Slide[], title: string, newLevel: string, newAgeGroup: string) => {
    setSlides(generatedSlides);
    setLessonTitle(title);
    setLevel(newLevel);
    setAgeGroup(newAgeGroup);
    setSelectedSlideId(generatedSlides[0]?.id || null);
    toast({ title: 'Lesson Generated!', description: `Created ${generatedSlides.length} slides.` });
  }, [toast]);

  return (
    <div className="h-full flex flex-col bg-background" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* ─── Top Action Bar ─── */}
      <div className="h-11 bg-card border-b border-border px-3 flex items-center gap-2 shrink-0">
        {onBack && (
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        <Input
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          className="max-w-[200px] h-7 text-sm font-semibold border-none shadow-none focus-visible:ring-0 px-1"
        />

        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-16 h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
        </Select>

        <Select value={ageGroup} onValueChange={setAgeGroup}>
          <SelectTrigger className="w-20 h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{ageGroups.map(a => <SelectItem key={a} value={a}>{a}y</SelectItem>)}</SelectContent>
        </Select>

        <div className="flex-1" />

        {/* Curriculum Browser Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
              <FolderOpen className="h-3.5 w-3.5" /> Curriculum
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-3 border-b border-border">
              <SheetTitle className="text-sm">Curriculum Browser</SheetTitle>
            </SheetHeader>
            <CurriculumBrowser activeLessonId={activeLessonId} onSelectLesson={handleSelectLesson} />
          </SheetContent>
        </Sheet>

        {/* Blueprint/Guide Drawer */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
              <ClipboardList className="h-3.5 w-3.5" /> Blueprint
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <Tabs defaultValue="blueprint" className="flex flex-col h-full">
              <TabsList className="w-full rounded-none border-b border-border bg-card shrink-0 h-9">
                <TabsTrigger value="blueprint" className="flex-1 gap-1 text-xs">
                  <ClipboardList className="h-3 w-3" /> Blueprint
                </TabsTrigger>
                <TabsTrigger value="guide" className="flex-1 gap-1 text-xs">
                  <BookOpen className="h-3 w-3" /> Guide
                </TabsTrigger>
              </TabsList>
              <TabsContent value="blueprint" className="flex-1 min-h-0 mt-0">
                <LessonBlueprint slides={slides} selectedSlideIndex={slides.findIndex(s => s.id === selectedSlideId)} onSelectSlide={(idx) => setSelectedSlideId(slides[idx]?.id || null)} />
              </TabsContent>
              <TabsContent value="guide" className="flex-1 min-h-0 mt-0">
                <TeacherGuide slide={selectedSlide} onUpdateSlide={handleUpdateSlide} />
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>

        {/* AI Buttons */}
        <AIActivityGenerator
          lessonContent={slides.map(s => s.title || '').join(' ')}
          level={level}
          onActivitiesGenerated={(newElements) => {
            if (selectedSlide) {
              handleUpdateSlide({ canvasElements: [...(selectedSlide.canvasElements || []), ...newElements] });
            }
          }}
        />

        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setShowAIWizard(true)}>
          <Wand2 className="h-3.5 w-3.5" /> AI
        </Button>

        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setShowPreview(true)}>
          <Eye className="h-3.5 w-3.5" /> Preview
        </Button>

        <Button size="sm" className="h-7 text-xs gap-1" onClick={handleSave} disabled={isSaving}>
          <Save className="h-3.5 w-3.5" /> {isSaving ? '...' : 'Save'}
        </Button>
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Collapsible Filmstrip with merged element toolbar */}
        <div className="flex shrink-0 h-full">
          {filmstripCollapsed ? (
            <div className="w-8 bg-card/50 border-r border-border flex flex-col items-center pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setFilmstripCollapsed(false)}
              >
                <PanelLeftOpen className="h-3.5 w-3.5" />
              </Button>
              <div className="mt-2 text-[9px] text-muted-foreground font-medium writing-vertical">
                {slides.findIndex(s => s.id === selectedSlideId) + 1}/{slides.length}
              </div>
            </div>
          ) : (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 z-10 h-5 w-5"
                onClick={() => setFilmstripCollapsed(true)}
              >
                <PanelLeftClose className="h-3 w-3" />
              </Button>
              <SlideFilmstrip
                slides={slides}
                selectedSlideId={selectedSlideId}
                onSelectSlide={setSelectedSlideId}
                onAddSlide={handleAddSlide}
                onDeleteSlide={handleDeleteSlide}
                onReorderSlides={handleReorderSlides}
                onImageUploaded={handleImageUploaded}
                onAddElement={handleAddElement}
              />
            </div>
          )}
        </div>

        {/* Center: Full Canvas */}
        <div className="flex-1 min-w-0" data-canvas-editor ref={canvasRef}>
          <EditorCanvas slide={selectedSlide} onUpdateSlide={handleUpdateSlide} />
        </div>
      </div>

      {/* ─── Bottom Pipeline Nav ─── */}
      {(onBack || onFinish) && (
        <div className="flex items-center justify-between px-6 py-2 border-t border-border bg-card shrink-0">
          {onBack ? (
            <Button variant="outline" onClick={onBack} className="gap-2" size="sm">
              <ArrowLeft className="h-4 w-4" /> Back: Curriculum
            </Button>
          ) : <div />}
          {onFinish && (
            <Button onClick={handlePublish} className="gap-2" size="sm" disabled={isSaving || !activeLessonId}>
              <CheckCircle className="h-4 w-4" /> Publish to Library <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <AILessonWizard open={showAIWizard} onOpenChange={setShowAIWizard} onLessonGenerated={handleAILessonGenerated} />
      <LessonPreviewDialog open={showPreview} onOpenChange={setShowPreview} slides={slides} lessonTitle={lessonTitle} />
    </div>
  );
};
