import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react';
import type { SmartWorksheet } from '@/services/whiteboardService';
import { whiteboardService } from '@/services/whiteboardService';

interface Props {
  worksheet: SmartWorksheet;
  roomId: string;
  userId: string;
  role: 'teacher' | 'student';
}

interface Chip {
  id: number;
  word: string;
}

interface SentenceState {
  index: number;
  bank: Chip[]; // unused chips
  built: Chip[]; // chips placed in sentence order
}

const buildForIndex = (worksheet: SmartWorksheet, index: number): SentenceState => {
  const item = worksheet.sentence_builder?.[index];
  const words = item?.scrambled_words ?? [];
  return {
    index,
    bank: words.map((word, id) => ({ id, word })),
    built: [],
  };
};

export const NativeGameSentence: React.FC<Props> = ({ worksheet, roomId, userId, role }) => {
  const sentences = worksheet.sentence_builder ?? [];
  const initial = useMemo(() => buildForIndex(worksheet, 0), [worksheet]);
  const [state, setState] = useState<SentenceState>(initial);

  useEffect(() => setState(initial), [initial]);

  useEffect(() => {
    const unsub = whiteboardService.subscribeToGameState(roomId, (payload) => {
      if (payload.gameType !== 'sentence' || payload.senderId === userId) return;
      const next = payload.state as Partial<SentenceState>;
      setState((prev) => ({
        index: typeof next.index === 'number' ? next.index : prev.index,
        bank: next.bank ?? prev.bank,
        built: next.built ?? prev.built,
      }));
    });
    return unsub;
  }, [roomId, userId]);

  const broadcast = (next: SentenceState) => {
    if (role !== 'teacher') return;
    void whiteboardService.sendGameState(roomId, {
      gameType: 'sentence',
      state: next,
      senderId: userId,
    });
  };

  const update = (next: SentenceState) => {
    setState(next);
    broadcast(next);
  };

  if (sentences.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white">
        <p className="text-muted-foreground">No sentences in this worksheet.</p>
      </div>
    );
  }

  const current = sentences[state.index];
  const builtSentence = state.built.map((c) => c.word).join(' ');
  const isCorrect = builtSentence === current.full_sentence;

  const moveToBuilt = (chipId: number) => {
    if (role !== 'teacher') return;
    const chip = state.bank.find((c) => c.id === chipId);
    if (!chip) return;
    update({
      ...state,
      bank: state.bank.filter((c) => c.id !== chipId),
      built: [...state.built, chip],
    });
  };

  const moveToBank = (chipId: number) => {
    if (role !== 'teacher') return;
    const chip = state.built.find((c) => c.id === chipId);
    if (!chip) return;
    update({
      ...state,
      built: state.built.filter((c) => c.id !== chipId),
      bank: [...state.bank, chip],
    });
  };

  const goNext = () => {
    if (state.index < sentences.length - 1) {
      update(buildForIndex(worksheet, state.index + 1));
    }
  };
  const goPrev = () => {
    if (state.index > 0) {
      update(buildForIndex(worksheet, state.index - 1));
    }
  };
  const reset = () => update(buildForIndex(worksheet, state.index));

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-8">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Sentence {state.index + 1} of {sentences.length}
      </div>

      {/* Built sentence drop zone */}
      <div
        className={`w-full max-w-3xl min-h-[110px] rounded-2xl border-2 border-dashed p-4 mb-6 flex flex-wrap gap-2 items-center justify-center transition-colors ${
          isCorrect ? 'bg-emerald-50 border-emerald-400' : 'bg-white/80 border-emerald-300'
        }`}
      >
        {state.built.length === 0 ? (
          <p className="text-muted-foreground italic">
            {role === 'teacher' ? 'Tap words below to build the sentence' : 'Watch the teacher build the sentence'}
          </p>
        ) : (
          state.built.map((chip) => (
            <motion.button
              key={`built-${chip.id}`}
              layout
              onClick={() => moveToBank(chip.id)}
              disabled={role !== 'teacher'}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 disabled:cursor-not-allowed"
            >
              {chip.word}
            </motion.button>
          ))
        )}
        {isCorrect && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-3 inline-flex items-center gap-1 text-emerald-600 font-bold"
          >
            <Check className="h-5 w-5" /> Correct!
          </motion.div>
        )}
      </div>

      {/* Word bank */}
      <div className="w-full max-w-3xl flex flex-wrap gap-2 justify-center min-h-[60px]">
        {state.bank.map((chip) => (
          <motion.button
            key={`bank-${chip.id}`}
            layout
            onClick={() => moveToBuilt(chip.id)}
            disabled={role !== 'teacher'}
            className="px-4 py-2 rounded-lg bg-white border-2 border-teal-300 text-foreground font-semibold shadow hover:border-teal-500 disabled:cursor-not-allowed"
          >
            {chip.word}
          </motion.button>
        ))}
      </div>

      {role === 'teacher' && (
        <div className="mt-6 flex items-center gap-3">
          <Button variant="outline" size="lg" onClick={goPrev} disabled={state.index === 0}>
            <ChevronLeft className="h-5 w-5" /> Previous
          </Button>
          <Button variant="secondary" size="lg" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={goNext}
            disabled={state.index === sentences.length - 1}
          >
            Next <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
