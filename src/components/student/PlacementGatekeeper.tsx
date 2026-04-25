import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, GraduationCap, Briefcase, Lock, ArrowRight, Loader2, Smile } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DemographicsPhase from '@/components/placement/DemographicsPhase';
import TestPhase, { type TestResult } from '@/components/placement/TestPhase';
import ProcessingPhase from '@/components/placement/ProcessingPhase';
import PlaygroundPlacementPhase from '@/components/placement/PlaygroundPlacementPhase';
import { usePlacementTest } from '@/hooks/usePlacementTest';
import type { StudentLevel } from '@/hooks/useStudentLevel';

type Phase = 'welcome' | 'demographics' | 'test' | 'processing' | 'celebrate';

interface PlacementGatekeeperProps {
  studentLevel: StudentLevel | null;
  studentName: string;
  /** Called once placement is complete so the parent can refetch / unlock */
  onComplete: () => void;
  children: React.ReactNode;
}

const HUB_THEME = {
  playground: {
    name: 'The Playground',
    icon: Smile,
    gradient: 'from-orange-500 via-amber-500 to-yellow-400',
    accent: 'from-orange-400 to-amber-300',
    accentText: 'text-amber-100',
    button: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
    glow: 'shadow-[0_0_60px_rgba(254,106,47,0.45)]',
  },
  academy: {
    name: 'The Academy',
    icon: GraduationCap,
    gradient: 'from-indigo-950 via-purple-900 to-violet-950',
    accent: 'from-violet-500 to-fuchsia-500',
    accentText: 'text-violet-300',
    button: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600',
    glow: 'shadow-[0_0_60px_rgba(139,92,246,0.35)]',
  },
  professional: {
    name: 'The Success Hub',
    icon: Briefcase,
    gradient: 'from-emerald-950 via-teal-900 to-emerald-950',
    accent: 'from-emerald-500 to-teal-500',
    accentText: 'text-emerald-300',
    button: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.35)]',
  },
} as const;

type ThemedHub = keyof typeof HUB_THEME;

