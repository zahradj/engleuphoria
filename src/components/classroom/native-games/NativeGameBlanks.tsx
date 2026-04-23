import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import type { SmartWorksheet } from '@/services/whiteboardService';
import { whiteboardService } from '@/services/whiteboardService';

interface Props {
  worksheet: SmartWorksheet;
  roomId: string;
  userId: string;
  role: 'teacher' | 'student';
}

interface BlanksState {
  index: number;
  selected: string | null;
  revealed: boolean;
}

export const NativeGameBlanks: React.FC<Props> = ({ worksheet, roomId, userId, role }) => {
  const items = worksheet.fill_in_blanks ?? [];
  const [state, setState] = useState<BlanksState>({ index: 0, selected: null, revealed: false });

  // Cache shuffled options per index so order is stable across re-renders.
  const optionsByIndex = useMemo(() => {
    return items.map((item) => {
      const opts = [item.correct_answer, ...item.distractors];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      return opts;
    });
  }, [items]);

  useEffect(() => {
    const unsub = whiteboardService.subscribeToGameState(roomId, (payload) => {
      if (payload.gameType !== 'blanks' || payload.senderId === userId) return;
      const next = payload.state as Partial<BlanksState>;
      setState((prev) => ({
        index: typeof next.index === 'number' ? next.index : prev.index,
        selected: next.selected !== undefined ? next.selected : prev.selected,
        revealed: typeof next.revealed === 'boolean' ? next.revealed : prev.revealed,
      }));
    });
    return unsub;
  }, [roomId, userId]);

  const broadcast = (next: BlanksState) => {
    if (role !== 'teacher') return;
    void whiteboardService.sendGameState(roomId, {
      gameType: 'blanks',
      state: next,
      senderId: userId,
    });
  };

  const update = (next: BlanksState) => {
    setState(next);
    broadcast(next);
  };

  if (items.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white">
        <p className="text-muted-foreground">No fill-in-the-blanks in this worksheet.</p>
      </div>
    );
  }

  const item = items[state.index];
  const opts = optionsByIndex[state.index] ?? [];
  const sentenceParts = item.sentence_with_blank.split('___');

  const handleSelect = (option: string) => {
    if (role !== 'teacher') return;
    update({ ...state, selected: option, revealed: true });
  };

  const goNext = () => {
    if (state.index < items.length - 1) {
      update({ index: state.index + 1, selected: null, revealed: false });
    }
  };
  const goPrev = () => {
    if (state.index > 0) {
      update({ index: state.index - 1, selected: null, revealed: false });
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 p-8">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
        Question {state.index + 1} of {items.length}
      </div>

      <div className="w-full max-w-3xl text-3xl font-medium text-center text-foreground mb-8 leading-relaxed">
        {sentenceParts[0]}
        <span
          className={`inline-block min-w-[140px] mx-2 px-4 py-1 rounded-lg border-b-4 ${
            state.revealed
              ? state.selected === item.correct_answer
                ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                : 'bg-rose-100 border-rose-500 text-rose-700'
              : 'bg-white border-rose-300 text-rose-400'
          }`}
        >
          {state.selected ?? '___'}
        </span>
        {sentenceParts[1]}
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-2xl">
        {opts.map((opt) => {
          const isSelected = state.selected === opt;
          const isCorrect = opt === item.correct_answer;
          const showResult = state.revealed && (isSelected || isCorrect);
          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(opt)}
              disabled={role !== 'teacher' || state.revealed}
              className={`px-5 py-4 rounded-xl text-lg font-semibold shadow transition-all flex items-center justify-center gap-2 ${
                showResult && isCorrect
                  ? 'bg-emerald-500 text-white'
                  : showResult && isSelected
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-foreground border-2 border-rose-200 hover:border-rose-400'
              } ${role !== 'teacher' || state.revealed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {showResult && isCorrect && <Check className="h-5 w-5" />}
              {showResult && isSelected && !isCorrect && <X className="h-5 w-5" />}
              {opt}
            </motion.button>
          );
        })}
      </div>

      {role === 'teacher' && (
        <div className="mt-8 flex items-center gap-3">
          <Button variant="outline" size="lg" onClick={goPrev} disabled={state.index === 0}>
            <ChevronLeft className="h-5 w-5" /> Previous
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={goNext}
            disabled={state.index === items.length - 1}
          >
            Next <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
