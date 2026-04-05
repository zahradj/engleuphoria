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
import { Slide, CanvasElementData } from '../types';
import { HUB_CONFIGS, resolveHub } from './hubConfig';
import { v4 as uuidv4 } from 'uuid';

interface AILessonWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLessonGenerated: (slides: Slide[], title: string, level: string, ageGroup: string) => void;
}

const generationSteps = [
  { id: 1, label: 'Analyzing topic & hub...', icon: BookOpen },
  { id: 2, label: 'Creating vocabulary slides...', icon: GraduationCap },
  { id: 3, label: 'Building hub-specific activities...', icon: Users },
  { id: 4, label: 'Generating media prompts...', icon: Sparkles },
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

    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    const plan = generatePPPLesson(formData);
    setGeneratedPlan(plan);

    await new Promise(resolve => setTimeout(resolve, 400));
    setIsGenerating(false);
  };

  const handleApplyLesson = () => {
    if (!generatedPlan) return;

    const hubConfig = HUB_CONFIGS[generatedPlan.lessonMeta.hub];
    const colors = hubConfig.colorPalette;

    const editorSlides: Slide[] = generatedPlan.slides.map((gs, index) => {
      const els: CanvasElementData[] = [];
      let z = 1;

      const txt = (x: number, y: number, w: number, h: number, text: string, fontSize: number, color: string, bold = false, align: 'left' | 'center' = 'left'): CanvasElementData => ({
        id: uuidv4(), elementType: 'text', x, y, width: w, height: h, rotation: 0, zIndex: z++,
        content: { text, fontSize, bold, italic: false, align, color },
      });

      const shape = (x: number, y: number, w: number, h: number, fill: string, opacity = 0.5): CanvasElementData => ({
        id: uuidv4(), elementType: 'shape', x, y, width: w, height: h, rotation: 0, zIndex: z++,
        content: { shape: 'rounded', fill, opacity },
      });

      const pip = (x: number, y: number, anim = 'idle'): CanvasElementData => ({
        id: uuidv4(), elementType: 'character', x, y, width: 200, height: 240, rotation: 0, zIndex: z++,
        content: { name: 'pip', animation: anim, src: '/pip-mascot.png', speechBubble: '' },
      });

      const img = (x: number, y: number, w: number, h: number, src: string, alt: string): CanvasElementData => ({
        id: uuidv4(), elementType: 'image', x, y, width: w, height: h, rotation: 0, zIndex: z++,
        content: { src, alt },
      });

      // Phase badge colors by slideType
      const slideTypeColors: Record<string, string> = {
        hook: '#ef4444',
        warmup: '#f59e0b',
        vocabulary: colors.accent,
        core_concept: colors.primary,
        dialogue: '#0891b2',
        activity: '#059669',
        game: '#dc2626',
        speaking: '#d946ef',
        creative: '#ec4899',
        summary: '#0284c7',
        review: '#0284c7',
        goodbye: '#f97316',
      };
      const badgeColor = slideTypeColors[gs.slideType] || colors.primary;
      els.push(shape(40, 30, 300, 42, badgeColor, 0.9));
      els.push(txt(55, 36, 280, 32, gs.phaseLabel, 16, '#ffffff', true));

      // Hub badge (top-right)
      els.push(shape(1600, 30, 260, 36, colors.primary, 0.7));
      els.push(txt(1615, 35, 230, 28, `${hubConfig.emoji} ${hubConfig.label}`, 13, '#ffffff', true));

      // Title
      els.push(txt(120, 90, 1680, 70, gs.title, hubConfig.hub === 'professional' ? 36 : 42, colors.text, true, 'center'));

      // Image on right side
      if (gs.imageUrl && gs.type !== 'matching') {
        els.push(img(1200, 200, 600, 400, gs.imageUrl, gs.imageKeywords || gs.title));
      }

      // Content by slide type
      switch (gs.type) {
        case 'title': {
          if (gs.content?.prompt) {
            els.push(shape(120, 200, 1000, 400, colors.highlight, 0.5));
            const lines = gs.content.prompt.split('\n').filter(Boolean);
            lines.forEach((line: string, i: number) => {
              els.push(txt(160, 220 + i * 48, 920, 44, line, hubConfig.hub === 'professional' ? 20 : 24, colors.text));
            });
          }
          if (hubConfig.mascot) els.push(pip(1500, 620, 'wave'));
          break;
        }
        case 'vocabulary': {
          els.push(shape(100, 180, 1000, 500, colors.highlight, 0.4));
          els.push(txt(140, 200, 920, 80, gs.content?.word || '', 72, colors.primary, true, 'center'));
          els.push(txt(140, 310, 920, 50, gs.content?.definition || '', 26, colors.text, false, 'center'));
          if (gs.content?.sentence) {
            els.push(shape(200, 400, 800, 60, colors.secondary + '33', 0.4));
            els.push(txt(220, 408, 760, 50, `"${gs.content.sentence}"`, 22, colors.accent, false, 'center'));
          }
          // Media type label
          els.push(shape(140, 490, 200, 30, colors.secondary, 0.3));
          els.push(txt(150, 494, 180, 24, `📷 ${gs.mediaType}`, 12, colors.text));
          if (hubConfig.mascot) els.push(pip(140, 550, 'jump'));
          break;
        }
        case 'fill-blank': {
          els.push(shape(100, 200, 1000, 300, colors.highlight, 0.5));
          els.push(txt(160, 220, 880, 40, 'Complete the sentence:', 22, colors.primary, true));
          els.push(txt(160, 290, 880, 60, gs.content?.sentence || '', 36, colors.text, true, 'center'));
          els.push(shape(160, 380, 880, 50, colors.secondary + '33', 0.6));
          els.push(txt(180, 388, 840, 40, `Answer: ${gs.content?.blankWord || ''}`, 20, colors.accent));
          if (gs.activityType) {
            els.push(shape(160, 450, 200, 30, colors.primary, 0.3));
            els.push(txt(170, 454, 180, 24, `🎯 ${gs.activityType}`, 12, '#ffffff'));
          }
          break;
        }
        case 'drag-drop': {
          els.push(shape(100, 180, 1720, 580, colors.highlight, 0.3));
          els.push(txt(160, 200, 600, 40, '🎯 Drag each word to its match!', 24, colors.primary, true));
          const items = gs.content?.dragItems || [];
          items.forEach((item: any, i: number) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            // Source (left)
            els.push(shape(160 + col * 450, 280 + row * 140, 180, 50, colors.primary, 0.7));
            els.push(txt(170 + col * 450, 290 + row * 140, 160, 40, item.text, 22, '#ffffff', true, 'center'));
            // Target (right)
            els.push(shape(370 + col * 450, 280 + row * 140, 220, 50, colors.secondary + '33', 0.5));
            els.push(txt(380 + col * 450, 290 + row * 140, 200, 40, item.target, 16, colors.text, false, 'center'));
          });
          if (hubConfig.mascot) els.push(pip(1550, 620, 'bounce'));
          break;
        }
        case 'matching': {
          els.push(shape(100, 180, 1720, 580, colors.highlight, 0.3));
          els.push(txt(160, 200, 400, 40, hubConfig.hub === 'playground' ? 'Match the pictures! 🎨' : 'Match the terms!', 22, colors.primary, true));
          const pairs = gs.content?.matchPairs || [];
          pairs.forEach((p: any, i: number) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            els.push(shape(160 + col * 450, 280 + row * 200, 400, 160, colors.highlight, 0.7));
            els.push(txt(180 + col * 450, 300 + row * 200, 360, 50, p.word, 28, colors.primary, true, 'center'));
            if (p.image) {
              els.push(img(1060 + col * 350, 280 + row * 200, 300, 160, p.image, p.word));
            }
          });
          if (hubConfig.mascot) els.push(pip(1550, 620, 'jump'));
          break;
        }
        case 'roleplay': {
          els.push(shape(100, 200, 1000, 480, colors.highlight, 0.4));
          if (gs.content?.prompt) {
            const lines = gs.content.prompt.split('\n').filter(Boolean);
            lines.forEach((line: string, i: number) => {
              const isDialogue = line.includes(':');
              els.push(txt(160, 230 + i * 42, 920, 40, line, isDialogue ? 22 : 20, isDialogue ? colors.text : colors.accent, isDialogue));
            });
          }
          if (gs.content?.caseStudy) {
            els.push(shape(120, 550, 960, 80, colors.secondary + '22', 0.5));
            els.push(txt(140, 558, 920, 60, `📋 ${gs.content.caseStudy}`, 16, colors.text));
          }
          if (hubConfig.mascot) els.push(pip(1500, 550, 'wave'));
          break;
        }
        case 'quiz': {
          els.push(shape(100, 200, 1000, 500, colors.highlight, 0.5));
          els.push(txt(160, 220, 880, 50, gs.content?.quizQuestion || '', 28, colors.primary, true));
          const opts = gs.content?.quizOptions || [];
          const optColors = [colors.highlight, colors.secondary + '33', colors.primary + '22', colors.accent + '22'];
          opts.forEach((opt: any, i: number) => {
            els.push(shape(180, 300 + i * 80, 860, 65, optColors[i % 4], 0.6));
            els.push(txt(220, 312 + i * 80, 780, 45, `${String.fromCharCode(65 + i)}. ${opt.text}`, 22, colors.text, false));
          });
          break;
        }
        default: {
          if (gs.content?.prompt) {
            els.push(shape(100, 200, 1000, 400, colors.highlight, 0.4));
            const lines = gs.content.prompt.split('\n').filter(Boolean);
            lines.forEach((line: string, i: number) => {
              els.push(txt(160, 230 + i * 42, 920, 40, line, 22, colors.text));
            });
          }
          if (hubConfig.mascot) els.push(pip(1500, 600, 'idle'));
          break;
        }
      }

      // Animation label (bottom-right) for non-static
      if (gs.animation && gs.animation !== 'none') {
        els.push(shape(1640, 750, 200, 28, colors.secondary, 0.3));
        els.push(txt(1650, 753, 180, 24, `✨ ${gs.animation}`, 11, colors.text));
      }

      const editorSlide: Slide = {
        id: gs.id,
        order: index,
        type: gs.type === 'quiz' ? 'quiz' : 'image',
        imageUrl: gs.imageUrl,
        title: gs.title,
        teacherNotes: gs.teacherNotes,
        keywords: gs.keywords,
        canvasElements: els,
      };

      if (gs.type === 'quiz' && gs.content?.quizQuestion) {
        editorSlide.quizQuestion = gs.content.quizQuestion;
        editorSlide.quizOptions = gs.content.quizOptions?.map((opt: any) => ({
          id: uuidv4(), text: opt.text, isCorrect: opt.isCorrect,
        }));
      }

      return editorSlide;
    });

    const levelMap: Record<string, string> = { beginner: 'A1', intermediate: 'B1', advanced: 'C1' };
    const ageGroupMap: Record<string, string> = { kids: '6-8', teens: '12-15', adults: '18+' };

    onLessonGenerated(
      editorSlides,
      generatedPlan.lessonMeta.title,
      levelMap[formData.level] || 'A1',
      ageGroupMap[formData.ageGroup] || '6-8'
    );

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

  const currentHub = HUB_CONFIGS[resolveHub(formData.ageGroup)];

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
            Generate a hub-adaptive PPP lesson with interactive slides.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isGenerating && !generatedPlan && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5 py-4"
            >
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium">Lesson Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Hello Pip, Zoo Animals, Business Negotiations"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="h-12 text-base"
                />
              </div>

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

              <div className="space-y-2">
                <Label className="text-sm font-medium">Target Hub</Label>
                <Select
                  value={formData.ageGroup}
                  onValueChange={(value: 'kids' | 'teens' | 'adults') =>
                    setFormData({ ...formData, ageGroup: value })
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select hub" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kids">
                      <div className="flex items-center gap-2">
                        🛝 Playground — Kids (6-11)
                      </div>
                    </SelectItem>
                    <SelectItem value="teens">
                      <div className="flex items-center gap-2">
                        🏫 Academy — Teens (12-17)
                      </div>
                    </SelectItem>
                    <SelectItem value="adults">
                      <div className="flex items-center gap-2">
                        🏢 Professional — Adults (18+)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hub Preview Card */}
              <div className="rounded-lg border p-3 text-sm" style={{ borderColor: currentHub.colorPalette.primary + '44' }}>
                <div className="flex items-center gap-2 font-medium mb-1">
                  {currentHub.emoji} {currentHub.label}
                </div>
                <p className="text-muted-foreground text-xs mb-2">{currentHub.tone}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">📷 {currentHub.mediaType}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">✨ {currentHub.defaultAnimation}</span>
                  {currentHub.permittedActivities.slice(0, 2).map(a => (
                    <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-muted">🎯 {a.replace(/_/g, ' ')}</span>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!formData.topic.trim()}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                ✨ Generate {currentHub.label} Lesson
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
                <h3 className="text-lg font-semibold">Creating {currentHub.label} Lesson</h3>
                <p className="text-sm text-muted-foreground">Topic: {formData.topic}</p>
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
                        isActive ? 'bg-purple-100 dark:bg-purple-900/30'
                          : isComplete ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isActive ? 'bg-purple-500 text-white'
                          : isComplete ? 'bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {isActive ? <Loader2 className="h-4 w-4 animate-spin" />
                          : isComplete ? <Check className="h-4 w-4" />
                          : <Icon className="h-4 w-4" />}
                      </div>
                      <span className={`text-sm ${
                        isActive ? 'text-purple-700 dark:text-purple-300 font-medium'
                          : isComplete ? 'text-green-700 dark:text-green-300'
                          : 'text-muted-foreground'
                      }`}>{step.label}</span>
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
                  {generatedPlan.slides.length} slides for "{generatedPlan.topic}"
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {HUB_CONFIGS[generatedPlan.lessonMeta.hub].emoji} {generatedPlan.lessonMeta.hub.toUpperCase()} • {generatedPlan.lessonMeta.level} • {generatedPlan.lessonMeta.estimatedMinutes} min
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium mb-3">Lesson Structure:</h4>
                <div className="space-y-2 text-sm">
                  {['presentation', 'practice', 'production'].map((phase) => {
                    const phaseSlides = generatedPlan.slides.filter(s => s.phase === phase);
                    const emoji = phase === 'presentation' ? '📖' : phase === 'practice' ? '✏️' : '🎤';
                    return (
                      <div key={phase} className="flex items-center justify-between">
                        <span className="capitalize text-muted-foreground">{emoji} {phase}</span>
                        <span className="font-medium">{phaseSlides.length} slides</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 mb-6 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Media type:</span>
                  <span>📷 {HUB_CONFIGS[generatedPlan.lessonMeta.hub].mediaType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Animation:</span>
                  <span>✨ {HUB_CONFIGS[generatedPlan.lessonMeta.hub].defaultAnimation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activities:</span>
                  <span>{HUB_CONFIGS[generatedPlan.lessonMeta.hub].permittedActivities.map(a => a.replace(/_/g, ' ')).join(', ')}</span>
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
