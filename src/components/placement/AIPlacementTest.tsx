import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import DemographicsPhase from './DemographicsPhase';
import TestPhase from './TestPhase';
import type { TestResult } from './TestPhase';
import ProcessingPhase from './ProcessingPhase';
import { usePlacementTest } from '@/hooks/usePlacementTest';

type Phase = 'demographics' | 'test' | 'processing' | 'complete';

const AIPlacementTest = () => {
  const navigate = useNavigate();
  const { completeTest } = usePlacementTest();
  const [phase, setPhase] = useState<Phase>('demographics');
  const [age, setAge] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const handleDemographicsComplete = (result: { age: number; goal: string; interests: string[] }) => {
    setAge(result.age);
    setInterests(result.interests);
    setPhase('test');
  };

  const handleTestComplete = (results: TestResult[]) => {
    setTestResults(results);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">The Guide</h2>
            <p className="text-white/50 text-xs">Placement Test</p>
          </div>
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
      </div>
    </div>
  );
};

export default AIPlacementTest;