export const PlacementGatekeeper = ({
  studentLevel,
  studentName,
  onComplete,
  children,
}: PlacementGatekeeperProps) => {
  const { user } = useAuth();
  const { completeTest } = usePlacementTest();
  const [checking, setChecking] = useState(true);
  const [needsPlacement, setNeedsPlacement] = useState(false);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [age, setAge] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [resolvedLevel, setResolvedLevel] = useState<string>('');

  const requiresPlacement =
    studentLevel === 'academy' ||
    studentLevel === 'professional' ||
    studentLevel === 'playground';
  const themeKey: ThemedHub = (studentLevel ?? 'playground') as ThemedHub;
  const isPlayground = themeKey === 'playground';

  // Check placement status on mount
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user?.id || !requiresPlacement) {
        setChecking(false);
        setNeedsPlacement(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('placement_test_completed_at')
          .eq('user_id', user.id)
          .maybeSingle();
        if (cancelled) return;
        if (error) {
          console.error('[PlacementGatekeeper] check failed:', error);
          // Fail-open: don't block dashboard if check itself errors
          setNeedsPlacement(false);
        } else {
          setNeedsPlacement(!data?.placement_test_completed_at);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [user?.id, requiresPlacement]);

  const handleDemographicsComplete = useCallback(
    (result: { age: number; goal: string; interests: string[] }) => {
      setAge(result.age);
      setInterests(result.interests);
      setPhase('test');
    },
    []
  );

  const handleTestComplete = useCallback((results: TestResult[]) => {
    setTestResults(results);
    setPhase('processing');
  }, []);

  const handleProcessingComplete = useCallback(async () => {
    try {
      await completeTest(age, testResults, interests);
      // Read back the assigned level for the celebration screen
      const { data } = await supabase
        .from('student_profiles')
        .select('student_level, cefr_level')
        .eq('user_id', user!.id)
        .maybeSingle();
      setResolvedLevel(
        (data?.cefr_level as string) || (data?.student_level as string) || 'your perfect level'
      );
      setPhase('celebrate');
    } catch (err) {
      console.error('[PlacementGatekeeper] complete failed:', err);
      toast.error('Something went wrong. Please try again.');
      setPhase('welcome');
    }
  }, [age, testResults, interests, completeTest, user]);

  const handleUnlock = useCallback(() => {
    setNeedsPlacement(false);
    onComplete();
  }, [onComplete]);

  // Loading check
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Pass through if no placement needed
  if (!needsPlacement || !requiresPlacement) {
    return <>{children}</>;
  }

  const theme = HUB_THEME[themeKey];
  const Icon = theme.icon;

  // Kids skip Demographics — we already know they're in Playground (4-9).
  // Default age 7 keeps evaluateStudentLevel pinned to playground while still
  // computing a meaningful CEFR band (A1/A2/B1) from the picture quiz.
  const handleStartAssessment = () => {
    if (isPlayground) {
      setAge(7);
      setPhase('test');
    } else {
      setPhase('demographics');
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${theme.accent}`} />
        <div className={`absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${theme.accent}`} />
      </div>

      <div className="relative w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {phase === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-10 ${theme.glow}`}
            >
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${theme.accent} flex items-center justify-center`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Lock className={`w-4 h-4 ${theme.accentText}`} />
                <span className={`text-xs uppercase tracking-widest font-semibold ${theme.accentText}`}>
                  Welcome Assessment
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 leading-tight">
                {isPlayground
                  ? `Hi ${studentName.split(' ')[0]}! Let's play! 🎉`
                  : `Welcome to ${theme.name}, ${studentName.split(' ')[0]}!`}
              </h1>
              <p className="text-white/80 text-center text-lg mb-8 max-w-lg mx-auto">
                {isPlayground
                  ? <>Tap the right pictures to show what you know. <span className="text-white font-semibold">Just 10 fun questions!</span></>
                  : <>Before we open your dashboard, let's find your <span className="text-white font-semibold">perfect starting point</span>. A short, joyful assessment so every lesson fits you exactly.</>}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {(isPlayground
                  ? ['~3 minutes', '10 pictures', 'Just for fun']
                  : ['~5 minutes', 'Personalized', 'One time only']
                ).map((label) => (
                  <div
                    key={label}
                    className="bg-white/10 border border-white/20 rounded-xl py-3 px-2 text-center"
                  >
                    <p className="text-white/90 text-sm font-medium">{label}</p>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                onClick={handleStartAssessment}
                className={`w-full ${theme.button} text-white font-semibold text-lg h-14 rounded-xl group`}
              >
                {isPlayground ? "Let's Start! 🚀" : 'Start My Assessment'}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          )}

          {(phase === 'demographics' || phase === 'test' || phase === 'processing') && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className={`backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden h-[80vh] flex flex-col ${theme.glow}`}
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.accent} flex items-center justify-center`}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">{theme.name} Placement</h2>
                  <p className="text-white/60 text-xs">
                    {isPlayground ? 'Tap the right picture!' : 'Find your perfect level'}
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {phase === 'demographics' && (
                    <motion.div
                      key="demographics"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="h-full"
                    >
                      <DemographicsPhase onComplete={handleDemographicsComplete} />
                    </motion.div>
                  )}
                  {phase === 'test' && (
                    <motion.div
                      key="test"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="h-full"
                    >
                      <TestPhase age={age} onComplete={handleTestComplete} />
                    </motion.div>
                  )}
                  {phase === 'processing' && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <ProcessingPhase onComplete={handleProcessingComplete} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {phase === 'celebrate' && (
            <motion.div
              key="celebrate"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-12 text-center ${theme.glow}`}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${theme.accent} flex items-center justify-center`}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>
              <p className={`text-sm uppercase tracking-widest font-semibold ${theme.accentText} mb-2`}>
                Your Level
              </p>
              <h2 className="text-5xl font-bold text-white mb-4">{resolvedLevel}</h2>
              <p className="text-white/70 text-lg mb-8">
                Your dashboard is now tuned to your exact level. Let's begin.
              </p>
              <Button
                size="lg"
                onClick={handleUnlock}
                className={`${theme.button} text-white font-semibold text-lg h-14 px-10 rounded-xl group`}
              >
                Enter {theme.name}
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlacementGatekeeper;
