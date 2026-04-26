import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Sparkles, Loader2, ArrowLeft, Save, ImageOff, BookOpen, Check,
  GraduationCap, Wand2, Pencil,
} from 'lucide-react';
import { handleAIResponse, showAIErrorToast } from '@/lib/aiErrorHandler';

// ─── Types matching the upgraded edge function ─────────────────────────
type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
type HubType = 'playground' | 'academy' | 'success';
type Phase = 'warm-up' | 'presentation' | 'practice' | 'production' | 'review';

interface PPPSlide {
  phase?: Phase;
  ppp_stage?: string;
  slide_type?: string;
  interaction_type?: string;
  title?: string;
  headline?: string;
  content?: string;
  body_text?: string;
  visual_keyword?: string;
  visual_search_keyword?: string;
  teacher_instructions?: string;
  teacher_notes?: any;
  interactive_options?: string[];
  video_url?: string | null;
}

interface PPPLesson {
  lesson_title: string;
  target_goal?: string;
  target_grammar?: string;
  target_vocabulary?: string;
  roadmap?: string[];
  slides: PPPSlide[];
}

// ─── Hub <-> CEFR defaults ─────────────────────────────────────────────
const HUB_DEFAULT_CEFR: Record<HubType, CEFRLevel> = {
  playground: 'A1',
  academy: 'B1',
  success: 'C1',
};

const HUB_LABEL: Record<HubType, string> = {
  playground: 'Playground (Kids 4–9, 30 min)',
  academy: 'Academy (Teens 12–17, 60 min)',
  success: 'Success Hub (Adults 18+, 60 min)',
};

const HUB_TARGET_SYSTEM: Record<HubType, string> = {
  playground: 'playground',
  academy: 'teens',
  success: 'adults',
};

const HUB_DIFFICULTY: Record<HubType, string> = {
  playground: 'beginner',
  academy: 'intermediate',
  success: 'advanced',
};

const HUB_DURATION: Record<HubType, number> = {
  playground: 30,
  academy: 60,
  success: 60,
};

const ROADMAP_PHASES: Phase[] = ['warm-up', 'presentation', 'practice', 'production', 'review'];

const PHASE_LABEL: Record<Phase, string> = {
  'warm-up': 'Warm-up',
  presentation: 'Presentation',
  practice: 'Practice',
  production: 'Production',
  review: 'Review',
};

// Each phase gets a distinct accent so the roadmap reads as a journey.
const PHASE_ACCENT: Record<Phase, string> = {
  'warm-up': 'from-amber-500/30 to-orange-500/30 border-amber-500/50 text-amber-100',
  presentation: 'from-sky-500/30 to-blue-500/30 border-sky-500/50 text-sky-100',
  practice: 'from-violet-500/30 to-purple-500/30 border-violet-500/50 text-violet-100',
  production: 'from-emerald-500/30 to-teal-500/30 border-emerald-500/50 text-emerald-100',
  review: 'from-rose-500/30 to-pink-500/30 border-rose-500/50 text-rose-100',
};

// Normalize whatever phase string the AI returns into our 5 canonical phases.
const normalizePhase = (s?: string): Phase => {
  const v = (s || '').toLowerCase().replace(/\s+/g, '-').replace('warmup', 'warm-up');
  if (v.startsWith('warm')) return 'warm-up';
  if (v.startsWith('pres')) return 'presentation';
  if (v.startsWith('prac')) return 'practice';
  if (v.startsWith('prod')) return 'production';
  if (v.startsWith('rev')) return 'review';
  return 'presentation';
};

// Build an Unsplash Source URL from the AI keyword (free, no API key needed).
const unsplashUrl = (keyword?: string) => {
  const safe = (keyword || 'classroom-english').trim().replace(/\s+/g, '-');
  return `https://source.unsplash.com/1024x768/?${encodeURIComponent(safe)}`;
};

// ─── Component ─────────────────────────────────────────────────────────
interface BlueprintHandoff {
  fromBlueprint?: boolean;
  cefr_level?: CEFRLevel;
  hub?: HubType;
  topic?: string;
  skill_focus?: string;
  learning_objective?: string;
  unit_title?: string;
  unit_theme?: string;
  curriculum_title?: string;
}

