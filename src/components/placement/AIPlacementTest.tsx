import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import DemographicsPhase from './DemographicsPhase';
import TestPhase from './TestPhase';
import type { TestResult } from './TestPhase';
import ComprehensivePhase from './comprehensive/ComprehensivePhase';
import ProcessingPhase from './ProcessingPhase';
import { usePlacementTest } from '@/hooks/usePlacementTest';
import { Logo } from '@/components/Logo';
import { CursorTrail } from '@/components/landing/CursorTrail';
import { useStudentLevel } from '@/hooks/useStudentLevel';
import type { Hub } from './questionBanks';

type HubIndex = 0 | 1 | 2;

// Maps the resolved hub to the same palette index used by the homepage
// CursorTrail: 0 = Playground, 1 = Academy, 2 = Professional.
const hubIndex = (hub: Hub): HubIndex => (hub === 'playground' ? 0 : hub === 'academy' ? 1 : 2);

// Strict age brackets per Three-Funnel architecture:
// 4-9 → Playground, 10-17 → Academy, 18+ → Success.
const hubFromAge = (age: number): Hub => {
  if (age > 0 && age < 10) return 'playground';
  if (age >= 10 && age < 18) return 'academy';
  return 'professional';
};

type Phase = 'demographics' | 'test' | 'processing' | 'complete';
type TestStage = 'mcq' | 'comprehensive';

interface AIPlacementTestProps {
  // When set, this instance is locked to a specific hub funnel
  // (used by /placement/playground, /placement/academy, /placement/success).
  // When unset, demographics → traffic-cop redirect to one of the three.
  forcedHub?: Hub;
}

const hubRoute = (hub: Hub): string =>
  hub === 'playground' ? '/placement/playground'
    : hub === 'academy' ? '/placement/academy'
    : '/placement/success';

const AIPlacementTest = ({ forcedHub }: AIPlacementTestProps = {}) => {
  const navigate = useNavigate();
  const { completeTest } = usePlacementTest();
  const { studentLevel } = useStudentLevel();
  const [phase, setPhase] = useState<Phase>('demographics');
  const [testStage, setTestStage] = useState<TestStage>('mcq');
  const [age, setAge] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [mcqResults, setMcqResults] = useState<TestResult[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Locked-funnel mode: forcedHub wins. Otherwise prefer profile, age fallback.
  const resolvedHub: Hub = forcedHub ?? (studentLevel as Hub | null) ?? hubFromAge(age);
  const isComprehensiveHub = resolvedHub === 'academy' || resolvedHub === 'professional';

  const handleDemographicsComplete = (result: { age: number; goal: string; interests: string[] }) => {
    setAge(result.age);
    setInterests(result.interests);

    // Traffic cop: if this isn't already a hub-locked funnel, route the student
    // to the correct isolated test based on age brackets.
    if (!forcedHub) {
      const hub = hubFromAge(result.age);
      navigate(hubRoute(hub), {
        replace: true,
        state: { age: result.age, interests: result.interests, goal: result.goal },
      });
      return;
    }

    setTestStage('mcq');
    setPhase('test');
  };

  // Playground hub → MCQ-only. Academy & Professional → MCQ then 4-skill.
  const handleMcqComplete = (results: TestResult[]) => {
    if (isComprehensiveHub) {
      setMcqResults(results);
      setTestStage('comprehensive');
    } else {
      setTestResults(results);
      setPhase('processing');
    }
  };

  const handleComprehensiveComplete = (results: TestResult[]) => {
    setTestResults([...mcqResults, ...results]);
    setPhase('processing');
  };

  const handleProcessingComplete = async () => {
    try {
      const route = await completeTest(age, testResults, interests);
      setPhase('complete');
      navigate(route, { replace: true });
    } catch (err) {
      console.error('Placement test error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const themeIndex = hubIndex(resolvedHub);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Same homepage interactive cursor effect, themed to the active hub */}
      <CursorTrail themeIndex={themeIndex} />

      <div className="relative z-10 w-full max-w-2xl h-[80vh] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
        {/* Header — Engleuphoria brand */}
        <div className="px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-center">
          <Logo size="medium" variant="white" className="pointer-events-none [&_img]:h-7 sm:[&_img]:h-9" />
        </div>

        {/* Phase content */}
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
                key={`test-${testStage}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="h-full"
              >
                {isComprehensiveHub && testStage === 'comprehensive' ? (
                  <ComprehensivePhase
                    hub={resolvedHub}
                    indexOffset={mcqResults.length}
                    onComplete={(results) => handleComprehensiveComplete(results)}
                  />
                ) : (
                  <TestPhase age={age} hub={resolvedHub} onComplete={handleMcqComplete} />
                )}
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
      </div>
    </div>
  );
};

export default AIPlacementTest;
