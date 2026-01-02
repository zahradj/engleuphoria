import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Users, GraduationCap, Wand2, Loader2, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { generatePPPLesson } from './generatePPPLesson';
import { WizardFormData, PPPLessonPlan } from './types';
import { Slide } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AILessonWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLessonGenerated: (slides: Slide[], title: string, level: string, ageGroup: string) => void;
}

const generationSteps = [
  { id: 1, label: 'Analyzing topic...', icon: BookOpen },
  { id: 2, label: 'Creating vocabulary slides...', icon: GraduationCap },
  { id: 3, label: 'Building interactive activities...', icon: Users },
  { id: 4, label: 'Generating images...', icon: Sparkles },
  { id: 5, label: 'Finalizing lesson plan...', icon: Check },
];

export function AILessonWizard({ open, onOpenChange, onLessonGenerated }: AILessonWizardProps) {
  const [formData, setFormData] = useState<WizardFormData>({
    topic: '',
    level: 'beginner',
    ageGroup: 'kids',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<PPPLessonPlan | null>(null);

  const handleGenerate = async () => {
    if (!formData.topic.trim()) return;

    setIsGenerating(true);
    setCurrentStep(0);

    // Simulate step-by-step generation with delays
    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Generate the lesson plan
    const plan = generatePPPLesson(formData);
    setGeneratedPlan(plan);

    // Short delay to show completion
    await new Promise(resolve => setTimeout(resolve, 400));

    setIsGenerating(false);
  };

  const handleApplyLesson = () => {
    if (!generatedPlan) return;

    // Convert generated slides to the editor's Slide format
    const editorSlides: Slide[] = generatedPlan.slides.map((gs, index) => {
      const slide: Slide = {
        id: gs.id,
        order: index,
        type: gs.type === 'quiz' ? 'quiz' : 'image',
        imageUrl: gs.imageUrl,
        title: gs.title,
        teacherNotes: gs.teacherNotes,
        keywords: gs.keywords,
      };

      // Add quiz-specific data
      if (gs.type === 'quiz' && gs.content?.quizQuestion) {
        slide.type = 'quiz';
        slide.quizQuestion = gs.content.quizQuestion;
        slide.quizOptions = gs.content.quizOptions?.map(opt => ({
          id: uuidv4(),
          text: opt.text,
          isCorrect: opt.isCorrect,
        }));
      }

      return slide;
    });

    // Map level to CEFR
    const levelMap: Record<string, string> = {
      beginner: 'A1',
      intermediate: 'B1',
      advanced: 'C1',
    };

    // Map age group
    const ageGroupMap: Record<string, string> = {
      kids: '6-8',
      teens: '12-15',
      adults: '18+',
    };

    onLessonGenerated(
      editorSlides,
      `${formData.topic} - PPP Lesson`,
      levelMap[formData.level] || 'A1',
      ageGroupMap[formData.ageGroup] || '6-8'
    );

    // Reset and close
    setGeneratedPlan(null);
    setFormData({ topic: '', level: 'beginner', ageGroup: 'kids' });
    onOpenChange(false);
  };

  const handleClose = () => {
    if (!isGenerating) {
      setGeneratedPlan(null);
      setFormData({ topic: '', level: 'beginner', ageGroup: 'kids' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            AI Lesson Wizard
          </DialogTitle>
          <DialogDescription>
            Generate a complete PPP (Presentation, Practice, Production) lesson in seconds.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isGenerating && !generatedPlan && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 py-4"
            >
              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium">
                  Lesson Topic
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Zoo Animals, Solar System, Present Continuous"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="h-12 text-base"
                />
              </div>

              {/* Level Select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Student Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                    setFormData({ ...formData, level: value })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">●</span> Beginner (A1-A2)
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediate">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">●</span> Intermediate (B1-B2)
                      </div>
                    </SelectItem>
                    <SelectItem value="advanced">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">●</span> Advanced (C1-C2)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Group Select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Age Group</Label>
                <Select
                  value={formData.ageGroup}
                  onValueChange={(value: 'kids' | 'teens' | 'adults') =>
                    setFormData({ ...formData, ageGroup: value })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kids">
                      <div className="flex items-center gap-2">
                        🧒 Kids (6-11 years)
                      </div>
                    </SelectItem>
                    <SelectItem value="teens">
                      <div className="flex items-center gap-2">
                        🎒 Teens (12-17 years)
                      </div>
                    </SelectItem>
                    <SelectItem value="adults">
                      <div className="flex items-center gap-2">
                        👔 Adults (18+ years)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!formData.topic.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                ✨ Generate Full Lesson
              </Button>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8"
            >
              <div className="flex flex-col items-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4"
                >
                  <Wand2 className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold">Creating Your Lesson</h3>
                <p className="text-sm text-muted-foreground">
                  Topic: {formData.topic}
                </p>
              </div>

              <div className="space-y-3">
                {generationSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isComplete = currentStep > step.id;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-100 dark:bg-purple-900/30'
                          : isComplete
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          isActive
                            ? 'bg-purple-500 text-white'
                            : isComplete
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isActive ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isComplete ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          isActive
                            ? 'text-purple-700 dark:text-purple-300 font-medium'
                            : isComplete
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {generatedPlan && !isGenerating && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-6"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
                >
                  <Check className="h-8 w-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Lesson Generated!</h3>
                <p className="text-muted-foreground">
                  {generatedPlan.slides.length} slides ready for "{generatedPlan.topic}"
                </p>
              </div>

              {/* Slides Preview */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium mb-3">Lesson Structure:</h4>
                <div className="space-y-2 text-sm">
                  {['presentation', 'practice', 'production'].map((phase) => {
                    const phaseSlides = generatedPlan.slides.filter(s => s.phase === phase);
                    return (
                      <div key={phase} className="flex items-center justify-between">
                        <span className="capitalize text-muted-foreground">{phase}</span>
                        <span className="font-medium">{phaseSlides.length} slides</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleApplyLesson}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Open in Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
