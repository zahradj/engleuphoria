import React, { useState, useCallback } from "react";
import { SlideMaster } from "@/components/slides/SlideMaster";
import { LessonSlides, Slide, ActivityResult } from "@/types/slides";
import { lessonSlidesService } from "@/services/lessonSlidesService";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface LessonSlideViewerProps {
  slides: any[];
  title: string;
  className?: string;
  lessonId?: string;
  studentId?: string;
  isTeacher?: boolean;
}

export function LessonSlideViewer({ 
  slides, 
  title, 
  className = "", 
  lessonId,
  studentId,
  isTeacher = false 
}: LessonSlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  

  // Convert legacy slides to new format if needed
  const convertedSlides = convertLegacySlidesToNew(slides, title);
  const lessonSlides: LessonSlides | null = convertedSlides;

  const handleNext = useCallback(() => {
    if (lessonSlides && currentSlide < lessonSlides.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      resetSlideState();
    }
  }, [currentSlide, lessonSlides]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      resetSlideState();
    }
  }, [currentSlide]);

  const resetSlideState = () => {
    setSelectedOptions([]);
    setShowFeedback(false);
    setIsCorrect(false);
    setStartTime(Date.now());
    setAttempts(0);
  };

  const handleOptionSelect = useCallback((optionId: string) => {
    if (showFeedback) return;

    const slide = lessonSlides?.slides[currentSlide];
    if (!slide) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Handle multiple choice vs single choice
    let newSelectedOptions: string[];
    if (Array.isArray(slide.correct)) {
      // Multiple choice
      newSelectedOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
    } else {
      // Single choice
      newSelectedOptions = [optionId];
    }

    setSelectedOptions(newSelectedOptions);

    // Check if answer is correct - support both slide.correct and option.isCorrect
    let correctAnswers: string[] = [];
    
    if (slide.correct) {
      correctAnswers = Array.isArray(slide.correct) ? slide.correct : [slide.correct];
    } else if (slide.options) {
      // Fallback: derive correct answers from options marked as correct
      correctAnswers = slide.options.filter(opt => opt.isCorrect).map(opt => opt.id);
    }
    
    const isAnswerCorrect = correctAnswers.length > 0 && 
      correctAnswers.length === newSelectedOptions.length &&
      correctAnswers.every(answer => newSelectedOptions.includes(answer));

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    // Log activity result
    if (studentId && lessonId) {
      const timeMs = Date.now() - startTime;
      const result: ActivityResult = {
        itemId: slide.id,
        correct: isAnswerCorrect,
        timeMs,
        attempts: newAttempts,
        tags: [slide.type],
        cefr: lessonSlides?.metadata.CEFR || 'A1',
        accuracyPercent: isAnswerCorrect ? 100 : 0
      };

      handleActivityResult(result);
    }

    // Auto-advance after feedback
    setTimeout(() => {
      if (isAnswerCorrect && currentSlide < (lessonSlides?.slides.length || 0) - 1) {
        handleNext();
      }
    }, 2000);
  }, [showFeedback, selectedOptions, attempts, startTime, studentId, lessonId, currentSlide, lessonSlides, handleNext]);

  const handleActivityResult = async (result: ActivityResult) => {
    try {
      if (studentId) {
        await lessonSlidesService.saveActivityResult(result);
        await lessonSlidesService.saveAILearningEvent(result, studentId);
      }

      // Show toast feedback
      if (result.correct) {
        toast.success("Great job! ✨", {
          description: `You got it right in ${result.attempts} ${result.attempts === 1 ? 'try' : 'tries'}!`
        });
      } else {
        toast.info("Keep trying! 💪", {
          description: "You're learning and that's what matters!"
        });
      }
    } catch (error) {
      console.error('Failed to save activity result:', error);
    }
  };

  if (!lessonSlides || !lessonSlides.slides || lessonSlides.slides.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center min-h-[400px]`}>
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-muted-foreground">No slides available</h3>
          <p className="text-muted-foreground">This lesson doesn't have any slides to display.</p>
          <Badge variant="outline" className="mt-4">
            Input type: {typeof slides}
          </Badge>
          <div className="mt-2 text-xs text-muted-foreground">
            Raw slides: {JSON.stringify(slides, null, 2).slice(0, 200)}...
          </div>
        </Card>
      </div>
    );
  }

  const currentSlideData = lessonSlides.slides[currentSlide];

  return (
    <div className={`${className} h-full`}>
      <SlideMaster
        slide={currentSlideData}
        currentSlide={currentSlide}
        totalSlides={lessonSlides.slides.length}
        isTeacher={isTeacher}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onOptionSelect={handleOptionSelect}
        selectedOptions={selectedOptions}
        showFeedback={showFeedback}
        isCorrect={isCorrect}
        timeElapsed={Math.floor((Date.now() - startTime) / 1000)}
        level={lessonSlides.metadata.CEFR}
      />
    </div>
  );
}

function convertLegacySlidesToNew(slides: any, title: string): LessonSlides | null {
  console.log('🔄 Converting slides:', slides);
  
  if (!slides) return null;

  // Check if already in LessonSlides format (v2.0)
  if (slides.version === '2.0' && slides.slides) {
    console.log('✅ Already in v2.0 format');
    return slides as LessonSlides;
  }

  // Handle LessonSlidesViewer format (different schema)
  if (slides.slides && Array.isArray(slides.slides)) {
    console.log('🔄 Converting from LessonSlidesViewer format');
    const convertedSlides: Slide[] = slides.slides.map((slide: any, index: number) => ({
      id: slide.id || `slide-${index + 1}`,
      type: mapLegacyTypeToNew(slide.activity_type || 'default'),
      prompt: slide.title || `Slide ${index + 1}`,
      instructions: slide.content || slide.teacher_notes || "Follow the instructions on screen",
      options: slide.interactive_elements?.map((element: string, optIndex: number) => ({
        id: `opt-${optIndex}`,
        text: element,
        isCorrect: false
      })),
      timeLimit: slide.duration ? slide.duration * 60 : undefined,
      accessibility: {
        largeText: true
      }
    }));

    return {
      version: '2.0',
      theme: 'mist-blue',
      slides: convertedSlides,
      durationMin: slides.total_duration || 30,
      metadata: {
        CEFR: 'A1',
        module: 1,
        lesson: 1,
        targets: ["lesson content"],
        weights: {
          accuracy: 60,
          fluency: 40
        }
      }
    };
  }

  // Handle legacy array format
  if (Array.isArray(slides)) {
    console.log('🔄 Converting from legacy array format');
    const convertedSlides: Slide[] = slides.map((slide, index) => ({
      id: slide.id || `slide-${index + 1}`,
      type: mapLegacyTypeToNew(slide.type || 'default'),
      prompt: slide.title || slide.content?.title || `Slide ${index + 1}`,
      instructions: slide.content?.instructions || slide.teacher_notes || "Follow the instructions on screen",
      media: slide.content?.image ? {
        type: 'image' as const,
        url: slide.content.image,
        alt: slide.content?.alt || "Lesson image"
      } : undefined,
      options: slide.content?.options?.map((opt: any, optIndex: number) => ({
        id: opt.id || `opt-${optIndex}`,
        text: typeof opt === 'string' ? opt : (opt.text || opt.label),
        isCorrect: opt.isCorrect || opt.correct || false
      })),
      correct: slide.content?.correct || (slide.content?.options?.find((opt: any) => opt.isCorrect)?.id),
      timeLimit: slide.duration ? slide.duration * 60 : undefined,
      accessibility: {
        screenReaderText: slide.content?.accessibleDescription,
        largeText: true
      }
    }));

    return {
      version: '2.0',
      theme: 'mist-blue',
      slides: convertedSlides,
      durationMin: 30,
      metadata: {
        CEFR: 'A1',
        module: 1,
        lesson: 1,
        targets: ["sentence building"],
        weights: {
          accuracy: 60,
          fluency: 40
        }
      }
    };
  }

  console.log('❌ Unable to convert slides format');
  return null;
}

function mapLegacyTypeToNew(legacyType: string): Slide['type'] {
  const typeMap: Record<string, Slide['type']> = {
    'title': 'warmup',
    'objectives': 'target_language',
    'vocabulary': 'target_language',
    'activity': 'sentence_builder',
    'practice': 'accuracy_mcq',
    'speaking': 'communicative_task',
    'conclusion': 'exit_check',
    'default': 'target_language'
  };

  return typeMap[legacyType] || 'target_language';
}