import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { SmartWorksheet } from '@/services/whiteboardService';
import { whiteboardService } from '@/services/whiteboardService';

interface Props {
  worksheet: SmartWorksheet;
  roomId: string;
  userId: string;
  role: 'teacher' | 'student';
}

interface Card {
  id: number;
  pairId: number;
  text: string;
}

interface MemoryState {
  cards: Card[];
  flipped: number[]; // currently flipped card ids (max 2)
  matched: number[]; // matched card ids
}

const seedFromTimestamp = (cards: Card[]): Card[] => {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const buildInitial = (worksheet: SmartWorksheet): MemoryState => {
  const pairs = (worksheet.memory_match ?? []).slice(0, 8);
  const cards: Card[] = [];
  pairs.forEach((p, i) => {
    cards.push({ id: i * 2, pairId: i, text: p.pair_1 });
    cards.push({ id: i * 2 + 1, pairId: i, text: p.pair_2 });
  });
  return { cards: seedFromTimestamp(cards), flipped: [], matched: [] };
};

export const NativeGameMemory: React.FC<Props> = ({ worksheet, roomId, userId, role }) => {
  const initial = useMemo(() => buildInitial(worksheet), [worksheet]);
  const [state, setState] = useState<MemoryState>(initial);

  useEffect(() => setState(initial), [initial]);

  useEffect(() => {
    const unsub = whiteboardService.subscribeToGameState(roomId, (payload) => {
      if (payload.gameType !== 'memory' || payload.senderId === userId) return;
      const next = payload.state as Partial<MemoryState>;
      setState((prev) => ({
        cards: next.cards ?? prev.cards,
        flipped: next.flipped ?? prev.flipped,
        matched: next.matched ?? prev.matched,
      }));
    });
    return unsub;
  }, [roomId, userId]);

  const broadcast = (next: MemoryState) => {
    if (role !== 'teacher') return;
    void whiteboardService.sendGameState(roomId, {
      gameType: 'memory',
      state: next,
      senderId: userId,
    });
  };

  const update = (next: MemoryState) => {
    setState(next);
    broadcast(next);
  };

  const handleFlip = (cardId: number) => {
    if (role !== 'teacher') return;
    if (state.matched.includes(cardId) || state.flipped.includes(cardId)) return;
    if (state.flipped.length === 2) return;

    const nextFlipped = [...state.flipped, cardId];
    if (nextFlipped.length === 2) {
      const [a, b] = nextFlipped.map((id) => state.cards.find((c) => c.id === id)!);
      const isMatch = a.pairId === b.pairId;
      update({ ...state, flipped: nextFlipped });
      setTimeout(() => {
        if (isMatch) {
          update({
            cards: state.cards,
            matched: [...state.matched, a.id, b.id],
            flipped: [],
          });
        } else {
          update({ ...state, flipped: [] });
        }
      }, 900);
    } else {
      update({ ...state, flipped: nextFlipped });
    }
  };

  const reset = () => update(buildInitial(worksheet));

  if (state.cards.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white">
        <p className="text-muted-foreground">No memory pairs in this worksheet.</p>
      </div>
    );
  }

  const allMatched = state.matched.length === state.cards.length;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 p-6 overflow-auto">
      <div className="flex items-center justify-between w-full max-w-3xl mb-4">
        <div className="text-sm font-medium text-muted-foreground">
          Matched: {state.matched.length / 2} / {state.cards.length / 2}
        </div>
        {role === 'teacher' && (
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-3xl">
        {state.cards.map((card) => {
          const isFlipped = state.flipped.includes(card.id) || state.matched.includes(card.id);
          const isMatched = state.matched.includes(card.id);
          return (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleFlip(card.id)}
              disabled={role !== 'teacher' || isMatched}
              className={`aspect-[4/3] rounded-2xl shadow-md flex items-center justify-center text-center p-3 text-base font-semibold transition-all ${
                isMatched
                  ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400 cursor-default'
                  : isFlipped
                  ? 'bg-white text-foreground ring-2 ring-indigo-400'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600'
              } ${role !== 'teacher' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isFlipped ? card.text : '?'}
            </motion.button>
          );
        })}
      </div>

      {allMatched && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-2xl font-bold text-emerald-600"
        >
          🎉 All matched! Great job!
        </motion.div>
      )}
    </div>
  );
};
