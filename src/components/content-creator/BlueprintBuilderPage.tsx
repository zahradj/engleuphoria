import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ArrowLeft, Sparkles, Loader2, Wand2, BookOpen, Pencil, MessageCircle,
  Headphones, Type, GraduationCap,
} from 'lucide-react';

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
type AgeGroup = 'kids' | 'teens' | 'adults';
type HubType = 'playground' | 'academy' | 'success';
type SkillFocus = 'Grammar' | 'Vocabulary' | 'Reading/Listening' | 'Speaking';

interface BlueprintLesson {
  lesson_id: string;
  title: string;
  skill_focus: SkillFocus;
  learning_objective: string;
}

interface BlueprintUnit {
  unit_title: string;
  theme: string;
  lessons: BlueprintLesson[];
}

interface Blueprint {
  curriculum_title: string;
  cefr_level: CEFRLevel;
  age_group: AgeGroup;
  hub: HubType;
  units: BlueprintUnit[];
}

const AGE_TO_HUB: Record<AgeGroup, HubType> = {
  kids: 'playground',
  teens: 'academy',
  adults: 'success',
};

const SKILL_META: Record<SkillFocus, { icon: React.ReactNode; gradient: string; ring: string }> = {
  Grammar: {
    icon: <Type className="h-3.5 w-3.5" />,
    gradient: 'from-violet-500/20 to-purple-500/20',
    ring: 'border-violet-500/40 text-violet-300',
  },
  Vocabulary: {
    icon: <BookOpen className="h-3.5 w-3.5" />,
    gradient: 'from-sky-500/20 to-blue-500/20',
    ring: 'border-sky-500/40 text-sky-300',
  },
  'Reading/Listening': {
    icon: <Headphones className="h-3.5 w-3.5" />,
    gradient: 'from-emerald-500/20 to-teal-500/20',
    ring: 'border-emerald-500/40 text-emerald-300',
  },
  Speaking: {
    icon: <MessageCircle className="h-3.5 w-3.5" />,
    gradient: 'from-amber-500/20 to-orange-500/20',
    ring: 'border-amber-500/40 text-amber-300',
  },
};

