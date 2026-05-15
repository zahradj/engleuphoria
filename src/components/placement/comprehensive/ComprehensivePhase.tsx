import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ComprehensiveProgressBar, { type StageKey } from './ComprehensiveProgressBar';
import ListeningPhase, { type ListeningResult } from './ListeningPhase';
import ReadingPhase, { type ReadingResult } from './ReadingPhase';
import WritingPhase, { type WritingResult } from './WritingPhase';
import SpeakingPhase, { type SpeakingResult } from './SpeakingPhase';
import type { TestResult } from '../TestPhase';

export interface ComprehensiveSubmission {
  listening: ListeningResult[];
  reading: ReadingResult[];
  writing: WritingResult | null;
  speaking: SpeakingResult | null;
}

interface Props {
  onComplete: (results: TestResult[], submission: ComprehensiveSubmission) => void;
  /** Offset for questionIndex so 4-skill results can be appended after prior MCQ results. */
  indexOffset?: number;
  /** Hub context (academy | professional) — kept for future per-hub content. */
  hub?: 'playground' | 'academy' | 'professional';
}

/**
 * Maps the multimedia 4-skill submission into the legacy TestResult[] shape
 * that `usePlacementTest.completeTest` expects, so we don't need any DB
 * migration. Listening + Reading correctness drives the deterministic CEFR
 * band; writing/speaking are stored on the submission for future Gemini
 * evaluation but do not affect persistence today.
 */
function toLegacyResults(sub: ComprehensiveSubmission, offset = 0): TestResult[] {
  const results: TestResult[] = [];
  sub.listening.forEach((r, idx) => {
    results.push({
      questionIndex: offset + results.length,
      selectedOption: 0,
      correctOption: r.correct ? 0 : 1,
      isCorrect: r.correct,
      difficulty: 0.5 + idx * 0.1,
      targetLevel: idx === 2 ? 'B2' : 'A2',
    });
  });
  sub.reading.forEach((r, idx) => {
    results.push({
      questionIndex: offset + results.length,
      selectedOption: r.choice,
      correctOption: r.correct ? r.choice : -1,
      isCorrect: r.correct,
      difficulty: 0.5 + idx * 0.1,
      targetLevel: 'B1',
    });
  });
  if (sub.writing) {
    const sentences = (sub.writing.text.match(/[.!?]+/g) || []).length;
    const strong = sub.writing.text.length >= 240 && sentences >= 4;
    results.push({
      questionIndex: offset + results.length,
      selectedOption: 0,
      correctOption: 0,
      isCorrect: strong,
      difficulty: 0.7,
      targetLevel: 'B2',
    });
  }
  if (sub.speaking) {
    const ok = sub.speaking.audioBlob !== null && sub.speaking.durationMs >= 10000;
    results.push({
      questionIndex: offset + results.length,
      selectedOption: 0,
      correctOption: 0,
      isCorrect: ok,
      difficulty: 0.7,
      targetLevel: 'B2',
    });
  }
  return results;
}

const STAGES: StageKey[] = ['listening', 'reading', 'writing', 'speaking'];

const ComprehensivePhase: React.FC<Props> = ({ onComplete, indexOffset = 0 }) => {
  const [stage, setStage] = useState<StageKey>('listening');
  const [submission, setSubmission] = useState<ComprehensiveSubmission>({
    listening: [],
    reading: [],
    writing: null,
    speaking: null,
  });

  const advance = (next: StageKey) => setStage(next);

  return (
    <div className="h-full flex flex-col">
      <ComprehensiveProgressBar current={stage} />
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 'listening' && (
            <motion.div key="L" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="h-full">
              <ListeningPhase
                onComplete={(r) => { setSubmission((s) => ({ ...s, listening: r })); advance('reading'); }}
              />
            </motion.div>
          )}
          {stage === 'reading' && (
            <motion.div key="R" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="h-full">
              <ReadingPhase
                onComplete={(r) => { setSubmission((s) => ({ ...s, reading: r })); advance('writing'); }}
              />
            </motion.div>
          )}
          {stage === 'writing' && (
            <motion.div key="W" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="h-full">
              <WritingPhase
                onComplete={(r) => { setSubmission((s) => ({ ...s, writing: r })); advance('speaking'); }}
              />
            </motion.div>
          )}
          {stage === 'speaking' && (
            <motion.div key="S" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="h-full">
              <SpeakingPhase
                onComplete={(r) => {
                  const final: ComprehensiveSubmission = { ...submission, speaking: r };
                  setSubmission(final);
                  onComplete(toLegacyResults(final, indexOffset), final);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ComprehensivePhase;