export const MasterPPPWizard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handoff = (location.state || {}) as BlueprintHandoff;
  const { user } = useAuth();
  const userRole = (user as any)?.role;

  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>(handoff.cefr_level || 'B1');
  const [hub, setHub] = useState<HubType>(handoff.hub || 'academy');
  const [topic, setTopic] = useState(handoff.topic || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lesson, setLesson] = useState<PPPLesson | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const autoTriggered = useRef(false);

  // Role guard — only admins & content creators
  if (userRole !== 'admin' && userRole !== 'content_creator') {
    return (
      <div className="p-6 text-center text-muted-foreground">
        This wizard is restricted to admins and content creators.
      </div>
    );
  }

  // Group slides by phase for the cards section.
  const slidesByPhase = useMemo(() => {
    if (!lesson?.slides) return {} as Record<Phase, Array<{ slide: PPPSlide; idx: number }>>;
    const out: Record<Phase, Array<{ slide: PPPSlide; idx: number }>> = {
      'warm-up': [], presentation: [], practice: [], production: [], review: [],
    };
    lesson.slides.forEach((slide, idx) => {
      const phase = normalizePhase(slide.phase || slide.ppp_stage);
      out[phase].push({ slide, idx });
    });
    return out;
  }, [lesson]);

  // If we arrived from the Blueprint with a lesson topic, auto-trigger generation once.
  useEffect(() => {
    if (
      handoff.fromBlueprint &&
      handoff.topic &&
      !autoTriggered.current &&
      !lesson &&
      !isGenerating
    ) {
      autoTriggered.current = true;
      setTimeout(() => handleGenerate(), 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handoff.fromBlueprint, handoff.topic]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a lesson topic.');
      return;
    }

    setIsGenerating(true);
    setLesson(null);
    setEditingIdx(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-lesson-plan', {
        body: {
          hub,
          cefr_level: cefrLevel,
          topic: topic.trim(),
          mode: 'full_deck',
        },
      });

      if (!handleAIResponse({ data, error, onRetry: handleGenerate, context: 'Master PPP Wizard' })) {
        setIsGenerating(false);
        return;
      }

      const ld = data.lessonData || {};
      setLesson({
        lesson_title: ld.lesson_title || data.lesson_title || topic.trim(),
        target_goal: ld.target_goal || data.target_goal,
        target_grammar: ld.target_grammar || data.target_grammar,
        target_vocabulary: ld.target_vocabulary || data.target_vocabulary,
        roadmap: ld.roadmap || data.roadmap || ['Warm-up', 'Presentation', 'Practice', 'Production', 'Review'],
        slides: ld.slides || data.slides || [],
      });

      toast.success(`Master lesson generated — ${(ld.slides || data.slides || []).length} slides ready to review.`);
    } catch (err: any) {
      console.error('Generation error:', err);
      showAIErrorToast(err?.message || 'Failed to generate lesson', handleGenerate, 'Master PPP Wizard');
    } finally {
      setIsGenerating(false);
    }
  };

  // Update a slide field in place (used by the edit panel).
  const updateSlideField = (idx: number, field: keyof PPPSlide, value: string) => {
    if (!lesson) return;
    const next = { ...lesson, slides: [...lesson.slides] };
    next.slides[idx] = { ...next.slides[idx], [field]: value };
    setLesson(next);
  };

  const handleSave = async () => {
    if (!lesson || !user) return;
    setIsSaving(true);
    try {
      const insertData = {
        title: lesson.lesson_title,
        description: lesson.target_goal || null,
        content: {
          structuredData: lesson,
          generatedAt: new Date().toISOString(),
          hub,
          cefr_level: cefrLevel,
        } as Record<string, unknown>,
        target_system: HUB_TARGET_SYSTEM[hub],
        difficulty_level: HUB_DIFFICULTY[hub],
        duration_minutes: HUB_DURATION[hub],
        created_by: user.id,
        is_published: false,
        skills_focus: lesson.target_grammar ? [lesson.target_grammar] : [],
      };

      const { error } = await supabase.from('curriculum_lessons').insert(insertData as any);
      if (error) throw error;
      toast.success('Saved to the Master Library!');
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(err.message || 'Failed to save lesson.');
    } finally {
      setIsSaving(false);
    }
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
            <Wand2 className="h-5 w-5 text-amber-400" />
            <h1 className="text-lg font-bold tracking-tight">Master PPP Lesson Wizard</h1>
          </div>
        </div>
        {lesson && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
          >
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save to Master Library
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 p-6">
        {/* ─── LEFT: Input Wizard ─── */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-5 space-y-5 shadow-lg">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-amber-400" />
              <h2 className="font-bold tracking-tight">Lesson Inputs</h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Target CEFR Level
              </label>
              <Select value={cefrLevel} onValueChange={(v) => setCefrLevel(v as CEFRLevel)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
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
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Target Age Group
              </label>
              <Select
                value={hub}
                onValueChange={(v) => {
                  const h = v as HubType;
                  setHub(h);
                  // Auto-suggest CEFR default when hub changes (user can still override).
                  setCefrLevel(HUB_DEFAULT_CEFR[h]);
                }}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="playground">{HUB_LABEL.playground}</SelectItem>
                  <SelectItem value="academy">{HUB_LABEL.academy}</SelectItem>
                  <SelectItem value="success">{HUB_LABEL.success}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Lesson Topic *
              </label>
              <Input
                placeholder="e.g. Ordering Coffee, Job Interview Prep…"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={500}
                className="bg-background/50"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Master Lesson…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Master Lesson
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Your lesson will follow the strict <strong>PPP framework</strong>: Warm-up → Presentation → Practice → Production → Review.
            </p>
          </div>
        </aside>

        {/* ─── RIGHT: Roadmap + Slide Cards ─── */}
        <main className="min-w-0 space-y-6">
          {!lesson && !isGenerating && (
            <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3" />
              <h3 className="font-bold text-lg">Your master lesson will appear here</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pick a level, age group, and topic on the left, then click Generate.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-12 text-center">
              <Loader2 className="h-10 w-10 mx-auto animate-spin text-amber-400 mb-3" />
              <h3 className="font-bold text-lg">Architecting your PPP lesson…</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cambridge-grade scaffolding, level-locked vocabulary, real interactive activities.
              </p>
            </div>
          )}

          {lesson && (
            <>
              {/* Lesson title + goal */}
              <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 shadow-lg">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {cefrLevel} · {HUB_LABEL[hub].split(' ')[0]}
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight mt-1">{lesson.lesson_title}</h2>
                    {lesson.target_goal && (
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        🎯 <strong>Goal:</strong> {lesson.target_goal}
                      </p>
                    )}
                    {(lesson.target_grammar || lesson.target_vocabulary) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {lesson.target_grammar && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
                            Grammar: {lesson.target_grammar}
                          </span>
                        )}
                        {lesson.target_vocabulary && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                            Vocab: {lesson.target_vocabulary}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Roadmap tracker */}
              <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-5 shadow-lg">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Lesson Roadmap
                </h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {ROADMAP_PHASES.map((phase, i) => {
                    const count = slidesByPhase[phase]?.length || 0;
                    const has = count > 0;
                    return (
                      <React.Fragment key={phase}>
                        <div
                          className={`flex-shrink-0 px-3 py-2 rounded-xl border bg-gradient-to-br ${PHASE_ACCENT[phase]} ${
                            has ? '' : 'opacity-40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {has && <Check className="h-3.5 w-3.5" />}
                            <span className="text-xs font-bold tracking-wide whitespace-nowrap">
                              {PHASE_LABEL[phase]}
                            </span>
                            <span className="text-xs opacity-70">({count})</span>
                          </div>
                        </div>
                        {i < ROADMAP_PHASES.length - 1 && (
                          <div className="flex-shrink-0 w-6 h-px bg-border/50" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Slides grouped by phase */}
              {ROADMAP_PHASES.map((phase) => {
                const items = slidesByPhase[phase] || [];
                if (items.length === 0) return null;
                return (
                  <section key={phase} className="space-y-3">
                    <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs bg-gradient-to-r ${PHASE_ACCENT[phase]} border`}
                      >
                        {PHASE_LABEL[phase]}
                      </span>
                      <span className="text-muted-foreground font-normal">
                        {items.length} slide{items.length !== 1 ? 's' : ''}
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map(({ slide, idx }) => (
                        <SlideCard
                          key={idx}
                          slide={slide}
                          index={idx}
                          isEditing={editingIdx === idx}
                          onToggleEdit={() => setEditingIdx(editingIdx === idx ? null : idx)}
                          onUpdate={(field, value) => updateSlideField(idx, field, value)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// ─── Slide Card ─────────────────────────────────────────────────────────
interface SlideCardProps {
  slide: PPPSlide;
  index: number;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (field: keyof PPPSlide, value: string) => void;
}

const SlideCard: React.FC<SlideCardProps> = ({ slide, index, isEditing, onToggleEdit, onUpdate }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const phase = normalizePhase(slide.phase || slide.ppp_stage);
  const keyword = slide.visual_keyword || slide.visual_search_keyword;
  const title = slide.title || slide.headline || `Slide ${index + 1}`;
  const body = slide.content || slide.body_text || slide.headline || '';
  const interaction = slide.interaction_type || slide.slide_type;
  const teacherTip =
    slide.teacher_instructions ||
    (typeof slide.teacher_notes === 'object' && slide.teacher_notes?.script) ||
    (typeof slide.teacher_notes === 'string' ? slide.teacher_notes : '');

  return (
    <article className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-muted/40 overflow-hidden">
        {!imgFailed ? (
          <img
            src={unsplashUrl(keyword)}
            alt={keyword || title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">No image for "{keyword}"</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${PHASE_ACCENT[phase]} border backdrop-blur-md`}
          >
            {PHASE_LABEL[phase]}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
            #{index + 1}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h4 className="text-white font-bold text-base leading-tight drop-shadow-md line-clamp-2">
            {title}
          </h4>
          {interaction && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/20 text-white backdrop-blur-md">
              {interaction}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {!isEditing ? (
          <>
            {body && <p className="text-sm text-foreground/90 line-clamp-4">{body}</p>}
            {teacherTip && (
              <div className="text-xs text-muted-foreground border-l-2 border-amber-500/50 pl-2.5 italic line-clamp-3">
                <span className="font-semibold text-amber-400 not-italic">Teacher: </span>
                {teacherTip}
              </div>
            )}
            {Array.isArray(slide.interactive_options) && slide.interactive_options.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {slide.interactive_options.slice(0, 4).map((opt, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-foreground/80 border border-border/40"
                  >
                    {opt.length > 40 ? `${opt.slice(0, 40)}…` : opt}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => onUpdate(slide.title !== undefined ? 'title' : 'headline', e.target.value)}
                className="bg-background/50 h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Content
              </label>
              <Textarea
                value={body}
                onChange={(e) => onUpdate(slide.content !== undefined ? 'content' : 'body_text', e.target.value)}
                className="bg-background/50 text-sm min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Teacher Instructions
              </label>
              <Textarea
                value={teacherTip}
                onChange={(e) => onUpdate('teacher_instructions', e.target.value)}
                className="bg-background/50 text-sm min-h-[60px]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Visual keyword (Unsplash)
              </label>
              <Input
                value={keyword || ''}
                onChange={(e) => {
                  onUpdate('visual_keyword', e.target.value);
                  setImgFailed(false);
                }}
                placeholder="e.g. busy-airport"
                className="bg-background/50 h-8 text-sm"
              />
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleEdit}
          className="w-full h-8 text-xs"
        >
          <Pencil className="h-3 w-3 mr-1.5" />
          {isEditing ? 'Done editing' : 'Edit slide'}
        </Button>
      </div>
    </article>
  );
};

export default MasterPPPWizard;