export const BlueprintBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B1');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('teens');
  const [unitCount, setUnitCount] = useState(4);
  const [lessonsPerUnit, setLessonsPerUnit] = useState(4);
  const [themeHint, setThemeHint] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);

  const hub = AGE_TO_HUB[ageGroup];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setBlueprint(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-curriculum-blueprint', {
        body: {
          cefr_level: cefrLevel,
          age_group: ageGroup,
          unit_count: unitCount,
          lessons_per_unit: lessonsPerUnit,
          theme_hint: themeHint.trim(),
          hub,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.details || data.error);

      setBlueprint(data as Blueprint);
      toast.success(
        `Blueprint ready: ${data.units?.length || 0} units · ${
          (data.units || []).reduce((s: number, u: BlueprintUnit) => s + u.lessons.length, 0)
        } lessons`,
      );
    } catch (err: any) {
      console.error('Blueprint error:', err);
      toast.error(err?.message || 'Failed to generate curriculum blueprint.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Hand off to the Master PPP Wizard with lesson context
  const buildSlides = (unit: BlueprintUnit, lesson: BlueprintLesson) => {
    if (!blueprint) return;
    navigate('/content-creator', {
      state: {
        fromBlueprint: true,
        cefr_level: blueprint.cefr_level,
        hub: blueprint.hub,
        topic: lesson.title,
        skill_focus: lesson.skill_focus,
        learning_objective: lesson.learning_objective,
        unit_title: unit.unit_title,
        unit_theme: unit.theme,
        curriculum_title: blueprint.curriculum_title,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/content-creator')}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="hidden sm:block h-6 w-px bg-border/50" />
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-sky-400" />
            <h1 className="text-lg font-bold tracking-tight">4-Skills Curriculum Blueprint</h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 p-6">
        {/* Inputs */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-5 space-y-5 shadow-lg">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-sky-400" />
              <h2 className="font-bold tracking-tight">Curriculum Inputs</h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CEFR Level</label>
              <Select value={cefrLevel} onValueChange={(v) => setCefrLevel(v as CEFRLevel)}>
                <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 — Absolute Beginner</SelectItem>
                  <SelectItem value="A2">A2 — Elementary</SelectItem>
                  <SelectItem value="B1">B1 — Intermediate</SelectItem>
                  <SelectItem value="B2">B2 — Upper-Intermediate</SelectItem>
                  <SelectItem value="C1">C1 — Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Age Group</label>
              <Select value={ageGroup} onValueChange={(v) => setAgeGroup(v as AgeGroup)}>
                <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kids">Kids (4–9) · Playground</SelectItem>
                  <SelectItem value="teens">Teens (12–17) · Academy</SelectItem>
                  <SelectItem value="adults">Adults (18+) · Success Hub</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Units</label>
                <Input
                  type="number" min={1} max={10} value={unitCount}
                  onChange={(e) => setUnitCount(Math.max(1, Math.min(10, +e.target.value || 1)))}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Lessons / Unit</label>
                <Input
                  type="number" min={1} max={8} value={lessonsPerUnit}
                  onChange={(e) => setLessonsPerUnit(Math.max(1, Math.min(8, +e.target.value || 1)))}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Theme hint (optional)
              </label>
              <Input
                placeholder="e.g. Travel & culture, career growth…"
                value={themeHint}
                onChange={(e) => setThemeHint(e.target.value)}
                maxLength={200}
                className="bg-background/50"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500 hover:from-sky-600 hover:to-blue-600 text-white border-0"
            >
              {isGenerating ? (
                <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Generating Blueprint…</>
              ) : (
                <><Sparkles className="h-5 w-5 mr-2" />Generate 4-Skills Blueprint</>
              )}
            </Button>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Lessons rotate through <strong>Grammar → Vocabulary → Reading/Listening → Speaking</strong> for balanced 4-skills coverage.
            </p>
          </div>
        </aside>

        {/* Output */}
        <main className="min-w-0 space-y-6">
          {!blueprint && !isGenerating && (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
              <h3 className="font-bold text-lg">Your curriculum blueprint will appear here</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pick a level, age group and size, then generate. Each lesson gets a "Build Slides" handoff to the AI Wizard.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-12 text-center">
              <Loader2 className="h-10 w-10 mx-auto animate-spin text-sky-400 mb-3" />
              <h3 className="font-bold text-lg">Designing your 4-skills curriculum…</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Themed units, balanced skill rotation, observable objectives.
              </p>
            </div>
          )}

          {blueprint && (
            <>
              <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  {blueprint.cefr_level} · {blueprint.age_group} · {blueprint.hub}
                </span>
                <h2 className="text-2xl font-bold tracking-tight mt-1">{blueprint.curriculum_title}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {blueprint.units.length} units · {blueprint.units.reduce((s, u) => s + u.lessons.length, 0)} lessons · 4-skills rotation
                </p>
              </div>

              <Accordion
                type="multiple"
                defaultValue={blueprint.units.map((_, i) => `unit-${i}`)}
                className="space-y-3"
              >
                {blueprint.units.map((unit, ui) => (
                  <AccordionItem
                    key={ui}
                    value={`unit-${ui}`}
                    className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-md overflow-hidden"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline">
                      <div className="flex items-center gap-3 text-left min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow">
                          <span className="text-white text-sm font-bold">{ui + 1}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold tracking-tight truncate">{unit.unit_title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            🎯 Theme: {unit.theme} · {unit.lessons.length} lessons
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {unit.lessons.map((lesson, li) => {
                          const meta = SKILL_META[lesson.skill_focus] || SKILL_META.Grammar;
                          return (
                            <article
                              key={lesson.lesson_id}
                              className={`rounded-xl border bg-gradient-to-br ${meta.gradient} ${meta.ring} p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                                  Lesson {li + 1}
                                </span>
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${meta.ring} bg-background/40`}>
                                  {meta.icon}
                                  {lesson.skill_focus}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-2">
                                  {lesson.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3">
                                  {lesson.learning_objective}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => buildSlides(unit, lesson)}
                                className="mt-auto h-8 text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                              >
                                <Pencil className="h-3 w-3 mr-1.5" />
                                Build Slides
                              </Button>
                            </article>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BlueprintBuilderPage;
