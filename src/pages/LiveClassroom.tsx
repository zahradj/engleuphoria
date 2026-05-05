import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLiveClassroom } from '@/hooks/useLiveClassroom';
import { AnnotationOverlay, type AnnotationTool } from '@/components/live-classroom/AnnotationOverlay';
import { AnnotationToolbar } from '@/components/live-classroom/AnnotationToolbar';
import { LaserDot } from '@/components/live-classroom/LaserDot';
import { RewardFx } from '@/components/live-classroom/RewardFx';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Loader2, Wifi, WifiOff } from 'lucide-react';
import { SlideRenderer as PlaygroundRenderer, type Slide as PlaygroundSlide } from '@/pages/PlaygroundDemo';
import { SlideRenderer as AcademyRenderer, type Slide as AcademySlide } from '@/pages/AcademyDemo';
import { SlideRenderer as SuccessRenderer, type Slide as SuccessSlide } from '@/pages/SuccessDemo';

type AnyHub = 'playground' | 'academy' | 'success';
type AnySlide = PlaygroundSlide | AcademySlide | SuccessSlide;

export default function LiveClassroom() {
  const { sessionId = '' } = useParams<{ sessionId: string }>();
  const [params] = useSearchParams();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const role: 'teacher' | 'student' = (user as any)?.role === 'teacher' ? 'teacher' : 'student';

  const [lessonRow, setLessonRow] = useState<any | null>(null);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const lessonIdParam = params.get('lessonId');

  const live = useLiveClassroom({
    sessionId,
    userId,
    role,
    bootstrapLessonId: lessonIdParam,
  });

  // Resolve which lesson to load: state row > URL param
  const effectiveLessonId = live.state?.lesson_id || lessonIdParam;

  useEffect(() => {
    if (!effectiveLessonId) { setLoadingLesson(false); return; }
    let cancelled = false;
    setLoadingLesson(true);
    (async () => {
      const { data } = await supabase
        .from('curriculum_lessons')
        .select('id, title, content, ai_metadata')
        .eq('id', effectiveLessonId)
        .maybeSingle();
      if (!cancelled) {
        setLessonRow(data);
        setLoadingLesson(false);
      }
    })();
    return () => { cancelled = true; };
  }, [effectiveLessonId]);

  const { hub, slides, title } = useMemo(() => {
    const content = (lessonRow?.content ?? {}) as any;
    const meta = (lessonRow?.ai_metadata ?? {}) as any;
    const hub = (content.hub ?? meta.hub ?? 'playground') as AnyHub;
    const slides = (Array.isArray(content.slides) ? content.slides : []) as AnySlide[];
    return { hub, slides, title: lessonRow?.title ?? 'Live Classroom' };
  }, [lessonRow]);

  const idx = Math.min(live.state?.current_slide_index ?? 0, Math.max(slides.length - 1, 0));
  const currentSlide = slides[idx];

  // Annotation state
  const [tool, setTool] = useState<AnnotationTool>('none');
  const [color, setColor] = useState('#0F172A');

  if (!user) {
    return <CenterMsg>Please sign in to enter the live classroom.</CenterMsg>;
  }
  if (loadingLesson) {
    return <CenterMsg><Loader2 className="h-6 w-6 animate-spin" /> Loading lesson…</CenterMsg>;
  }
  if (!slides.length) {
    return (
      <CenterMsg>
        <div className="space-y-3 text-center">
          <p>No lesson loaded for this session.</p>
          <p className="text-sm text-muted-foreground">Pass <code>?lessonId=…</code> in the URL to start.</p>
        </div>
      </CenterMsg>
    );
  }

  const SlideComponent = (() => {
    if (hub === 'academy') return <AcademyRenderer slide={currentSlide as AcademySlide} t={ACADEMY_THEME} />;
    if (hub === 'success') return <SuccessRenderer slide={currentSlide as SuccessSlide} t={SUCCESS_THEME} />;
    return <PlaygroundRenderer slide={currentSlide as PlaygroundSlide} />;
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">←</Link>
          <h1 className="text-base font-semibold truncate max-w-[40ch]">{title}</h1>
          <span className="text-xs text-muted-foreground">Slide {idx + 1}/{slides.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            {live.isConnected ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-muted-foreground">{live.peers.length} online</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600">
            <Star className="h-4 w-4 fill-amber-500" />
            <span className="text-sm font-bold">{live.state?.student_rewards ?? 0}</span>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground capitalize">{role}</span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex">
        {/* Toolbar */}
        <div className="p-3">
          <AnnotationToolbar
            role={role}
            tool={tool}
            setTool={setTool}
            color={color}
            setColor={setColor}
            onClear={live.clearStrokes}
            onReward={role === 'teacher' ? live.sendReward : undefined}
          />
        </div>

        {/* Slide canvas */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative w-full max-w-5xl aspect-[16/10] bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="absolute inset-0 p-6 overflow-auto">
              {SlideComponent}
            </div>
            <AnnotationOverlay
              tool={tool}
              color={color}
              onStroke={live.sendStroke}
              onLaser={(p) => live.sendLaser(p)}
              registerStrokeHandler={live.onStroke}
              registerClearHandler={live.onClear}
            />
            <LaserDot registerLaserHandler={live.onLaser} />
            <RewardFx registerRewardHandler={live.onReward} />
          </div>
        </div>

        {/* Slide list */}
        <aside className="w-56 border-l border-border bg-card overflow-y-auto p-2">
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground px-2 py-1">Slides</h2>
          <ul className="space-y-1">
            {slides.map((s: any, i) => (
              <li key={i}>
                <button
                  disabled={!live.isTeacher}
                  onClick={() => live.setSlideIndex(i)}
                  className={`w-full text-left px-2 py-2 rounded-lg text-sm truncate ${
                    i === idx ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                  } ${!live.isTeacher ? 'cursor-default' : ''}`}
                >
                  {i + 1}. {s.title || s.type || 'Slide'}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* Footer nav (teacher only) */}
      {live.isTeacher && (
        <footer className="flex items-center justify-center gap-3 p-3 border-t border-border bg-card">
          <Button
            variant="outline"
            onClick={() => live.setSlideIndex(Math.max(0, idx - 1))}
            disabled={idx === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
          </Button>
          <Button
            onClick={() => live.setSlideIndex(Math.min(slides.length - 1, idx + 1))}
            disabled={idx >= slides.length - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </footer>
      )}
    </div>
  );
}

function CenterMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}

// Minimal theme tokens for Academy / Success renderers (mirrors their demo defaults)
const ACADEMY_THEME: any = {
  // The renderer uses Tailwind classes already; theme tokens are mostly accents.
  primary: 'text-violet-700', accent: 'bg-violet-100', surface: 'bg-card', text: 'text-foreground',
};
const SUCCESS_THEME: any = {
  primary: 'text-emerald-700', accent: 'bg-emerald-100', surface: 'bg-card', text: 'text-foreground',
};
